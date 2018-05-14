function TestApp() {
  this.world;
  this.scene;
  this.cube;

  this.init();
}

TestApp.prototype.init = function() {
  this.createWorld();
  this.populateScene();
}

TestApp.prototype.createWorld = function() {
  console.log(Oomph3D);
  this.world = new Oomph3D.World('test-canvas');
  this.scene = new Oomph3D.Scene();
  this.camera = new Oomph3D.cameras.LookAtCamera({
    fieldOfView: 60,
    z: 400,
    x: 0,
    y: 0,
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
    material: new Oomph3D.materials.FlatColor({ r: 200, g: 200, b: 0 }),
  });

  this.cylinder = new Oomph3D.meshes.Cylinder({
    radius: 50,
    height: 100,
    material: new Oomph3D.materials.FlatColor({ r: 255, g: 0, b: 0 }),
  });

  this.sphere = new Oomph3D.meshes.Sphere({
    radius: 50,
    material: new Oomph3D.materials.FlatColor({ r: 0, g: 200, b: 200 }),
  });

  this.fShape = new Oomph3D.meshes.FShape({
    width: 100,
    material: new Oomph3D.materials.FlatColor({ r: 200, g: 0, b: 200 }),
  });

  this.plane = new Oomph3D.meshes.Plane({
    width: 100,
    material: new Oomph3D.materials.FlatColor({ r: 200, g: 200, b: 0 }),
  });

  this.scene.addChild(this.fShape);
  if (this.camera.lookAt) this.camera.lookAt(this.fShape);
  if (this.camera.followMesh) this.camera.followMesh(this.fShape, 200);
  if (this.camera.enableControls) this.camera.enableControls();
}

TestApp.prototype.onUpdate = function() {
  this.fShape.rotationX += 1;
}

var app = new TestApp();
