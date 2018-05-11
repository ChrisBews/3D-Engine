import { Scene } from './Scene';
import { Program } from './Program';
import { Matrix4 } from '../utils/Matrix4';
import { normalizeVector } from '../utils/vectorUtils';

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
  }

  set onUpdate(callback: (timeElapsed: number) => void) {
    this._onUpdate = callback;
    if (callback) {
      this._startFrameTimer();
    } else {
      this._clearFrameTimer();
    }
  }

  _initGL() {
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

  _createBuffers() {
    this._positionBuffer = this._gl.createBuffer();
    this._normalsBuffer = this._gl.createBuffer();
    this._indexBuffer = this._gl.createBuffer();
    this._uvBuffer = this._gl.createBuffer();
  }

  _addListeners() {
    window.addEventListener('resize', this._onWindowResized);
  }

  _resizeCanvas() {
    this._resizeFrameRequest = undefined;
    const cssToRealPixels: number = window.devicePixelRatio || 1;
    const displayWidth: number = Math.floor(this._canvas.clientWidth * cssToRealPixels);
    const displayHeight: number = Math.floor(this._canvas.clientHeight * cssToRealPixels);
    if (this._canvas.width !== displayWidth || this._canvas.height !== displayHeight) {
      this._canvas.width = displayWidth;
      this._canvas.height = displayHeight;
    }
  }

  _startFrameTimer() {
    this._clearFrameTimer();
    this._frameTimer = requestAnimationFrame(this._update);
  }

  _clearFrameTimer() {
    if (this._frameTimer) {
      cancelAnimationFrame(this._frameTimer);
      this._frameTimer = undefined;
    }
  }

  _processMeshMaterial(mesh: IMesh) {
    if (!mesh.material.program) {
      // Instantiate the material as required
      mesh.material.program = new Program(this._gl, mesh.material.vertexShader, mesh.material.fragmentShader);
    }
  }

  _update = (renderTime: number) => {
    // Convert from milliseconds to seconds
    renderTime *= 0.001;
    // Get the elapsed time
    const timePassed = renderTime - this._previousRenderTime;
    // Store previous render time
    this._previousRenderTime = renderTime;

    // Allow for updates to take place
    if (this._onUpdate) this._onUpdate(timePassed);
    // Draw all children in current scene
    this._draw();
    // Wait for next frame
    this._startFrameTimer();
  }

  _draw() {
    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    const sceneCameraMatrix: mat4 = this._activeScene.camera.matrix;
    const meshes = this._activeScene.children;
    meshes.forEach(mesh => {
      const program: IProgram = mesh.material.program;

      if (program) {
        // Render the mesh
        this._gl.useProgram(program);
        const meshMatrix: Matrix4 = new Matrix4(sceneCameraMatrix);
        meshMatrix.multiply(mesh.matrix);
        this._gl.uniformMatrix4fv(program.matrixUniform, false, meshMatrix.value);
        const normalsMatrix: Matrix4 = new Matrix4(mesh.normalsMatrix);
        normalsMatrix.invert();
        normalsMatrix.transpose();
        this._gl.uniformMatrix4fv(program.normalMatrixUniform, false, normalsMatrix.value);

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._normalsBuffer);
        this._gl.enableVertexAttribArray(program.normalAttribute);
        this._gl.vertexAttribPointer(program.normalAttribute, 3, this._gl.FLOAT, false, 0, 0);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, mesh.normals, this._gl.STATIC_DRAW);

        if (program.colorUniform) {
          this._gl.uniform4fv(program.colorUniform, [
            mesh.material.colorInUnits.r,
            mesh.material.colorInUnits.g,
            mesh.material.colorInUnits.b,
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
          new Float32Array([normalizedLightValues.x, normalizedLightValues.y, normalizedLightValues.z])
        );
        this._gl.uniform3fv(program.lightColorUniform, lightColor);

        // UVs
        if (program.uvAttribute && program.uvAttribute !== -1 && mesh.uvs.length && mesh.material.isTextureMap) {
          this._gl.bindTexture(this._gl.TEXTURE_2D, mesh.material.texture);
          this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._uvBuffer);
          this._gl.enableVertexAttribArray(program.uvAttribute);
          this._gl.vertexAttribPointer(program.uvAttribute, 2, this._gl.FLOAT, true, 0, 0);
          this._gl.bufferData(this._gl.ARRAY_BUFFER, mesh.uvs, this._gl.STATIC_DRAW);
        }

        // Vertices
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
        this._gl.enableVertexAttribArray(program.positionAttribute);
        this._gl.vertexAttribPointer(program.positionAttribute, 2, this._gl.FLOAT, false, 0, 0);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, mesh.vertices, this._gl.STATIC_DRAW);

        // Indices
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, mesh.indices, this._gl.STATIC_DRAW);
        this._gl.drawElements(this._gl.TRIANGLES, mesh.indices.length, this._gl.UNSIGNED_SHORT, 0);
      } else {
        throw new Error(`Mesh ${mesh.id} has no material assigned, so will not be rendered`);
      }
    });
  }

  _onMeshAddedToScene = (newChild: IMesh) => {
    this._processMeshMaterial(newChild);
  }

  _onMeshMaterialUpdated = (child: IMesh) => {
    this._processMeshMaterial(child);
  }

  _onWindowResized = () => {
    if (!this._resizeFrameRequest) {
      this._resizeFrameRequest = requestAnimationFrame(this._onFrameTimerTicked);
    }
  }

  _onFrameTimerTicked = () => {
    this._resizeCanvas();
  }

}
