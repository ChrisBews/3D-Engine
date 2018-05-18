type easingObject = {
  x1: number;
  x2: number;
  t1: number;
  t2: number;
};

interface IEasingMethods {
  linear: easingObject;
  inSine: easingObject;
  outSine: easingObject;
  inOutSine: easingObject;
  inQuad: easingObject;
  outQuad: easingObject;
  inOutQuad: easingObject;
  inCubic: easingObject;
  outCubic: easingObject;
  inOutCubic: easingObject;
  inQuart: easingObject;
  outQuart: easingObject;
  inOutQuart: easingObject;
  inQuint: easingObject;
  outQuint: easingObject;
  inOutQuint: easingObject;
  inExpo: easingObject;
  outExpo: easingObject;
  inOutExpo: easingObject;
  inCirc: easingObject;
  outCirc: easingObject;
  inOutCirc: easingObject;
  inBack: easingObject;
  outBack: easingObject;
  inOutBack: easingObject;
}

type MotionOptions = {
  to: animationValue;

};

type animationValue = object | string | number;

type animationInfo = {
  isNumber: boolean;
  sourceColorType: number;
  destColorType: number;
  isNumberArray: boolean;
  isColor: boolean;
};

interface processedAnimationData {
  start: number | string;
  end: number | string;
  isColor?: boolean;
  startColorType?: number;
  endColorType?: number;
}

interface singleAnimationData {
  value: animationValue;
  isNumberArray: boolean;
  isColor: boolean;
  colorType: number;
}

type animationOptions = {
  duration?: number;
  easing?: easingObject;
  delay?: number;
  loops?: number;
  steps?: number;
  alternate?: boolean;
  bounce?: boolean;
  onUpdate?: (data: animationProgressData) => void;
  onComplete?: () => void;
};

type animationProgressData = {
  id: number;
  source: animationValue;
  value: animationValue;
  progress: number;
};

interface IAnimator {
  id: number;
  complete: boolean;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  update: (elapsed: number) => void;
}

interface IActiveAnimation extends IAnimator {
  value: animationValue;
  paused: boolean;
  startValues: animationValue;
  endValues: animationValue;
  source: animationValue;
  currentValue: animationValue;
  progress: number;
  restart: () => void;
  reverseEasing: () => void;
  reverseDirection: () => void;
  updateStartValues: (values: animationValue) => void;
  updateEndValues: (values: animationValue) => void;
}

interface ITimeline extends IAnimator {

}
