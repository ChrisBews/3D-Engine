class Plane extends Mesh {

  constructor(width, depth, divisions) {
    super();

    if (!width) {
      console.error('A plane must have a width');
      return;
    }
    this._id = `Plane-${Date.now()}`;
    this._width = width;
    this._height = 0;
    this._depth = depth || width;
    this._divisions = divisions || 0;
    this._sections = this._divisions + 1;
    this._tempIndices = [];
    this._previousIndex = 0;
    this._generateVerticesAndNormals();
    this._updateMatrix();
  }

  _generateVerticesAndNormals() {
    // Create the surface with as many faces as required
    const length = (this._sections * this._sections * 12);

    this._vertices = new Float32Array(length);
    this._normals = new Float32Array(length);
    let previousX = -(this._width / 2);
    let previousZ = this._depth / 2;
    for (let i = 0; i < this._sections; i++) {
      const newZ = previousZ + (-this._depth / this._sections);
      previousX = -(this._width / 2);

      for (let k = 0; k < this._sections; k++) {
        const newX = previousX + (this._width / this._sections);
        const counter = (i * (this._sections * 12)) + (k * 12);
        this._addDivision(counter, previousX, previousZ, newX, newZ);
        previousX = newX;
      }

      previousZ = newZ;
    }
    this._indices = new Uint16Array(this._tempIndices);
  }

  _addDivision(index, startX, startZ, endX, endZ) {
    const newVertices = [
      startX, 0, startZ,
      endX, 0, startZ,
      endX, 0, endZ,
      startX, 0, endZ,
    ];

    let indexArrayCounter = (index / 3);
    if (index === 0) {
      this._tempIndices.push(
        0, 1, 2, 0, 2, 3
      );
    } else {
      this._tempIndices.push(
        indexArrayCounter, indexArrayCounter + 1, indexArrayCounter + 2,
        indexArrayCounter, indexArrayCounter + 2, indexArrayCounter + 3,
      );
    }

    const newNormals = [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ];

    this._vertices.set(newVertices, index);
    this._normals.set(newNormals, index);

    this._previousIndex = index;
  }
}