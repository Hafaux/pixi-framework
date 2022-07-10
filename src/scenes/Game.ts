import { Sprite } from "pixi.js";
import Scene from "../core/Scene";
import { Player } from "../entities/Player";
import { centerObjects } from "../utils/misc";

export default class Game extends Scene {
	name = "Game";

	load() {
		const bg = Sprite.from("bgWaterfall");

		const player = new Player();

		centerObjects(bg, player);

		this.addChild(bg, player);
	}
}
