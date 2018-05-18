interface ICamera {
  matrix: mat4;
  update: () => void;
  resize: (canvasWidth: number, canvasHeight: number) => void;
}

interface IPerspectiveCameraOptions {
  fieldOfView: number;
  zNear?: number;
  zFar?: number;
  x?: number;
  y?: number;
  z?: number;
}

interface IFollowCameraOptions {
  fieldOfView: number;
  zNear?: number;
  zFar?: number;
  distance?: number;
}

interface IProjectionCameraOptions {
  distanceMultiplier?: number;
  zNear?: number;
  zFar?: number;
}
