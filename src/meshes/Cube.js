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
    this._rotationY = 0;
    this._rotationZ = 0;
    this._program;
    this._gl;
    this._shader;
    this._matrix;
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

  set rotationX(value) {
    this._rotationX = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  set rotationY(value) {
    this._rotationY = Helpers.degreesToRadians(value);
    this._updateMatrix();
  }

  set rotationZ(value) {
    this._rotationZ = Helpers.degreesToRadians(value);
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

  get matrix() {
    return this._matrix;
  }

  get material() {
    return {
      program: this._program,
      shader: this._shader,
    };
  }

  _updateMatrix() {
    this._matrix = Matrix3D.createTranslation(this._x, this._y, this._y);
    if (this._rotationX || this._rotationY || this._rotationZ) {
      this._matrix = Matrix3D.rotateX(this._matrix, this._rotationX);
      this._matrix = Matrix3D.rotateY(this._matrix, this._rotationY);
      this._matrix = Matrix3D.rotateZ(this._matrix, this._rotationZ);
    }
    // Move origin to the center of the shape
    this._matrix = Matrix3D.translate(this._matrix, -this._width / 2, -this._height / 2, 0);
  }

  _createProgram() {
    this._program = new Program(this._gl, this._shader);
  }

  _generateVertices() {
    const w = this._width;
    const h = this._height;
    const d = this._depth;
    this._vertices = new Float32Array([
      // Front face
      0, 0, 0,
      0, h, 0,
      w, 0, 0,

      0, h, 0,
      w, h, 0,
      w, 0, 0,

      // Top face
      w, 0, 0,
      0, 0, 0,
      0, 0, d,

      0, 0, d,
      w, 0, d,
      w, 0, 0,

      // Right face
      w, 0, 0,
      w, h, 0,
      w, h, d,

      w, h, d,
      w, 0, d,
      w, 0, 0,

      // Back face
      w, 0, d,
      0, 0, d,
      0, h, d,

      0, h, d,
      w, h, d,
      w, 0, d,

      // Left face
      0, 0, 0,
      0, 0, d,
      0, h, d,

      0, h, d,
      0, h, 0,
      0, 0, 0,

      // Bottom face
      0, h, 0,
      w, h, 0,
      w, h, d,

      w, h, d,
      0, h, d,
      0, h, 0,
    ]);

    return this._vertices;
  }
}