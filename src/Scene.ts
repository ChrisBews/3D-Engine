export class Scene {

  public children: any[];
  public camera: ICamera;
  public lights: ILight[];

  constructor() {
    this.children = [];
  }

  addChild(mesh: IMesh) {
    if (!this.children.includes(mesh)) {
      this.children.push(mesh);
    }
  }

  removeChild(mesh: IMesh) {
    this.children = this.children.filter(currentMesh => currentMesh !== mesh);
  }

  addLight(light: ILight) {
    if (!this.lights.includes(light)) {
      this.lights.push(light);
    }
  }

  removeLight(light: ILight) {
    this.lights = this.lights.filter(currentLight => currentLight !== light);
  }

  update(canvasWidth, canvasHeight) {
    if (this.camera && this.camera.resize) {
      this.camera.resize(canvasWidth, canvasHeight);
    }
  }
}