class ActiveAnimation {

  constructor(source, destination, options, stats) {
    this._source = source;
    this._destination = destination;
    this._options = options;
    this._isNumber = stats.isNumber;
    this._isColor = stats.sourceColorType && stats.destColorType;
    this._isNumberArray = stats.isNumberArray;
    this._sourceColorType = stats.sourceColorType;
    this._destColorType = stats.destColorType;
    this._startValues = source;
    this._endValues = destination;
    this._currentValues = this._startValues;
    this._id = Math.random() + Date.now();
    this._endTime = options.duration;
    this._elapsedSinceStart = 0;
    this._complete = false;
    this._totalLoops = 0;
    this._animBackwards = false;
    this._paused = false;
    this._elapsedWhenPaused = 0;
    this.processValues();
  }

  get id() { return this._id; }
  get complete() { return this._complete; }
  get value() { return this._currentValues; }
  get paused() { return this._paused; }

  stop() {
    this._animBackwards = false;
    this.reset();
  }

  pause() {
    if (!this._paused) {
      this._paused = true;
      this._elapsedWhenPaused = this._elapsedSinceStart;
    }
  }

  resume() {
    if (this._paused) {
      this._paused = false;
      // Resume at the correct progress
      this._elapsedSinceStart = this._elapsedWhenPaused;
    }
  }

  reset() {
    this._restart();
    this.update(0);
  }

  processValues() {
    if (!this._isNumber && !this._isColor && !this._isNumberArray) {
      // Properties of an object instead of a raw number or color
      this._startValues = {};
      for (let key in this._destination) {
        const startValue = this._source[key];
        const endValue = this._destination[key];
        const valueData = this.prepareStartAndEndValue(startValue, endValue);
        this._startValues[key] = {
          value: valueData.start,
          isNumberArray: Array.isArray(valueData.start),
          isColor: valueData.isColor,
          colorType: valueData.startColorType,
        };
        this._endValues[key] = {
          value: valueData.end,
          isNumberArray: Array.isArray(valueData.end),
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
    const isColor = this._sourceColorType && this._destColorType;
    if (isColor) {
      startValue = OomphMotion.Colors.convertToRGBA(startValue, startColorType);
      endValue = OomphMotion.Colors.convertToRGBA(endValue, endColorType);
    }

    return {
      start: startValue,
      end: endValue,
      isColor: isColor,
      startColorType: this._sourceColorType,
      endColorType: this._destColorType,
    };
  }

  update(elapsed) {
    this._elapsedSinceStart += elapsed;
    if (!this._paused) {
      if (this._options.steps) {
        const stepDuration = (this._options.duration / (this._options.steps-1));
        let currentStep = Math.floor(this._elapsedSinceStart / stepDuration);
        if (this._animBackwards) {
          currentStep = (this._options.steps-1) - currentStep;
        }
        this._progress = currentStep / (this._options.steps-1);
      } else {
        this._progress = Math.min(this._elapsedSinceStart / this._options.duration, 1);
        if (this._animBackwards) this._progress = 1 - this._progress;
      }
      if (this._progress > 1) {
        this._progress = 1;
      } else if (this._progress < 0) {
        this._progress = 0;
      }
      this._easedProgress = OomphMotion.Easing.getEasedPercentageOnCurve(this._options.easing, this._progress);
      if (this._isNumber) {
        this._updateNumberValue();
      } else if (this._isColor) {
        this._updateColorValue();
      } else if (this._isNumberArray) {
        this._updateNumberArrayValue();
      } else {
        this._updateObjectValues();
      }
      if (this._options.onUpdate) this._options.onUpdate(this);
      if ((this._progress === 1 && !this._animBackwards) || (this._progress === 0 && this._animBackwards)) {
        if (this._options.loop) {
          this._totalLoops++;
          this._restart();
        } else if (this._options.alternate) {
          this.reverseDirection();
        } else if (this._options.bounce) {
          this._reverseEasing();
        } else {
          this._complete = true;
          if (this._options.onComplete) this._options.onComplete();
        }
      }
    }
  }

  _restart() {
    this._complete = false;
    this._progress = 0;
    this._easedProgress = 0;
    this._elapsedSinceStart = 0;
  }

  reverseDirection() {
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

  _updateNumberArrayValue() {
    this._currentValues = [];
    for (let i = 0; i < this._endValues.length; i++) {
      this._currentValues.push(this._startValues[i] + (this._easedProgress * (this._endValues[i] - this._startValues[i])));
    }
  }

  _updateObjectValues() {
    for (let key in this._endValues) {
      let newValue;
      if (this._startValues[key].isColor) {
        newValue = OomphMotion.Colors.getColorBetweenRGBA(this._startValues[key].value, this._endValues[key].value, this._easedProgress);
      } else if (this._startValues[key].isNumberArray) {
        newValue = [];
        for (let i = 0; i < this._endValues[key].value.length; i++) {
          newValue.push(this._startValues[key].value[i] + (this._easedProgress * (this._endValues[key].value[i] - this._startValues[key].value[i])));
        }
      } else {
        newValue = this._startValues[key].value + (this._easedProgress * (this._endValues[key].value - this._startValues[key].value));
      }
      this._source[key] = newValue;
      this._currentValues[key] = newValue;
    }
  }
}
