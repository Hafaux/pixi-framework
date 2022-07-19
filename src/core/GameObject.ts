import { Container } from "pixi.js";
import Animation from "./Animation";
import SceneManager from "./SceneManager";

export type AnimState = {
	anim: string;
	soundName?: string;
	loop?: boolean;
	speed?: number;
};

export default class GameObject extends Container {
	name: string;
	anim: Animation;
	currentState: AnimState | null = null;
	ticker = SceneManager.getInstance().ticker;

	constructor({ spritesheet }: { spritesheet: string }) {
		super();

		this.name = spritesheet;

		this.anim = new Animation(this.name);

		this.addChild(this.anim);
	}

	setState(state: AnimState) {
		this.currentState = state;

		return this.anim.play(state);
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
