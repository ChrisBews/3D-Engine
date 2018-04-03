class FollowCamera {

  constructor(fieldOfView, canvasWidth, canvasHeight, zNear, zFar) {
    this._fieldOfViewRadians = Helpers.degreesToRadians(fieldOfView);
    this._aspectRatio;
    this._zNear = zNear || 1;
    this._zFar = zFar || 2000;
    this._matrix = Matrix3D.createIdentity();
    this._target = [0, 0, 0];
    this._targetMesh;
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this.resize(canvasWidth, canvasHeight);
  }

  get matrix() { return this._matrix; }

  followMesh(mesh, distanceX, distanceY, distanceZ) {
    this._targetMesh = mesh;
    this._distanceX = distanceX;
    this._distanceY = distanceY;
    this._distanceZ = distanceZ;
    this.update();
  }

  update() {
    if (this._targetMesh) this._updateTarget();
    this._x = this._target[0] + this._distanceX;
    this._y = this._target[1] + this._distanceY;
    this._z = this._target[2] + this._distanceZ;
    this._updateMatrix();
  }

  _updateTarget() {
    this._target = [
      this._targetMesh.center.x,
      this._targetMesh.center.y,
      this._targetMesh.center.z,
    ];
  }

  resize(width, height) {
    this._aspectRatio = width / height;
    this.update();
  }

  _updateMatrix() {
    this._projectionMatrix = Matrix3D.createPerspective(this._fieldOfViewRadians, this._aspectRatio, this._zNear, this._zFar);
    this._matrix = Matrix3D.createTranslation(this._x, this._y, this._z);
    const cameraPosition = [
      this._matrix[12],
      this._matrix[13],
      this._matrix[14],
    ];
    const upDirection = [0, 1, 0];
    this._matrix = Matrix3D.createLookAt(cameraPosition, this._target, upDirection);

    const viewMatrix = Matrix3D.inverse(this._matrix);
    this._matrix = Matrix3D.multiply(this._projectionMatrix, viewMatrix);
  }

}