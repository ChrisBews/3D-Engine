import { Matrix4 } from "../utils/Matrix4";

const distanceMultiplier: number = 1;

export class ProjectionCamera {

  private _left: number = 0;
  private _right: number = 0;
  private _top: number = 0;
  private _bottom: number = 0;
  private _zNear: number;
  private _zFar: number;
  private _matrix: Matrix4;
  private _orthoMatrix: Matrix4;

  constructor(canvas, zNear, zFar) {
    this._left = 0;
    this._right = canvas.clientWidth;
    this._top = 0;
    this._bottom = canvas.clientHeight;
    this._zNear = zNear || 400;
    this._zFar = zFar || -200;
    this._matrix = new Matrix4();
    this._orthoMatrix = new Matrix4();
    this._orthoMatrix.setToOrthographic(this._left, this._right, this._bottom, this._top, zNear, zFar);
    this._updateMatrix();
  }

  get matrix() {
    this._updateMatrix();
    return this._matrix;
  }

  _updateMatrix() {
    this._matrix.setToIdentity();
    this._matrix.copyZToW(distanceMultiplier);
    this._matrix.multiply(this._orthoMatrix.value);
  }
}
