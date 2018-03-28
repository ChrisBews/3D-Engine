class OomphMotionCore {

  constructor() {
    this.Easing = new Easing();
    this.Colors = new Colors();
    this.defaultEasing = this.Easing.linear;
    this.defaultDuration = 1000;
    this._requestStartTime = 0;
    this._activeAnimations = [];
    this._outputColorsAsArrays = false;
  }

  get outputColorsAsArrays() { return this._outputColorsAsArrays; }
  set outputColorsAsArrays(value) {
    this._outputColorsAsArrays = value;
  }

  /**
   * Start a new animation of properties
   * @param {object} target 
   * @param {object} options The following options can be set:
   * to: Number, color, array of numbers, or object with values to animate towards
   * duration: Length of the animation in milliseconds
   * easing: Easing curve to use (x1, y1, x2, y2)
   * loop: Play the same animation infinitely
   * alternate: Animate back and forth, with the easing method the same in either direction
   * bounce: Animate back and forth, with the easing method reversed on return
   * steps: Jump between the passed number of steps instead of a smooth progression
   * onUpdate: Called every time the animation is updated. Passes the ActiveAnimation in the callback
   * onComplete: Called when the animation completes
   */
  start(
    source,
    options,
  ) {
    if (!options.to) {
      console.error(`OomphMotion: No value for 'to' has been set`);
      return;
    }
    const newAnimation = this._createAnimation(source, options);

    if (newAnimation) {
      this._activeAnimations.push(newAnimation);

      return newAnimation.id;
    } else {
      return;
    }
  }

  stop(id) {
    let remainingAnimations = [];
    for (let i = 0; i < this._activeAnimations.length; i++) {
      if (this._activeAnimations[i].id === id || !id) {
        this._activeAnimations[i].stop();
      } else {
        remainingAnimations.push(this._activeAnimations[i]);
      }
    }
    this._activeAnimations = remainingAnimations;
  }

  timeline(source, animations, options) {
    const newAnimations = [];
    for (let i = 0; i < animations.length; i++) {
      animations[i].loop = false;
      const newAnimation = this._createAnimation(source, animations[i]);
      newAnimations.push(newAnimation);
    }
    this._activeAnimations.push(new Timeline(source, newAnimations, options));
  }

  pause(id) {
    for (let i = 0; i < this._activeAnimations.length; i++) {
      if (this._activeAnimations[i].id === id || !id) {
        this._activeAnimations[i].pause();
      }
    }
  }

  resume(id) {
    for (let i = 0; i < this._activeAnimations.length; i++) {
      if (this._activeAnimations[i].id === id || !id) {
        this._activeAnimations[i].resume();
      }
    }
  }

  _createAnimation(source, options) {
    const destination = options.to;
    const sourceType = typeof source;
    const destType = typeof destination;
    const sourceIsNumber = sourceType === 'number';
    const sourceColorType = OomphMotion.Colors.getColorType(source);
    const sourceIsNumberArray = this._isNumberArray(source);
    if (sourceType !== 'object' && !sourceIsNumber
      && !sourceIsNumberArray && !sourceColorType) {
      console.error('OomphMotion: Start value is neither an object of values, a color, a number, or an array of numbers');
      return;
    }
    const destIsNumber = destType === 'number';
    const destColorType = OomphMotion.Colors.getColorType(destination);
    const destIsNumberArray = this._isNumberArray(destination);
    if (destType !== 'object' && !destIsNumber
      && !destIsNumberArray && !destColorType) {
      console.error('OomphMotion: End value is neither an object of values, a color, a number, or an array of numbers');
      return;
    }
    if (sourceType !== destType || sourceIsNumberArray !== destIsNumberArray) {
      console.error(`OomphMotion: Start and end values don't match.`);
      return;
    }

    const stats = {};
    if (!options.easing) options.easing = this.defaultEasing;
    if (!options.duration) options.duration = this.defaultDuration;
    if (sourceIsNumber && destIsNumber) stats.isNumber = true;
    if (sourceColorType) stats.sourceColorType = sourceColorType;
    if (destColorType) stats.destColorType = destColorType;
    if (sourceIsNumberArray && destIsNumberArray) stats.isNumberArray = true;

    if (!this._activeAnimations.length) {
      // Start the animation loop if no animations are running
      this._requestStartTime = 0;
      this._startAnimFrame();
    }

    return new ActiveAnimation(source, destination, options, stats);
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

  _isNumberArray(value) {
    const isArray = Array.isArray(value);
    if (!isArray) return false;
    for (let i = 0; i < value.length; i++) {
      if (typeof value[i] !== 'number') return false;
    }
    
    return true;
  }

  _onFrame(currentTime) {
    const elapsed = (!this._requestStartTime) ? 0 : currentTime - this._requestStartTime;
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