import { Sprite } from "pixi.js";
import Scene from "../core/Scene";
import { Wizard } from "../entities/Wizard";
import { centerObjects } from "../utils/misc";

export default class Game extends Scene {
	name = "Game";

	load() {
		const bg = Sprite.from("bgWaterfall");

		const wizard = new Wizard();

		centerObjects(bg, wizard);

		this.addChild(bg, wizard);
	}
}
