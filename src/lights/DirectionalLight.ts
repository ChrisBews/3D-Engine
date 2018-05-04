import { convertColorToUnits } from '../utils/colorUtils';

export class DirectionalLight implements ILight {

  private _direction: vec3;
  private _color: rgb;
  private _colorUnits: rgb;

  constructor(options: IDirectionalLightOptions) {
    if (typeof options.directionX === 'undefined') throw new Error('DirectionalLight options object missing directionX attribute');
    if (typeof options.directionY === 'undefined') throw new Error('DirectionalLight options object missing directionY attribute');
    if (typeof options.directionZ === 'undefined') throw new Error('DirectionalLight options object missing directionZ attribute');

    this._direction = {
      x: options.directionX,
      y: options.directionY,
      z: options.directionZ,
    };
    this._color = options.color || {r: 255, g: 255, b: 255};
    this._updateUnitColor();
  }

  get isDirectional(): boolean { return true; }

  get direction(): vec3 { return this._direction; }
  set direction(direction: vec3) {
    this._direction = direction;
  }

  get color(): rgb { return this._color; }
  set color(color: rgb) {
    this._color = color;
    this._updateUnitColor();
  }

  get colorUnits(): rgb { return this._colorUnits; }

  _updateUnitColor() {
    this._colorUnits = convertColorToUnits(this._color);
  }
}
