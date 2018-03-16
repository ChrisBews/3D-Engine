class ProjectionCamera {

  constructor(canvas, near, far) {
    this._left = 0;
    this._right = canvas.clientWidth;
    this._top = 0;
    this._bottom = canvas.clientHeight;
    this._near = near || 400;
    this._far = far || -400;
    this._distanceMultiplier = 1;
    this._updateMatrix();
  }

  get matrix() {
    this._updateMatrix();
    return this._matrix;
  }

  _updateMatrix() {
    this._matrix = Matrix3D.createZToWMatrix(this._distanceMultiplier);
    this._matrix = Matrix3D.multiply(this._matrix, Matrix3D.createOrthographic(this._left, this._right, this._bottom, this._top, this._near, this._far));
  }
}