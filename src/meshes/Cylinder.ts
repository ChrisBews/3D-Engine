import { Mesh } from './Mesh';
import { degreesToRadians } from '../utils/mathUtils';

const defaultCircumferenceSegments: number = 20;
const defaultHeightSegments: number = 1;

export class Cylinder extends Mesh {

  private _radius: number;
  private _segments: number;
  private _heightSegments: number;

  constructor(options: ICylinderOptions) {
    super();
    if (!options.radius) throw new Error('Cylinders options object is mising a radius attribute');
    if (!options.material) throw new Error('Cylinder options object is missing a material attribute');
    this._id = `Cylinder-${Date.now()}`;
    this._radius = options.radius;
    this._width = this._depth = this._radius * 2;
    this._height = options.height;
    this._segments = options.segments || defaultCircumferenceSegments;
    this._heightSegments = options.heightSegments || defaultHeightSegments;
    this._generateMeshData();
    this._updateMatrix();
  }

  _generateMeshData() {
    const vertexArray: number[] = [];
    const normalsArray: number[] = [];
    const indicesArray: number[] = [];
    // const uvsArray: number[] = [];
    const segmentAngle: number = (360 / this._segments);
    let startIndex: number = 0;
    for (let i: number = 0; i < this._segments; i++) {
      // Theta = the angle within this face segment
      const theta: number = degreesToRadians(segmentAngle * i);
      const nextTheta: number = degreesToRadians(segmentAngle * (i + 1));

      // Calculate the normals
      const nX1: number = Math.cos(theta);
      const nZ1: number = Math.sin(theta);
      const nX2: number = Math.cos(nextTheta);
      const nZ2: number = Math.sin(nextTheta);

      // Calculate the vertices from the normals, since both require the same math
      const vX1: number = nX1 * this._radius;
      const vZ1: number = nZ1 * this._radius;
      const vX2: number = nX2 * this._radius;
      const vZ2: number = nZ2 * this._radius;

      // Draw the bottom triangle
      vertexArray.push(
        0, 0, 0,
        vX1, 0, vZ1,
        vX2, 0, vZ2,
      );
      normalsArray.push(
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
      );
      indicesArray.push(startIndex, startIndex + 1, startIndex + 2);
      startIndex += 3;

      // Draw the middle segments
      for (let k: number = 0; k < this._heightSegments; k++) {
        const h1: number = (k * (this._height / this._heightSegments));
        const h2: number = ((k + 1) * (this._height / this._heightSegments));

        vertexArray.push(
          vX1, h1, vZ1,
          vX1, h2, vZ1,
          vX2, h2, vZ2,
          vX2, h1, vZ2,
        );
        normalsArray.push(
          nX1, 0, nZ1,
          nX1, 0, nZ1,
          nX2, 0, nZ2,
          nX2, 0, nZ2,
        );
        indicesArray.push(
          startIndex, startIndex + 1, startIndex + 2,
          startIndex, startIndex + 2, startIndex + 3,
        );
        startIndex += 4;
      }

      // Draw the top triangle
      vertexArray.push(
        0, this._height, 0,
        vX2, this._height, vZ2,
        vX1, this._height, vZ1,
      );
      normalsArray.push(
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
      );

      indicesArray.push(
        startIndex, startIndex + 1, startIndex + 2
      );
      startIndex += 3;
    }

    this._vertices = new Float32Array(vertexArray);
    this._normals = new Float32Array(normalsArray);
    this._indices = new Uint16Array(indicesArray);
  }
}
