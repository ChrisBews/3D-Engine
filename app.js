class App {

  constructor() {
    this.renderer = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.createEngine();
    this.populateScene();
    this.camera.x = 400;
    this.camera.y = 100;
    this.camera.z = 300;
    //this.camera.angleY = 20;

    this.camera.lookAt(this.plane);
  }

  createEngine() {
    const canvas = document.getElementById('canvas');
    this.renderer = new Renderer(canvas);
    this.scene = new Scene();

    //this.camera = new ProjectionCamera(canvas);
    //this.camera = new PerspectiveCamera(60, canvas.clientWidth, canvas.clientHeight, 1, 2000);
    this.camera = new LookAtCamera(60, canvas.clientWidth, canvas.clientHeight, 1, 2000);

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
    this.cube.shader = new FlatColorShader(255, 255, 255);
    this.cube.x = -150;
    this.cube.y = 0;
    this.cube.z = -1000;
    this.cube.rotationY = 0;

    this.cube2 = new Cube(100, 100, 5);
    this.cube2.temp = true;
    this.cube2.shader = new FlatColorShader(255, 0, 0);
    this.cube2.x = 200;
    this.cube2.y = 0;
    this.cube2.z = 0;
    this.cube2.scale = 1;

    this.originCube = new Cube(3, 100, 3);
    this.originCube.shader = new FlatColorShader(0, 127, 0);

    this.fShape = new FShape(200);
    this.fShape.shader = new FlatColorShader(229, 25, 127);
    this.fShape.scale = 0.5;

    this.plane = new Plane(100, 200, 0);
    this.plane.shader = new FlatColorShader(80, 200, 80);
    this.plane.x = 300;
    this.plane.y = 0;
    this.plane.z = 0;

    this.scene.addChild(this.cube);
    this.scene.addChild(this.cube2);
    this.scene.addChild(this.originCube);
    this.scene.addChild(this.fShape);
    this.scene.addChild(this.plane);
  }
  
  onUpdate(elapsedTime) {
    this.cube.rotationY += (elapsedTime * 180);
    this.cube2.rotationX += (elapsedTime * 180);
    this.fShape.rotationY += (elapsedTime * 90);
    this.plane.rotationY += (elapsedTime * 180);
  }
}

const app = new App();