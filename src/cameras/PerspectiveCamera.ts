import { degreesToRadians } from "../utils/mathUtils";
import { Matrix4 } from "../utils/Matrix4";

export class PerspectiveCamera implements ICamera {

  protected _aspectRatio: number;
  protected _zNear: number;
  protected _zFar: number;
  protected _position: vec3;
  protected _matrix: Matrix4;
  protected _angle: vec3;
  protected _angleInRadians: vec3;
  protected _target: vec3;
  protected _fieldOfView: number;
  protected _fieldOfViewRadians: number;
  protected _projectionMatrix: Matrix4;
  protected _viewMatrix: Matrix4;

  constructor(options: IPerspectiveCameraOptions) {
    if (!options.fieldOfView) throw new Error('PerspectiveCamera options object is missing fieldOfView attribute');

    this._fieldOfView = options.fieldOfView;
    this._fieldOfViewRadians = degreesToRadians(this._fieldOfView);
    this._zNear = options.zNear || 1;
    this._zFar = options.zFar || 2000;
    this._matrix = new Matrix4();
    this._projectionMatrix = new Matrix4();
    this._viewMatrix = new Matrix4();
    this._position = {x: 0, y: 0, z: 0};
    this._angle = {x: 0, y: 0, z: 0};
    this._angleInRadians = {x: 0, y: 0, z: 0};
    this._updateMatrix();
  }

  get matrix(): mat4 { return this._matrix.value; }

  get x(): number { return this._position.x; }
  set x(value: number) {
    this._position.x = value;
    this._updateMatrix();
  }

  get y(): number { return this._position.y; }
  set y(value: number) {
    this._position.y = value;
    this._updateMatrix();
  }

  get z(): number { return this._position.z; }
  set z(value: number) {
    this._position.z = value;
    this._updateMatrix();
  }

  get angleX(): number { return this._angle.x; }
  set angleX(value: number) {
    this._angle.x = value;
    this._angleInRadians.x = degreesToRadians(value);
    this._updateMatrix();
  }

  get angleY(): number { return this._angle.y; }
  set angleY(value: number) {
    this._angle.y = value;
    this._angleInRadians.y = degreesToRadians(value);
    this._updateMatrix();
  }

  get angleZ(): number { return this._angle.z; }
  set angleZ(value: number) {
    this._angle.z = value;
    this._angleInRadians.z = degreesToRadians(value);
    this._updateMatrix();
  }

  public setPosition(x: number, y: number, z: number) {
    this._position = {x, y, z};
  }

  public resize(canvasWidth: number, canvasHeight: number) {
    this._aspectRatio = canvasWidth / canvasHeight;
    this._updateMatrix();
  }

  protected _updateMatrix() {
    this._projectionMatrix.setToPerspective(this._fieldOfViewRadians, this._aspectRatio, this._zNear, this._zFar);
    this._viewMatrix.setToIdentity();
    this._viewMatrix.translate(this._position.x, this._position.y, this._position.z);

    this._viewMatrix.rotateY(this._angleInRadians.y);
    this._viewMatrix.rotateX(this._angleInRadians.x);
    this._viewMatrix.rotateZ(this._angleInRadians.z);
    this._viewMatrix.invert();

    this._matrix.value = this._projectionMatrix.value;
    this._matrix.multiply(this._viewMatrix.value);
  }
}
