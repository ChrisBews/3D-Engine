import { Matrix4 } from "../utils/Matrix4";

export class ProjectionCamera implements ICamera {

  private _distanceMultiplier: number;
  private _left: number = 0;
  private _right: number = 0;
  private _top: number = 0;
  private _bottom: number = 0;
  private _zNear: number;
  private _zFar: number;
  private _matrix: Matrix4;
  private _orthoMatrix: Matrix4;

  constructor(options: IProjectionCameraOptions) {
    this._distanceMultiplier = options.distanceMultiplier || 0.25;
    this._zNear = options.zNear || 400;
    this._zFar = options.zFar || -200;
    this._matrix = new Matrix4();
    this._orthoMatrix = new Matrix4();
    this._orthoMatrix.setToOrthographic(this._top, this._right, this._bottom, this._left, this._zNear, this._zFar);
    this._updateMatrix();
  }

  get matrix(): mat4 {
    this._updateMatrix();
    return this._matrix.value;
  }

  public resize(canvasWidth: number, canvasHeight: number) {
    this._right = canvasWidth;
    this._bottom = canvasHeight;
    this._orthoMatrix.setToOrthographic(this._top, this._right, this._bottom, this._left, this._zNear, this._zFar);
  }

  public update() {

  }

  private _updateMatrix() {
    this._matrix.setToIdentity();
    this._matrix.copyZToW(this._distanceMultiplier);
    this._matrix.multiply(this._orthoMatrix.value);
    this._matrix.scale(1, 1, -1);
    this._matrix.value[1] *= -1;
    this._matrix.value[5] *= -1;
    this._matrix.value[9] *= -1;
    this._matrix.value[13] *= -1;

  }
}
