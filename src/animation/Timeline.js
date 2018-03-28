class Timeline {

  constructor(source, animations, options) {
    this._source = source;
    this._animations = animations;
    this._options = options || {};
    this._activeAnimation = animations[0];
    this._activeAnimationIndex = 0;
    this._complete = false;
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
      if (this._activeAnimationIndex < this._animations.length-1) {
        this._activeAnimationIndex++;
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

  _onTimelineComplete() {
    this._complete = true;
    if (this._options.onComplete) this._options.onComplete();
  }
}