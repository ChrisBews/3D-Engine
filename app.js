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
    this.scene2 = new Scene();
    this.renderer.scene = this.scene;
    this.renderer.onUpdate = this.onUpdate.bind(this);
    setTimeout(() => {
      this.renderer.scene = this.scene2;
    }, 5000);
  }

  populateScene() {
    this.cube = new Cube(0.3);
    this.cube.shader = new FlatColorShader([0, 0.5, 0, 1]);

    this.cube2 = new Cube(0.2);
    this.cube2.shader = new FlatColorShader([1, 0, 0, 1]);

    /*
    this.cube.position = {x: 0, y: 0, z: 0};
    this.cube.rotationX = 90;
    this.cube.scale = 1;

    this.cube.setPosition(x, y, z);
    this.cube.setRotationX(90);
    this.cube.setScale(1);

    this.cube.x = 0;
    this.cube.y = 0;
    this.cube.z = 0;
    this.cube.rotationX = 90;
    this.cube.scale = 1;
    
    */

    this.scene.addChild(this.cube);
    this.scene2.addChild(this.cube2);
  }
  
  onUpdate(elapsedTime) {
    
  }
}

const app = new App();