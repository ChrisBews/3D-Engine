import { Mesh } from './Mesh';

export class Plane extends Mesh {

  private _widthDivisions: number;
  private _widthSections: number;
  private _depthDivisions: number;
  private _depthSections: number;
  private _tempVertices: number[] = [];
  private _tempNormals: number[] = [];
  private _tempIndices: number[] = [];
  private _tempUvs: number[] = [];

  constructor(options: IPlaneOptions) {
    super(options);
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

  private _generateMeshData() {
    // Create the surface with as many faces as required
    let previousX: number = -(this._width / 2);
    let previousZ: number = this._depth / 2;
    for (let i: number = 0; i < this._depthSections; i++) {
      const newZ: number = previousZ + (-this._depth / this._depthSections);
      previousX = -(this._width / 2);

      for (let k: number = 0; k < this._widthSections; k++) {
        const newX: number = previousX + (this._width / this._widthSections);
        this._addDivision(previousX, previousZ, newX, newZ);
        previousX = newX;
      }

      previousZ = newZ;
    }
    this._vertices = new Float32Array(this._tempVertices);
    this._normals = new Float32Array(this._tempNormals);
    this._indices = new Uint16Array(this._tempIndices);
    this._uvs = new Float32Array(this._tempUvs);
  }

  private _addDivision(startX: number, startZ: number, endX: number, endZ: number) {
    const indexArrayCounter: number = (this._tempVertices.length / 3);
    if (this._tempIndices.length === 0) {
      this._tempIndices.push(0, 1, 2, 0, 2, 3);
    } else {
      this._tempIndices.push(
        indexArrayCounter, indexArrayCounter + 1, indexArrayCounter + 2,
        indexArrayCounter, indexArrayCounter + 2, indexArrayCounter + 3
      );
    }

    this._tempVertices.push(
      startX, 0, startZ,
      endX, 0, startZ,
      endX, 0, endZ,
      startX, 0, endZ
    );
    this._tempNormals.push(
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0
    );
    const startPercentX: number = (startX + (this._width / 2)) / this._width;
    const startPercentY: number = ((startZ + (this._depth / 2)) / this._depth);
    const endPercentX: number = (endX + (this._width / 2)) / this._width;
    const endPercentY: number = ((endZ + (this._depth / 2)) / this._depth);

    this._tempUvs.push(
      startPercentX, startPercentY,
      endPercentX, startPercentY,
      endPercentX, endPercentY,
      startPercentX, endPercentY,
    );
  }
}
