
export class Timeline implements ITimeline {

  private _source: animationValue;
  private _animations: IActiveAnimation[];
  private _options: animationOptions;
  private _activeAnimation: IActiveAnimation;
  private _activeAnimationIndex: number = 0;
  private _complete: boolean = false;
  private _reversing: boolean = false;
  private _loopCount: number = 0;
  private _totalLoops: number = undefined;

  constructor(source, newAnimations, options) {
    this._source = source;
    this._animations = newAnimations;
    this._options = options || {};
    this._activeAnimation = newAnimations[0];
    this._totalLoops = typeof options.loops === 'number' ? options.loops : undefined;
  }

  get complete(): boolean { return this._complete; }

  public stop() {
    this._activeAnimation.stop();
  }

  public pause() {
    this._activeAnimation.pause();
  }

  public resume() {
    this._activeAnimation.resume();
  }

  public update(elapsed: number) {
    if (this._activeAnimation.complete) {
      const totalAnims: number = this._animations.length;
      if (!this._reversing && this._activeAnimationIndex < totalAnims - 1) {
        const previousEndValues: animationValue = this._animations[this._activeAnimationIndex].endValues;
        this._activeAnimationIndex++;
        this._updateStartValues(previousEndValues);
        this._activeAnimation = this._animations[this._activeAnimationIndex];
      } else if (this._reversing && this._activeAnimationIndex > 0) {
        const previousStartValues = this._animations[this._activeAnimationIndex].startValues;
        this._activeAnimationIndex--;
        this._updateEndValues(previousStartValues);
        this._activeAnimation = this._animations[this._activeAnimationIndex];
      } else {
        this._onTimelineComplete();
        return;
      }
    }
    this._activeAnimation.update(elapsed);
    if (this._options.onUpdate) {
      this._options.onUpdate(this._activeAnimation);
    }
  }

  private _updateStartValues(previousEndValues: animationValue) {
    for (let i = this._activeAnimationIndex; i < this._animations.length; i++) {
      this._animations[i].updateStartValues(previousEndValues);
    }
  }

  private _updateEndValues(previousStartValues: animationValue) {
    for (let i = this._activeAnimationIndex; i > 0; i--) {
      this._animations[i].updateEndValues(previousStartValues);
    }
  }

  private _restart() {
    for (let i = this._animations.length-1; i >= 0; i--) {
      this._animations[i].restart();
    }
    const previousEndValues = this._animations.length > 1
      ? this._animations[this._activeAnimationIndex].endValues
      : this._animations[0].startValues;
    this._updateStartValues(previousEndValues);
    this._activeAnimation = this._animations[0];
    this._activeAnimationIndex = 0;
  }

  private _reverseDirection() {
    this._reversing = !this._reversing;
    for (let i = this._animations.length-1; i >= 0; i--) {
      this._animations[i].reverseDirection();
    }
  }

  private _reverseEasing() {
    this._reversing = !this._reversing;
    for (let i = this._animations.length - 1; i >= 0; i--) {
      this._animations[i].reverseEasing();
    }
  }

  private _onTimelineComplete() {
    if (this._options.loops) {
      this._loopCount++;
      if (this._totalLoops && this._loopCount >= this._totalLoops) {
        this._complete = true;
        if (this._options.onComplete) this._options.onComplete();
      } else {
        this._restart();
      }
    } else if (this._options.alternate) {
      this._reverseDirection();
    } else if (this._options.bounce) {
      this._reverseEasing();
    } else if (this._options.onComplete) {
      this._complete = true;
      if (this._options.onComplete) this._options.onComplete();
    }
  }
}
