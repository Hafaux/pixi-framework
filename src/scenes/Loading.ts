import { Container, Sprite, Text } from "pixi.js";
import AssetLoader from "../core/AssetLoader";
import { centerObjects } from "../utils/misc";
import type { Scene } from "../core/SceneManager";

export default class Loading extends Container implements Scene {
	name = "Loading";

	private assetLoader = AssetLoader.getInstance();

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
