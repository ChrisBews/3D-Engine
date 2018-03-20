class Sphere extends Mesh {

  constructor(radius) {
    super();
    this._latitudeBands = 10;
    this._longitudeBands = 10;
    
    if (!radius) {
      console.error('A sphere must have a defined radius');
      return;
    }
    this._radius = radius;
    this._generateVerticesAndNormals();
    this._updateMatrix();
  }

  createVertexData(theta, phi) {
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

  _generateVerticesAndNormals() {
    const vertices = [];
    const normals = [];
    for (let i = 0; i < this._longitudeBands; i++) {
      const theta1 = (i / this._longitudeBands) * Math.PI;
      const theta2 = ((i+1)/this._longitudeBands) * Math.PI;

      for (let k = 0; k < this._latitudeBands; k++) {
        const phi1 = (k/this._latitudeBands) * 2 * Math.PI;
        const phi2 = ((k+1)/this._latitudeBands) * 2 * Math.PI;

        const vertexData1 = this.createVertexData(theta1, phi1);
        const vertexData2 = this.createVertexData(theta1, phi2);
        const vertexData3 = this.createVertexData(theta2, phi2);
        const vertexData4 = this.createVertexData(theta2, phi1);

        const vertex1 = {
          x: vertexData1.x * this._radius,
          y: vertexData1.y * this._radius,
          z: vertexData1.z * this._radius,
        };

        const vertex2 = {
          x: vertexData2.x * this._radius,
          y: vertexData2.y * this._radius,
          z: vertexData2.z * this._radius,
        };

        const vertex3 = {
          x: vertexData3.x * this._radius,
          y: vertexData3.y * this._radius,
          z: vertexData3.z * this._radius,
        };

        const vertex4 = {
          x: vertexData4.x * this._radius,
          y: vertexData4.y * this._radius,
          z: vertexData4.z * this._radius,
        };

        if (i === 0) {
          // Top cap of the sphere
          vertices.push(
            vertex1.x, vertex1.y, vertex1.z,
            vertex3.x, vertex3.y, vertex3.z,
            vertex4.x, vertex4.y, vertex4.z
          );

          normals.push(
            vertexData1.x, vertexData1.y, vertexData1.z,
            vertexData3.x, vertexData3.y, vertexData3.z,
            vertexData4.x, vertexData4.y, vertexData4.z
          );

        } else if (i === this._longitudeBands.length) {
          // End cap
          vertices.push(
            vertex3.x, vertex3.y, vertex3.z,
            vertex1.x, vertex1.y, vertex1.z,
            vertex2.x, vertex2.y, vertex2.z
          );
          normals.push(
            vertexData3.x, vertexData3.y, vertexData3.z,
            vertexData1.x, vertexData1.y, vertexData1.z,
            vertexData2.x, vertexData2.y, vertexData2.z
          );

        } else {
          // Body
          vertices.push(
            vertex1.x, vertex1.y, vertex1.z,
            vertex2.x, vertex2.y, vertex2.z,
            vertex4.x, vertex4.y, vertex4.z,

            vertex2.x, vertex2.y, vertex2.z,
            vertex3.x, vertex3.y, vertex3.z,
            vertex4.x, vertex4.y, vertex4.z,
          );

          normals.push(
            vertexData1.x, vertexData1.y, vertexData1.z,
            vertexData2.x, vertexData2.y, vertexData2.z,
            vertexData4.x, vertexData4.y, vertexData4.z,

            vertexData2.x, vertexData2.y, vertexData2.z,
            vertexData3.x, vertexData3.y, vertexData3.z,
            vertexData4.x, vertexData4.y, vertexData4.z,
          );
        }
      }
    }

    this._vertices = new Float32Array(vertices.length);
    this._normals = new Float32Array(normals.length);
    this._vertices.set(vertices);
    this._normals.set(normals);
  }

}