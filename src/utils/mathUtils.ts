export const degreesToRadians = (angleInDegrees: number): number => {
  return angleInDegrees * Math.PI / 180;
}

export const radiansToDegrees = (angleInRadians: number): number => {
  return angleInRadians * 180 / Math.PI;
}
