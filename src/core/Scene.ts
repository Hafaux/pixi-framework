import { Container } from "pixi.js";

export default abstract class Scene extends Container {
	abstract name: string;

	load?(): void | Promise<void>;

	unload?(): void | Promise<void>;

	start?(): void | Promise<void>;
}
