class OomphMotionCore {

  constructor() {
    this.Easing = new Easing();
    this.defaultEasing = this.Easing.linear;
    this._activeAnimations = [];
    this.defaultDuration = 1000;
    this._requestStartTime = 0;
  }

  /**
   * Start a new animation of properties
   * @param {object} target 
   * @param {object} properties 
   * @param {object} options The following options can be set:
   * duration: Length of the animation in milliseconds
   * easing: Easing curve to use (x1, y1, x2, y2)
   * loop: Play the same animation infinitely
   * alternate: Animate back and forth, with the easing method the same in either direction
   * bounce: Animate back and forth, with the easing method reversed on return
   * onUpdate: Called every time the animation is updated. Passes the ActiveAnimation in the callback
   * onComplete: Called when the animation completes
   */
  start(
    source,
    destination,
    options,
  ) {
    const sourceType = typeof source;
    const destType = typeof destination;
    if (sourceType !== 'object' && sourceType !== 'number') {
      console.error('Animber: Target is neither an object or a number');
      return;
    }
    if (destType !== 'object' && destType !== 'number') {
      console.error('Animber: Destination is neither an object of values, or a number');
      return;
    }
    if (!options.easing) options.easing = this.defaultEasing;
    if (!options.duration) options.duration = this.defaultDuration;
    if (!this._activeAnimations.length) {
      // Start the animation loop if no animations are running
      this._requestStartTime = 0;
      this._startAnimFrame();
    }
    const newAnimation = new ActiveAnimation(source, destination, options);
    this._activeAnimations.push(newAnimation);

    return newAnimation;
  }

  stop(id) {

  }

  pause(id) {

  }

  resume(id) {

  }

  _startAnimFrame() {
    this._stopAnimFrame();
    this._animFrame = requestAnimationFrame(this._onFrame.bind(this));
  }

  _stopAnimFrame() {
    if (this._animFrame) {
      cancelAnimationFrame(this._animFrame);
      this._animFrame = undefined;
    }
  }

  _onFrame(currentTime) {
    const elapsed = currentTime - this._requestStartTime;
    this._requestStartTime = currentTime;
    for (let i = 0; i < this._activeAnimations.length; i++) {
      this._activeAnimations[i].update(elapsed);
    }
    this._checkForCompletedAnimations();
    if (this._activeAnimations.length) {
      this._startAnimFrame();
    } else {
      this._stopAnimFrame();
    }
  }

  _checkForCompletedAnimations() {
    const incompleteAnims = [];
    for (let i = 0; i < this._activeAnimations.length; i++) {
      if (!this._activeAnimations[i].complete) {
        incompleteAnims.push(this._activeAnimations[i]);
      }
    }
    this._activeAnimations = incompleteAnims;
  }
}

window.OomphMotion = new OomphMotionCore();