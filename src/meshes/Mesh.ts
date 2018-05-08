import { degreesToRadians } from '../utils/mathUtils';
import { Matrix4 } from '../utils/Matrix4';

export class Mesh implements IMesh {

  protected _id: string;
  protected _width: number = 0;
  protected _height: number = 0;
  protected _depth: number = 0;
  protected _position: vec3 = {x: 0, y: 0, z: 0};
  protected _rotation: vec3 = {x: 0, y: 0, z: 0};
  protected _rotationRadians: vec3 = {x: 0, y: 0, z: 0};
  protected _scale: vec3 = {x: 0, y: 0, z: 0};
  protected _material: IMaterial;
  protected _vertices: Float32Array;
  protected _normals: Float32Array;
  protected _indices: Uint16Array;
  protected _uvs: Float32Array;
  protected _matrix: Matrix4;
  protected _normalMatrix: Matrix4;

  constructor(options: IMeshOptions = {}) {
    this._id = `Mesh-${Date.now()}`;
    this._vertices = new Float32Array(options.vertices || []);
    this._normals = new Float32Array(options.normals || []);
    this._indices = new Uint16Array(options.indices || []);
    this._uvs = new Float32Array(options.uvs || []);
    if (options.vertices) this._calculateBounds();
  }

  get id(): string { return this._id; }

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

  get center(): vec3 {
    return {
      x: this._position.x,
      y: this._position.y + ((this._height / 2) * this._scale.y),
      z: this._position.z,
    };
  }

  get rotationX(): number { return this._rotation.x; }
  set rotationX(value: number) {
    this._rotation.x = value;
    this._rotationRadians.x = degreesToRadians(value);
    this._updateMatrix();
  }

  get rotationY(): number { return this._rotation.y; }
  set rotationY(value: number) {
    this._rotation.y = value;
    this._rotationRadians.y = degreesToRadians(value);
    this._updateMatrix();
  }

  get rotationZ(): number { return this._rotation.z; }
  set rotationZ(value: number) {
    this._rotation.z = value;
    this._rotationRadians.z = degreesToRadians(value);
    this._updateMatrix();
  }

  get scale(): number { return this._scale.z; }
  set scale(value: number) {
    this._scale = { x: value, y: value, z: value };
    this._updateMatrix();
  }

  get scaleX(): number { return this._scale.x; }
  set scaleX(value: number) {
    this._scale.x = value;
    this._updateMatrix();
  }

  get scaleY(): number { return this._scale.y; }
  set scaleY(value: number) {
    this._scale.y = value;
    this._updateMatrix();
  }

  get scaleZ(): number { return this._scale.z; }
  set scaleZ(value: number) {
    this._scale.z = value;
    this._updateMatrix();
  }

  get vertices(): Float32Array { return this._vertices; }
  set vertices(value: Float32Array) { this._vertices = value; }

  get normals(): Float32Array { return this._normals; }
  set normals(value: Float32Array) { this._normals = value; }

  get indices(): Uint16Array { return this._indices; }
  set indices(value: Uint16Array) { this._indices = value; }

  get uvs(): Float32Array { return this._uvs; }
  set uvs(value: Float32Array) { this._uvs = value; }

  get material() { return this._material; }
  set material(value: any) { this._material = value; }

  get matrix(): Matrix4 { return this._matrix; }

  get normalsMatrix(): Matrix4 { return this._normalMatrix; }

  protected _updateMatrix() {
    const scaledHeight: number = this._height * this._scale.y;
    const updatedMatrix: Matrix4 = new Matrix4();
    updatedMatrix.translate(this._position.x, this._position.y, this._position.z);
    const updatedNormalMatrix: Matrix4 = new Matrix4();

    // If rotation has been applied
    if (this._rotation.x || this._rotation.y || this._rotation.z) {
      updatedMatrix.translate(0, scaledHeight / 2, 0);
      updatedMatrix.rotate(this._rotationRadians.x, this._rotationRadians.y, this._rotationRadians.z);
      updatedNormalMatrix.rotate(this._rotationRadians.x, this._rotationRadians.y, this._rotationRadians.z);
      updatedMatrix.translate(0, -scaledHeight / 2, 0);
    }
    if (this._scale.x !== 1 || this._scale.y !== 1 || this._scale.z !== 1) {
      updatedMatrix.scale(this._scale.x, this._scale.y, this._scale.z);
    }

    this._matrix = updatedMatrix;
    this._normalMatrix = updatedNormalMatrix;
  }

  private _calculateBounds() {
    this._width = this._getMaxVertexDistance(0, this._vertices.length - 2);
    this._height = this._getMaxVertexDistance(1, this._vertices.length - 1);
    this._depth = this._getMaxVertexDistance(2, this._vertices.length - 1);
  }

  private _getMaxVertexDistance(startIndex: number, endIndex: number): number {
    let min: number = 0;
    let max: number = 0;
    for (let i = startIndex; i < endIndex; i += 3) {
      const vertexCoord = this._vertices[i];
      if (vertexCoord < min) min = vertexCoord;
      if (vertexCoord > max) max = vertexCoord;
    }
    return max - min;
  }
}
