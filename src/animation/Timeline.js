class Timeline {

  constructor(source, animations, options) {
    this._source = source;
    this._animations = animations;
    this._options = options || {};
    this._activeAnimation = animations[0];
    this._activeAnimationIndex = 0;
    this._complete = false;
    this._reversing = false;
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
        this._activeAnimationIndex++;
        this._activeAnimation = this._animations[this._activeAnimationIndex];
      } else if (this._reversing && this._activeAnimationIndex > 0) {
        this._activeAnimationIndex--;
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

  _reset() {
    for (let i = this._animations.length-1; i >= 0; i--) {
      this._animations[i].reset();
    }
    this._activeAnimation = this._animations[0];
    this._activeAnimationIndex = 0;
  }

  _reverseDirection() {
    this._reversing = !this._reversing;
    for (let i = this._animations.length-1; i >= 0; i--) {
      this._animations[i].reverseDirection();
    }
  }

  _onTimelineComplete() {
    if (this._options.loop) {
      this._reset();
    } else if (this._options.alternate) {
      this._reverseDirection();
    } else if (this._options.bounce) {

    } else if (this._options.onComplete) {
      this._complete = true;
      this._options.onComplete();
    }
  }
}