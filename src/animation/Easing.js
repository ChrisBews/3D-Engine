class Easing {

  constructor() {
    // Predefined easing objects
    this.linear = {x1: 0, t1: 0, x2: 1, t2: 1};
    this.inSine = {x1: 0.47, t1: 0.0, x2: 0.745, t2: 0.715};
    this.outSine = {x1: 0.39, t1: 0.575, x2: 0.565, t2: 1};
    this.inOutSine = {x1: 0.445, t1: 0.05, x2: 0.55, t2: 0.95};
    this.inQuad = {x1: 0.55, t1: 0.085, x2: 0.68, t2: 0.53};
    this.outQuad = {x1: 0.25, t1: 0.46, x2: 0.45, t2: 0.94};
    this.inOutQuad = {x1: 0.455, t1: 0.03, x2: 0.515, t2: 0.955};
    this.inCubic = {x1: 0.55, t1: 0.055, x2: 0.675, t2: 0.19};
    this.outCubic = {x1: 0.215, t1: 0.61, x2: 0.355, t2: 1};
    this.inOutCubic = {x1: 0.645, t1: 0.045, x2: 0.355, t2: 1};
    this.inQuart = {x1: 0.895, t1: 0.03, x2: 0.685, t2: 0.22};
    this.outQuart = {x1: 0.165, t1: 0.84, x2: 0.44, t2: 1};
    this.inOutQuart = {x1: 0.77, t1: 0, x2: 0.175, t2: 1};
    this.inQuint = {x1: 0.755, t1: 0.05, x2: 0.855, t2: 0.06};
    this.outQuint = {x1: 0.23, t1: 1, x2: 0.32, t2: 1};
    this.inOutQuint = {x1: 0.86, t1: 0, x2: 0.07, t2: 1};
    this.inExpo = {x1: 0.95, t1: 0.05, x2: 0.795, t2: 0.035};
    this.outExpo = {x1: 0.19, t1: 1, x2: 0.22, t2: 1};
    this.inOutExpo = {x1: 1, t1: 0, x2: 0, t2: 1};
    this.inCirc = {x1: 0.6, t1: 0.04, x2: 0.98, t2: 0.335};
    this.outCirc = {x1: 0.075, t1: 0.82, x2: 0.165, t2: 1};
    this.inOutCirc = {x1: 0.785, t1: 0.135, x2: 0.15, t2: 0.86};
    this.inBack = {x1: 0.6, t1: -0.28, x2: 0.735, t2: 0.045};
    this.outBack = {x1: 0.175, t1: 0.885, x2: 0.32, t2: 1.275};
    this.inOutBack = {x1: 0.68, t1: -0.55, x2: 0.265, t2: 1.55};
  }

  getBezierObject(easing) {
    const easingType = typeof easing;
    if (easingType === 'string') {
      // String passed in
      if (this[easing] && this[easing].x1) {
        return this[easing];
      } else if (easing.search('cubic-bezier(') > -1) {
        return this.parseCubicBezierString();
      } else {
        console.warn('Animber: Invalid easing function');
        return undefined;
      }
    } else if (easingType === 'object' && easing.x1 && easing.x2 && easing.t1 && easing.t2) {
      // Valid easing object
      return easing;
    } else {
      console.error('Animber: Invalid easing function');
      return undefined;
    }
  }

  parseCubicBezierString(bezierString) {
    const easingObject = {};
    bezierString = bezierString.substring(
      bezierString.indexOf('('),
      bezierString.substring(')')
    ).split(',');
    easingObject.x1 = parseFloat(bezierString[0]);
    easingObject.x2 = parseFloat(bezierString[1]);
    easingObject.t1 = parseFloat(bezierString[2]);
    easingObject.t2 = parseFloat(bezierString[3]);

    return easingObject;
  }

  getEasedPercentageOnCurve(bezierObject, percentage) {
    // If the ease is linear, return the percentage as is
    if (bezierObject.x1 === bezierObject.t1 && bezierObject.x2 === bezierObject.t2) return percentage;
    return this.calculateBezier(this.getPositionOnCurve(bezierObject, percentage), bezierObject.t1, bezierObject.t2);
  }

  getPositionOnCurve(bezierObject, percentage) {
    // Newton method of guessing the position through iterations
    var bezierGuess = percentage, i = 0, currentBezierSlope = 0, currentBezierX = 0;
    const iterations = 30;
    for (; i < iterations; i++) {
      currentBezierSlope = this.getBezierSlope(bezierGuess, bezierObject.x1, bezierObject.x2);
      if (currentBezierSlope == 0.0) return bezierGuess;
      currentBezierX = this.calculateBezier(bezierGuess, bezierObject.x1, bezierObject.x2) - percentage;
      bezierGuess -= currentBezierX / currentBezierSlope;
    }
    return bezierGuess;
  }

  getBezierSlope(guess, start, end) {
    return 3.0 * (1.0 - 3.0 * end + 3.0 * start) * guess * guess
      + 2.0 * (3.0 * end - 6.0 * start) * guess
      + 3.0 * start;
  }

  calculateBezier(guess, start, end) {
    return (((1.0 - 3.0 * end + 3.0 * start) * guess
      + (3.0 * end - 6.0 * start)) * guess
      + (3.0 * start)) * guess;
  }
}