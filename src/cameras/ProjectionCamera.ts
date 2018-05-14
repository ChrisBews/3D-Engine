import { Matrix4 } from "../utils/Matrix4";

const distanceMultiplier: number = 1;

export class ProjectionCamera implements ICamera {

  private _left: number = 0;
  private _right: number = 0;
  private _top: number = 0;
  private _bottom: number = 0;
  private _zNear: number;
  private _zFar: number;
  private _matrix: Matrix4;
  private _orthoMatrix: Matrix4;

  constructor(zNear, zFar) {
    this._zNear = zNear || 400;
    this._zFar = zFar || -200;
    this._matrix = new Matrix4();
    this._orthoMatrix = new Matrix4();
    this._orthoMatrix.setToOrthographic(this._left, this._right, this._bottom, this._top, zNear, zFar);
    this._updateMatrix();
  }

  get matrix(): mat4 {
    this._updateMatrix();
    return this._matrix.value;
  }

  public resize(canvasWidth: number, canvasHeight: number) {
    this._right = canvasWidth;
    this._bottom = canvasHeight;
    this._orthoMatrix.setToOrthographic(this._left, this._right, this._bottom, this._top, this._zNear, this._zFar);
  }

  public update() {

  }

  private _updateMatrix() {
    this._matrix.setToIdentity();
    this._matrix.copyZToW(distanceMultiplier);
    this._matrix.multiply(this._orthoMatrix.value);
  }
}
