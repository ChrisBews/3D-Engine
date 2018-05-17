import { convertToRGBA, getColorBetweenRGBA, getColorType } from '../utils/colorUtils';
import { getEasedPercentageOnCurve } from '../utils/animationUtils';

export class ActiveAnimation implements IActiveAnimation {

  private _source: animationValue;
  private _destination: animationValue;
  private _options: animationOptions;
  private _info: animationInfo;
  private _startValues: any;
  private _endValues: any;
  private _currentValues: any;
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
  get source(): animationValue { return this._source; }
  get currentValue(): animationValue { return this._currentValues; }
  get progress(): number { return this._progress; }

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
      for (const key in values) {
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
      for (const key in values) {
        if (this._endValues[key]) {
          this._endValues[key] = values[key];
        }
      }
    } else {
      this._endValues = values;
    }
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
        const stepDuration = (this._options.duration / (this._options.steps - 1));
        let currentStep = Math.floor(this._elapsedSinceStart / stepDuration);
        if (this._animBackwards) {
          currentStep = (this._options.steps - 1) - currentStep;
        }
        this._progress = currentStep / (this._options.steps - 1);
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
          this.reverseDirection();
        } else if (this._options.bounce) {
          this.reverseEasing();
        } else {
          this._complete = true;
          if (this._options.onComplete) this._options.onComplete();
        }
      }
    }
  }

  public restart() {
    this._complete = false;
    this._progress = 0;
    this._easedProgress = 0;
    this._elapsedSinceStart = 0;
  }

  public reverseEasing() {
    this.restart();
    this._animBackwards = !this._animBackwards;
  }

  public reverseDirection() {
    this.restart();
    const newStartValues = this._endValues;
    this._endValues = this._startValues;
    this._startValues = newStartValues;
  }

  private _processValues() {
    if (!this._info.isNumber && !this._info.isColor && !this._info.isNumberArray) {
      // Properties of an object instead of a raw number or color
      this._startValues = {};
      Object.keys(this._destination).forEach(key => {
        const startValue: number | string = this._source[key];
        const endValue: number | string = this._destination[key];
        const valueData: processedAnimationData = this._prepareStartAndEndValue(startValue, endValue);
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
      });
    } else {
      // Either a raw number or a raw color string
      const valueData: processedAnimationData = this._prepareStartAndEndValue(this._startValues, this._endValues);
      this._startValues = valueData.start;
      this._endValues = valueData.end;
    }
  }

  private _prepareStartAndEndValue(startValue, endValue): processedAnimationData {
    const isColor: boolean = (this._info.sourceColorType >= 0 && this._info.destColorType >= 0);
    if (isColor) {
      const startType = getColorType(startValue);
      const endType = getColorType(endValue);
      startValue = convertToRGBA(startValue, startType);
      endValue = convertToRGBA(endValue, endType);
    }

    return {
      start: startValue,
      end: endValue,
      isColor,
      startColorType: this._info.sourceColorType,
      endColorType: this._info.destColorType,
    };
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
    Object.keys(this._endValues).forEach(key => {
      let newValue;
      if (this._startValues[key].isColor) {
        newValue = getColorBetweenRGBA(this._startValues[key].value, this._endValues[key].value, this._easedProgress);
      } else if (this._startValues[key].isNumberArray) {
        newValue = [];
        for (let i = 0; i < this._endValues[key].value.length; i++) {
          newValue.push(this._startValues[key].value[i] + (this._easedProgress * (this._endValues[key].value[i] - this._startValues[key].value[i])));
        }
      } else {
        // If the value itself is an object, update each key of that value separately
        if (typeof this._endValues[key].value === 'object') {
          newValue = {};
          Object.keys(this._endValues[key].value).forEach(subKey => {
            newValue[subKey] = this._startValues[key].value[subKey] + (this._easedProgress * (this._endValues[key].value[subKey] - this._startValues[key].value[subKey]));
          });
        } else {
          newValue = this._startValues[key].value + (this._easedProgress * (this._endValues[key].value - this._startValues[key].value));
        }
      }
      this._source[key] = newValue;
      this._currentValues[key] = newValue;
    });
  }
}
