import { Matrix4 } from '../utils/Matrix4';
import { degreesToRadians } from '../utils/mathUtils';

export class LookAtCamera {

  private _fieldOfView: number;
  private _fieldOfViewRadians: number;
  private _aspectRatio: number;
  private _zNear: number;
  private _zFar: number;
  private _position: vec3;
  private _lookingAtMesh: boolean = false;
  private _target: IMesh | vec3;
  private _targetCoords: vec3;
  private _matrix: Matrix4;
  private _projectionMatrix: Matrix4;
  private _viewMatrix: Matrix4;

  constructor(options: IPerspectiveCameraOptions) {
    if (!options.fieldOfView) throw new Error('LookAtCamera options object is missing fieldOfView attribute');
    if (!options.canvasWidth) throw new Error('LookAtCamera options object is missing canvasWidth attribute');
    if (!options.canvasHeight) throw new Error('LookAtCamera options object is missing canvasHeight attribute');

    this._fieldOfView = options.fieldOfView;
    this._fieldOfViewRadians = degreesToRadians(this._fieldOfView);
    this._zNear = options.zNear || 1;
    this._zFar = options.zFar || 2000;
    this._matrix = new Matrix4();
    this._projectionMatrix = new Matrix4();
    this._position = {x: 0, y: 0, z: 0};
    this._targetCoords = {x: 0, y: 0, z: 0};
    this.resize(options.canvasWidth, options.canvasHeight);
    this._updateMatrix();
  }

  get matrix(): Matrix4 { return this._matrix; }

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

  setPosition(x: number, y: number, z: number) {
    this._position.x = x;
    this._position.y = y;
    this._position.z = z;
    this._updateMatrix();
  }

  resize(canvasWidth: number, canvasHeight: number) {
    this._aspectRatio = canvasWidth / canvasHeight;
    this._updateMatrix();
  }

  lookAt(meshOrPosition: IMesh | vec3) {
    this._target = meshOrPosition;
    this._lookingAtMesh = this._target.constructor !== Array;
    this._updateMatrix();
  }

  update() {
    if (this._lookingAtMesh) {
      this._updateTargetCoords();
    }
    this._updateMatrix();
  }

  _updateTargetCoords() {
    this._targetCoords = this._lookingAtMesh
      ? [this._target.center.x, this._target.center.y, this._target.center.z]
      : this._target;
  }

  _updateMatrix() {
    if (this._target) {
      this._updateTargetCoords();
      this._projectionMatrix.setToPerspective(this._fieldOfViewRadians, this._aspectRatio, this._zNear, this._zFar);
      this._matrix.setToIdentity();
      this._matrix.translate(this._position.x, this._position.y, this._position.z);
      const cameraPosition = {
        x: this._matrix[12],
        y: this._matrix[13],
        z: this._matrix[14],
      };

      const upDirection = [0, 1, 0];
      this._viewMatrix.setToLookAt(cameraPosition, this._targetCoords, upDirection);

      this._viewMatrix.invert();
      this._matrix.value = this._projectionMatrix.value;
      this._matrix.multiply(this._viewMatrix);
    }
  }
}
