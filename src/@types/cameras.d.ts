interface ICamera {
  matrix: IMatrix4;
  resize: (canvasWidth: number, canvasHeight: number) => void;
}

interface IPerspectiveCameraOptions {
  fieldOfView: number;
  canvasWidth: number;
  canvasHeight: number;
  zNear?: number;
  zFar?: number;
}

interface IFollowCameraOptions extends IPerspectiveCameraOptions {
  distance?: number;
}
