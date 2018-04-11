class FreeCamera extends PerspectiveCamera {

  constructor(fieldOfView, canvasWidth, canvasHeight, zNear, zFar) {
    super(fieldOfView, canvasWidth, canvasHeight, zNear, zFar);
    this._MAX_SPEED = 7;
    this._START_SPEED = 4;
    this._keyDown = false;
    this._speedPerSecond = this._START_SPEED;
    this._pressedKeys = [];
    this._keyDownTime;
    this._previousUpdateTime = 0;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this.enableControls();
  }

  enableControls() {
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);
  }

  disableControls() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('mousemove', this._onMouseMove);
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
    if (!this._keyDown) {
      this._startKeyFrameTimer();
    }
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
      this._previousUpdateTime = 0;
      this._clearKeyFrameTimer();
    }
  }

  _onMouseMove() {

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

    this._updateMatrix();
    // Up the speed every second
    this._speedPerSecond = Math.min((this._START_SPEED + ((updateTime - this._keyDownTime) / 2)), this._MAX_SPEED);
    this._startKeyFrameTimer();
  }
}