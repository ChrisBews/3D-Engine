import { Scene } from './Scene';
import { Program } from './Program';
import { Matrix4 } from '../utils/Matrix4';
import { normalizeVector } from '../utils/vectorUtils';
import { defaultTexture } from '@oomph3d/constants/textures';

export class World implements IWorld {

  private _gl: WebGL2RenderingContext;
  private _canvas: HTMLCanvasElement;
  private _activeScene: IScene;
  private _vao: WebGLVertexArrayObject;
  private _positionBuffer: WebGLBuffer;
  private _normalsBuffer: WebGLBuffer;
  private _indexBuffer: WebGLBuffer;
  private _uvBuffer: WebGLBuffer;
  private _resizeFrameRequest: number;
  private _frameTimer: number;
  private _previousRenderTime: number = 0;
  private _onUpdate: (timeElapsed: number) => void;

  constructor(canvasId: string) {
    this._canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this._initGL();
    this._addListeners();
    this._onWindowResized();
  }

  set scene(scene: IScene) {
    if (!(scene instanceof Scene)) {
      throw new Error('Cannot set scene, as it is not a valid Scene reference');
    }
    this._activeScene = scene;
    this._activeScene.onChildAdded = this._onMeshAddedToScene;
    this._activeScene.onMeshMaterialUpdated = this._onMeshMaterialUpdated;
    this._activeScene.onCameraAdded = this._onCameraAdded;
    if (scene.camera) this._onCameraAdded(scene.camera);
    if (scene.children.length) {
      scene.children.forEach(mesh => {
        this._onMeshAddedToScene(mesh);
      });
    }
  }

  set onUpdate(callback: (timeElapsed: number) => void) {
    this._onUpdate = callback;
    if (callback) {
      this._startFrameTimer();
    } else {
      this._clearFrameTimer();
    }
  }

  private _initGL() {
    this._gl = this._canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!this._gl) throw new Error('World: Failed to instantiate a WebGL2 context');
    this._vao = this._gl.createVertexArray();
    this._gl.bindVertexArray(this._vao);
    // Don't render back-facing triangles
    this._gl.enable(this._gl.CULL_FACE);
    // Enable depth buffer (ie. don't show obscured pixels)
    this._gl.enable(this._gl.DEPTH_TEST);
    this._createBuffers();
  }

  private _createBuffers() {
    this._positionBuffer = this._gl.createBuffer();
    this._normalsBuffer = this._gl.createBuffer();
    this._indexBuffer = this._gl.createBuffer();
    this._uvBuffer = this._gl.createBuffer();
  }

  private _addListeners() {
    window.addEventListener('resize', this._onWindowResized);
  }

  private _resizeCanvas() {
    this._resizeFrameRequest = undefined;
    const cssToRealPixels: number = window.devicePixelRatio || 1;
    const displayWidth: number = Math.floor(this._canvas.clientWidth * cssToRealPixels);
    const displayHeight: number = Math.floor(this._canvas.clientHeight * cssToRealPixels);
    if (this._canvas.width !== displayWidth || this._canvas.height !== displayHeight) {
      this._canvas.width = displayWidth;
      this._canvas.height = displayHeight;
    }
    this._gl.viewport(0, 0, this._gl.canvas.clientWidth, this._gl.canvas.clientHeight);
    if (this._activeScene && this._activeScene.camera) {
      this._activeScene.resize(displayWidth, displayHeight);
    }
  }

  private _startFrameTimer() {
    this._clearFrameTimer();
    this._frameTimer = requestAnimationFrame(this._update);
  }

  private _clearFrameTimer() {
    if (this._frameTimer) {
      cancelAnimationFrame(this._frameTimer);
      this._frameTimer = undefined;
    }
  }

  private _processMeshMaterial(mesh: IMesh) {
    if (!mesh.material.program) {
      // Instantiate the material as required
      mesh.material.program = new Program(this._gl, mesh.material.vertexShader, mesh.material.fragmentShader);
      if (mesh.material.isTextureMap && !mesh.material.texture) {
        // Prepare the texture
        this._prepareMaterialTexture(mesh.material);
      }
    }
  }

  private _prepareMaterialTexture(material: IMaterial) {
    const texture = this._gl.createTexture();
    material.texture = texture;
    this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, 16, 16, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, defaultTexture);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
    material.loadImage(this._onImageLoadComplete);
  }

  private _update = (renderTime: number) => {
    // Convert from milliseconds to seconds
    renderTime *= 0.001;
    // Get the elapsed time
    const timePassed = renderTime - this._previousRenderTime;
    // Store previous render time
    this._previousRenderTime = renderTime;

    // Allow for updates to take place before updating camera matrix
    // This ensures the whole scene remains on the same frame
    if (this._onUpdate) this._onUpdate(timePassed);

    if (this._activeScene) this._activeScene.update();
    // Draw all children in current scene
    this._draw();
    // Wait for next frame
    this._startFrameTimer();
  }

  private _draw() {
    this._gl.clearColor(0.7, 0.7, 0.7, 1);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    const sceneCamera: ICamera = this._activeScene.camera;
    if (!sceneCamera) return;

    const sceneCameraMatrix: mat4 = this._activeScene.camera.matrix;
    const meshes = this._activeScene.children;
    meshes.forEach(mesh => {
      const program: IProgram = mesh.material.program;

      if (program) {
        // Use the correct shader for this mesh
        this._gl.useProgram(program.glProgram);

        // Mesh matrix
        const meshMatrix: Matrix4 = new Matrix4(sceneCameraMatrix);
        meshMatrix.multiply(mesh.matrix);
        this._gl.uniformMatrix4fv(program.matrixUniform, false, meshMatrix.value);

        // Normals matrix
        // Protect the normals from world scaling by inverting and transposing the mesh's matrix
        const normalsMatrix: Matrix4 = new Matrix4(mesh.normalsMatrix);
        normalsMatrix.invert();
        normalsMatrix.transpose();
        this._gl.uniformMatrix4fv(program.normalMatrixUniform, false, normalsMatrix.value);

        // Normals
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._normalsBuffer);
        this._gl.enableVertexAttribArray(program.normalAttribute);
        this._gl.vertexAttribPointer(program.normalAttribute, 3, this._gl.FLOAT, false, 0, 0);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, mesh.normals, this._gl.STATIC_DRAW);

        // Vertices
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
        this._gl.enableVertexAttribArray(program.positionAttribute);
        this._gl.vertexAttribPointer(program.positionAttribute, 3, this._gl.FLOAT, false, 0, 0);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, mesh.vertices, this._gl.STATIC_DRAW);

        // Indices
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, mesh.indices, this._gl.STATIC_DRAW);

        // UVs / Material texture
        if (program.uvAttribute && program.uvAttribute !== -1 && mesh.uvs.length && mesh.material.isTextureMap) {
          this._gl.bindTexture(this._gl.TEXTURE_2D, mesh.material.texture);
          this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._uvBuffer);
          this._gl.enableVertexAttribArray(program.uvAttribute);
          this._gl.vertexAttribPointer(program.uvAttribute, 2, this._gl.FLOAT, true, 0, 0);
          this._gl.bufferData(this._gl.ARRAY_BUFFER, mesh.uvs, this._gl.STATIC_DRAW);
        }

        this._gl.drawElements(this._gl.TRIANGLES, mesh.indices.length, this._gl.UNSIGNED_SHORT, 0);

        // Material color
        if (program.colorUniform) {
          this._gl.uniform4fv(program.colorUniform, [
            mesh.material.colorInUnits.r,
            mesh.material.colorInUnits.g,
            mesh.material.colorInUnits.b,
            mesh.material.colorInUnits.a,
          ]);
        }

        // Lights
        let lightValues: vec3 = {x: 0, y: 0, z: 0};
        let lightColor: number[] = [0, 0, 0];
        const directionalLight: IDirectionalLight = this._activeScene.directionalLight;
        if (directionalLight) {
          lightValues = directionalLight.direction;
          lightColor = directionalLight.colorInUnits;
        }
        const normalizedLightValues: vec3 = normalizeVector(lightValues);
        this._gl.uniform3fv(
          program.lightDirectionUniform,
          [normalizedLightValues.x, normalizedLightValues.y, normalizedLightValues.z]
        );
        this._gl.uniform3fv(program.lightColorUniform, lightColor);
      } else {
        throw new Error(`Mesh ${mesh.id} has no material assigned, so will not be rendered`);
      }
    });
  }

  private _onMeshAddedToScene = (newChild: IMesh) => {
    this._processMeshMaterial(newChild);
  }

  private _onMeshMaterialUpdated = (child: IMesh) => {
    this._processMeshMaterial(child);
  }

  private _onCameraAdded = (camera: ICamera) => {
    this._activeScene.resize(this._canvas.clientWidth, this._canvas.clientHeight);
  }

  private _onImageLoadComplete = (material: IMaterial) => {
    this._gl.bindTexture(this._gl.TEXTURE_2D, material.texture);
    // TODO: Allow the texture filtering to be selectable
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, material.image);
    this._gl.generateMipmap(this._gl.TEXTURE_2D);
  }

  private _onWindowResized = () => {
    if (!this._resizeFrameRequest) {
      this._resizeFrameRequest = requestAnimationFrame(this._onFrameTimerTicked);
    }
  }

  private _onFrameTimerTicked = () => {
    this._resizeCanvas();
  }

}
