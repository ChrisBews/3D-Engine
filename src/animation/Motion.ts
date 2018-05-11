import { easing } from '../constants/easing';
import { colorType } from '../constants/colors';
import { getColorType } from '../utils/colorUtils';
import { ActiveAnimation } from './ActiveAnimation';
import { Timeline } from './Timeline';

class MotionCore {

  private _defaultEasing: easingObject = easing.linear;
  private _defaultDuration: number = 1000;
  private _requestStartTime: number = 0;
  private _activeAnimations: Array<IActiveAnimation|ITimeline>;
  private _outputColorsAsStrings: boolean = false;
  private _animFrame: number;

  constructor() {

  }

  get outputColorsAsStrings(): boolean { return this._outputColorsAsStrings; }
  set outputColorsAsStrings(value: boolean) {
    this._outputColorsAsStrings = value;
  }

  /**
   * Start a new animation of properties
   * @param {object} target
   * @param {object} options The following options can be set:
   * to: Number, color, array of numbers, or object with values to animate towards
   * duration: Length of the animation in milliseconds
   * easing: Easing curve to use (x1, y1, x2, y2)
   * loops: Play the same animation infinitely
   * alternate: Animate back and forth, with the easing method the same in either direction
   * bounce: Animate back and forth, with the easing method reversed on return
   * steps: Jump between the passed number of steps instead of a smooth progression
   * onUpdate: Called every time the animation is updated. Passes the ActiveAnimation in the callback
   * onComplete: Called when the animation completes
   */
  public start(source: number | string | object, options?: MotionOptions): number | undefined {
    if (!options.to) {
      throw new Error(`Motion: No value for 'to' has been set`);
    }
    const newAnimation: ActiveAnimation = this._createAnimation(source, options);
    if (newAnimation) {
      this._activeAnimations.push(newAnimation);
      return newAnimation.id;
    } else {
      return;
    }
  }

  stop(id: number) {
    const remainingAnimations: Array<IActiveAnimation|ITimeline> = [];
    for (let i: number = 0; i < this._activeAnimations.length; i++) {
      if (this._activeAnimations[i].id === id || !id) {
        this._activeAnimations[i].stop();
      } else {
        remainingAnimations.push(this._activeAnimations[i]);
      }
    }
    this._activeAnimations = remainingAnimations;
  }

  timeline(source, animations, options) {
    const newAnimations: ActiveAnimation[] = [];
    for (let i: number = 0; i < animations.length; i++) {
      animations[i].loops = false;
      animations[i].alternate = false;
      animations[i].bounce = false;
      newAnimations.push(this._createAnimation(source, animations[i]));
    }
    this._activeAnimations.push(new Timeline(source, newAnimations, options));
  }

  pause(id?: number) {
    for (let i: number = 0; i < this._activeAnimations.length; i++) {
      if (this._activeAnimations[i].id === id || !id) {
        this._activeAnimations[i].pause();
      }
    }
  }

  resume(id: number) {
    for (let i: number = 0; i < this._activeAnimations.length; i++) {
      if (this._activeAnimations[i].id === id || !id) {
        this._activeAnimations[i].resume();
      }
    }
  }

  _createAnimation(source, options): ActiveAnimation {
    const destination: animationValue = options.to;
    const sourceType: string = typeof source;
    const destType: string = typeof destination;
    const sourceIsNumber: boolean = sourceType === 'number';
    const sourceColorType: colorType = getColorType(source);
    const sourceIsNumberArray: boolean = this._isNumberArray(source);
    if (sourceType !== 'object' && !sourceIsNumber
      && !sourceIsNumberArray && !sourceColorType) {
      throw new Error('Motion: Start value is neither an object of values, a color, a number, or an array of numbers');
    }
    const destIsNumber: boolean = destType === 'number';
    const destColorType: colorType = getColorType(destination);
    const destIsNumberArray: boolean = this._isNumberArray(destination);
    if (destType !== 'object' && !destIsNumber
      && !destIsNumberArray && !destColorType) {
      throw new Error('Motion: End value is neither an object of values, a color, a number, or an array of numbers');
    }
    if (sourceType !== destType || sourceIsNumberArray !== destIsNumberArray) {
      throw new Error(`Motion: Start and end values don't match.`);
    }

    const animationInfo: animationInfo = {
      isNumber: sourceIsNumber && destIsNumber,
      sourceColorType,
      destColorType,
      isColor: !!(sourceColorType && destColorType),
      isNumberArray: sourceIsNumberArray && destIsNumberArray,
    };

    options.easing = options.easing || this._defaultEasing;
    options.duration = options.duration || this._defaultDuration;

    if (!this._activeAnimations.length) {
      // Start the animation loop if no animations are running
      this._requestStartTime = 0;
      this._startAnimFrameRequest();
    }

    return new ActiveAnimation(source, destination, options, animationInfo);
  }

  _startAnimFrameRequest() {
    this._stopAnimFrameRequest();
    this._animFrame = requestAnimationFrame(this._onFrame.bind(this));
  }

  _stopAnimFrameRequest() {
    if (this._animFrame) {
      cancelAnimationFrame(this._animFrame);
      this._animFrame = undefined;
    }
  }

  _isNumberArray(value: any): boolean {
    const isArray: boolean = Array.isArray(value);
    if (!isArray) return false;
    for (let i: number = 0; i < value.length; i++) {
      if (typeof value[i] !== 'number') return false;
    }
    return true;
  }

  _onFrame(currentTime: number) {
    const elapsed: number = (!this._requestStartTime) ? 0 : currentTime - this._requestStartTime;
    this._requestStartTime = currentTime;
    for (let i: number = 0; i < this._activeAnimations.length; i++) {
      this._activeAnimations[i].update(elapsed);
    }
    this._checkForCompletedAnimations();
    if (this._activeAnimations.length) {
      this._startAnimFrameRequest();
    } else {
      this._stopAnimFrameRequest();
    }
  }

  _checkForCompletedAnimations() {
    const incompleteAnims: Array<IActiveAnimation|ITimeline> = [];
    for (let i: number = 0; i < this._activeAnimations.length; i++) {
      if (!this._activeAnimations[i].complete) {
        incompleteAnims.push(this._activeAnimations[i]);
      }
    }
    this._activeAnimations = incompleteAnims;
  }
}

export const Motion = new MotionCore();
