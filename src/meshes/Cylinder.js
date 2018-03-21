class Cylinder extends Mesh {

  constructor(radius, height, segments, heightSegments) {
    super();
    if (!radius) {
      console.error('A cylinder must have a radius');
      return;
    }
    if (!height) {
      console.error('A cylinder must have a height');
      return;
    }
    this._id = `Cylinder-${Date.now()}`;
    this._radius = radius;
    this._height = height;
    this._segments = segments || 20;
    this._heightSegments = heightSegments || 1;
    this._generateVerticesAndNormals();
    this._updateMatrix();
  }

  _generateVerticesAndNormals() {
    const vertexArray = [];
    const normalsArray = [];
    const h = this._height;
    for (let i = 0; i < this._segments; i++) {
      // Theta = the angle within this segment
      const theta = Helpers.degreesToRadians((360 / this._segments) * i);
      const nextTheta = Helpers.degreesToRadians((360 / this._segments) * (i+1));
      
      // Calculate the normals
      const nX1 = Math.cos(theta);
      const nZ1 = Math.sin(theta);
      const nX2 = Math.cos(nextTheta);
      const nZ2 = Math.sin(nextTheta);

      // Calculate the vertices from the normals (since both require the same math)
      const vX1 = nX1 * this._radius;
      const vZ1 = nZ1 * this._radius;
      const vX2 = nX2 * this._radius;
      const vZ2 = nZ2 * this._radius;

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

      // Draw the middle segments
      for (let k = 0; k < this._heightSegments; k++) {
        const h1 = k * (this._height / this._heightSegments);
        const h2 = (k+1) * (this._height / this._heightSegments);

        vertexArray.push(
          vX1, h1, vZ1,
          vX2, h2, vZ2,
          vX2, h1, vZ2,

          vX2, h2, vZ2,
          vX1, h1, vZ1,
          vX1, h2, vZ1,
        );
        normalsArray.push(
          nX1, 0, nZ1,
          nX2, 0, nZ2,
          nX2, 0, nZ2,

          nX2, 0, nZ2,
          nX1, 0, nZ1,
          nX1, 0, nZ1,
        );
      }

      // Draw the top triangle
      vertexArray.push(
        0, h, 0,
        vX2, h, vZ2,
        vX1, h, vZ1,
      );
      normalsArray.push(
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
      );
    }

    this._vertices = new Float32Array(vertexArray.length);
    this._normals = new Float32Array(normalsArray.length);
    this._vertices.set(vertexArray);
    this._normals.set(normalsArray);
  }
}