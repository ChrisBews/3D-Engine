class ActiveAnimation {

  constructor(source, destination, options) {
    this._source = source;
    this._destination = destination;
    this._options = options;
    this._isNumber = typeof source === 'number' && typeof destination === 'number';

    this._startValues = source;
    this._endValues = destination;
    this._currentValues = this._startValues;
    if (!this._isNumber) {
      // Properties of an object instead of a raw number
      this._startValues = {};
      for (let key in destination) {
        this._startValues[key] = source[key];
        this._endValues[key] = destination[key];
        this._currentValues[key] = this._startValues[key];
      }
    }

    this._id = Math.random() + Date.now();
    this._endTime = options.duration;
    this._elapsedSinceStart = 0;
    this._complete = false;
    this._totalLoops = 0;
    this._animBackwards = false;
    console.log('current', this._currentValues);
  }

  get id() { return this._id; }
  get complete() { return this._complete; }
  get value() { return this._currentValues; }

  update(elapsed) {
    this._elapsedSinceStart += elapsed;
    this._progress = Math.min(this._elapsedSinceStart / this._options.duration, 1);
    if (this._animBackwards) {
      this._progress = 1 - this._progress;
    }
    this._easedProgress = OomphMotion.Easing.getEasedPercentageOnCurve(this._options.easing, this._progress);
    if (this._isNumber) {
      this._updateNumberValue();
    } else {
      this._updateObjectValues();
    }
    if (this._options.onUpdate) this._options.onUpdate(this);
    if (this._progress === 1 || (this._progress === 0 && this._animBackwards)) {
      if (this._options.loop) {
        this._totalLoops++;
        this._restart();
      } else if (this._options.alternate) {
        this._reverseDirection();
      } else if (this._options.bounce) {
        this._reverseEasing();
      } else {
        this._complete = true;
        if (this._options.onComplete) this._options.onComplete();
      }
    }
  }

  _restart() {
    this._progress = 0;
    this._easedProgress = 0;
    this._elapsedSinceStart = 0;
  }

  _reverseDirection() {
    this._restart();
    const newStartValues = this._endValues;
    this._endValues = this._startValues;
    this._startValues = newStartValues;
  }

  _reverseEasing() {
    this._restart();
    this._animBackwards = !this._animBackwards;
  }

  _updateNumberValue() {
    this._currentValues = this._startValues + (this._easedProgress * (this._endValues - this._startValues));
  }

  _updateObjectValues() {
    for (let key in this._startValues) {
      const newValue = this._startValues[key] + (this._easedProgress * (this._endValues[key] - this._startValues[key]));
      this._source[key] = newValue;
      this._currentValues[key] = newValue;
    }
  }
}