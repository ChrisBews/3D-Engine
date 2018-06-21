import { Mesh } from './Mesh';

const defaultSegments: number = 20;

export class Sphere extends Mesh {

  private _radius: number;
  private _latitudeBands: number;
  private _longitudeBands: number;
  private _vertexArray: number[];
  private _normalsArray: number[];
  private _uvArray: number[];

  constructor(options: ISphereOptions) {
    super(options);
    if (!options.radius) throw new Error('Sphere options object is missing a radius attribute');
    if (!options.material) throw new Error('Sphere options object is missing a material attribute');
    this._id = `Sphere-${Date.now()}`;
    this._radius = options.radius;
    this._width = this._height = this._depth = 2 * this._radius;
    this._latitudeBands = options.segments || defaultSegments;
    this._longitudeBands = options.segments || defaultSegments;
    this._vertexArray = [];
    this._normalsArray = [];
    this._uvArray = [];
    this._generateMeshData();
    this._updateMatrix();
  }

  private _generateMeshData() {
    // Explained here: https://gamedev.stackexchange.com/a/60107
    // Helpful ASCII diagram showing how the triangles are built up
    // phi2     phi1
    //  |        |
    //  2------- 1 -- theta1
    //  |\       |
    //  | \___   |
    //  |     \  |
    //  |      \ |
    //  3--------4 -- theta 2
    //
    // Note that at the two caps we just create one triangle
    // which hits the top/bottom point of the sphere
    const tempIndices: number[] = [];
    let startIndex: number = 0;
    for (let i: number = 0; i < this._longitudeBands; i++) {
      const theta1: number = (i / this._longitudeBands) * Math.PI;
      const theta2: number = ((i + 1) / this._longitudeBands) * Math.PI;

      for (let k: number = 0; k < this._latitudeBands; k++) {
        const phi1: number = (k / this._latitudeBands) * 2 * Math.PI;
        const phi2 = ((k + 1) / this._latitudeBands) * 2 * Math.PI;

        const normal1: vec3 = this._createNormal(theta1, phi1);
        const normal2: vec3 = this._createNormal(theta1, phi2);
        const normal3: vec3 = this._createNormal(theta2, phi2);
        const normal4: vec3 = this._createNormal(theta2, phi1);
        const vertex1: vec3 = this._createVertex(normal1);
        const vertex2: vec3 = this._createVertex(normal2);
        const vertex3: vec3 = this._createVertex(normal3);
        const vertex4: vec3 = this._createVertex(normal4);
        const u: number = 1 - (k / (this._longitudeBands / 2));
        const v: number = 1 - ((this._latitudeBands - i) / this._latitudeBands);
        const u2: number = 1 - ((k + 1) / (this._longitudeBands / 2));
        const v2: number = 1 - ((this._latitudeBands - (i + 1)) / this._latitudeBands);

        if (i === 0) {
          // Top cap of the sphere
          this._addVertex(vertex1, normal1, u + ((u2 - u) / 2), 0);
          this._addVertex(vertex3, normal3, u2, v2);
          this._addVertex(vertex4, normal4, u, v2);
          tempIndices.push(
            startIndex,
            startIndex + 1,
            startIndex + 2
          );
          startIndex += 3;
        } else if (i === this._longitudeBands - 1) {
          // End cap
          this._addVertex(vertex3, normal3, u + ((u2 - u) / 2), v2);
          this._addVertex(vertex1, normal1, u, v);
          this._addVertex(vertex2, normal2, u2, v);
          tempIndices.push(
            startIndex,
            startIndex + 1,
            startIndex + 2
          );
          startIndex += 3;
        } else {
          // Body
          this._addVertex(vertex3, normal3, u2, v2);
          this._addVertex(vertex4, normal4, u, v2);
          this._addVertex(vertex1, normal1, u, v);
          this._addVertex(vertex2, normal2, u2, v);

          /*
          this._addVertex(vertex3, normal3, u2, v2);
          this._addVertex(vertex4, normal4, u, v2);
          this._addVertex(vertex1, normal1, u, v);
          this._addVertex(vertex2, normal2, u2, v);
          */

          /*this._addVertex(vertex3, normal3, u2, v2);
          this._addVertex(vertex4, normal4, u2, v);
          this._addVertex(vertex1, normal1, u, v);
          this._addVertex(vertex2, normal2, u, v2);*/

          tempIndices.push(
            startIndex, startIndex + 1, startIndex + 2,
            startIndex, startIndex + 2, startIndex + 3
          );
          startIndex += 4;
        }
      }
    }
    // Generate the typed arrays that WebGL requires
    this._vertices = new Float32Array(this._vertexArray);
    this._normals = new Float32Array(this._normalsArray);
    this._indices = new Uint16Array(tempIndices);
    this._uvs = new Float32Array(this._uvArray);
  }

  private _addVertex(vertex: vec3, normal: vec3, u: number, v: number) {
    // Add a single vertex and it's normal to the JS arrays being built up
    this._vertexArray.push(vertex.x, vertex.y, vertex.z);
    this._normalsArray.push(normal.x, normal.y, normal.z);
    this._uvArray.push(u, v);
  }

  private _createNormal(theta, phi): vec3 {
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    const xPos = cosPhi * sinTheta;
    const yPos = cosTheta;
    const zPos = sinPhi * sinTheta;

    return {
      x: xPos,
      y: yPos,
      z: zPos,
    };
  }

  private _createVertex(normal: vec3): vec3 {
    return {
      x: normal.x * this._radius,
      y: (normal.y * this._radius) + this._radius,
      z: normal.z * this._radius,
    };
  }
}
