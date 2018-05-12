interface ICamera {
  matrix: mat4;
  resize: (canvasWidth: number, canvasHeight: number) => void;
}

interface IPerspectiveCameraOptions {
  fieldOfView: number;
  canvasWidth: number;
  canvasHeight: number;
  zNear?: number;
  zFar?: number;
  x?: number;
  y?: number;
  z?: number;
}

interface IFollowCameraOptions {
  fieldOfView: number;
  canvasWidth: number;
  canvasHeight: number;
  zNear?: number;
  zFar?: number;
  distance?: number;
}
