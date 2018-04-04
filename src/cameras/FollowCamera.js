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
    this._distanceX = 0;
    this._distanceY = 0;
    this._distanceZ = 400;
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
    if (this._targetMesh) {
      this._updateTarget();
      const s = Helpers.degreesToRadians(this._targetMesh.rotationY);
      const t = Helpers.degreesToRadians(this._targetMesh.rotationX);

      this._x = this._targetMesh.center.x + (this._distanceZ * Math.sin(s) * Math.cos(t));
      this._y = this._targetMesh.center.y + (this._distanceZ * -Math.sin(t));
      this._z = this._targetMesh.center.z + (this._distanceZ * Math.cos(s) * Math.cos(t));

      this._updateMatrix();
    }
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

    // TODO: We need to re-calculate 'up' from the camera's perspective in relation to the target
    // not just directly using the rotation of the target shape like this is doing:
    const xAngleInRadians = -Helpers.degreesToRadians(this._targetMesh.rotationX)

    const upDirection = [0, Math.cos(xAngleInRadians), -Math.sin(xAngleInRadians)];
    //console.log(upDirection);
    this._matrix = Matrix3D.createLookAt(cameraPosition, this._target, upDirection);

    const viewMatrix = Matrix3D.inverse(this._matrix);
    this._matrix = Matrix3D.multiply(this._projectionMatrix, viewMatrix);
  }

}