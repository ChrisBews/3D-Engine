export class Scene implements IScene {

  private _children: IMesh[];
  private _camera: ICamera;
  private _lights: ILight[];
  private _directionalLight: IDirectionalLight;
  private _onChildAdded: (mesh: IMesh) => void;
  private _onCameraAdded: (camera: ICamera) => void;
  private _onMeshMaterialUpdated: (mesh: IMesh) => void;

  constructor() {
    this._children = [];
    this._lights = [];
  }

  get children(): IMesh[] { return this._children; }

  get camera(): ICamera { return this._camera; }
  set camera(camera: ICamera) {
    this._camera = camera;
    if (this._onCameraAdded) this._onCameraAdded(camera);
  }

  get lights(): ILight[] { return this._lights; }
  get directionalLight(): IDirectionalLight { return this._directionalLight; }

  set onChildAdded(value: (mesh: IMesh) => void) {
    this._onChildAdded = value;
  }

  set onMeshMaterialUpdated(value: (mesh: IMesh) => void) {
    this._onMeshMaterialUpdated = value;
  }

  set onCameraAdded(value: (camera: ICamera) => void) {
    this._onCameraAdded = value;
  }

  addChild(mesh: IMesh) {
    if (this._children.indexOf(mesh) === -1) {
      this._children.push(mesh);
      mesh.onMaterialUpdated = this._onMeshMaterialUpdated;
      if (this._onChildAdded) this._onChildAdded(mesh);
    }
  }

  removeChild(mesh: IMesh) {
    this._children = this._children.filter(currentMesh => currentMesh !== mesh);
  }

  addLight(light: ILight) {
    if (this._lights.indexOf(light) === -1) {
      if (light.isDirectional) {
        if (this._directionalLight) {
          throw new Error('Scene: Scene already contains a directional light. Remove the existing one before adding a new one');
        }
        this._directionalLight = light as IDirectionalLight;
      } else {
        this._lights.push(light);
      }
    }
  }

  removeLight(light: ILight) {
    if (light.isDirectional) {
      this._directionalLight = undefined;
    } else {
      this._lights = this._lights.filter(currentLight => currentLight !== light);
    }
  }

  update(canvasWidth: number, canvasHeight: number) {
    if (this._camera && this._camera.resize) {
      this._camera.resize(canvasWidth, canvasHeight);
    }
  }
}
