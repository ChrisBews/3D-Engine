export class Mesh implements IMesh {

  private _id: string;
  private _width: number = 0;
  private _height: number = 0;
  private _position: Vector3;
  private _rotation: Vector3;

  constructor(options: IMeshOptions = {}) {

  }
}
