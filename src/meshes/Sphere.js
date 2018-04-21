class Sphere extends Mesh {

  constructor(radius, segments) {
    super();
    if (!radius) {
      console.error('A sphere must have a defined radius');
      return;
    }
    this._id = `Sphere-${Date.now()}`;
    this._radius = radius;
    this._width = this._height = this._depth = 2 * this._radius;
    this._latitudeBands = segments || 20;
    this._longitudeBands = segments || 20;
    this._vertexArray = [];
    this._normalsArray = [];
    this._generateVerticesAndNormals();
    this._updateMatrix();
  }

  createPointData(theta, phi) {
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    const xPos = cosPhi * sinTheta;
    const yPos = cosTheta;
    const zPos = sinPhi * sinTheta;

    return {
      normal: {
        x: xPos,
        y: yPos,
        z: zPos,
      },
      vertex: {
        x: xPos * this._radius,
        y: (yPos * this._radius) + this._radius,
        z: zPos * this._radius,
      },
    };
  }

  _addVertex(vertexData) {
    // Add a single vertex and it's normal to the JS arrays being built up
    this._vertexArray.push(vertexData.vertex.x, vertexData.vertex.y, vertexData.vertex.z);
    this._normalsArray.push(vertexData.normal.x, vertexData.normal.y, vertexData.normal.z);
  }

  _generateVerticesAndNormals() {
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
    const tempIndices = [];
    let startIndex = 0;
    for (let i = 0; i < this._longitudeBands; i++) {
      const theta1 = (i / this._longitudeBands) * Math.PI;
      const theta2 = ((i+1)/this._longitudeBands) * Math.PI;

      for (let k = 0; k < this._latitudeBands; k++) {
        const phi1 = (k/this._latitudeBands) * 2 * Math.PI;
        const phi2 = ((k+1)/this._latitudeBands) * 2 * Math.PI;

        const point1 = this.createPointData(theta1, phi1);
        const point2 = this.createPointData(theta1, phi2);
        const point3 = this.createPointData(theta2, phi2);
        const point4 = this.createPointData(theta2, phi1);
        if (i === 0) {
          // Top cap of the sphere
          this._addVertex(point1);
          this._addVertex(point3);
          this._addVertex(point4);
          tempIndices.push(
            startIndex,
            startIndex + 1,
            startIndex + 2
          );
          startIndex += 3;
        } else if (i === this._longitudeBands - 1) {
          // End cap
          this._addVertex(point3);
          this._addVertex(point1);
          this._addVertex(point2);
          tempIndices.push(
            startIndex,
            startIndex + 1,
            startIndex + 2
          );
          startIndex += 3;
        } else {
          // Body
          this._addVertex(point3);
          this._addVertex(point4);
          this._addVertex(point1);
          this._addVertex(point2);
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
  }
}