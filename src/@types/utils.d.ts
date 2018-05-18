interface IMatrix4 {
  value: mat4;
  setToIdentity: () => void;
  setToProjection: (width: number, height: number, depth: number) => void;
  setToOrthographic: (top: number, right: number, bottom: number, left: number, near: number, far: number) => void;
  setToPerspective: (fieldOfViewRadians: number, aspectRatio: number, near: number, far: number) => void;
  setToLookAt: (cameraPosition: vec3, target: vec3, up: vec3) => void;
  copyZToW: (distanceMultiplier: number) => void;
  translate: (x: number, y: number, z: number) => void;
  rotate: (angleXRadians: number, angleYRadians: number, angleZRadians: number) => void;
  rotateX: (angleInRadians: number) => void;
  rotateY: (angleInRadians: number) => void;
  rotateZ: (angleInRadians: number) => void;
  scale: (x: number, y: number, z: number) => void;
  rotateOnAxis: (angleInRadians: number, xAxis: number, yAxis: number, zAxis: number) => void;
  multiply: (matrix: mat4) => void;
  invert: () => void;
  transpose: () => void;
}
