export class Instance {

  canvas: HTMLElement;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId);
  }
}