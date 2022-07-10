import { Container } from "pixi.js";

export default class Entity extends Container {
	name: string;

	constructor(name: string) {
		super();

		this.name = name;
	}

	enableInteraction(pointerCursor = true) {
		this.interactive = true;
		this.buttonMode = pointerCursor;
	}

	disableInteraction() {
		this.interactive = false;
		this.buttonMode = false;
	}
}
