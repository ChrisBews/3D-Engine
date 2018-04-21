class FShape extends Mesh {

  constructor(width, height, depth) {
    super();
    
    if (!width) {
      console.error('A cube must have a defined width');
      return;
    }
    this._id = `FShape-${Date.now()}`;
    this._width = width || 100;
    this._height =  height || (this._width / 2) * 3;
    this._depth = depth || Math.floor(this._width / 3);
    this._vertices = this._generateVertices();
    this._normals = this._generateNormals();
    this._indices = this._generateIndices();
    this._updateMatrix();
  }

  _generateVertices() {
    const w = this._width / 2;
    const thirdW = -w + (this._width / 3);
    const twoThirdsW = -w + ((this._width / 3) * 2);
    const h = this._height;
    const d = this._depth / 2;
    const vertices = new Float32Array([
      // Left column front
      -w, 0, d,
      thirdW, 0, d,
      thirdW, h, d,
      -w, h, d,

      // top rung front
      thirdW, h, d,
      thirdW, (h/5)*4, d,
      w, (h/5)*4, d,
      w, h, d,

      // middle rung front
      thirdW, (h/5) * 3, d,
      thirdW, (h/5) * 2, d,
      twoThirdsW, (h/5)*2, d,
      twoThirdsW, (h/5)*3, d,

      // left column back
      -w, 0, -d,
      -w, h, -d,
      thirdW, h, -d,
      thirdW, 0, -d,

      // top rung back
      w, h, -d,
      w, (h/5)*4, -d,
      thirdW, (h/5)*4, -d,
      thirdW, h, -d,

      // middle rung back
      twoThirdsW, (h/5)*3, -d,
      twoThirdsW, (h/5) * 2, -d,
      thirdW, (h/5) * 2, -d,
      thirdW, (h/5) * 3, -d,

      // top
      -w, h, d,
      w, h, d,
      w, h, -d,
      -w, h, -d,

      // top rung right
      w, h, d,
      w, (h/5)*4, d,
      w, (h/5)*4, -d,
      w, h, -d,

      // under top rung
      thirdW, (h/5)*4, -d,
      w, (h/5)*4, -d,
      w, (h/5)*4, d,
      thirdW, (h/5)*4, d,

      // between top rung and middle
      thirdW, (h/5)*4, d,
      thirdW, (h/5)*3, d,
      thirdW, (h/5)*3, -d,
      thirdW, (h/5)*4, -d,

      // top of middle rung
      thirdW, (h/5)*3, d,
      twoThirdsW, (h/5)*3, d,
      twoThirdsW, (h/5)*3, -d,
      thirdW, (h/5)*3, -d,

      // right of middle rung
      twoThirdsW, (h/5)*3, d,
      twoThirdsW, (h/5)*2, d,
      twoThirdsW, (h/5)*2, -d,
      twoThirdsW, (h/5)*3, -d,

      // bottom of middle rung.
      thirdW, (h/5)*2, d,
      thirdW, (h/5)*2, -d,
      twoThirdsW, (h/5)*2, -d,
      twoThirdsW, (h/5)*2, d,
      
      // right of bottom
      thirdW, (h/5)*2, -d,
      thirdW, (h/5)*2, d,
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

    return vertices;
  }

  _generateNormals() {
    const normals = new Float32Array([
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

    return normals;
  }

  _generateIndices() {
    return new Uint16Array([
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
}