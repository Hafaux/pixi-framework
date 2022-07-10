import { Sprite, Text } from "pixi.js";
import AssetLoader from "../core/AssetLoader";
import Scene from "../core/Scene";
import { centerObjects } from "../utils/misc";

export default class Loading extends Scene {
	name = "Loading";

	assetLoader = AssetLoader.getInstance();

	async load() {
		await this.assetLoader.loadAssetsGroup("Loading");

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
		await this.assetLoader.loadAssetsGroup("Game");
	}
}
