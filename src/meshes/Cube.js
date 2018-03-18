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

    return vertices;
  }

  _generateNormals() {
    const normals = new Float32Array([
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

    return normals;
  }
}