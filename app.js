class App {

  constructor() {
    this.renderer = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.createEngine();
    this.populateScene();
    /*this.camera.x = -100;
    this.camera.y = 20;
    this.camera.z = -1000;*/
    //this.camera.angleX = 0;
    this.camera.x = 100;
    this.camera.y = 200;
    this.camera.z = 600;
    //this.camera.angleY = 0;

    this.camera.lookAt(this.originCube);
  }

  createEngine() {
    const canvas = document.getElementById('canvas');
    this.renderer = new Renderer(canvas);
    this.scene = new Scene();
    //this.camera = new ProjectionCamera(canvas);
    this.camera = new PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 2000);
    //this.camera.z = 600;
    this.scene.camera = this.camera;
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
    this.cube.x = -150;
    this.cube.y = 0;
    this.cube.z = -1000;
    this.cube.rotationY = 0;

    this.cube2 = new Cube(100);
    this.cube2.temp = true;
    this.cube2.shader = new FlatColorShader([1, 0, 0, 1]);
    this.cube2.x = 100;
    this.cube2.y = 0;
    this.cube2.z = 0;
    this.cube2.scale = 1;

    this.originCube = new Cube(3, 100, 3);
    this.originCube.shader = new FlatColorShader([0, 0.5, 0.5, 1]);

    this.fShape = new FShape(200);
    this.fShape.shader = new FlatColorShader([0.9, 0.1, 0.5, 1]);

    //this.scene.addChild(this.cube);
    this.scene.addChild(this.cube2);
    this.scene.addChild(this.originCube);
    this.scene.addChild(this.fShape);
  }
  
  onUpdate(elapsedTime) {
    //this.cube.rotationX += 1;
    //this.cube.rotationY += 1;
    this.cube2.rotationX += 1;
    this.cube2.y += 1;
    this.fShape.rotationY += 1;
    //this.camera.angleY += 2;
    //this.camera.y += 0.5;
    // this.cube2.scale += 0.001;
  }
}

const app = new App();