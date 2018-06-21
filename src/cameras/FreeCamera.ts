import { PerspectiveCamera } from './PerspectiveCamera';
import { Matrix4 } from '../utils/Matrix4';
import { transformVector } from '../utils/vectorUtils';

const maxSpeed: number = 300;
const startSpeed: number = 50;
const accelerationTime: number = 3;
const maxRotationPerSecond: number = 75;

export class FreeCamera extends PerspectiveCamera {

  private _horizontalDeadzoneStart: number = 0;
  private _horizontalDeadzoneEnd: number = 0;
  private _verticalDeadzoneStart: number = 0;
  private _verticalDeadzoneEnd: number = 0;
  private _alwaysRotateToMouse: boolean = false;
  private _dragInProgress: boolean = false;
  private _speedPerSecond: number = startSpeed;
  private _pressedKeys: string[] = [];
  private _keyDownTime: number = 0;
  private _previousUpdateTime: number = 0;
  private _xRotationStrength: number = 0;
  private _yRotationStrength: number = 0;
  private _mouseXRotating: boolean = false;
  private _mouseYRotating: boolean = false;
  private _previousMouseX: number = 0;
  private _previousMouseY: number = 0;
  private _keyFrameTimer: number;
  private _rotationMatrix: Matrix4;
  private _activeTouches: any = [];
  private _previousPinchDiff: point = {x: 0, y: 0};

  constructor(options: IPerspectiveCameraOptions) {
    super(options);
    this._rotationMatrix = new Matrix4();
    this._updateDeadzones();
  }

  set alwaysRotateToMouse(value: boolean) {
    this.disableControls();
    this._alwaysRotateToMouse = value;
    this.enableControls();
  }

  public enableControls() {
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('touchstart', this._onTouchStart);
    window.addEventListener('resize', this._onWindowResized);
    if (!this._alwaysRotateToMouse) {
      document.addEventListener('mousedown', this._onMouseDown);
    } else {
      document.addEventListener('mousemove', this._onMouseMove);
    }
    this._startKeyFrameTimer();
  }

  public disableControls() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('touchstart', this._onTouchStart);
    window.removeEventListener('resize', this._onWindowResized);
    if (!this._alwaysRotateToMouse) {
      document.removeEventListener('mousedown', this._onMouseDown);
      if (this._dragInProgress) {
        this._onMouseUp();
      }
    } else {
      document.removeEventListener('mousemove', this._onMouseMove);
    }
    this._clearKeyFrameTimer();
  }

  private _startKeyFrameTimer() {
    this._clearKeyFrameTimer();
    if (!this._keyFrameTimer) {
      this._keyFrameTimer = requestAnimationFrame(this._onKeyFrameTimerTicked.bind(this));
    }
  }

  private _clearKeyFrameTimer() {
    if (this._keyFrameTimer) {
      cancelAnimationFrame(this._keyFrameTimer);
      this._keyFrameTimer = undefined;
    }
  }

  private _updateDeadzones() {
    this._horizontalDeadzoneStart = (window.innerWidth / 2) - Math.min(200, window.innerWidth / 8);
    this._horizontalDeadzoneEnd = (window.innerWidth / 2) + Math.min(200, window.innerWidth / 8);
    this._verticalDeadzoneStart = (window.innerHeight / 2) - Math.min(200, window.innerHeight / 8);
    this._verticalDeadzoneEnd = (window.innerHeight / 2) + Math.min(200, window.innerHeight / 8);
  }

  private _updatePosition(key: string, speedIncrement: number) {
    this._rotationMatrix.setToIdentity();
    if (this._angleInRadians.x) this._rotationMatrix.rotateX(this._angleInRadians.x);
    if (this._angleInRadians.y) this._rotationMatrix.rotateY(this._angleInRadians.y);
    let movementDirection: vec4 = {x: 0, y: 0, z: 0, w: 0};

    switch (key) {
      case 's':
        // Backwards (S)
        movementDirection = {x: 0, y: 0, z: 1, w: 0};
        break;
      case 'w':
        // Forwards (W)
        movementDirection = {x: 0, y: 0, z: -1, w: 0};
        break;
      case 'a':
        // Left (A)
        movementDirection = {x: -1, y: 0, z: 0, w: 0};
        break;
      case 'd':
        // Right (D)
        movementDirection = {x: 1, y: 0, z: 0, w: 0};
        break;
      default:
        break;
    }

    const adjustment = transformVector(this._rotationMatrix, movementDirection);
    this._position = {
      x: this._position.x += (adjustment.x * speedIncrement),
      y: this._position.y += (adjustment.y * speedIncrement),
      z: this._position.z += (adjustment.z * speedIncrement),
    };
  }

  private _clearKeyRotations() {
    if (this._pressedKeys.indexOf('ArrowLeft') === -1
      && this._pressedKeys.indexOf('ArrowRight') === -1
      && !this._mouseXRotating) {
      this._xRotationStrength = 0;
    }

    if (this._pressedKeys.indexOf('ArrowUp') === -1
      && this._pressedKeys.indexOf('ArrowDown') === -1
      && !this._mouseYRotating) {
      this._yRotationStrength = 0;
    }
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (!this._pressedKeys.length) {
      this._previousUpdateTime = 0;
    }
    if (this._pressedKeys.indexOf(e.key) < 0) {
      this._pressedKeys.push(e.key);
    }
  }

  private _onKeyUp = (e: KeyboardEvent) => {
    if (this._pressedKeys.indexOf(e.key) > -1) {
      this._pressedKeys.splice(this._pressedKeys.indexOf(e.key));
    }
    if (!this._pressedKeys.length) {
      this._speedPerSecond = startSpeed;
      this._keyDownTime = 0;
    }
  }

  private _onMouseDown = (e: MouseEvent) => {
    if (!this._alwaysRotateToMouse) {
      this._dragInProgress = true;
      this._previousMouseX = e.pageX;
      this._previousMouseY = e.pageY;
      document.addEventListener('mousemove', this._onMouseMove);
      document.addEventListener('mouseup', this._onMouseUp);
    }
  }

  private _onMouseMove = (e: MouseEvent) => {
    if (this._alwaysRotateToMouse) {
      if (e.clientX < this._horizontalDeadzoneStart) {
        this._xRotationStrength = 1 - (e.clientX / this._horizontalDeadzoneStart);
      } else if (e.clientX > this._horizontalDeadzoneEnd) {
        this._xRotationStrength = -((e.clientX - this._horizontalDeadzoneEnd) / (window.innerWidth - this._horizontalDeadzoneEnd));
      } else {
        this._xRotationStrength = 0;
      }
      if (e.clientY < this._verticalDeadzoneStart) {
        this._yRotationStrength = 1 - (e.clientY / this._verticalDeadzoneStart);
      } else if (e.clientY > this._verticalDeadzoneEnd) {
        this._yRotationStrength = -((e.clientY - this._verticalDeadzoneEnd) / (window.innerHeight - this._verticalDeadzoneEnd));
      } else {
        this._yRotationStrength = 0;
      }
      this._mouseXRotating = this._xRotationStrength !== 0;
      this._mouseYRotating = this._yRotationStrength !== 0;
    } else if (!this._alwaysRotateToMouse && this._dragInProgress) {
      const diffX = e.pageX - this._previousMouseX;
      const diffY = e.pageY - this._previousMouseY;
      this.angleY += (diffX / window.innerWidth) * 180;
      this.angleX += (diffY / window.innerHeight) * 180;
      this._previousMouseX = e.pageX;
      this._previousMouseY = e.pageY;
    }
  }

  private _onMouseUp = (e?: MouseEvent) => {
    this._dragInProgress = false;
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
  }

  private _onTouchStart = (e: TouchEvent) => {
    if (!this._activeTouches.length) {
      document.addEventListener('touchmove', this._onTouchMove);
      document.addEventListener('touchend', this._onTouchEnd);
    }
    const touch: Touch = e.touches[0];
    this._activeTouches.push(touch);
  }

  private _onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // Check for pinch-zooming
      const currentDiff: point = {
        x: Math.abs(e.touches[0].pageX - e.touches[1].pageX),
        y: Math.abs(e.touches[0].pageY - e.touches[1].pageY),
      };
      const movementDirection = {x: 0, y: 0, z: 0, w: 0};
      if (this._previousPinchDiff.x > 0 || this._previousPinchDiff.y > 0) {
        if (currentDiff.x > this._previousPinchDiff.x) {
          // Distance X has increased
          movementDirection.z = -1;
        } else if (currentDiff.x < this._previousPinchDiff.x) {
          // Distance has decreased
          movementDirection.z = 1;
        } else if (currentDiff.y > this._previousPinchDiff.y) {
          movementDirection.z = -1;
        } else if (currentDiff.y < this._previousPinchDiff.y) {
          movementDirection.z = 1;
        }
        if (movementDirection.z) {
          // Reset the rotation matrix
          this._rotationMatrix.setToIdentity();
          if (this._angleInRadians.x) this._rotationMatrix.rotateX(this._angleInRadians.x);
          if (this._angleInRadians.y) this._rotationMatrix.rotateY(this._angleInRadians.y);

          // Perform the zoom whil respecting camera angle
          const adjustment = transformVector(this._rotationMatrix, movementDirection);
          // TODO: Scale the increment according to the size of the difference between current and previous gaps
          const speedIncrement = 3;
          this._position = {
            x: this._position.x += (adjustment.x * speedIncrement),
            y: this._position.y += (adjustment.y * speedIncrement),
            z: this._position.z += (adjustment.z * speedIncrement),
          };
        }
      }
      this._previousPinchDiff = currentDiff;
    } else {
      // Rotate the camera
      const touch: Touch = e.touches[0];
      const diffX = touch.pageX - this._activeTouches[0].pageX;
      const diffY = touch.pageY - this._activeTouches[0].pageY;
      this.angleY += (diffX / window.innerWidth) * 180;
      this.angleX += (diffY / window.innerHeight) * 180;
    }

    // Update the cached touch data
    for (let i: number = 0; i < e.touches.length; i++) {
      for (let j: number = 0; j < this._activeTouches.length; j++) {
        if (e.touches[i].identifier === this._activeTouches[j].identifier) {
          this._activeTouches[j] = e.touches[i];
          break;
        }
      }
    }
    e.preventDefault();
  }

  private _onTouchEnd = (e: TouchEvent) => {
    this._activeTouches = [];
    this._previousPinchDiff = {
      x: 0,
      y: 0,
    };
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._onTouchEnd);
  }

  private _onWindowResized = () => {
    this._updateDeadzones();
  }

  private _onKeyFrameTimerTicked = (updateTime: number) => {
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

    if (this._alwaysRotateToMouse) {
      if (this._xRotationStrength) {
        this.angleY += ((maxRotationPerSecond * this._xRotationStrength) * timePassed);
      }
      if (this._yRotationStrength) {
        this.angleX += ((maxRotationPerSecond * this._yRotationStrength) * timePassed);
      }
    }

    this._updateMatrix();
    // Up the speed every second
    if (this._pressedKeys.length) {
      this._speedPerSecond = Math.min((startSpeed + ((updateTime - this._keyDownTime) / accelerationTime) * (maxSpeed - startSpeed)), maxSpeed);
    } else {
      this._speedPerSecond = 0;
    }
    this._startKeyFrameTimer();
  }
}
