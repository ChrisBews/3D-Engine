import {
  normalizeVector,
  subtractVectors,
  crossVectors,
} from '../utils/vectorUtils';

export class Matrix4 {

  private _currentValue: mat4;
  private _identity: mat4 = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];

  constructor(matrix?: mat4) {
    this._currentValue = matrix || this._identity;
  }

  get currentValue(): mat4 { return this._currentValue; }

  setToIdentity() {
    this._currentValue = this._identity;
  }

  setToProjection(width: number, height: number, depth: number) {
    // Converts from pixels to clipspace
    // Scale by 1.0/resolution
    // Scale by 2.0
    // Translate by -1.0, -1.0
    // Scale Y by -1 (flip Y to make top = 0)
    this._currentValue = [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  }

  setToOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    // Similar to setToPerspective, but allows you to define the full 3D space
    this._currentValue = [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,

      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ];
  }

  setToPerspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
    // Adjust the units so they're in clip space
    // Calculate (via Math.tan) the field of view from radians
    // The field of view is basically the rectangle at 'near' and
    // the rectangle found at 'far' getting bigger, increasing the
    // area between them in which objects are rendered
    // The shape of that area is called a 'frustum'

    // Use near and far as the Z-clipping space
    // ie. what we should consider the distance multiplier when
    // adding perspective (z normally = -1 to 1)
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    const rangeInv = 1.0 / (near - far);
    // This assumes there is an eye or camera at 0,0,0
    // Then works out the maths to result in stuff at 'near' being at z = -1
    // Then stuff at 'near' that is half of fieldOfView above or below the center
    // ends up with y = -1 and y = 1 respectively
    // X is just the x-coord multiplied by the 'aspect', which is usually
    // the width of the display area divided by it's height
    this._currentValue = [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ];
  }

  setToLookAt(cameraPosition: vec3, target: vec3, up: vec3) {
    // Get the axis found between the camera and the target
    const zAxis = normalizeVector(subtractVectors(cameraPosition, target));
    // Work out the X axis - it's perpendicular to up and the zAxis
    const xAxis = crossVectors(up, zAxis);
    // Work out the Y axis - it's perpendicular to the Z and X axes
    const yAxis = crossVectors(zAxis, xAxis);

    this._currentValue = [
      xAxis.x, xAxis.y, xAxis.z, 0,
      yAxis.x, yAxis.y, yAxis.z, 0,
      zAxis.x, zAxis.y, zAxis.z, 0,
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z,
      1,
    ];
  }

  translate(x: number, y: number, z: number) {
    this.multiply([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ]);
  }

  rotate(angleXRadians: number, angleYRadians: number, angleZRadians: number) {
    if (angleXRadians) this.rotateX(angleXRadians);
    if (angleYRadians) this.rotateY(angleYRadians);
    if (angleZRadians) this.rotateZ(angleZRadians);
  }

  rotateX(angleInRadians: number) {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    this.multiply([
      1, 0, 0, 0,
      0, cos, sin, 0,
      0, -sin, cos, 0,
      0, 0, 0, 1,
    ]);
  }

  rotateY(angleInRadians: number) {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    this.multiply([
      cos, 0, -sin, 0,
      0, 1, 0, 0,
      sin, 0, cos, 0,
      0, 0, 0, 1,
    ]);
  }

  rotateZ(angleInRadians: number) {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    this.multiply([
      cos, sin, 0, 0,
      -sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  scale(x: number, y: number, z: number) {
    this.multiply([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    ]);
  }

  rotateOnAxis(angleInRadians: number, xAxis: number, yAxis: number, zAxis: number) {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    const length = Math.sqrt(xAxis * xAxis + yAxis * yAxis + zAxis * zAxis);
    if (length !== 1) {
      let inverseLength = 1 / length;
      xAxis *= inverseLength;
      yAxis *= inverseLength;
      zAxis *= inverseLength;
    }
    const inverseCos = 1 - cos;
    const xy = xAxis * yAxis;
    const yz = yAxis * zAxis;
    const zx = zAxis * xAxis;
    const xSin = xAxis * sin;
    const ySin = yAxis * sin;
    const zSin = zAxis * sin;
    this.multiply([
      xAxis * xAxis * inverseCos - zSin,
      xy * inverseCos + zSin,
      zx * inverseCos - ySin,
      0,

      xy * inverseCos - zSin,
      yAxis * yAxis * inverseCos + cos,
      yz * inverseCos + xSin,
      0,

      zx * inverseCos + ySin,
      yz * inverseCos - xSin,
      zAxis * zAxis * inverseCos + cos,
      0,

      0, 0, 0, 1,
    ]);
  }

  multiply(matrix: mat4) {
    const a00 = this._currentValue[0 * 4 + 0];
    const a01 = this._currentValue[0 * 4 + 1];
    const a02 = this._currentValue[0 * 4 + 2];
    const a03 = this._currentValue[0 * 4 + 3];
    const a10 = this._currentValue[1 * 4 + 0];
    const a11 = this._currentValue[1 * 4 + 1];
    const a12 = this._currentValue[1 * 4 + 2];
    const a13 = this._currentValue[1 * 4 + 3];
    const a20 = this._currentValue[2 * 4 + 0];
    const a21 = this._currentValue[2 * 4 + 1];
    const a22 = this._currentValue[2 * 4 + 2];
    const a23 = this._currentValue[2 * 4 + 3];
    const a30 = this._currentValue[3 * 4 + 0];
    const a31 = this._currentValue[3 * 4 + 1];
    const a32 = this._currentValue[3 * 4 + 2];
    const a33 = this._currentValue[3 * 4 + 3];
    const b00 = matrix[0 * 4 + 0];
    const b01 = matrix[0 * 4 + 1];
    const b02 = matrix[0 * 4 + 2];
    const b03 = matrix[0 * 4 + 3];
    const b10 = matrix[1 * 4 + 0];
    const b11 = matrix[1 * 4 + 1];
    const b12 = matrix[1 * 4 + 2];
    const b13 = matrix[1 * 4 + 3];
    const b20 = matrix[2 * 4 + 0];
    const b21 = matrix[2 * 4 + 1];
    const b22 = matrix[2 * 4 + 2];
    const b23 = matrix[2 * 4 + 3];
    const b30 = matrix[3 * 4 + 0];
    const b31 = matrix[3 * 4 + 1];
    const b32 = matrix[3 * 4 + 2];
    const b33 = matrix[3 * 4 + 3];
    this._currentValue = [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  }

  invert() {
    // Create the inverse of the current matrix
    // ie. it should do the opposite of whatever
    // transformation it currently does
    const m00 = this._currentValue[0 * 4 + 0];
    const m01 = this._currentValue[0 * 4 + 1];
    const m02 = this._currentValue[0 * 4 + 2];
    const m03 = this._currentValue[0 * 4 + 3];
    const m10 = this._currentValue[1 * 4 + 0];
    const m11 = this._currentValue[1 * 4 + 1];
    const m12 = this._currentValue[1 * 4 + 2];
    const m13 = this._currentValue[1 * 4 + 3];
    const m20 = this._currentValue[2 * 4 + 0];
    const m21 = this._currentValue[2 * 4 + 1];
    const m22 = this._currentValue[2 * 4 + 2];
    const m23 = this._currentValue[2 * 4 + 3];
    const m30 = this._currentValue[3 * 4 + 0];
    const m31 = this._currentValue[3 * 4 + 1];
    const m32 = this._currentValue[3 * 4 + 2];
    const m33 = this._currentValue[3 * 4 + 3];
    const tmp_0  = m22 * m33;
    const tmp_1  = m32 * m23;
    const tmp_2  = m12 * m33;
    const tmp_3  = m32 * m13;
    const tmp_4  = m12 * m23;
    const tmp_5  = m22 * m13;
    const tmp_6  = m02 * m33;
    const tmp_7  = m32 * m03;
    const tmp_8  = m02 * m23;
    const tmp_9  = m22 * m03;
    const tmp_10 = m02 * m13;
    const tmp_11 = m12 * m03;
    const tmp_12 = m20 * m31;
    const tmp_13 = m30 * m21;
    const tmp_14 = m10 * m31;
    const tmp_15 = m30 * m11;
    const tmp_16 = m10 * m21;
    const tmp_17 = m20 * m11;
    const tmp_18 = m00 * m31;
    const tmp_19 = m30 * m01;
    const tmp_20 = m00 * m21;
    const tmp_21 = m20 * m01;
    const tmp_22 = m00 * m11;
    const tmp_23 = m10 * m01;

    const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
             (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
             (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
             (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
             (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    this._currentValue = [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
           (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
           (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
           (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
           (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
           (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
           (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
           (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
           (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
           (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
           (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
           (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
           (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
    ];
  }

  transpose() {
    // AKA swap the columns of a matrix for rows
    this._currentValue = [
      this._currentValue[0], this._currentValue[4], this._currentValue[8], this._currentValue[12],
      this._currentValue[1], this._currentValue[5], this._currentValue[9], this._currentValue[13],
      this._currentValue[2], this._currentValue[6], this._currentValue[10], this._currentValue[14],
      this._currentValue[3], this._currentValue[7], this._currentValue[11], this._currentValue[15],
    ];
  }
}
