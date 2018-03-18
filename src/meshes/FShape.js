class FShape extends Mesh {

  constructor(width, height, depth) {
    super();
    
    if (!width) {
      console.error('A cube must have a defined width');
      return;
    }
    this._width = width || 100;
    this._height =  height || (this._width / 2) * 3;
    this._depth = depth || Math.floor(this._width / 3);
    this._vertices = this._generateVertices();
    this._normals = this._generateNormals();
    this._updateMatrix();
  }

  _generateVertices() {
    const w = this._width;
    const h = this._height;
    const d = this._depth;
    const vertices = new Float32Array([
      // Left column front
      0, 0, 0,
      w/3, 0, 0,
      0, h, 0,

      0, h, 0,
      w/3, 0, 0,
      w/3, h, 0,

      // top rung front
      w/3, h,  0,
      w/3, (h/5)*4,  0,
      w, (h/5)*4,  0,

      w, (h/5)*4,  0,
      w, h, 0,
      w/3, h,  0,

      // middle rung front
      w/3, (h/5) * 3, 0,
      w/3, (h/5) * 2, 0,
      w, (h/5) * 2, 0,

      w, (h/5)*2, 0,
      w, (h/5)*3, 0,
      w/3, (h/5)*3, 0,

      // left column back
      0, 0, -d,
      0, h, -d,
      w/3, 0, -d,

      0, h, -d,
      w/3, h, -d,
      w/3, 0, -d,

      // top rung back
      w/3, h, -d,
      w, (h/5)*4, -d,
      w/3, (h/5)*4, -d,

      w, (h/5)*4, -d,
      w/3, h, -d,
      w, h, -d,

      // middle rung back
      w/3, (h/5) * 3, -d,
      w, (h/5) * 2, -d,
      w/3, (h/5) * 2, -d,

      w, (h/5)*2, -d,
      w/3, (h/5)*3, -d,
      w, (h/5)*3, -d,

      // top
      0, h, 0,
      w, h, 0,
      w, h, -d,

      w, h, -d,
      0, h, -d,
      0, h, 0,

      // top rung right
      w, h, 0,
      w, (h/5)*4, 0,
      w, (h/5)*4, -d,

      w, (h/5)*4, -d,
      w, h, -d,
      w, h, 0,

      // under top rung
      w/3, (h/5)*4, 0,
      w, (h/5)*4, -d,
      w, (h/5)*4, 0,

      w, (h/5)*4, -d,
      w/3, (h/5)*4, 0,
      w/3, (h/5)*4, -d,

      // between top rung and middle
      w/3, (h/5)*4, 0,
      w/3, (h/5)*3, 0,
      w/3, (h/5)*3, -d,

      w/3, (h/5)*3, -d,
      w/3, (h/5)*4, -d,
      w/3, (h/5)*4, 0,


      // top of middle rung
      w/3, (h/5)*3, 0,
      w, (h/5)*3, 0,
      w, (h/5)*3, -d,

      w, (h/5)*3, -d,
      w/3, (h/5)*3, -d,
      w/3, (h/5)*3, 0,

      // right of middle rung
      w, (h/5)*3, 0,
      w, (h/5)*2, 0,
      w, (h/5)*2, -d,

      w, (h/5)*2, -d,
      w, (h/5)*3, -d,
      w, (h/5)*3, 0,

      // bottom of middle rung.
      w/3, (h/5)*2, 0,
      w, (h/5)*2, -d,
      w, (h/5)*2, 0,

      w, (h/5)*2, -d,
      w/3, (h/5)*2, 0,
      w/3, (h/5)*2, -d,

      // right of bottom
      w/3, (h/5)*2, 0,
      w/3, 0, 0,
      w/3, 0, -d,

      w/3, 0, -d,
      w/3, (h/5)*2, -d,
      w/3, (h/5)*2, 0,

      // bottom
      0, 0, 0,
      w/3, 0, -d,
      w/3, 0, 0,

      w/3, 0, -d,
      0, 0, 0,
      0, 0, -d,

      // left side
      0, 0, 0,
      0, h, 0,
      0, h, -d,
      
      0, h, -d,
      0, 0, -d,
      0, 0, 0,
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
      0, 0, 1,
      0, 0, 1,

      // top rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // middle rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // left column back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // top rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // middle rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // top rung right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // under top rung
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // between top rung and middle
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // top of middle rung
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // right of middle rung
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // bottom of middle rung.
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // right of bottom
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // bottom
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // left side
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
    ]);

    return normals;
  }
}