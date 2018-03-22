class App {

  constructor() {
    this.renderer = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.createEngine();
    this.populateScene();
    this.createLights();
    this.camera.x = -100;
    this.camera.y = 300;
    this.camera.z = 300;
    
    this.camera2.x = 0;
    this.camera2.y = 100;
    this.camera2.z = 200;
    //this.camera2.angleX = -40;
    //this.camera2.angleY = -40;

    this.cameraIncrement = -1;
    
    this.lightDirection = 360;
    this.lightIncrement = 1;

    this.camera.lookAt(this.cylinder);

    this.activeCamera = this.camera2;
    //this.toggleCamera();
  }

  toggleCamera() {
    setTimeout(() => {
      if (this.activeCamera === this.camera) {
        this.activeCamera = this.camera2;
      } else {
        this.activeCamera = this.camera;
      }
      this.scene.camera = this.activeCamera;
      this.toggleCamera();
    }, 5000);
  }

  createEngine() {
    const canvas = document.getElementById('canvas');
    this.renderer = new Renderer(canvas);
    this.scene = new Scene();

    //this.camera = new ProjectionCamera(canvas);
    this.camera = new LookAtCamera(60, canvas.clientWidth, canvas.clientHeight, 1, 2000);
    this.camera2 = new PerspectiveCamera(60, canvas.clientWidth, canvas.clientHeight, 1, 2000);

    this.scene.camera = this.camera2;
    //this.scene2 = new Scene();
    this.renderer.scene = this.scene;
    //this.renderer.scene = this.scene2;
    this.renderer.onUpdate = this.onUpdate.bind(this);
  }

  populateScene() {
    this.cube = new Cube(50);
    this.cube.shader = new FlatColorShader(255, 255, 255);
    this.cube.x = 100;
    this.cube.y = 0;
    this.cube.z = 0;
    this.cube.rotationY = 0;

    this.cube2 = new Cube(100, 100, 3);
    this.cube2.temp = true;
    this.cube2.shader = new FlatColorShader(255, 0, 0);
    this.cube2.x = 200;
    this.cube2.y = 0;
    this.cube2.z = 0;
    this.cube2.scale = 1;

    this.originCube = new Cube(3, 200, 3);
    this.originCube.shader = new FlatColorShader(0, 127, 0);

    this.fShape = new FShape(100);
    this.fShape.shader = new FlatColorShader(229, 25, 127);
    this.fShape.x = 100;
    this.fShape.z = -100;

    this.plane = new Plane(100, 200, 2);
    this.plane.shader = new FlatColorShader(80, 200, 80);
    this.plane.x = 0;
    this.plane.y = 0;
    this.plane.z = 0;

    this.sphere = new Sphere(50);
    this.sphere.y = 50;
    this.sphere.shader = new FlatColorShader(80, 40, 250);

    this.cylinder = new Cylinder(50, 200);
    this.cylinder.shader = new FlatColorShader(244, 232, 66);
    this.cylinder.x = -100;
    this.cylinder.z = -150;
  
    this.scene.addChild(this.sphere);
    this.scene.addChild(this.cube);
    this.scene.addChild(this.cube2);
    this.scene.addChild(this.originCube);
    this.scene.addChild(this.fShape);
    this.scene.addChild(this.plane);
    this.scene.addChild(this.cylinder);
  }

  createLights() {
    this.directionalLight = new DirectionalLight(0, 0.2, 0);
    this.directionalLight.color = [200, 200, 255];
    this.scene.addLight(this.directionalLight);
  }
  
  onUpdate(elapsedTime) {
    //this.cube.rotationY += (elapsedTime * 120);
    //this.cube2.rotationX += (elapsedTime * 180);
    //this.cylinder.rotationX += (elapsedTime * 120);
    //this.cylinder.rotationZ += (elapsedTime * 120);

    this.lightDirection -= this.lightIncrement;
    this.directionalLight.directionX = Math.cos(Helpers.degreesToRadians(this.lightDirection));
    //this.directionalLight.directionY = Math.cos(Helpers.degreesToRadians(this.lightDirection));
    this.directionalLight.directionZ = Math.sin(Helpers.degreesToRadians(this.lightDirection));

    //this.fShape.rotationY += (elapsedTime * 90);
    //this.plane.rotationY += (elapsedTime * 180);
    //this.camera.x += this.cameraIncrement;
    if (this.camera.x < -300 || this.camera.x > 300) {
      //this.cameraIncrement *= -1;
    }
  }
}

const app = new App();