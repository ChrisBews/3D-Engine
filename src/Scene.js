class Scene {

  constructor() {
    this._children = [];
    this._gl;
  }

  get children() {
    return this._children;
  }

  set glContext(context) {
    this._gl = context;
    this._children.forEach(child => child.glContext = this._gl);
  }

  addChild(mesh) {
    console.log('add child');
    if (!this._children.includes(mesh)) {
      if (this._gl) mesh.glContext = this._gl;
      this._children.push(mesh);
    }
  }

  removeChild(mesh) {
    this.children.filter(child => child !== mesh);
  }
}