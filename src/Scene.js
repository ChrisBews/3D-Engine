class Scene {

  constructor() {
    this._children = [];
  }

  get children() {
    return this._children;
  }

  addChild(mesh) {
    if (!this._children.includes(mesh)) {
      this._children.push(mesh);
    }
  }

  removeChild(mesh) {
    this.children.filter(child => child !== mesh);
  }
}