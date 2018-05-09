import { Scene } from './Scene';
import { Program } from './Program';

export class World implements IWorld {

  private _gl: any;
  private _canvas: HTMLCanvasElement;
  private _activeScene: IScene;
  private _vao: any;
  private _positionBuffer: any;
  private _normalsBuffer: any;
  private _indexBuffer: any;
  private _uvBuffer: any;
  private _resizeFrameRequest: any;
  private _frameTimer: any;
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
    this._gl = this._canvas.getContext('webgl2');
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
    const sceneCameraMatrix = this._activeScene.camera.matrix;
    const meshes = this._activeScene.children;
    meshes.forEach(mesh => {
      const program = mesh.material.program;
    });
  }

  _processMeshMaterial(mesh: IMesh) {
    if (!mesh.material.program) {
      // Instantiate the material as required
      mesh.material.program = new Program(this._gl, mesh.material.vertexShader, mesh.material.fragmentShader);
    }
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
