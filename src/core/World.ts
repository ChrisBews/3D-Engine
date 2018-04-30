import { Scene } from './Scene';

export class World implements IWorld {

  private _canvas: HTMLElement;
  private _activeScene: IScene;

  constructor(canvasId: string) {
    this._canvas = document.getElementById(canvasId);
  }

  set scene(scene: IScene) {
    if (!(scene instanceof Scene)) {
      throw new Error('Cannot set scene, as it is not a valid Scene reference');
    }
    this._activeScene = scene;
  }
}
