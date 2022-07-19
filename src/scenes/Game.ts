import { Container } from "pixi.js";
import config from "../config";
import ParallaxBackground from "../prefabs/ParallaxBackground";
import { Player } from "../prefabs/Player";
import { centerObjects } from "../utils/misc";
import type { Scene } from "../core/SceneManager";

export default class Game extends Container implements Scene {
	name = "Game";

	load() {
		const background = new ParallaxBackground(config.backgrounds.forest);

		const player = new Player();

		player.initPlayerMovement(background);

		centerObjects(player);

		player.y += 300;

		this.addChild(background, player);
	}
}
