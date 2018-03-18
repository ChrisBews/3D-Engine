class Plane extends Mesh {

  constructor(width, height) {
    super();

    if (!width) {
      console.error('A plane must have a width');
      return;
    }
    this._width = width;
    this._height = height || width;
    this._vertices = this._generateVertices();
    this._normals = this._generateNormals();
  }

  _generateVertices() {
    const w = this._width;
    const h = this._height;
    const vertices = new Float32Array([
      0, 0, 0,
      w, 0, 0,
      w, h, 0,

      w, h, 0,
      0, h, 0,
      0, 0, 0,
    ]);

    return vertices;
  }

  _generateNormals() {
    const normals = new Float32Array([
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ]);

    return normals;
  }

}