import Scene from "../core/Scene";
import ParallaxBackground from "../entities/ParallaxBackground";
import { Player } from "../entities/Player";
import { centerObjects } from "../utils/misc";

export default class Game extends Scene {
	name = "Game";

	load() {
		const world = new ParallaxBackground(
			[
				"sky",
				"clouds_1",
				"rocks",
				"clouds_2",
				"ground_1",
				"ground_2",
				"ground_3",
				"plant",
			],
			{
				speed: 0.2,
				offset: {
					x: 0,
					y: -100,
				},
			}
		);

		const player = new Player();

		player.initPlayerMovement(world);

		centerObjects(world, player);

		player.y += 300;

		this.addChild(world, player);
	}
}
