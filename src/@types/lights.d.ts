interface ILight {
  isDirectional: boolean;
  color: rgb;
  colorInUnits: number[];
}

interface IDirectionalLight extends ILight {
  direction: vec3;
}

type IDirectionalLightOptions = {
  directionX: number;
  directionY: number;
  directionZ: number;
  color?: rgb;
}
