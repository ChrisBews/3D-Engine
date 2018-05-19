function TestApp() {
  this.world;
  this.scene;
  this.cube;

  this.init();
}

TestApp.prototype.init = function() {
  this.createWorld();
  this.populateScene();
  this.createAnimations();
}

TestApp.prototype.createWorld = function() {
  console.log(Oomph3D);
  this.world = new Oomph3D.World('test-canvas');
  this.scene = new Oomph3D.Scene();
  this.camera = new Oomph3D.cameras.FollowCamera({
    fieldOfView: 60,
    z: 400,
    x: 0,
    y: 200,
    distanceMultiplier: 0.5,
  });
  this.scene.camera = this.camera;

  this.light = new Oomph3D.lights.DirectionalLight({
    directionX: Math.cos(Oomph3D.utils.degreesToRadians(120)),
    directionY: 0,
    directionZ: Math.sin(Oomph3D.utils.degreesToRadians(120)),
  });

  this.scene.addLight(this.light);
  this.world.scene = this.scene;
  this.world.onUpdate = this.onUpdate.bind(this);
}

TestApp.prototype.populateScene = function() {
  this.cube = new Oomph3D.meshes.Cube({
    width: 100,
    material: new Oomph3D.materials.Texture('TestAppAssets/crate-2.jpg'),
  });
  this.cube.x = 200;
  this.cube.z = 50;

  this.cylinderMaterial = new Oomph3D.materials.FlatColor({ r: 255, g: 0, b: 0 });
  this.cylinder = new Oomph3D.meshes.Cylinder({
    radius: 50,
    height: 100,
    material: this.cylinderMaterial,
  });
  this.cylinder.x = 600;

  this.sphere = new Oomph3D.meshes.Sphere({
    radius: 50,
    material: new Oomph3D.materials.FlatColor({ r: 0, g: 200, b: 200 }),
  });

  this.fShape = new Oomph3D.meshes.FShape({
    width: 100,
    material: new Oomph3D.materials.FlatColor({ r: 200, g: 0, b: 200 }),
  });

  this.fShape.x = 50;
  this.fShape.y = 0;

  this.plane = new Oomph3D.meshes.Plane({
    width: 100,
    material: new Oomph3D.materials.FlatColor({ r: 200, g: 200, b: 0 }),
  });

  this.modalLoader = new Oomph3D.loaders.ObjLoader('TestAppAssets/girl.obj', meshData => {
    this.girlMesh = new Oomph3D.meshes.Mesh({
      vertices: meshData.vertices,
      normals: meshData.normals,
      indices: meshData.indices,
      uvs: meshData.uvs,
      material: new Oomph3D.materials.Texture('TestAppAssets/girl.png'),
    });
    this.girlMesh.scale = 24;
    this.girlMesh.x = 300;
    this.girlMesh.z = 200;
    this.scene.addChild(this.girlMesh);
  });

  this.scene.addChild(this.fShape);
  this.scene.addChild(this.cube);
  this.scene.addChild(this.cylinder);
  if (this.camera.lookAt) this.camera.lookAt(this.cube);
  if (this.camera.followMesh) this.camera.followMesh(this.cube, 200);
  if (this.camera.enableControls) this.camera.enableControls();
}

TestApp.prototype.createAnimations = function() {

  // Mesh rotation
  Oomph3D.Motion.start(this.fShape, {
    to: { rotationY: 360 },
    duration: 3000,
    easing: Oomph3D.Motion.easing.inOutQuad,
    bounce: true,
  });

  // Mesh rotation
  Oomph3D.Motion.timeline(this.cylinder, [
    {
      to: { rotationX: 180 },
      duration: 2000,
      easing: Oomph3D.Motion.easing.inOutQuad,
    },
    {
      to: { rotationZ: 180 },
      duration: 2000,
      easing: Oomph3D.Motion.easing.inOutQuad,
    },
  ],
  {
    bounce: true,
  });

  // rgba colour
  Oomph3D.Motion.start(this.cylinderMaterial, {
    to: { color: {r: 0, g: 255, b: 0, a: 1} },
    duration: 2000,
    bounce: true,
  });

  /*
  // Colour string
  Oomph3D.Motion.start('rgba(255, 255, 255, 1)', {
    to: 'rgba(0, 0, 0, 0)',
    duration: 2000,
    onUpdate: function(data) {
      console.log(data.value);
    },
  });
  */
  /*
  // Number
  Oomph3D.Motion.start(10, {
    to: 200,
    duration: 2000,
    onUpdate: function(data) {
      console.log(data.value);
    },
  });
  */

  /*
  // Number array
  Oomph3D.Motion.start([10, 10, 10], {
    to: [200, 200, 200],
    duration: 2000,
    onUpdate: function(data) {
      console.log(data.value);
    },
  });
  */
}

TestApp.prototype.onUpdate = function(elapsedTime) {
  this.cube.rotationX += (elapsedTime * 60);
  this.cube.rotationY += (elapsedTime * 60);

}

var app = new TestApp();
