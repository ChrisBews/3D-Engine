class PerspectiveCamera {
  
  constructor(fieldOfView, aspect, zNear, zFar) {
    // TODO: Will probably have to pass in canvas to calculate aspect ratio automatically
    this._aspectRatio = aspect;
    this._zNear = zNear || 1;
    this._zFar = zFar || 2000;
    this._position;
    this._positionMatrix;
    this._matrix;
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._angleY = 80;
    this._angleXInRadians = 0;
    this._angleYInRadians = 0;
    this._angleZInRadians = 0;
    this._target = [0, 0, 0];
    // Create the projection matrix
    this.fieldOfViewRadians = Helpers.degreesToRadians(fieldOfView);
    this._updateMatrix();
  }

  get matrix() { return this._matrix; }

  get x() { return this._x; }
  set x(value) {
    this._x = value;
    this._updateMatrix();
  }

  get y() { return this._y; }
  set y(value) {
    this._y = value;
    this._updateMatrix();
  }

  get z() { return this._z; }
  set z(value) {
    this._z = value;
    this._updateMatrix();
  }

  get angleX() { return this._angleX; }
  set angleX(value) {
    this._lookingAtMesh = false;
    this._angleX = value;
    this._angleXInRadians = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  get angleY() { return this._angleY; }
  set angleY(value) {
    this._lookingAtMesh = false;
    this._angleY = value;
    this._angleYInRadians = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  get angleZ() { return this._angleZ; }
  set angleZ(value) {
    this._lookingAtMesh = false;
    this._angleZ = value;
    this._angleZInRadians = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  setPosition(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._updateMatrix();
  }

  lookAt(mesh) {
    this._lookingAtMesh = true;
    this._target = [mesh.x, mesh.y, mesh.z];
    this._updateMatrix();
  }

  _updateMatrix() {
    this._projectionMatrix = Matrix3D.createPerspective(this.fieldOfViewRadians, this._aspectRatio, this._zNear, this._zFar);
    if (!this._lookingAtMesh) {
      this._matrix = Matrix3D.createXRotation(this._angleXInRadians);
      this._matrix = Matrix3D.rotateY(this._matrix, this._angleYInRadians);
      this._matrix = Matrix3D.rotateZ(this._matrix, this._angleZInRadians);
      this._matrix = Matrix3D.translate(this._matrix, this._x, this._y, this._z);
    } else {
      this._matrix = Matrix3D.createTranslation(this._x, this._y, this._z);
      const cameraPosition = [
        this._matrix[12],
        this._matrix[13],
        this._matrix[14],
      ];
      const upDirection = [0, 1, 0];
      this._matrix = Matrix3D.createLookAt(cameraPosition, this._target, upDirection);
    }

    const viewMatrix = Matrix3D.inverse(this._matrix);
    this._matrix = Matrix3D.multiply(this._projectionMatrix, viewMatrix);
  }
}