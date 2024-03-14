import { Application, ApplicationOptions } from "pixi.js";
import Scene from "./Scene";
import AssetLoader from "./AssetLoader";
import { Debug } from "../utils/debug";

export interface SceneUtils {
  assetLoader: AssetLoader;
}

type SceneConstructor = ConstructorType<typeof Scene>;

export default class SceneManager {
  app: Application;
  sceneInstances = new Map<SceneConstructor, Scene>();
  currentScene?: Scene;

  constructor() {
    this.app = new Application();
  }

  async init(options: Partial<ApplicationOptions> = {}) {
    await this.app.init({
      canvas: document.querySelector("#app") as HTMLCanvasElement,
      autoDensity: true,
      resizeTo: window,
      powerPreference: "high-performance",
      ...options,
    });

    Debug.log(`🎨 Rendering context: ${this.app.renderer.name}`);

    window.__PIXI_APP__ = this.app;

    window.addEventListener("resize", (ev: UIEvent) => {
      const target = ev.target as Window;

      this.currentScene?.onResize?.(target.innerWidth, target.innerHeight);
    });

    this.app.ticker.add(() => {
      this.currentScene?.onUpdate?.(this.app.ticker.elapsedMS);
    });
  }

  async switchScene(
    scene: SceneConstructor,
    deletePrevious = true
  ): Promise<Scene> {
    await this.removeScene(deletePrevious);

    Debug.log(`🔀 Switching to scene ${scene.name}`);

    this.currentScene = this.sceneInstances.get(scene);

    if (!this.currentScene) this.currentScene = await this.initScene(scene);

    if (!this.currentScene)
      throw new Error(`Failed to initialize scene: ${scene}`);

    this.app.stage.addChild(this.currentScene);

    if (this.currentScene.start) await this.currentScene.start();

    return this.currentScene;
  }

  private async removeScene(destroyScene: boolean) {
    if (!this.currentScene) return;

    Debug.log(
      `🔀 Removing scene ${this.currentScene.constructor.name} ${
        destroyScene && "and destroying it"
      }`
    );

    if (destroyScene) {
      this.currentScene.destroy({ children: true });

      this.sceneInstances.delete(
        this.currentScene.constructor as SceneConstructor
      );
    } else {
      this.app.stage.removeChild(this.currentScene);
    }

    if (this.currentScene.unload) await this.currentScene.unload();

    this.currentScene = undefined;
  }

  private async initScene(sceneConstructor: SceneConstructor) {
    const sceneUtils = {
      assetLoader: new AssetLoader(),
    };

    const scene = new sceneConstructor(sceneUtils);

    this.sceneInstances.set(sceneConstructor, scene);

    if (scene.load) await scene.load();

    return scene;
  }
}
