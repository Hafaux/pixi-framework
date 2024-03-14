import { Sprite } from "pixi.js";
import Scene from "../core/Scene";
import { centerObjects } from "../utils/misc";

export default class Loading extends Scene {
  loading: Sprite;
  async load() {
    await this.utils.assetLoader.loadAssetsGroup("Loading");

    this.loading = Sprite.from("loading");

    this.loading.alpha = 0.5;
    this.loading.scale.set(0.5);

    centerObjects(this.loading);

    this.addChild(this.loading);
  }

  onUpdate(delta: number): void {
    this.loading.rotation += 0.001 * delta;
  }

  async start() {
    await this.utils.assetLoader.loadAssetsGroup("Game");
  }
}
