class AnimberCore {

  constructor() {
    this.activeAnimations = [];
    this.Easing = new Easing();
    this.defaultEasing = this.Easing.default;
    this.defaultDuration = 1000;
    this._requestStartTime = 0;
  }

  /**
   * Start a new animation of properties
   * @param {object} target 
   * @param {object} properties 
   * @param {object} options 
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
    if (!this.activeAnimations.length) {
      // Start the animation loop if no animations are running
      this._requestStartTime = 0;
      this._startAnimFrame();
    }
    const newAnimation = new ActiveAnimation(source, destination, options);
    this.activeAnimations.push(newAnimation);

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
    for (let i = 0; i < this.activeAnimations.length; i++) {
      this.activeAnimations[i].update(elapsed);
    }
    this._checkForCompletedAnimations();
    this._startAnimFrame();
  }

  _checkForCompletedAnimations() {
    const incompleteAnims = [];
    for (let i = 0; i < this.activeAnimations.length; i++) {
      if (!this.activeAnimations[i].complete) {
        incompleteAnims.push(this.activeAnimations[i]);
      }
    }
    this.activeAnimations = incompleteAnims;
  }
}

window.Animber = new AnimberCore();