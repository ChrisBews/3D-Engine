class App {

  constructor() {
    this.renderer = undefined;
    this.createEngine();
    this.populateScene();
  }

  createEngine() {
    const canvas = document.getElementById('canvas');
    this.renderer = new Renderer(canvas);
    this.scene = new Scene();
    this.renderer.scene = this.scene;
    this.renderer.onUpdate = this.onUpdate.bind(this);
  }

  populateScene() {
    this.cube = new Cube(100);
    this.cube.x = 0;
    this.cube.y = 0;
    this.cube.z = 0;
    this.scene.addChild(this.cube);
  }
  
  onUpdate() {
    console.log('ok');
  }
}

const app = new App();