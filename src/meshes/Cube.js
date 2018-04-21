class Cube extends Mesh {

  constructor(width, height, depth) {
    super();

    if (!width) {
      console.error('A cube must have a defined width');
      return;
    }
    this._width = width;
    this._height = height || this._width;
    this._depth = depth || this._width;
    this._vertices = this._generateVertices();
    this._normals = this._generateNormals();
    this._indices = this._generateIndices();
    this._updateMatrix();
  }

  _generateVertices() {
    const w = this._width / 2;
    const h = this._height;
    const d = this._depth / 2;
    // We want 0,0,0 at center of the mesh
    // Negative depth because -z is into the screen
    const vertices = new Float32Array([
      // Front face
      -w, 0, d,
      w, 0, d,
      w, h, d,
      -w, h, d,

      // Back face
      -w, 0, -d,
      -w, h, -d,
      w, h, -d,
      w, 0, -d,

      // Top face
      -w, h, -d,
      -w, h, d,
      w, h, d,
      w, h, -d,

      // Bottom face
      -w, 0, -d,
      w, 0, -d,
      w, 0, d,
      -w, 0, d,

      // Right face
      w, 0, -d,
      w, h, -d,
      w, h, d,
      w, 0, d,

      // Left face
      -w, 0, -d,
      -w, 0, d,
      -w, h, d,
      -w, h, -d,
    ]);

    return vertices;
  }

  _generateNormals() {
    const normals = new Float32Array([
      // Front face
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // Back face
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // Top face
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // Bottom face
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // Right face
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // Left face
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
    ]);

    return normals;
  }

  _generateIndices() {
    return new Uint16Array([
      0, 1, 2,     0, 2, 3,    // Front
      4, 5, 6,     4, 6, 7,    // Back
      8, 9, 10,    8, 10, 11,  // Top
      12, 13, 14,  12, 14, 15, // Bottom
      16, 17, 18,  16, 18, 19, // Right
      20, 21, 22,  20, 22, 23, // Left
    ]);
  }
}