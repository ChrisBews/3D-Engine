class Timeline {

  constructor(source, animations, options) {
    this._source = source;
    this._animations = animations;
    this._options = options || {};
    this._activeAnimation = animations[0];
    this._activeAnimationIndex = 0;
    this._complete = false;
    this._reversing = false;
    this._loopCount = 0;
    this._totalLoops = typeof options.loops === 'number' ? options.loops : undefined;
  }

  get complete() { return this._complete; }

  stop() {
    this._activeAnimation.stop();
  }

  pause() {
    this._activeAnimation.pause();
  }

  resume() {
    this._activeAnimation.resume();
  }

  update(elapsed) {
    if (this._activeAnimation.complete) {
      const totalAnims = this._animations.length;
      if (!this._reversing && this._activeAnimationIndex < totalAnims - 1) {
        const previousEndValues = this._animations[this._activeAnimationIndex].endValues;
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

  _updateStartValues(previousEndValues) {
    for (let i = this._activeAnimationIndex; i < this._animations.length; i++) {
      this._animations[i].updateStartValues(previousEndValues);
    }
  }

  _updateEndValues(previousStartValues) {
    for (let i = this._activeAnimationIndex; i > 0; i--) {
      this._animations[i].updateEndValues(previousStartValues);
    }
  }

  _restart() {
    for (let i = this._animations.length-1; i >= 0; i--) {
      this._animations[i].restart();
    }
    const previousEndValues = this._animations[this._activeAnimationIndex].endValues;
    this._updateStartValues(previousEndValues);
    this._activeAnimation = this._animations[0];
    this._activeAnimationIndex = 0;
  }

  _reverseDirection() {
    this._reversing = !this._reversing;
    for (let i = this._animations.length-1; i >= 0; i--) {
      this._animations[i].reverseDirection();
    }
  }

  _reverseEasing() {
    this._reversing = !this._reversing;
    for (let i = this._animations.length - 1; i >= 0; i--) {
      this._animations[i].reverseEasing();
    }
  }

  _onTimelineComplete() {
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