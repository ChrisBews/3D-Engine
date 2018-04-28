import { Scene } from './Scene';

export class Instance {

  private canvas: HTMLElement;
  private activeScene: IScene;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId);
  }

  set scene(scene: IScene) {
    if (!(scene instanceof Scene)) {
      throw new Error('Cannot set scene, as it is not a valid Scene reference');
    }
    this.activeScene = scene;
  }
}