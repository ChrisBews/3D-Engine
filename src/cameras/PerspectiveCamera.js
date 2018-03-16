class PerspectiveCamera {
  
  constructor(fieldOfView, aspect, zNear, zFar) {
    zNear = zNear || 1;
    zFar = zFar || 2000;
    this._position;
    this._positionMatrix;
    this._matrix;
    // Create the projection matrix
    this.fieldOfViewRadians = Helpers.degreesToRadians(fieldOfView);
    this._projectionMatrix = Matrix3D.createPerspective(this.fieldOfViewRadians, aspect, zNear, zFar);
  }

  setPosition(x, y, z) {
    this._positionMatrix = Matrix3D.translate(this.matrix, x, y, z);
    this._positionMatrix = [
      this._positionMatrix[12],
      this._positionMatrix[13],
      this._positionMatrix[14],
    ];
    this._matrix = Matrix3D.inverse(this._positionMatrix);
    this._matrix = Matrix3D.multiply(this._projectionMatrix, this._matrix);
  }

  lookAt(mesh) {

  }
}