class Mesh {

  constructor(vertices, normals) {
    this._id = `Mesh-${Date.now()}`;
    this._width = 0;
    this._height = 0;
    this._depth = 0;
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._rotationX = 0;
    this._rotationXRadians = 0;
    this._rotationY = 0;
    this._rotationYRadians = 0;
    this._rotationZ = 0;
    this._rotationZRadians = 0;
    this._scaleX = 1;
    this._scaleY = 1;
    this._scaleZ = 1;
    this._program;
    this._gl;
    this._shader;
    this._vertices = vertices;
    this._normals = normals;
    this._matrix;
    this._worldMatrix;
    if (vertices) {
      // If vertices were passed into the constructor, this is a custom mesh
      // We therefore need to work out the width/height/depth automatically
      this._calculateBounds();
    }
  }

  _calculateBounds() {
    
  }

  _calculateWidth() {

  }

  _calculateHeight() {

  }

  _calculateDepth() {

  }

  get id() { return this._id; }

  get x() { return this._x; }
  set x(value) {
    this._x = value;
    this._updateMatrix();
  }

  get y() { return this._y; }
  set y(value) {
    this._y = value;
    this._updateMatrix();
  }

  get z() { return this._z; }
  set z(value) {
    this._z = value;
    this._updateMatrix();
  }

  get rotationX() { return this._rotationX; }
  set rotationX(value) {
    this._rotationX = value;
    this._rotationXRadians = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  get rotationY() { return this._rotationY; }
  set rotationY(value) {
    this._rotationY = value;
    this._rotationYRadians = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  get rotationZ() { return this._rotationZ; }
  set rotationZ(value) {
    this._rotationZ = value;
    this._rotationZRadians = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  get scale() { return this._scaleZ; }
  set scale(value) {
    this._scaleX = this._scaleY = this._scaleZ = value;
    this._updateMatrix();
  }

  get scaleX() { return this._scaleX; }
  set scaleX(value) {
    this._scaleX = value;
    this._updateMatrix();
  }

  get scaleY() { return this._scaleY; }
  set scaleY(value) {
    this._scaleY = value;
    this._updateMatrix();
  }

  get scaleZ() { return this._scaleZ; }
  set scaleZ(value) {
    this._scaleZ = value;
    this._updateMatrix();
  }

  set shader(shader) {
    this._shader = shader;
    if (this._gl) this._createProgram();
  }

  set glContext(context) {
    this._gl = context;
    if (this._shader) this._createProgram();
  }

  get vertices() {
    return this._vertices;
  }
  set vertices(value) { this._vertices = value; }

  get normals() {
    return this._normals;
  }
  set normals(value) { this._normals = value; }

  get matrix() {
    return this._matrix;
  }

  get center() {
    return {
      x: this._x,
      y: this._y + ((this._height/2) * this._scaleY),
      z: this._z,
    };
  }

  get material() {
    return {
      program: this._program,
      shader: this._shader,
    };
  }

  _updateMatrix() {
    this._matrix = Matrix3D.createIdentity();
    // The mesh origin should be in the middle of the shape, and at the bottom of the shape (ie. not the middle vertically)
    const scaledWidth = this._width * this._scaleX;
    const scaledHeight = this._height * this._scaleY;
    const scaledDepth = this._depth * this._scaleZ;
    const xPos = this._x - (scaledWidth/2);
    const yPos = this._y;
    const zPos = this._z + (scaledDepth/2);
    this._matrix = Matrix3D.translate(this._matrix, xPos, yPos, zPos);

    if (this._rotationX || this._rotationY || this._rotationZ) {
      // Translate so that the origin is at the center of the shape for rotation
      this._matrix = Matrix3D.translate(this._matrix, scaledWidth/2, scaledHeight/2, -scaledDepth / 2);
      this._matrix = Matrix3D.rotateX(this._matrix, this._rotationXRadians);
      this._matrix = Matrix3D.rotateY(this._matrix, this._rotationYRadians);
      this._matrix = Matrix3D.rotateZ(this._matrix, this._rotationZRadians);
      // Translate back. Rotation has now happened in the center
      this._matrix = Matrix3D.translate(this._matrix, -scaledWidth/2, -scaledHeight/2, scaledDepth / 2);
    }

    if (this._scaleX !== 1 || this._scaleY !== 1 || this._scaleZ !== 1) {
      this._matrix = Matrix3D.scale(this._matrix, this._scaleX, this._scaleY, this._scaleZ);
    }
  }

  _createProgram() {
    this._program = new Program(this._gl, this._shader);
  }
}