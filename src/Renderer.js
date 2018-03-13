class Renderer {

  constructor(canvas) {
    this.canvas = canvas;
    this._gl;
    this._scene;
    this._frameTimer;
    this._previousRenderTime;
    this._onUpdate;
    this._initGL();
  }

  _initGL() {
    this._gl = this.canvas.getContext('webgl2');
    if (!this._gl) {
      console.error('Failed to instantiate WebGL2');
    }
  }

  set scene(scene) {
    if (!scene instanceof Scene) {
      console.error('Scene is not valid');
      return;
    }
    this._scene = scene;
    this._startFrameTimer();
  }

  set onUpdate(callback) { this._onUpdate = callback; }

  _clearFrameTimer() {
    // Cancel a frame request if one exists
    if (this._frameTimer) {
      cancelAnimationFrame(this._frameTimer);
      this._frameTimer = undefined;
    }
  }

  _startFrameTimer() {
    this._clearFrameTimer();
    // Start a new frame request
    this._frameTimer = requestAnimationFrame(this._update.bind(this));
  }

  _update(renderTime) {
    // Convert from milliseconds to seconds
    renderTime *= 0.001;
    // Get the elapsed time
    const timePassed = renderTime - this._previousRenderTime;
    // Store previous render time
    this._previousRenderTime = renderTime;

    // Allow for updates to take place
    if (this._onUpdate) this._onUpdate();
    // Draw all children in current scene
    this._draw();
    // Wait for next frame
    this._startFrameTimer();
  }

  _draw() {

  }
}