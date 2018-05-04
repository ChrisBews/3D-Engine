import { Mesh } from './Mesh';

export class Cube extends Mesh {

  constructor(options: ICubeOptions) {
    super();
    if (!options.width) throw new Error('Cube options object is missing a width attribute');
    if (!options.material) throw new Error('Cube options object is missing a material attribute');
    this._width = options.width;
    this._height = options.height || this._width;
    this._depth = options.depth || this._width;
    this._generateVertices();
    this._generateNormals();
    this._generateIndices();
    this._generateUVs();
    this._updateMatrix();
  }

  _generateVertices() {
    const w: number = this._width / 2;
    const h: number = this._height;
    const d: number = this._depth / 2;
    this._vertices = new Float32Array([
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
  }

  _generateNormals() {
    this._normals = new Float32Array([
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
  }

  _generateIndices() {
    this._indices = new Uint16Array([
      0, 1, 2,     0, 2, 3,    // Front
      4, 5, 6,     4, 6, 7,    // Back
      8, 9, 10,    8, 10, 11,  // Top
      12, 13, 14,  12, 14, 15, // Bottom
      16, 17, 18,  16, 18, 19, // Right
      20, 21, 22,  20, 22, 23, // Left
    ]);
  }

  _generateUVs() {
    this._uvs = new Float32Array([
      // Front face
      0, 1,
      1, 1,
      1, 0,
      0, 0,

      // Back face
      1, 1,
      1, 0,
      0, 0,
      0, 1,

      // Top face
      0, 0,
      0, 1,
      1, 1,
      1, 0,

      // Bottom face
      0, 1,
      1, 1,
      1, 0,
      0, 0,

      // Right face
      1, 1,
      1, 0,
      0, 0,
      0, 1,

      // Left face
      0, 1,
      1, 1,
      1, 0,
      0, 0,
    ]);
  }
}
