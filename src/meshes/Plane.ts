import { Mesh } from './Mesh';

export class Plane extends Mesh {

  private _widthDivisions: number;
  private _widthSections: number;
  private _depthDivisions: number;
  private _depthSections: number;

  constructor(options: IPlaneOptions) {
    super();
    if (!options.width) throw new Error('Plane options object is missing a width attribute');
    if (!options.material) throw new Error('Plane options object is missing a material attribute');
    this._id = `Plane-${Date.now()}`;
    this._width = options.width;
    this._height = 0;
    this._depth = options.depth || this._width;
    this._widthDivisions = options.widthDivisions || 0;
    this._widthSections = this._widthDivisions + 1;
    this._depthDivisions = options.depthDivisions || 0;
    this._depthSections = this._depthDivisions + 1;
    this._generateMeshData();
    this._updateMatrix();
  }

  _generateMeshData() {
    // Create the surface with as many faces as required
    const length: number = (this._widthSections * this._depthSections * 12);

    this._vertices = new Float32Array(length);
    this._normals = new Float32Array(length);
    let previousX = -(this._width / 2);
    let previousZ = this._depth / 2;
    for (let i = 0; i < this._depthSections; i++) {
      const newZ = previousZ + (-this._depth / this._depthSections);
      previousX = -(this._width / 2);

      for (let k = 0; k < this._widthSections; k++) {
        const newX = previousX + (this._width / this._widthSections);
        const counter = (i * (this._depthSections * 12)) + (k * 12);
        this._addDivision(previousX, previousZ, newX, newZ);
        previousX = newX;
      }

      previousZ = newZ;
    }
  }

  _addDivision(startX: number, startZ: number, endX: number, endZ: number) {
    let indexArrayCounter = (this._vertices.length / 3);
    if (this._vertices.length === 0) {
      this.indices.set(
        [0, 1, 2, 0, 2, 3],
      );
    } else {
      this._indices.set(
        [
          indexArrayCounter, indexArrayCounter + 1, indexArrayCounter + 2,
          indexArrayCounter, indexArrayCounter + 2, indexArrayCounter + 3,
        ],
        this._indices.length
      );
    }

    this._vertices.set(
      [
        startX, 0, startZ,
        endX, 0, startZ,
        endX, 0, endZ,
        startX, 0, endZ,
      ],
      this._vertices.length
    );
    this._normals.set(
      [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
      ],
      this._normals.length
    );
  }
}
