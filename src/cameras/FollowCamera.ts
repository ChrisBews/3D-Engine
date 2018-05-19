import { Matrix4 } from '../utils/Matrix4';
import { degreesToRadians } from '../utils/mathUtils';
import { subtractVectors, transformVector } from '../utils/vectorUtils';

export class FollowCamera implements ICamera {

  private _fieldOfView: number;
  private _fieldOfViewRadians: number;
  private _aspectRatio: number;
  private _zNear: number;
  private _zFar: number;
  private _matrix: Matrix4;
  private _target: vec3;
  private _targetMesh: IMesh;
  private _distance: number;

  constructor(options: IFollowCameraOptions) {
    if (!options.fieldOfView) throw new Error('FollowCamera options object is missing fieldOfView attribute');
    this._fieldOfView = options.fieldOfView;
    this._fieldOfViewRadians = degreesToRadians(options.fieldOfView);
    this._zNear = options.zNear || 1;
    this._zFar = options.zFar || 2000;
    this._matrix = new Matrix4();
    this._target = {x: 0, y: 0, z: 0};
    this._distance = options.distance || 400;
  }

  get matrix(): mat4 { return this._matrix.value; }

  public followMesh(mesh: IMesh, distance?: number) {
    this._targetMesh = mesh;
    if (distance) this._distance = distance;
    this.update();
  }

  public resize(canvasWidth: number, canvasHeight: number) {
    this._aspectRatio = canvasWidth / canvasHeight;
    this.update();
  }

  public update() {
    if (this._targetMesh) {
      this._updateTarget();
      this._updateMatrix();
    }
  }

  private _updateTarget() {
    this._target = this._targetMesh.center;
  }

  private _updateMatrix() {
    const projectionMatrix: Matrix4 = new Matrix4();
    projectionMatrix.setToPerspective(this._fieldOfViewRadians, this._aspectRatio, this._zNear, this._zFar);

    // New camera position
    const cameraX = this._target.x;
    const cameraY = this._target.y;
    const cameraZ = this._target.z + this._distance;

    this._matrix.setToIdentity();
    this._matrix.translate(cameraX, cameraY, cameraZ);

    const cameraPosition: vec3 = {
      x: this._matrix.value[12],
      y: this._matrix.value[13],
      z: this._matrix.value[14],
    };

    const xAngleInRadians = degreesToRadians(this._targetMesh.rotationX);
    const yAngleInRadians = degreesToRadians(this._targetMesh.rotationY);

    // Calculate the x and y rotation from the target and camera position
    let directionVector: vec4 = {...subtractVectors(cameraPosition, this._target), w: 0};
    let upDirection: vec4 = {x: 0, y: 1, z: 0, w: 0};

    /// pitch = y, yaw = x
    const rotationMatrix: Matrix4 = new Matrix4();
    rotationMatrix.rotateY(yAngleInRadians);
    rotationMatrix.rotateX(xAngleInRadians);

    directionVector = transformVector(rotationMatrix, directionVector);
    upDirection = transformVector(rotationMatrix, {x: 0, y: 1, z: 0, w: 0});

    cameraPosition.x = directionVector.x + this._target.x;
    cameraPosition.y = directionVector.y + this._target.y;
    cameraPosition.z = directionVector.z + this._target.z;

    const viewMatrix: Matrix4 = new Matrix4();
    viewMatrix.setToLookAt(cameraPosition, this._target, upDirection);
    viewMatrix.invert();

    this._matrix.value = projectionMatrix.value;
    this._matrix.multiply(viewMatrix.value);
  }
}
