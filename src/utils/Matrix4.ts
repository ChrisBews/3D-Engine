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

  get value(): mat4 { return this._currentValue; }
  set value(value: mat4) {
    this._currentValue = value;
  }

  public setToIdentity() {
    this._currentValue = this._identity;
  }

  public setToProjection(width: number, height: number, depth: number) {
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

  public setToOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number) {
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

  public setToPerspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
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

  public setToLookAt(cameraPosition: vec3, target: vec3, up: vec3) {
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

  public copyZToW(distanceMultiplier: number) {
    this._currentValue[11] = this._currentValue[10] * distanceMultiplier;
  }

  public translate(x: number, y: number, z: number) {
    this.multiply([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ]);
  }

  public rotate(angleXRadians: number, angleYRadians: number, angleZRadians: number) {
    if (angleXRadians) this.rotateX(angleXRadians);
    if (angleYRadians) this.rotateY(angleYRadians);
    if (angleZRadians) this.rotateZ(angleZRadians);
  }

  public rotateX(angleInRadians: number) {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    this.multiply([
      1, 0, 0, 0,
      0, cos, sin, 0,
      0, -sin, cos, 0,
      0, 0, 0, 1,
    ]);
  }

  public rotateY(angleInRadians: number) {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    this.multiply([
      cos, 0, -sin, 0,
      0, 1, 0, 0,
      sin, 0, cos, 0,
      0, 0, 0, 1,
    ]);
  }

  public rotateZ(angleInRadians: number) {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    this.multiply([
      cos, sin, 0, 0,
      -sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  public scale(x: number, y: number, z: number) {
    this.multiply([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    ]);
  }

  public rotateOnAxis(angleInRadians: number, xAxis: number, yAxis: number, zAxis: number) {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    const length = Math.sqrt(xAxis * xAxis + yAxis * yAxis + zAxis * zAxis);
    if (length !== 1) {
      const inverseLength = 1 / length;
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

  public multiply(matrix: mat4) {
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

  public invert() {
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
    const tmp0  = m22 * m33;
    const tmp1  = m32 * m23;
    const tmp2  = m12 * m33;
    const tmp3  = m32 * m13;
    const tmp4  = m12 * m23;
    const tmp5  = m22 * m13;
    const tmp6  = m02 * m33;
    const tmp7  = m32 * m03;
    const tmp8  = m02 * m23;
    const tmp9  = m22 * m03;
    const tmp10 = m02 * m13;
    const tmp11 = m12 * m03;
    const tmp12 = m20 * m31;
    const tmp13 = m30 * m21;
    const tmp14 = m10 * m31;
    const tmp15 = m30 * m11;
    const tmp16 = m10 * m21;
    const tmp17 = m20 * m11;
    const tmp18 = m00 * m31;
    const tmp19 = m30 * m01;
    const tmp20 = m00 * m21;
    const tmp21 = m20 * m01;
    const tmp22 = m00 * m11;
    const tmp23 = m10 * m01;

    const t0 = (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
             (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
    const t1 = (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
             (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
    const t2 = (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
             (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
    const t3 = (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
             (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    this._currentValue = [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp1 * m10 + tmp2 * m20 + tmp5 * m30) -
           (tmp0 * m10 + tmp3 * m20 + tmp4 * m30)),
      d * ((tmp0 * m00 + tmp7 * m20 + tmp8 * m30) -
           (tmp1 * m00 + tmp6 * m20 + tmp9 * m30)),
      d * ((tmp3 * m00 + tmp6 * m10 + tmp11 * m30) -
           (tmp2 * m00 + tmp7 * m10 + tmp10 * m30)),
      d * ((tmp4 * m00 + tmp9 * m10 + tmp10 * m20) -
           (tmp5 * m00 + tmp8 * m10 + tmp11 * m20)),
      d * ((tmp12 * m13 + tmp15 * m23 + tmp16 * m33) -
           (tmp13 * m13 + tmp14 * m23 + tmp17 * m33)),
      d * ((tmp13 * m03 + tmp18 * m23 + tmp21 * m33) -
           (tmp12 * m03 + tmp19 * m23 + tmp20 * m33)),
      d * ((tmp14 * m03 + tmp19 * m13 + tmp22 * m33) -
           (tmp15 * m03 + tmp18 * m13 + tmp23 * m33)),
      d * ((tmp17 * m03 + tmp20 * m13 + tmp23 * m23) -
           (tmp16 * m03 + tmp21 * m13 + tmp22 * m23)),
      d * ((tmp14 * m22 + tmp17 * m32 + tmp13 * m12) -
           (tmp16 * m32 + tmp12 * m12 + tmp15 * m22)),
      d * ((tmp20 * m32 + tmp12 * m02 + tmp19 * m22) -
           (tmp18 * m22 + tmp21 * m32 + tmp13 * m02)),
      d * ((tmp18 * m12 + tmp23 * m32 + tmp15 * m02) -
           (tmp22 * m32 + tmp14 * m02 + tmp19 * m12)),
      d * ((tmp22 * m22 + tmp16 * m02 + tmp21 * m12) -
           (tmp20 * m12 + tmp23 * m22 + tmp17 * m02)),
    ];
  }

  public transpose() {
    // AKA swap the columns of a matrix for rows
    this._currentValue = [
      this._currentValue[0], this._currentValue[4], this._currentValue[8], this._currentValue[12],
      this._currentValue[1], this._currentValue[5], this._currentValue[9], this._currentValue[13],
      this._currentValue[2], this._currentValue[6], this._currentValue[10], this._currentValue[14],
      this._currentValue[3], this._currentValue[7], this._currentValue[11], this._currentValue[15],
    ];
  }
}
