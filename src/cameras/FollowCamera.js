class FollowCamera {

  constructor(fieldOfView, canvasWidth, canvasHeight, zNear, zFar) {
    this._fieldOfViewRadians = Helpers.degreesToRadians(fieldOfView);
    this._aspectRatio;
    this._zNear = zNear || 1;
    this._zFar = zFar || 2000;
    this._matrix = Matrix3D.createIdentity();
    this._target = [0, 0, 0];
    this._targetMesh;
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._distanceX = 0;
    this._distanceY = 0;
    this._distanceZ = 400;
    this.resize(canvasWidth, canvasHeight);
  }

  get matrix() { return this._matrix; }

  followMesh(mesh, distanceX, distanceY, distanceZ) {
    this._targetMesh = mesh;
    this._distanceX = distanceX;
    this._distanceY = distanceY;
    this._distanceZ = distanceZ;
    this.update();
  }

  update() {
    if (this._targetMesh) {
      this._updateTarget();
      
      const s = Helpers.degreesToRadians(this._targetMesh.rotationY);
      const t = Helpers.degreesToRadians(this._targetMesh.rotationX);

      // This stuff is wrong
     /* this._x = this._targetMesh.center.x + (this._distanceZ * -Math.sin(s) * Math.cos(t));
      this._y = this._targetMesh.center.y + (this._distanceZ * -Math.sin(t));
      this._z = this._targetMesh.center.z + (this._distanceZ * Math.cos(s) * Math.cos(t));*/

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

    // Calculate the new camera position
    //this._z = 400;

    this._y = this._target[1];
    this._x = 0;
this._z = this._distanceZ;

    this._matrix = Matrix3D.createTranslation(this._x, this._y, this._z);
    let cameraPosition = [
      this._matrix[12],
      this._matrix[13],
      this._matrix[14],
    ];

    const xAngleInRadians = Helpers.degreesToRadians(this._targetMesh.rotationX)
    const yAngleInRadians = Helpers.degreesToRadians(this._targetMesh.rotationY)

    // Calculate the x and y rotation from the target and camera position
    //let directionVector = (Matrix3D.subtractVectors(cameraPosition, this._target));

    let directionVector = (Matrix3D.subtractVectors(cameraPosition, this._target));
    directionVector[3] = 0;//directionVector[2];

    let upDirection = [0, 1, 0, 0];//[0, Math.cos(xAngleInRadians), -Math.sin(xAngleInRadians), 0];
    let rightDirection = [1, 0, 0, 0];

    /// pitch = y, yaw = x

    let rotMatrix = Matrix3D.createYRotation(yAngleInRadians);
    rotMatrix = Matrix3D.rotateX(rotMatrix, xAngleInRadians);

    directionVector = Matrix3D.transformVector(rotMatrix, directionVector);


    upDirection = Matrix3D.transformVector(rotMatrix, upDirection);

    this._x = directionVector[0] + this._target[0];
    this._y = directionVector[1] - this._target[1];
    this._z = directionVector[2] + this._target[2];

    cameraPosition = [
      directionVector[0] + this._target[0],
      directionVector[1] + this._target[1],
      directionVector[2] + this._target[2],
    ];


    //console.log(directionVector);
    // up and yaw
    // right and pitch


    // This post explains how to calculate the angles from a direction vector - https://gamedev.stackexchange.com/a/149798
    /*directionVector[2] = -Math.abs(directionVector[2]);
    let xRotation = Math.atan2(-directionVector[1], -directionVector[2]);
    let yRotation = -Math.asin(directionVector[0]);
*/
    let xRotation = xAngleInRadians;
    let yRotation = yAngleInRadians;
    

    function hamilton(R, P) {
      /*return [
        R[0] * P[0] - R[1] * P[1] - R[2] * P[2] - R[3] * P[3],
        R[0] * P[1] + R[1] * P[0] + R[2] * P[3] - R[3] * P[2],
        R[0] * P[2] + R[2] * P[0] + R[3] * P[1] - R[1] * P[3],
        R[0] * P[3] + R[3] * P[0] + R[1] * P[2] - R[2] * P[1],
      ];*/
    }



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

    //let upDirection = [0, Math.cos(xAngleInRadians), -Math.sin(xAngleInRadians), 0];

    
    

    /// pitch = y, yaw = x

    this._matrix = Matrix3D.createLookAt(cameraPosition, this._target, upDirection);
    
    const viewMatrix = Matrix3D.inverse(this._matrix);
    this._matrix = Matrix3D.multiply(this._projectionMatrix, viewMatrix);
  }

}