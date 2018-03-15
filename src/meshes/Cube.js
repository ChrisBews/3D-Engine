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
    this._program;
    this._gl;
    this._shader;
  }

  get x() { return this._x; }
  set x(value) { this._x = value; }

  get y() { return this._y; }
  set y(value) { this._y = value; }

  get z() { return this._z; }
  set z(value) { this._z = value; }

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

  get material() {
    return {
      program: this._program,
      shader: this._shader,
    };
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
      w, 0, 0,
      0, h, 0,

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