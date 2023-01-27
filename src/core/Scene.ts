import { Container } from "pixi.js";
import type { SceneUtils } from "./SceneManager";

export interface Scene {
  load?(): void | Promise<void>;
  unload?(): void | Promise<void>;
  start?(): void | Promise<void>;
  onResize?(width: number, height: number): void;
}

export abstract class Scene extends Container {
  abstract name: string;

  constructor(protected utils: SceneUtils) {
    super();
  }
}

export default Scene;
