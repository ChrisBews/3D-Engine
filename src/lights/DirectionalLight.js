class DirectionalLight {

  constructor(directionX, directionY, directionZ, color) {
    this._directionX = directionX || 0;
    this._directionY = directionY || 0;
    this._directionZ = directionZ || 0;
    this._color = color || [255, 255, 255];
    this._colorUnits;
    this.convertColors();
  }

  get isDirectional() {
    return true;
  }

  get direction() {
    return [
      this._directionX,
      this._directionY,
      this._directionZ,
    ];
  }

  get directionX() { return this._directionX; }
  get directionY() { return this._directionY; }
  get directionZ() { return this._directionZ; }

  get color() {
    return [
      this._colorUnits.r,
      this._colorUnits.g,
      this._colorUnits.b,
    ];
  }

  set directionX(value) {
    this._directionX = value;
  }

  set directionY(value) {
    this._directionY = value;
  }

  set directionZ(value) {
    this._directionZ = value;
  }

  set color(color) {
    this._color = color;
    this.convertColors();
  }

  convertColors() {
    this._colorUnits = {
      r: Helpers.convertRGBToUnits(this._color[0]),
      g: Helpers.convertRGBToUnits(this._color[1]),
      b: Helpers.convertRGBToUnits(this._color[2]),
    };
  }
}