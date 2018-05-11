import { Matrix4 } from '../utils/Matrix4';
import { degreesToRadians } from '../utils/mathUtils';
import { Mesh } from '../meshes/Mesh';

export class LookAtCamera implements ICamera {

  private _fieldOfView: number;
  private _fieldOfViewRadians: number;
  private _aspectRatio: number;
  private _zNear: number;
  private _zFar: number;
  private _position: vec3;
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

  public setPosition(x: number, y: number, z: number) {
    this._position.x = x;
    this._position.y = y;
    this._position.z = z;
    this._updateMatrix();
  }

  public resize(canvasWidth: number, canvasHeight: number) {
    this._aspectRatio = canvasWidth / canvasHeight;
    this._updateMatrix();
  }

  public lookAt(meshOrPosition: IMesh | vec3) {
    this._target = meshOrPosition;
    this._updateMatrix();
  }

  public update() {
    if (this._target instanceof Mesh) {
      this._updateTargetCoords();
    }
    this._updateMatrix();
  }

  private _updateTargetCoords() {
    if (this._target instanceof Mesh) {
      this._targetCoords = this._target.center;
    } else {
      this._targetCoords = this._target;
    }
  }

  private _updateMatrix() {
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

      const upDirection = {x: 0, y: 1, z: 0};
      this._viewMatrix.setToLookAt(cameraPosition, this._targetCoords, upDirection);

      this._viewMatrix.invert();
      this._matrix.value = this._projectionMatrix.value;
      this._matrix.multiply(this._viewMatrix.value);
    }
  }
}
