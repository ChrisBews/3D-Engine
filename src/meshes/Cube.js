class Cube {

  constructor(width, height, depth) {
    if (!width) {
      console.error('A cube must have a defined width');
      return;
    }
    this._width = width;
    this._height = height || this._width;
    this._depth = depth || this._width;
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
    this._vertices;
    this._normals;
    this._matrix;
    this._worldMatrix;
    this._updateMatrix();
  }

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
    return this._vertices || this._generateVertices();
  }

  get normals() {
    return this._normals || this._generateNormals();
  }

  get matrix() {
    return this._matrix;
  }

  get worldMatrix() {
    return this._worldMatrix;
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
      this._matrix = Matrix3D.translate(this._matrix, scaledWidth/2, scaledHeight/2, -scaledDepth/2);
      this._matrix = Matrix3D.rotateX(this._matrix, this._rotationXRadians);
      this._matrix = Matrix3D.rotateY(this._matrix, this._rotationYRadians);
      this._matrix = Matrix3D.rotateZ(this._matrix, this._rotationZRadians);
      // Translate back. Rotation has now happened in the center
      this._matrix = Matrix3D.translate(this._matrix, -scaledWidth/2, -scaledHeight/2, scaledDepth/2);
    }
    this._worldMatrix = this._matrix;

    if (this._scaleX !== 1 || this._scaleY !== 1 || this._scaleZ !== 1) {
      this._matrix = Matrix3D.scale(this._matrix, this._scaleX, this._scaleY, this._scaleZ);
    }
  }

  _createProgram() {
    this._program = new Program(this._gl, this._shader);
  }

  _generateVertices() {
    const w = this._width;
    const h = this._height;
    const d = this._depth;
    // Negative height because +h is upwards, and we want 0,0,0 at top left front corner
    // Negative depth because -z is into the screen
    this._vertices = new Float32Array([
      // Front face
      0, 0, 0,
      w, 0, 0,
      0, h, 0,

      0, h, 0,
      w, 0, 0,
      w, h, 0,

      // Top face
      w, h, 0,
      0, h, -d,
      0, h, 0,

      0, h, -d,
      w, h, 0,
      w, h, -d,

      // Right face
      w, 0, 0,
      w, h, -d,
      w, h, 0,

      w, h, -d,
      w, 0, 0,
      w, 0, -d,

      // Back face
      w, 0, -d,
      0, 0, -d,
      0, h, -d,

      0, h, -d,
      w, h, -d,
      w, 0, -d,

      // Left face
      0, 0, 0,
      0, h, -d,
      0, 0, -d,

      0, h, -d,
      0, 0, 0,
      0, h, 0,

      // Bottom face
      0, 0, 0,
      w, 0, -d,
      w, 0, 0,

      w, 0, -d,
      0, 0, 0,
      0, 0, -d,
    ]);

    return this._vertices;
  }

  _generateNormals() {
    this._normals = new Float32Array([
      // Front face
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // Top face
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // Right face
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // Back face
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // Left face
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      
      // Bottom face
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    ]);

    return this._normals;
  }
}