class Plane extends Mesh {

  constructor(width, height, divisions) {
    super();

    if (!width) {
      console.error('A plane must have a width');
      return;
    }
    this._width = width;
    this._height = height || width;
    this._divisions = divisions || 0;
    this._sections = this._divisions + 1;
    this._generateVerticesAndNormals();
  }

  _generateVerticesAndNormals() {
    // Create the surface with as many faces as required
    const w = this._width;
    const h = this._height;
    const length = (this._sections * this._sections * 18);

    this._vertices = new Float32Array(length);
    this._normals = new Float32Array(length);

    let previousX = 0;
    let previousY = 0;
    for (let i = 0; i < this._sections; i++) {
      const newY = previousY + (h / this._sections);
      previousX = 0;

      for (let k = 0; k < this._sections; k++) {
        const newX = previousX + (w / this._sections);
        const counter = (i * (this._sections * 18)) + (k * 18);
        this._addDivision(counter, previousX, previousY, newX, newY);
        previousX = newX;
      }

      previousY = newY;
    }
  }

  _addDivision(index, startX, startY, endX, endY) {
    const newVertices = [
      startX, startY, 0,
      endX, startY, 0,
      endX, endY, 0,

      endX, endY, 0,
      startX, endY, 0,
      startX, startY, 0,
    ];

    const newNormals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ];

    this._vertices.set(newVertices, index);
    this._normals.set(newNormals, index);
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