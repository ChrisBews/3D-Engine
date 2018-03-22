class Scene {

  constructor() {
    this._children = [];
    this._gl;
    this._camera;
    this._lights = [];
  }

  get children() {
    return this._children;
  }

  set glContext(context) {
    this._gl = context;
    this._children.forEach(child => child.glContext = this._gl);
  }

  get camera() { return this._camera; }
  set camera(value) { this._camera = value; }

  get lights() { return this._lights; }
  
  addChild(mesh) {
    if (!this._children.includes(mesh)) {
      if (this._gl) mesh.glContext = this._gl;
      this._children.push(mesh);
    }
  }

  removeChild(mesh) {
    this._children = this.children.filter(child => child !== mesh);
  }

  addLight(light) {
    this._lights.push(light);
  }

  removeLight(light) {
    this._lights = this._lights.filter(thisLight => thisLight !== light);
  }

  onWindowResized() {
    // Pass the width and height of the canvas to the camera
    // Allowing it to recalculate bounds/aspect ratio
    if (this._camera && this._camera.resize) {
      this._camera.resize(this._gl.canvas.clientWidth, this._gl.canvas.clientHeight);
    }
  }
}