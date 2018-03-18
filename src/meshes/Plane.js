class Plane extends Mesh {

  constructor(width, depth, divisions) {
    super();

    if (!width) {
      console.error('A plane must have a width');
      return;
    }
    this._width = width;
    this._depth = depth || width;
    this._divisions = divisions || 0;
    this._sections = this._divisions + 1;
    this._generateVerticesAndNormals();
    this._updateMatrix();
  }

  _generateVerticesAndNormals() {
    // Create the surface with as many faces as required
    const length = (this._sections * this._sections * 18);

    this._vertices = new Float32Array(length);
    this._normals = new Float32Array(length);

    let previousX = 0;
    let previousZ = 0;
    for (let i = 0; i < this._sections; i++) {
      const newZ = previousZ + (-this._depth / this._sections);
      previousX = 0;

      for (let k = 0; k < this._sections; k++) {
        const newX = previousX + (this._width / this._sections);
        const counter = (i * (this._sections * 18)) + (k * 18);
        this._addDivision(counter, previousX, previousZ, newX, newZ);
        previousX = newX;
      }

      previousZ = newZ;
    }
  }

  _addDivision(index, startX, startZ, endX, endZ) {
    const newVertices = [
      startX, 0, startZ,
      endX, 0, startZ,
      endX, 0, endZ,

      endX, 0, endZ,
      startX, 0, endZ,
      startX, 0, startZ,
    ];

    const newNormals = [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ];

    this._vertices.set(newVertices, index);
    this._normals.set(newNormals, index);
  }
}