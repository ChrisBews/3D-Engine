class LookAtCamera {

  constructor(fieldOfView, canvasWidth, canvasHeight, zNear, zFar) {
    this._aspectRatio;
    this._zNear = zNear || 1;
    this._zFar = zFar || 2000;
    this._position;
    this._positionMatrix;
    this._matrix;
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._target = [0, 0, 0];
    this._fieldOfViewRadians = Helpers.degreesToRadians(fieldOfView);
    // Calculate the current aspect ratio
    this.resize(canvasWidth, canvasHeight);
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

  setPosition(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._updateMatrix();
  }

  resize(width, height) {
    this._aspectRatio = width / height;
    this._updateMatrix();
  }

  lookAt(meshOrPosition) {
    this._target = meshOrPosition.constructor === Array
      ? meshOrPosition
      : [meshOrPosition.center.x, meshOrPosition.center.y, meshOrPosition.center.z];
    this._updateMatrix();
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