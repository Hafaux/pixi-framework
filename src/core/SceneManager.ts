import { AbstractRenderer, Application, Container, Ticker } from "pixi.js";
import { debug } from "../utils/debug";
import { importScenes } from "../utils/misc";

if (import.meta.env.DEV) debug.init();

export interface Scene extends Container {
	name: string;

	load?(): void | Promise<void>;

	unload?(): void | Promise<void>;

	start?(): void | Promise<void>;
}

export default class SceneManager {
	private static instance: SceneManager;

	private app: Application;
	private stage: Container;
	private sceneConstructors = importScenes();

	renderer: AbstractRenderer;
	ticker: Ticker;

	sceneInstances = new Map<string, Scene>();
	currentScene?: Scene;

	private constructor() {
		this.app = new Application({
			view: document.querySelector("#app") as HTMLCanvasElement,
			autoDensity: true,
			resizeTo: window,
			powerPreference: "high-performance",
			backgroundColor: 0x23272a,
			sharedLoader: false,
		});

		this.stage = this.app.stage;
		this.renderer = this.app.renderer;
		this.ticker = this.app.ticker;
	}

	static getInstance(): SceneManager {
		if (!SceneManager.instance) {
			SceneManager.instance = new SceneManager();
		}

		return SceneManager.instance;
	}

	async switchScene(sceneName: string, deletePrevious = true): Promise<Scene> {
		await this.removeScene(deletePrevious);

		this.currentScene = this.sceneInstances.get(sceneName);

		if (!this.currentScene) this.currentScene = await this.initScene(sceneName);

		if (!this.currentScene)
			throw new Error(`Failed to initialize scene: ${sceneName}`);

		this.stage.addChild(this.currentScene);

		if (this.currentScene.start) await this.currentScene.start();

		return this.currentScene;
	}

	private removeScene(deleteScene: Boolean) {
		if (!this.currentScene) return;

		this.stage.removeChild(this.currentScene);

		if (deleteScene) {
			this.sceneInstances.delete(this.currentScene.name);
		}

		if (this.currentScene.unload) return this.currentScene.unload();
	}

	private async initScene(sceneName: string) {
		const scene = new this.sceneConstructors[sceneName]();

		this.sceneInstances.set(sceneName, scene);

		if (scene.load) await scene.load();

		return scene;
	}
}
