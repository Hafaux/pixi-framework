import { Sprite, Text } from "pixi.js";
import Scene from "../core/Scene";
import { centerObjects } from "../utils/misc";

export default class Loading extends Scene {
  name = "Loading";

  async load() {
    await this.utils.assetLoader.loadAssetsGroup("Loading");

    const bg = Sprite.from("bgNight");

    const text = new Text("Loading...", {
      fontFamily: "Verdana",
      fontSize: 50,
      fill: "white",
    });

    text.resolution = 2;

    centerObjects(bg, text);

    this.addChild(bg, text);
  }

  async start() {
    await this.utils.assetLoader.loadAssetsGroup("Game");
  }
}
