import { Container, Text } from "pixi.js";
import { centerObject, debug } from "../utils/misc";

abstract class Scene extends Container {
	abstract sceneName: string;

	load?(): void | Promise<void>;

	// Start your scene's main logic
	start(): void | Promise<void> {
		debug.log(`${this.sceneName} scene start()`);

		const text = new Text(this.sceneName, {
			fill: 0xffffff,
		});

		centerObject(text);

		this.addChild(text);
	}

	unload?(): void | Promise<void>;
}

export default Scene;
