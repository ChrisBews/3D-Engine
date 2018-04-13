class FollowCamera {

  constructor(fieldOfView, canvasWidth, canvasHeight, zNear, zFar) {
    this._fieldOfViewRadians = Helpers.degreesToRadians(fieldOfView);
    this._aspectRatio;
    this._zNear = zNear || 1;
    this._zFar = zFar || 2000;
    this._matrix = Matrix3D.createIdentity();
    this._target = [0, 0, 0];
    this._targetMesh;
    this._distance = 400;
    this.resize(canvasWidth, canvasHeight);
  }

  get matrix() { return this._matrix; }

  followMesh(mesh, distance) {
    this._targetMesh = mesh;
    this._distance = distance;
    this.update();
  }

  update() {
    if (this._targetMesh) {
      this._updateTarget();
      this._updateMatrix();
    }
  }

  _updateTarget() {
    this._target = [
      this._targetMesh.center.x,
      this._targetMesh.center.y,
      this._targetMesh.center.z,
    ];
  }

  resize(width, height) {
    this._aspectRatio = width / height;
    this.update();
  }

  _updateMatrix() {
    this._projectionMatrix = Matrix3D.createPerspective(this._fieldOfViewRadians, this._aspectRatio, this._zNear, this._zFar);

    // New camera position
    const cameraX = this._target[0];
    const cameraY = this._target[1];
    const cameraZ = this._target[2] + this._distance;

    this._matrix = Matrix3D.createTranslation(cameraX, cameraY, cameraZ);
    let cameraPosition = [
      this._matrix[12],
      this._matrix[13],
      this._matrix[14],
    ];

    const xAngleInRadians = Helpers.degreesToRadians(this._targetMesh.rotationX)
    const yAngleInRadians = Helpers.degreesToRadians(this._targetMesh.rotationY)

    // Calculate the x and y rotation from the target and camera position
    let directionVector = Matrix3D.subtractVectors(cameraPosition, this._target);
    directionVector[3] = 0;

    let upDirection = [0, 1, 0, 0];
    let rightDirection = [1, 0, 0, 0];

    /// pitch = y, yaw = x
    let rotationMatrix = Matrix3D.createXRotation(xAngleInRadians);
    // upDirection = Matrix3D.normalizeVector(Matrix3D.transformVector(rotMatrix, upDirection));
    // rightDirection = Matrix3D.normalizeVector(Matrix3D.transformVector(rotMatrix, rightDirection));

    rotationMatrix = Matrix3D.rotateY(rotationMatrix, yAngleInRadians);
    directionVector = Matrix3D.transformVector(rotationMatrix, directionVector);
    upDirection = Matrix3D.transformVector(rotationMatrix, [0, 1, 0, 0]);

    cameraPosition = [
      directionVector[0] + this._target[0],
      directionVector[1] + this._target[1],
      directionVector[2] + this._target[2],
    ];
    // up and yaw
    // right and pitch


    // This post explains how to calculate the angles from a direction vector - https://gamedev.stackexchange.com/a/149798
    /*directionVector[2] = -Math.abs(directionVector[2]);
    let xRotation = Math.atan2(-directionVector[1], -directionVector[2]);
    let yRotation = -Math.asin(directionVector[0]);
*/

    /*
    function hamilton2(q, r) {
      return [
        r[0] * q[0] - r[1] * q[1] - r[2] * q[3] - r[3] * q[3],
        r[0] * q[1] + r[1] * q[0] - r[2] * q[3] + r[3] * q[2],
        r[0] * q[2] + r[1] * q[3] + r[2] * q[0] - r[3] * q[1],
        r[0] * q[3] - r[1] * q[2] + r[2] * q[1] + r[3] * q[0],
      ];
    }
    
    const cosX = Math.cos(xRotation/2);
    const sinX = Math.sin(xRotation/2);
    const cosY = Math.cos(yRotation/2);
    const sinY = Math.sin(yRotation/2);

    // Rotate around the Y axis
    const q = [cosX, sinX*0, sinX*1, sinX*0];
    // Rotate around the X axis
    const q2 = [cosY, sinY*1, sinY*0, sinY*0];
    
    const p = [0, 0, 1, 0]; // axis to rotate around, ie. the x axis
    const invQ = [q[0], -q[1], -q[2], -q[3]];

    //const H1 = hamilton(q, p);
    //const H2 = hamilton(H1, invQ);

    const H1 = hamilton2(q, p);
    const H2 = hamilton2(H1, invQ);

    const p2 = [0, 1, 0, 0];
    const invQ2 = [q2[0], -q2[1], -q2[2], -q2[3]];

    const H3 = hamilton2(q2, p2);
    const H4 = hamilton2(H3, invQ2);

    //const upDirection = [H4[2], H4[1], H4[3]];*/

    /// pitch = y, yaw = x

    this._matrix = Matrix3D.createLookAt(cameraPosition, this._target, upDirection);
    
    const viewMatrix = Matrix3D.inverse(this._matrix);
    this._matrix = Matrix3D.multiply(this._projectionMatrix, viewMatrix);
  }

}