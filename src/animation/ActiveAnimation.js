class ActiveAnimation {

  constructor(source, destination, options) {
    this._source = source;
    this._destination = destination;
    this._options = options;
    this._isNumber = this.isValidNumber(source, destination);
    this._isColor = OomphMotion.Colors.getColorType(source, destination);
    this._startValues = source;
    this._endValues = destination;
    this._currentValues = this._startValues;
    this._id = Math.random() + Date.now();
    this._endTime = options.duration;
    this._elapsedSinceStart = 0;
    this._complete = false;
    this._totalLoops = 0;
    this._animBackwards = false;
    this.processValues();
  }

  get id() { return this._id; }
  get complete() { return this._complete; }
  get value() { return this._currentValues; }

  isValidNumber(source, destination) {
    return typeof source === 'number' && typeof destination === 'number';
  }

  processValues() {
    if (!this._isNumber && !this._isColor) {
      // Properties of an object instead of a raw number or color
      this._startValues = {};
      for (let key in this._destination) {
        const startValue = this._source[key];
        const endValue = this._destination[key];
        const valueData = this.prepareStartAndEndValue(startValue, endValue);
        this._startValues[key] = {
          value: valueData.start,
          isColor: valueData.isColor,
          colorType: valueData.startColorType,
        };
        this._endValues[key] = {
          value: valueData.end,
          isColor: valueData.isColor,
          colorType: valueData.endColorType,
        };
        this._currentValues[key] = valueData.start;
      }
    } else {
      // Either a raw number or a raw color string
      const valueData = this.prepareStartAndEndValue(this._startValues, this._endValues);
      this._startValues = valueData.start;
      this._endValues = valueData.end;
    }
  }

  prepareStartAndEndValue(startValue, endValue) {
    const startColorType = OomphMotion.Colors.getColorType(startValue);
    const endColorType = OomphMotion.Colors.getColorType(endValue);
    const isColor = startColorType && endColorType;
    if (isColor) {
      startValue = OomphMotion.Colors.convertToRGBA(startValue, startColorType);
      endValue = OomphMotion.Colors.convertToRGBA(endValue, endColorType);
    }

    return {
      start: startValue,
      end: endValue,
      isColor: isColor,
      startColorType: startColorType,
      endColorType: endColorType,
    };
  }

  update(elapsed) {
    this._elapsedSinceStart += elapsed;
    this._progress = Math.min(this._elapsedSinceStart / this._options.duration, 1);
    if (this._animBackwards) {
      this._progress = 1 - this._progress;
    }
    this._easedProgress = OomphMotion.Easing.getEasedPercentageOnCurve(this._options.easing, this._progress);
    if (this._isNumber) {
      this._updateNumberValue();
    } else if (this._isColor) {
      this._updateColorValue();
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
    this._currentValues = this._startValues.value + (this._easedProgress * (this._endValues.value - this._startValues.value));
  }

  _updateColorValue() {
    this._currentValues = OomphMotion.Colors.getColorBetweenRGBA(this._startValues, this._endValues, this._easedProgress);
  }

  _updateObjectValues() {
    for (let key in this._startValues) {
      const newValue = this._startValues.isColor
        ? OomphMotion.Colors.getColorBetweenRGBA(this._startValues[key].value, this._endValues[key].value, this._easedProgress)
        : this._startValues[key].value + (this._easedProgress * (this._endValues[key].value - this._startValues[key].value));
      this._source[key] = newValue;
      this._currentValues[key] = newValue;
    }
  }
}