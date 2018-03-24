class Easing {

  get default() { return this.linear; }
  get linear() { return {x1: 0.00, t1: 0.0, x2: 1.00, t2: 1.0}; }
  get inSine() { return {x1: 0.47, t1: 0.0, x2: 0.745, t2: 0.715}; }
  get outSine() { return {x1: 0.39, t1: 0.575, x2: 0.565, t2: 1}; }
  get inOutSine() { return {x1: 0.445, t1: 0.05, x2: 0.55, t2: 0.95}; }
  get inQuad() { return {x1: 0.55, t1: 0.085, x2: 0.68, t2: 0.53}; }
  get outQuad() { return {x1: 0.25, t1: 0.46, x2: 0.45, t2: 0.94}; }
  get inOutQuad() { return {x1: 0.455, t1: 0.03, x2: 0.515, t2: 0.955}; }
  get inCubic() { return {x1: 0.55, t1: 0.055, x2: 0.675, t2: 0.19}; }
  get outCubic() { return {x1: 0.215, t1: 0.61, x2: 0.355, t2: 1}; }
  get inOutCubic() { return {x1: 0.645, t1: 0.045, x2: 0.355, t2: 1}; }
  get inQuart() { return {x1: 0.895, t1: 0.03, x2: 0.685, t2: 0.22}; }
  get outQuart() { return {x1: 0.165, t1: 0.84, x2: 0.44, t2: 1}; }
  get inOutQuart() { return {x1: 0.77, t1: 0, x2: 0.175, t2: 1}; }
  get inQuint() { return {x1: 0.755, t1: 0.05, x2: 0.855, t2: 0.06}; }
  get outQuint() { return {x1: 0.23, t1: 1, x2: 0.32, t2: 1}; }
  get inOutQuint() { return {x1: 0.86, t1: 0, x2: 0.07, t2: 1}; }
  get inExpo() { return {x1: 0.95, t1: 0.05, x2: 0.795, t2: 0.035}; }
  get outExpo() { return {x1: 0.19, t1: 1, x2: 0.22, t2: 1}; }
  get inOutExpo() { return {x1: 1, t1: 0, x2: 0, t2: 1}; }
  get inCirc() { return {x1: 0.6, t1: 0.04, x2: 0.98, t2: 0.335}; }
  get outCirc() { return {x1: 0.075, t1: 0.82, x2: 0.165, t2: 1}; }
  get inOutCirc() { return {x1: 0.785, t1: 0.135, x2: 0.15, t2: 0.86}; }
  get inBack() { return {x1: 0.6, t1: -0.28, x2: 0.735, t2: 0.045}; }
  get outBack() { return {x1: 0.175, t1: 0.885, x2: 0.32, t2: 1.275}; }
  get inOutBack() { return {x1: 0.68, t1: -0.55, x2: 0.265, t2: 1.55}; }

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

  reverseBezierCurve(bezierObject) {
    const point1 = this.halfUnitTurn(bezierObject.x1, bezierObject.t1);
    const point2 = this.halfUnitTurn(bezierObject.x2, bezierObject.t2);
    return {
      x1: point1.x,
      t1: point1.y,
      x2: point2.x,
      t2: point2.y,
    };
  }

  halfUnitTurn(x, y) {
    return {
      x: 0.5 - (x - 0.5),
      y: 0.5 - (y - 0.5),
    };
  }

  getEasedPercentageOnCurve(bezierObject, percentage) {
    // If the ease is linear, return the percentage as is
    if (bezierObject.x1 === bezierObject.t1 && bezierObject.x2 === bezierObject.t2) return percentage;
    return this.positionOnBezierCurve(bezierObject.t1, bezierObject.t2, percentage);
  }

  positionOnBezierCurve(x1, x2, percentage) {
    const squaredPercentage = percentage * percentage;
    const cubedPercentage = squaredPercentage * percentage;
    return (3 * x1 + percentage * (-6 * x1 + x1 * 3 * percentage)) * percentage
    + (x2 * 3 - x2 * 3 * percentage) * squaredPercentage
    + cubedPercentage;
  }
}