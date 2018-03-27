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
    this.camera2.y = 75;
    this.camera2.z = 200;

    this.activeCamera = this.camera;
    
    this.lightIncrement = 1;

    OomphMotion.outputColorsAsArrays = true;

    /*OomphMotion.start(
      this.cube,
      { rotationX: 360, y: 100},
      {
        duration: 500,
        easing: OomphMotion.Easing.outQuart,
        bounce: true,
      },
    );*/

    /*OomphMotion.start(
      this.cylinder,
      {scaleY: 0.1},
      {
        duration: 500,
        easing: OomphMotion.Easing.outQuad,
        bounce: true,
      },
    );*/

    /*OomphMotion.start(
      0,
      10,
      {
        duration: 1000,
        easing: OomphMotion.Easing.outQuad,
        onUpdate: (animation) => {
          console.log(animation.value);
        },
      },
    );*/

    setTimeout(() => {
      OomphMotion.start(
        this.cylinderShader,
        {
          color: [255, 0, 0],
        },
        /*'rgba(255, 255, 255, 0)',
        'hsl(0, 0%, 0%)',*/
        /*'hsl(180, 100%, 50%)',
        'rgba(0, 0, 0, 0.5)',*/
        /*{
          color: 'hsl(180, 100%, 50%)',
        },
        //'#FFF',
        {
          color: 'rgba(20, 20, 20, 0.5)',
        },*/
        /*[255, 100, 0, 0.5],
        [0, 0, 0, 1],*/
        /*{
          color: [255, 100, 0, 0.5],
        },
        {
          color: [0, 0, 0, 1],
        },*/
        {
          duration: 2000,
          easing: OomphMotion.Easing.inOutQuad,
          alternate: true,
          onUpdate: (animation) => {
            //console.log(animation.value.color.toString());
          },
          onComplete: () => {
            console.log('Complete');
          },
        },
      );
    }, 1000);

    this.camera.x = -500;

    //Snowmotion.start(

    //Oomph3D
    OomphMotion.start(
      this.camera,
      {x: 500},
      {
        duration: 5000,
        easing: OomphMotion.Easing.inOutQuad,
        alternate: true,
      },
    );

    this.camera.lookAt(this.sphere);

    this.toggleCamera();
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
    }, 3000);
  }

  createEngine() {
    const canvas = document.getElementById('canvas');
    this.renderer = new Oomph3D(canvas);
    this.scene = new Scene();

    //this.camera = new ProjectionCamera(canvas);
    this.camera = new LookAtCamera(60, canvas.clientWidth, canvas.clientHeight, 1, 2000);
    this.camera2 = new PerspectiveCamera(60, canvas.clientWidth, canvas.clientHeight, 1, 2000);

    this.scene.camera = this.camera;
    //this.scene2 = new Scene();
    this.renderer.scene = this.scene;
    //this.renderer.scene = this.scene2;
    this.renderer.onUpdate = this.onUpdate.bind(this);
  }

  populateScene() {
    this.cube = new Cube(50);
    this.cube.shader = new FlatColorShader([255, 255, 255]);
    this.cube.x = 100;
    this.cube.y = 0;
    this.cube.z = 0;
    this.cube.rotationY = 0;

    this.cube2 = new Cube(100, 100, 3);
    this.cube2.temp = true;
    this.cube2.shader = new FlatColorShader([255, 0, 0]);
    this.cube2.x = 200;
    this.cube2.y = 0;
    this.cube2.z = 0;
    this.cube2.scale = 1;

    this.originCube = new Cube(3, 200, 3);
    this.originCube.shader = new FlatColorShader([0, 127, 0]);

    this.fShape = new FShape(100);
    this.fShape.shader = new FlatColorShader([229, 25, 127]);
    this.fShape.x = 100;
    this.fShape.z = -100;

    this.plane = new Plane(100, 200, 2);
    this.plane.shader = new FlatColorShader([80, 200, 80]);
    this.plane.x = 0;
    this.plane.y = 0;
    this.plane.z = 0;

    this.sphere = new Sphere(50);
    this.sphere.y = 0;
    this.sphere.shader = new FlatColorShader([80, 40, 250]);

    this.cylinderShader = new FlatColorShader([244, 232, 66]);
    this.cylinder = new Cylinder(50, 200);
    this.cylinder.shader = this.cylinderShader;
    this.cylinder.x = -100;
    this.cylinder.z = -150;
  
    this.scene.addChild(this.sphere);
    this.scene.addChild(this.cube);
    this.scene.addChild(this.cube2);
    this.scene.addChild(this.originCube);
    this.scene.addChild(this.fShape);
    this.scene.addChild(this.plane);
    this.scene.addChild(this.cylinder);

    /*setTimeout(() => {
      this.scene.removeChild(this.fShape);
    }, 5000);*/
  }

  createLights() {
    const lightDirection = 90;
    const lightDirX = Math.cos(Helpers.degreesToRadians(lightDirection));
    const lightDirZ = Math.sin(Helpers.degreesToRadians(lightDirection));
    this.directionalLight = new DirectionalLight(lightDirX, 0, lightDirZ);
    this.directionalLight.color = [255, 255, 255];
    this.scene.addLight(this.directionalLight);
    /*setTimeout(() => {
      this.scene.removeLight(this.directionalLight);
    }, 5000);*/
  }
  
  onUpdate(elapsedTime) {
    //this.cube.rotationY += (elapsedTime * 120);
    //this.cube2.rotationX += (elapsedTime * 180);
    //this.cylinder.rotationX += (elapsedTime * 120);
    //this.cylinder.rotationZ += (elapsedTime * 120);

    //this.lightDirection -= this.lightIncrement;
    
    //this.directionalLight.directionX = Math.cos(Helpers.degreesToRadians(this.lightDirection));
    //this.directionalLight.directionY = Math.cos(Helpers.degreesToRadians(this.lightDirection));
    //this.directionalLight.directionZ = Math.sin(Helpers.degreesToRadians(this.lightDirection));

    //this.fShape.rotationY += (elapsedTime * 90);
    //this.plane.rotationY += (elapsedTime * 180);
  

    /*this.sphere.scale += this.sphereIncrement;
    if (this.sphere.scale <= 0.5 || this.sphere.scale >= 1) {
      this.sphereIncrement *= -1;
    }*/
  }
}

const app = new App();