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
    console.log('my cube indices', this._indices.length);
    console.log('my cube vertices', this._vertices.length);
    console.log('my cube normals', this._normals.length);
    this._updateMatrix();
  }

  _generateVertices() {
    const w = this._width;
    const h = this._height;
    const d = this._depth;
    // We want 0,0,0 at bottom of mesh, and in the center
    // Negative depth because -z is into the screen
    const vertices = new Float32Array([
      // Front face
      0, 0, 0,
      w, 0, 0,
      w, h, 0,
      0, h, 0,

      // Back face
      0, 0, -d,
      0, h, -d,
      w, h, -d,
      w, 0, -d,

      // Top face
      0, h, -d,
      0, h, 0,
      w, h, 0,
      w, h, -d,

      // Bottom face
      0, 0, -d,
      w, 0, -d,
      w, 0, 0,
      0, 0, 0,

      // Right face
      w, 0, -d,
      w, h, -d,
      w, h, 0,
      w, 0, 0,

      // Left face
      0, 0, -d,
      0, 0, 0,
      0, h, 0,
      0, h, -d,
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