class FreeCamera extends PerspectiveCamera {

  constructor(fieldOfView, canvasWidth, canvasHeight, zNear, zFar) {
    super(fieldOfView, canvasWidth, canvasHeight, zNear, zFar);
    this._MAX_SPEED = 300;
    this._START_SPEED = 50;
    this._ACCELERATION_TIME = 3;
    this._HORIZONTAL_DEADZONE_START = 0;
    this._HORIZONTAL_DEADZONE_END = 0;
    this._VERTICAL_DEADZONE = 100;
    this._MAX_ROTATION_PER_SECOND = 75;
    this._keyDown = false;
    this._speedPerSecond = this._START_SPEED;
    this._pressedKeys = [];
    this._keyDownTime;
    this._previousUpdateTime = 0;
    this._xRotationStrength = 0;
    this._yRotationStrength = 0;
    this._currentDirection = [0, 0, -1];
    this._mouseXRotating = false;
    this._mouseYRotating = false;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onWindowResized = this._onWindowResized.bind(this);
    this._updateDeadzones();
  }

  enableControls() {
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('resize', this._onWindowResized);
    this._startKeyFrameTimer();
  }

  disableControls() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('resize', this._onWindowResized);
    this._clearKeyFrameTimer();
  }

  _startKeyFrameTimer() {
    this._clearKeyFrameTimer();
    if (!this._keyFrameTimer) {
      this._keyFrameTimer = requestAnimationFrame(this._onKeyFrameTimerTicked.bind(this));
    }
  }

  _clearKeyFrameTimer() {
    if (this._keyFrameTimer) {
      cancelAnimationFrame(this._keyFrameTimer);
      this._keyFrameTimer = undefined;
    }
  }

  _updateDeadzones() {
    this._HORIZONTAL_DEADZONE_START = (window.innerWidth / 2) - Math.min(200, window.innerWidth / 8);
    this._HORIZONTAL_DEADZONE_END = (window.innerWidth / 2) + Math.min(200, window.innerWidth / 8);
    this._VERTICAL_DEADZONE_START = (window.innerHeight / 2) - Math.min(200, window.innerHeight / 8);
    this._VERTICAL_DEADZONE_END = (window.innerHeight / 2) + Math.min(200, window.innerHeight / 8);
  }

  _updatePosition(keyCode, speedIncrement) {
    let rotationMatrix = Matrix3D.createIdentity();
    if (this._angleXInRadians) rotationMatrix = Matrix3D.rotateX(rotationMatrix, this._angleXInRadians);
    if (this._angleYInRadians) rotationMatrix = Matrix3D.rotateY(rotationMatrix, this._angleYInRadians);
    let movementDirection = [0, 0, 0, 0];
    
    switch(keyCode) {
      case 83:
        // Backwards (S)
        movementDirection = [0, 0, 1, 0];
        break;
      case 87:
        // Forwards (W)
        movementDirection = [0, 0 , -1, 0];
        break;
      case 65:
        // Left (A)
        movementDirection = [-1, 0, 0, 0];
        break;
      case 68:
        // Right (D)
        movementDirection = [1, 0, 0, 0];
        break;
      default:
        break;
    }

    // Handle rotations separately
    if (!this._mouseXRotating) {
      if (keyCode === 37) {
        // Left arrow key
        this._xRotationStrength = 1;
      } else if (keyCode === 39) {
        // Right arrow key
        this._xRotationStrength = -1;
      }
    }
    if (!this._mouseYRotating) {
      if (keyCode === 38) {
        // Up arrow key
        this._yRotationStrength = 1;
      } else if (keyCode === 40) {
        // Down arrow key
        this._yRotationStrength = -1;
      }
    }
 
    const adjustment = Matrix3D.transformVector(rotationMatrix, movementDirection);
    this._x += adjustment[0] * speedIncrement;
    this._y += adjustment[1] * speedIncrement;
    this._z += adjustment[2] * speedIncrement;
  }

  _clearKeyRotations() {
    if (this._pressedKeys.indexOf(37) === -1
      && this._pressedKeys.indexOf(39) === -1
      && !this._mouseXRotating) {
      this._xRotationStrength = 0;
    }

    if (this._pressedKeys.indexOf(38) === -1
      && this._pressedKeys.indexOf(40) === -1
      && !this._mouseYRotating) {
      this._yRotationStrength = 0;
    }
  }

  _onKeyDown(event) {
    if (!this._pressedKeys.length) {
      this._previousUpdateTime = 0;
    }
    if (this._pressedKeys.indexOf(event.keyCode) < 0) {
      this._pressedKeys.push(event.keyCode);
    }
  }

  _onKeyUp(event) {
    if (this._pressedKeys.indexOf(event.keyCode) > -1) {
      this._pressedKeys.splice(this._pressedKeys.indexOf(event.keyCode));
    }
    if (!this._pressedKeys.length) {
      this._speedPerSecond = this._START_SPEED;
      this._keyDownTime = 0;
    }
  }

  _onMouseMove(e) {
    if (e.clientX < this._HORIZONTAL_DEADZONE_START) {
      this._xRotationStrength = 1 - (e.clientX / this._HORIZONTAL_DEADZONE_START);
    } else if (e.clientX > this._HORIZONTAL_DEADZONE_END) {
      this._xRotationStrength = -((e.clientX - this._HORIZONTAL_DEADZONE_END) / (window.innerWidth - this._HORIZONTAL_DEADZONE_END));
    } else {
      this._xRotationStrength = 0;
    }
    if (e.clientY < this._VERTICAL_DEADZONE_START) {
      this._yRotationStrength = 1 - (e.clientY / this._VERTICAL_DEADZONE_START);
    } else if (e.clientY > this._VERTICAL_DEADZONE_END) {
      this._yRotationStrength = -((e.clientY - this._VERTICAL_DEADZONE_END) / (window.innerHeight - this._VERTICAL_DEADZONE_END));
    } else {
      this._yRotationStrength = 0;
    }
    this._mouseXRotating = this._xRotationStrength !== 0;
    this._mouseYRotating = this._yRotationStrength !== 0;
  }

  _onWindowResized() {
    this._updateDeadzones();
  }

  _onKeyFrameTimerTicked(updateTime) {
    updateTime *= 0.001;
    if (!this._previousUpdateTime) this._previousUpdateTime = updateTime;
    
    this._clearKeyFrameTimer();
    const timePassed = (updateTime - this._previousUpdateTime);
    this._previousUpdateTime = updateTime;

    if (this._pressedKeys.length) {
      if (!this._keyDownTime) this._keyDownTime = updateTime;
      const speedIncrement = timePassed * this._speedPerSecond;
      this._pressedKeys.forEach(keyCode => {
        this._updatePosition(keyCode, speedIncrement);
      });
    }

    this._clearKeyRotations();

    if (this._xRotationStrength) {
      this.angleY += ((this._MAX_ROTATION_PER_SECOND * this._xRotationStrength) * timePassed);
    }
    if (this._yRotationStrength) {
      this.angleX += ((this._MAX_ROTATION_PER_SECOND * this._yRotationStrength) * timePassed);
    }

    this._updateMatrix();
    // Up the speed every second
    if (this._pressedKeys.length) {
      this._speedPerSecond = Math.min((this._START_SPEED + ((updateTime - this._keyDownTime) / this._ACCELERATION_TIME) * (this._MAX_SPEED - this._START_SPEED)), this._MAX_SPEED);
    } else {
      this._speedPerSecond = 0;
    }
    this._startKeyFrameTimer();
  }
}