export const getBezierObject = (easing: any): easingObject => {
  const easingType: string = typeof easing;
  if (easingType === 'string') {
    // String passed in
    if (this[easing] && this[easing].x1) {
      return this[easing];
    } else if (easing.search('cubic-bezier(') > -1) {
      return this.parseCubicBezierString();
    } else {
      throw new Error('getBezierObject: Invalid easing function');
    }
  } else if (easingType === 'object' && easing.x1 && easing.x2 && easing.t1 && easing.t2) {
    // Valid easing object
    return easing;
  } else {
    throw new Error('getBezierObject: Invalid easing function');
  }
};

export const parseCubicBezierString = (bezierString: string): easingObject => {
  const easingObject: easingObject = {x1: 0, x2: 0, t1: 0, t2: 0};
  const bezierArray: string[] = bezierString.substring(
    bezierString.indexOf('(') + 1,
    bezierString.indexOf(')') - 1
  ).split(',');
  easingObject.x1 = parseFloat(bezierArray[0]);
  easingObject.x2 = parseFloat(bezierArray[1]);
  easingObject.t1 = parseFloat(bezierArray[2]);
  easingObject.t2 = parseFloat(bezierArray[3]);

  return easingObject;
};

export const getEasedPercentageOnCurve = (bezierObject: easingObject, percentage: number) => {
  // If the ease is linear, return the percentage as is
  if (bezierObject.x1 === bezierObject.t1 && bezierObject.x2 === bezierObject.t2) return percentage;
  return this.calculateBezier(this.getPositionOnCurve(bezierObject, percentage), bezierObject.t1, bezierObject.t2);
};

export const getPositionOnCurve = (bezierObject: easingObject, percentage: number) => {
  // Newton method of guessing the position through iterations
  let bezierGuess: number = percentage;
  let currentBezierSlope: number = 0;
  let currentBezierX: number = 0;
  const iterations: number = 30;
  for (let i: number = 0; i < iterations; i++) {
    currentBezierSlope = this.getBezierSlope(bezierGuess, bezierObject.x1, bezierObject.x2);
    if (currentBezierSlope === 0.0) return bezierGuess;
    currentBezierX = this.calculateBezier(bezierGuess, bezierObject.x1, bezierObject.x2) - percentage;
    bezierGuess -= currentBezierX / currentBezierSlope;
  }
  return bezierGuess;
};

export const getBezierSlope = (guess: number, start: number, end: number): number => {
  return 3.0 * (1.0 - 3.0 * end + 3.0 * start) * guess * guess
    + 2.0 * (3.0 * end - 6.0 * start) * guess
    + 3.0 * start;
};

export const calculateBezier = (guess: number, start: number, end: number): number => {
  return (((1.0 - 3.0 * end + 3.0 * start) * guess
    + (3.0 * end - 6.0 * start)) * guess
    + (3.0 * start)) * guess;
};
