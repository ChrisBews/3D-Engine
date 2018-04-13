class PerspectiveCamera {
  
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
    this._angleX = 0;
    this._angleY = 0;
    this._angleZ = 0;
    this._angleXInRadians = 0;
    this._angleYInRadians = 0;
    this._angleZInRadians = 0;
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

  get angleX() { return this._angleX; }
  set angleX(value) {
    this._angleX = value;
    this._angleXInRadians = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  get angleY() { return this._angleY; }
  set angleY(value) {
    this._angleY = value;
    this._angleYInRadians = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  get angleZ() { return this._angleZ; }
  set angleZ(value) {
    this._angleZ = value;
    this._angleZInRadians = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  resize(width, height) {
    this._aspectRatio = width / height;
    this._updateMatrix();
  }

  _updateMatrix() {
    this._projectionMatrix = Matrix3D.createPerspective(this._fieldOfViewRadians, this._aspectRatio, this._zNear, this._zFar);
    this._matrix = Matrix3D.createTranslation(this._x, this._y, this._z);
   
    this._matrix = Matrix3D.rotateY(this._matrix, this._angleYInRadians);
    this._matrix = Matrix3D.rotateX(this._matrix, this._angleXInRadians);
    this._matrix = Matrix3D.rotateZ(this._matrix, this._angleZInRadians);

    const viewMatrix = Matrix3D.inverse(this._matrix);
    this._matrix = Matrix3D.multiply(this._projectionMatrix, viewMatrix);
  }
}