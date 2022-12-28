import { Application } from "pixi.js";
import Scene from "./Scene";
import { debug } from "../utils/debug";
import { importScenes } from "../utils/misc";
import AssetLoader from "./AssetLoader";

if (import.meta.env.DEV) debug.init();

export interface SceneUtils {
  assetLoader: AssetLoader;
}

export default class SceneManager {
  private sceneConstructors = importScenes();

  app: Application;
  sceneInstances = new Map<string, Scene>();
  currentScene?: Scene;

  constructor() {
    this.app = new Application({
      view: document.querySelector("#app") as HTMLCanvasElement,
      autoDensity: true,
      resizeTo: window,
      powerPreference: "high-performance",
      backgroundColor: 0x23272a,
    });
  }

  async switchScene(sceneName: string, deletePrevious = true): Promise<Scene> {
    await this.removeScene(deletePrevious);

    this.currentScene = this.sceneInstances.get(sceneName);

    if (!this.currentScene) this.currentScene = await this.initScene(sceneName);

    if (!this.currentScene)
      throw new Error(`Failed to initialize scene: ${sceneName}`);

    this.app.stage.addChild(this.currentScene);

    if (this.currentScene.start) await this.currentScene.start();

    return this.currentScene;
  }

  private async removeScene(destroyScene: boolean) {
    if (!this.currentScene) return;

    if (destroyScene) {
      this.sceneInstances.delete(this.currentScene.name);

      this.currentScene.destroy({ children: true });
    } else {
      this.app.stage.removeChild(this.currentScene);
    }

    if (this.currentScene.unload) await this.currentScene.unload();

    this.currentScene = undefined;
  }

  private async initScene(sceneName: string) {
    const sceneUtils = {
      assetLoader: new AssetLoader(),
    };

    const scene = new this.sceneConstructors[sceneName](sceneUtils);

    this.sceneInstances.set(sceneName, scene);

    if (scene.load) await scene.load();

    return scene;
  }
}
