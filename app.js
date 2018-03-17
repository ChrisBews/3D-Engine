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
    //this.scene.camera = new ProjectionCamera(canvas);
    const camera = new PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 2000);
    camera.z = -600;
    camera.x = 20;
    this.scene.camera = camera;
    //this.scene2 = new Scene();
    this.renderer.scene = this.scene;
    this.renderer.onUpdate = this.onUpdate.bind(this);
    /*setTimeout(() => {
      this.renderer.scene = this.scene2;
    }, 5000);*/
  }

  populateScene() {
    this.cube = new Cube(200);
    this.cube.shader = new FlatColorShader([Math.random(), Math.random(), Math.random(), 1]);
    this.cube.x = 0;
    this.cube.y = 0;
    this.cube.z = 0;
    this.cube.rotationY = 0;

    this.cube2 = new Cube(100);
    this.cube2.shader = new FlatColorShader([1, 0, 0, 1]);
    this.cube2.x = 200;
    this.cube2.y = 200;
    this.cube2.rotationZ = 0;
    this.cube2.scale = 1;

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
    this.scene.addChild(this.cube2);
  }
  
  onUpdate(elapsedTime) {
    this.cube.rotationX += 1;
    this.cube.rotationY += 1;
    // this.cube2.scale += 0.001;
    // console.log(this.cube.rotationY);
  }
}

const app = new App();