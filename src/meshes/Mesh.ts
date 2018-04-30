interface IMeshOptions {
  vertices?: number[];
  normals?: number[];
  indices?: number[];
  uvs?: number[];
}

export class Mesh implements IMesh {

  private _id: string;
  private _width: number = 0;
  private _height: number = 0;
  private _position: vector3;
  private _rotation: vector3;

  constructor(options: IMeshOptions) {

  }
}
