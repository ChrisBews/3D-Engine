interface ICamera {
  resize: (canvasWidth: number, canvasHeight: number) => void;
}

interface IFollowCameraOptions {
  fieldOfView: number;
  canvasWidth: number;
  canvasHeight: number;
  zNear?: number;
  zFar?: number;
  distance?: number;
}
