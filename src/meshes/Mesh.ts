import { degreesToRadians } from '../utils/mathUtils';

export class Mesh implements IMesh {

  private _id: string;
  private _width: number = 0;
  private _height: number = 0;
  private _depth: number = 0;
  private _position: vec3 = {x: 0, y: 0, z: 0};
  private _rotation: vec3 = {x: 0, y: 0, z: 0};
  private _rotationRadians: vec3 = {x: 0, y: 0, z: 0};
  private _scale: vec3 = {x: 0, y: 0, z: 0};
  private _material: IMaterial;
  private _vertices: Float32Array;
  private _normals: Float32Array;
  private _indices: Uint16Array;
  private _uvs: Float32Array;
  private _matrix: mat4;
  private _normalMatrix: mat4;

  constructor(options: IMeshOptions = {}) {
    this._id = `Mesh-${Date.now()}`;
    this._vertices = new Float32Array(options.vertices || []);
    this._normals = new Float32Array(options.normals || []);
    this._indices = new Uint16Array(options.indices || []);
    this._uvs = new Float32Array(options.uvs || []);
    if (options.vertices) this._calculateBounds();
  }

  get id() { return this._id; }

  get x() { return this._position.x; }
  set x(value: number) {
    this._position.x = value;
    this._updateMatrix();
  }

  get y() { return this._position.y; }
  set y(value: number) {
    this._position.y = value;
    this._updateMatrix();
  }

  get z() { return this._position.z; }
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

  get rotationX() { return this._rotation.x; }
  set rotationX(value: number) {
    this._rotation.x = value;
    this._rotationRadians.x = degreesToRadians(value);
    this._updateMatrix();
  }

  get rotationY() { return this._rotation.y; }
  set rotationY(value: number) {
    this._rotation.y = value;
    this._rotationRadians.y = degreesToRadians(value);
    this._updateMatrix();
  }

  get rotationZ() { return this._rotation.z; }
  set rotationZ(value: number) {
    this._rotation.z = value;
    this._rotationRadians.z = degreesToRadians(value);
    this._updateMatrix();
  }

  get scale() { return this._scale.z; }
  set scale(value: number) {
    this._scale = { x: value, y: value, z: value };
    this._updateMatrix();
  }

  get scaleX() { return this._scale.x; }
  set scaleX(value: number) {
    this._scale.x = value;
    this._updateMatrix();
  }

  get scaleY() { return this._scale.y; }
  set scaleY(value: number) {
    this._scale.y = value;
    this._updateMatrix();
  }

  get scaleZ() { return this._scale.z; }
  set scaleZ(value: number) {
    this._scale.z = value;
    this._updateMatrix();
  }

  get vertices() { return this._vertices; }
  set vertices(value: Float32Array) { this._vertices = value; }

  get normals() { return this._normals; }
  set normals(value: Float32Array) { this._normals = value; }

  get indices() { return this._indices; }
  set indices(value: Uint16Array) { this._indices = value; }

  get uvs() { return this._uvs; }
  set uvs(value: Float32Array) { this._uvs = value; }

  get material() { return this._material; }
  set material(value: any) { this._material = value; }

  get matrix() { return this._matrix; }

  get normalsMatrix() { return this._normalMatrix; }

  _calculateBounds() {
    this._width = this._getMaxVertexDistance(0, this._vertices.length - 2);
    this._height = this._getMaxVertexDistance(1, this._vertices.length - 1);
    this._depth = this._getMaxVertexDistance(2, this._vertices.length - 1);
  }

  _getMaxVertexDistance(startIndex: number, endIndex: number): number {
    let min: number = 0, max: number = 0;
    for (let i = startIndex; i < endIndex; i+= 3) {
      const vertexCoord = this._vertices[i];
      if (vertexCoord < min) min = vertexCoord;
      if (vertexCoord > max) max = vertexCoord;
    }
    return max - min;
  }

  _updateMatrix() {
    const scaledHeight: number = this._height * this._scale.y;
    let updatedMatrix: mat4 = Matrix4.createTranslation(this._position.x, this._position.y, this._position.z);
    let updatedNormalMatrix: mat4 = Matrix4.createIdentity();

    // If rotation has been applied
    if (this._rotation.x || this._rotation.y || this._rotation.z) {
      updatedMatrix = Matrix4.translate(updatedMatrix, 0, scaledHeight / 2, 0);
      updatedMatrix = Matrix4.rotate(updatedMatrix, this._rotationRadians.x, this._rotationRadians.y, this._rotationRadians.z);
      updatedNormalMatrix = Matrix4.rotate(updatedNormalMatrix, this._rotationRadians.x, this._rotationRadians.y, this._rotationRadians.z);
      updatedMatrix = Matrix4.translate(updatedMatrix, 0, -scaledHeight / 2, 0);
    }
    if (this._scale.x !== 1 || this._scale.y !== 1 || this._scale.z !== 1) {
      updatedMatrix = Matrix4.scale(updatedMatrix, this._scale.x, this._scale.y, this._scale.z);
    }

    this._matrix = updatedMatrix;
    this._normalMatrix = updatedNormalMatrix;
  }
}
