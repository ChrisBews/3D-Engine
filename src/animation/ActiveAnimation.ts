import { convertToRGBA, getColorBetweenRGBA } from '../utils/colorUtils';
import { getEasedPercentageOnCurve } from '../utils/animationUtils';

export class ActiveAnimation implements IActiveAnimation {

  private _source: animationValue;
  private _destination: animationValue;
  private _options: animationOptions;
  private _info: animationInfo;
  private _startValues: animationValue;
  private _endValues: animationValue;
  private _currentValues: animationValue;
  private _id: number;
  private _endTime: number;
  private _elapsedSinceStart: number = 0;
  private _waitingForDelay: boolean = false;
  private _complete: boolean = false;
  private _loopCount: number = 0;
  private _totalLoops: number = 0;
  private _animBackwards: boolean = false;
  private _paused: boolean = false;
  private _elapsedWhenPaused: number = 0;
  private _progress: number = 0;
  private _easedProgress: number = 0;

  constructor(source, destination, options: animationOptions, info: animationInfo) {
    this._source = source;
    this._destination = destination;
    this._options = options;
    this._info = info;
    this._startValues = source;
    this._endValues = destination;
    this._currentValues = this._startValues;
    this._id = Math.random() + Date.now();
    this._endTime = options.duration;
    this._waitingForDelay = !!this._options.delay;
    this._totalLoops = (typeof options.loops  === 'number') ? options.loops : undefined;
    this._processValues();
  }

  get id(): number { return this._id; }
  get complete(): boolean { return this._complete; }
  get value(): animationValue { return this._currentValues; }
  get paused(): boolean { return this._paused; }
  get startValues(): animationValue { return this._startValues; }
  get endValues(): animationValue { return this._endValues; }

  public stop() {
    this._animBackwards = false;
    this.reset();
  }

  public pause() {
    if (!this._paused) {
      this._paused = true;
      this._elapsedWhenPaused = this._elapsedSinceStart;
    }
  }

  public resume() {
    if (this._paused) {
      this._paused = false;
      // Resume at the correct progress
      this._elapsedSinceStart = this._elapsedWhenPaused;
    }
  }

  public reset() {
    this.restart();
    this.update(0);
  }

  public updateStartValues(values)  {
    if (!this._info.isNumber && !this._info.isColor && !this._info.isNumberArray) {
      // Properties of an object instead of a raw number or color
      for (let key in values) {

        if (this._startValues[key]) {
          this._startValues[key] = values[key];
        }
      }
    } else {
      this._startValues = values;
    }
  }

  public updateEndValues(values) {
    if (!this._info.isNumber && !this._info.isColor && !this._info.isNumberArray) {
      // Properties of an object instead of a raw number or color
      for (let key in values) {

        if (this._endValues[key]) {
          this._endValues[key] = values[key];
        }
      }
    } else {
      this._endValues = values;
    }
  }

  private _processValues() {
    if (!this._info.isNumber && !this._info.isColor && !this._info.isNumberArray) {
      // Properties of an object instead of a raw number or color
      this._startValues = {};
      for (let key: string in <Object>this._destination) {
        const startValue: number | string = this._source[key];
        const endValue: number | string = this._destination[key];
        const valueData = this._prepareStartAndEndValue(startValue, endValue);
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
      const valueData = this._prepareStartAndEndValue(this._startValues, this._endValues);
      this._startValues = valueData.start;
      this._endValues = valueData.end;
    }
  }

  private _prepareStartAndEndValue(startValue, endValue): processedAnimationData {
    const isColor: boolean = (this._info.sourceColorType >= 0 && this._info.destColorType >= 0);
    if (isColor) {
      startValue = convertToRGBA(startValue, startValue.colorType);
      endValue = convertToRGBA(endValue, endValue.colorType);
    }

    return {
      start: startValue,
      end: endValue,
      isColor,
      startColorType: this._info.sourceColorType,
      endColorType: this._info.destColorType,
    };
  }

  public update(elapsed: number) {
    this._elapsedSinceStart += elapsed;
    if (this._waitingForDelay) {
      if (this._options.delay && this._elapsedSinceStart < this._options.delay) {
        return;
      }
      this._elapsedSinceStart -= this._options.delay;
      this._waitingForDelay = false;
    }
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
      this._easedProgress = getEasedPercentageOnCurve(this._options.easing, this._progress);
      if (this._info.isNumber) {
        this._updateNumberValue();
      } else if (this._info.isColor) {
        this._updateColorValue();
      } else if (this._info.isNumberArray) {
        this._updateNumberArrayValue();
      } else {
        this._updateObjectValues();
      }
      if (this._options.onUpdate) this._options.onUpdate({
        id: this._id,
        source: this._source,
        value: this._currentValues,
        progress: this._progress,
      });
      if ((this._progress === 1 && !this._animBackwards) || (this._progress === 0 && this._animBackwards)) {
        if (this._options.loops) {
          this._loopCount++;
          if (this._totalLoops && this._loopCount >= this._totalLoops) {
            this._complete = true;
            if (this._options.onComplete) this._options.onComplete();
          } else {
            this.restart();
          }
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
  }

  private restart() {
    this._complete = false;
    this._progress = 0;
    this._easedProgress = 0;
    this._elapsedSinceStart = 0;
  }

  private _reverseDirection() {
    this.restart();
    const newStartValues = this._endValues;
    this._endValues = this._startValues;
    this._startValues = newStartValues;
  }

  private _reverseEasing() {
    this.restart();
    this._animBackwards = !this._animBackwards;
  }

  private _updateNumberValue() {
    this._currentValues = this._startValues.value + (this._easedProgress * (this._endValues.value - this._startValues.value));
  }

  private _updateColorValue() {
    this._currentValues = getColorBetweenRGBA(this._startValues, this._endValues, this._easedProgress);
  }

  private _updateNumberArrayValue() {
    this._currentValues = [];
    for (let i: number = 0; i < this._endValues.length; i++) {
      this._currentValues.push(this._startValues[i] + (this._easedProgress * (this._endValues[i] - this._startValues[i])));
    }
  }

  private _updateObjectValues() {
    for (let key in <Object>this._endValues) {
      let newValue;
      if (this._startValues[key].isColor) {
        newValue = getColorBetweenRGBA(this._startValues[key].value, this._endValues[key].value, this._easedProgress);
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
