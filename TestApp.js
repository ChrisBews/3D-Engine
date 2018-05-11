function TestApp() {
  this.world;
  this.scene;
  this.cube;

  this.init();
}

TestApp.prototype.init = function() {
  this.createWorld();
}

TestApp.prototype.createWorld = function() {
  this.world = new Oomph3D.World('test-canvas');
  this.scene = new Oomph3D.Scene();
  // 60, canvas.clientWidth, canvas.clientHeight, 1, 2000);
  this.camera = new Oomph3D.PerspectiveCamera({
    fieldOfView: 60,
  });
  this.world.scene = this.scene;
  this.world.onUpdate = this.onUpdate.bind(this);
}

TestApp.prototype.populateScene = function() {
  //this.cube = new Oomph3D.meshes.Cube(50);
  //this.cube = new Oomph3D.meshes.Cube({width: 50});
}

TestApp.prototype.onUpdate = function() {

}

var app = new TestApp();
