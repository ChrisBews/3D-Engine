export class Scene implements IScene {

  private _children: any[];
  private _camera: ICamera;
  private _lights: ILight[];

  constructor() {
    this._children = [];
  }

  addChild(mesh: IMesh) {
    if (!this._children.includes(mesh)) {
      this._children.push(mesh);
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

  update(canvasWidth, canvasHeight) {
    if (this._camera && this._camera.resize) {
      this._camera.resize(canvasWidth, canvasHeight);
    }
  }
}
