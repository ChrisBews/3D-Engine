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

  }
}