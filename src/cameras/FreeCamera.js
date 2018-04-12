class FreeCamera extends PerspectiveCamera {

  constructor(fieldOfView, canvasWidth, canvasHeight, zNear, zFar) {
    super(fieldOfView, canvasWidth, canvasHeight, zNear, zFar);
    this._MAX_SPEED = 7;
    this._START_SPEED = 4;
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
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onWindowResized = this._onWindowResized.bind(this);
    this.enableControls();
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
    switch(keyCode) {
      case 83:
        // Backwards (S)
        this._z += speedIncrement;
        break;
      case 87:
        // Forwards (W)
        this._z -= speedIncrement;
        break;
      case 65:
        // Left (A)
        this._x -= speedIncrement;
        break;
      case 68:
        // Right (D)
        this._x += speedIncrement;
        break;
      default:
        break;
    }
  }

  _onKeyDown(event) {
    if (!this._pressedKeys.length) {
      this._previousUpdateTime = 0;
    }
    if (!this._pressedKeys.indexOf(event.keyCode) > -1) {
      this._pressedKeys.push(event.keyCode);
    }
  }

  _onKeyUp(event) {
    this._pressedKeys.indexOf(event.keyCode)
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
  }

  _onWindowResized() {
    this._updateDeadzones();
  }

  _onKeyFrameTimerTicked(updateTime) {
    updateTime *= 0.001;
    if (!this._keyDownTime) this._keyDownTime = updateTime;
    if (!this._previousUpdateTime) this._previousUpdateTime = updateTime;
    
    this._clearKeyFrameTimer();
    const timePassed = (updateTime - this._previousUpdateTime);
    this._previousUpdateTime = updateTime;

    const speedIncrement = timePassed * this._speedPerSecond;

    this._pressedKeys.forEach(value => {
      this._updatePosition(value, speedIncrement);
    });

    if (this._xRotationStrength) {
      this.angleY += ((this._MAX_ROTATION_PER_SECOND * this._xRotationStrength) * timePassed);
    }
    if (this._yRotationStrength) {
      this.angleX += ((this._MAX_ROTATION_PER_SECOND * this._yRotationStrength) * timePassed);
    }

    this._updateMatrix();
    // Up the speed every second
    this._speedPerSecond = Math.min((this._START_SPEED + ((updateTime - this._keyDownTime) / 2)), this._MAX_SPEED);
    this._startKeyFrameTimer();
  }
}