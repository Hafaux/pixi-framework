import { Sprite } from "pixi.js";
import AssetLoader from "../core/AssetLoader";
import Scene from "../core/Scene";
import { centerObject, wait } from "../utils/misc";

export default class Loading extends Scene {
	sceneName = "Loading";

	assetLoader = AssetLoader.getInstance();

	async load() {
		await this.assetLoader.loadAssetsGroup("Loading");

		const bg = Sprite.from("bgNight");

		centerObject(bg);

		this.addChild(bg);
	}

	async start() {
		super.start();

		// Simulate longer loading time
		await wait(1);

		return this.assetLoader.loadAssetsGroup("Game");
	}
}
