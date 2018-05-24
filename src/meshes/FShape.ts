import { Mesh } from './Mesh';

export class FShape extends Mesh {

  constructor(options: IFShapeOptions) {
    super(options);
    if (!options.width) throw new Error('FShape options object is missing a width attribute');
    if (!options.material) throw new Error('FShape options object is missing a material attribute');
    this._id = `FShape-${Date.now()}`;
    this._width = options.width;
    this._height = options.height || Math.floor(this._width / 2) * 3;
    this._depth = options.depth || Math.floor(this._width / 3);
    this._generateVertices();
    this._generateNormals();
    this._generateIndices();
    this._generateUVs();
  }

  private _generateVertices() {
    const w: number = this._width / 2;
    const thirdW: number = -w + (this._width / 3);
    const twoThirdsW: number = -w + ((this._width / 3) * 2);
    const twoFifthsH: number = (this._height / 5) * 2;
    const threeFifthsH: number = (this._height / 5) * 3;
    const fourFifthsH: number = (this._height / 5) * 4;
    const h: number = this._height;
    const d: number = this._depth / 2;
    this._vertices = new Float32Array([
      // Left column front
      -w, 0, d,
      thirdW, 0, d,
      thirdW, h, d,
      -w, h, d,

      // top rung front
      thirdW, h, d,
      thirdW, fourFifthsH, d,
      w, fourFifthsH, d,
      w, h, d,

      // middle rung front
      thirdW, threeFifthsH, d,
      thirdW, twoFifthsH, d,
      twoThirdsW, twoFifthsH, d,
      twoThirdsW, threeFifthsH, d,

      // left column back
      -w, 0, -d,
      -w, h, -d,
      thirdW, h, -d,
      thirdW, 0, -d,

      // top rung back
      w, h, -d,
      w, fourFifthsH, -d,
      thirdW, fourFifthsH, -d,
      thirdW, h, -d,

      // middle rung back
      twoThirdsW, threeFifthsH, -d,
      twoThirdsW, twoFifthsH, -d,
      thirdW, twoFifthsH, -d,
      thirdW, threeFifthsH, -d,

      // top
      -w, h, d,
      w, h, d,
      w, h, -d,
      -w, h, -d,

      // top rung right
      w, h, d,
      w, fourFifthsH, d,
      w, fourFifthsH, -d,
      w, h, -d,

      // under top rung
      thirdW, fourFifthsH, -d,
      w, fourFifthsH, -d,
      w, fourFifthsH, d,
      thirdW, fourFifthsH, d,

      // between top rung and middle
      thirdW, fourFifthsH, d,
      thirdW, threeFifthsH, d,
      thirdW, threeFifthsH, -d,
      thirdW, fourFifthsH, -d,

      // top of middle rung
      thirdW, threeFifthsH, d,
      twoThirdsW, threeFifthsH, d,
      twoThirdsW, threeFifthsH, -d,
      thirdW, threeFifthsH, -d,

      // right of middle rung
      twoThirdsW, threeFifthsH, d,
      twoThirdsW, twoFifthsH, d,
      twoThirdsW, twoFifthsH, -d,
      twoThirdsW, threeFifthsH, -d,

      // bottom of middle rung.
      thirdW, twoFifthsH, d,
      thirdW, twoFifthsH, -d,
      twoThirdsW, twoFifthsH, -d,
      twoThirdsW, twoFifthsH, d,

      // right of bottom
      thirdW, twoFifthsH, -d,
      thirdW, twoFifthsH, d,
      thirdW, 0, d,
      thirdW, 0, -d,

      // bottom
      -w, 0, -d,
      thirdW, 0, -d,
      thirdW, 0, d,
      -w, 0, d,

      // left side
      -w, 0, d,
      -w, h, d,
      -w, h, -d,
      -w, 0, -d,
    ]);
  }

  private _generateNormals() {
    this._normals = new Float32Array([
      // left column front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // top rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // middle rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // left column back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // top rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // middle rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // top rung right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // under top rung
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // between top rung and middle
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // top of middle rung
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // right of middle rung
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // bottom of middle rung.
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // right of bottom
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // bottom
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // left side
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
    ]);
  }

  private _generateIndices() {
    this._indices = new Uint16Array([
      0, 1, 2,     0, 2, 3,    // Left column front
      4, 5, 6,     4, 6, 7,    // top rung front
      8, 9, 10,    8, 10, 11,  // middle rung front
      12, 13, 14,  12, 14, 15, // left column back
      16, 17, 18,  16, 18, 19, // top rung back
      20, 21, 22,  20, 22, 23, // middle rung back

      24, 25, 26,  24, 26, 27, // top
      28, 29, 30,  28, 30, 31, // top rung right
      32, 33, 34,  32, 34, 35, // under top rung
      36, 37, 38,  36, 38, 39, // between top rung and middle
      40, 41, 42,  40, 42, 43, // top of middle rung
      44, 45, 46,  44, 46, 47, // right of middle rung
      48, 49, 50,  48, 50, 51, // bottom of middle rung.
      52, 53, 54,  52, 54, 55, // right of bottom
      56, 57, 58,  56, 58, 59, // bottom
      60, 61, 62,  60, 62, 63, // left side
    ]);
  }

  private _generateUVs() {
    this._uvs = new Float32Array([
      // left column front
      0, 0,
      1, 0,
      1, 5,
      0, 5,

      // top rung front
      0, 1,
      0, 0,
      2, 0,
      2, 1,

      // middle run front
      0, 1,
      0, 0,
      1, 0,
      1, 1,

      // left column back
      0, 0,
      0, 5,
      1, 5,
      1, 0,

      // top rung back
      2, 1,
      2, 0,
      0, 0,
      0, 1,

      // middle rung back
      1, 1,
      1, 0,
      0, 0,
      0, 1,

      // top
      0, 1,
      3, 1,
      3, 0,
      0, 0,

      // top rung right
      1, 1,
      0, 1,
      0, 0,
      1, 0,

      // under top rung
      0, 0,
      2, 0,
      2, 1,
      0, 1,

      // between top and middle rungs
      1, 1,
      0, 1,
      0, 0,
      1, 0,

      // top of middle rung
      1, 1,
      0, 1,
      0, 0,
      1, 0,

      // right of middle rung
      1, 1,
      0, 1,
      0, 0,
      1, 0,

      // bottom of middle rung
      1, 0,
      1, 1,
      0, 1,
      0, 0,

      // right of bottom
      1, 0,
      1, 1,
      0, 1,
      0, 0,

      // bottom
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // left side
      0, 1,
      5, 1,
      5, 0,
      0, 0,
    ]);
  }
}
