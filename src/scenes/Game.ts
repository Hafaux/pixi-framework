import { Sprite } from "pixi.js";
import Scene from "../core/Scene";
import { centerObject } from "../utils/misc";

export default class Game extends Scene {
	sceneName = "Game";

	start() {
		const bg = Sprite.from("bgWaterfall");

		centerObject(bg);

		this.addChild(bg);
	}
}
