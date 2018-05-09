export class Scene implements IScene {

  private _children: IMesh[];
  private _camera: ICamera;
  private _lights: ILight[];
  private _onChildAdded: (mesh: IMesh) => void;
  private _onMeshMaterialUpdated: (mesh: IMesh) => void;

  constructor() {
    this._children = [];
  }

  get children(): IMesh[] { return this._children; }
  get camera(): ICamera { return this._camera; }
  get lights(): ILight[] { return this._lights; }

  set onChildAdded(value: (mesh: IMesh) => void) {
    this._onChildAdded = value;
  }

  set onMeshMaterialUpdated(value: (mesh: IMesh) => void) {
    this._onMeshMaterialUpdated = value;
  }

  addChild(mesh: IMesh) {
    if (!this._children.includes(mesh)) {
      this._children.push(mesh);
      mesh.onMaterialUpdated = this._onMeshMaterialUpdated;
      if (this._onChildAdded) this._onChildAdded(mesh);
    }
  }

  removeChild(mesh: IMesh) {
    this._children = this._children.filter(currentMesh => currentMesh !== mesh);
  }

  addLight(light: ILight) {
    if (!this._lights.includes(light)) {
      this._lights.push(light);
    }
  }

  removeLight(light: ILight) {
    this._lights = this._lights.filter(currentLight => currentLight !== light);
  }

  update(canvasWidth: number, canvasHeight: number) {
    if (this._camera && this._camera.resize) {
      this._camera.resize(canvasWidth, canvasHeight);
    }
  }
}
