import { AnimatedSprite, Container } from "pixi.js";
import { spritesheets } from "./AssetLoader";

export default class Animation extends Container {
	animationTextures: typeof spritesheets[""]["animations"];
	animatedSprite?: AnimatedSprite;
	speed: number = 1;

	animations = new Map<string, AnimatedSprite>();

	constructor(name: string, speed: number) {
		super();

		this.name = name;
		this.speed = speed;
		this.animationTextures = spritesheets[name].animations;
	}

	private initAnimation(anim: string) {
		const textures = this.animationTextures[anim];

		if (!textures) {
			throw new Error(`Animation ${anim} not found`);
		}

		const sprite = new AnimatedSprite(textures);

		sprite.name = anim;
		sprite.anchor.set(0.5);
		sprite.animationSpeed = this.speed;

		return sprite;
	}

	play(anim: string, { loop = false, speed = this.speed } = {}) {
		if (this.animatedSprite) {
			this.animatedSprite.stop();

			this.removeChild(this.animatedSprite);
		}

		this.animatedSprite = this.animations.get(anim);

		if (!this.animatedSprite) {
			this.animatedSprite = this.initAnimation(anim);

			this.animations.set(anim, this.animatedSprite);
		}

		this.animatedSprite.loop = loop;
		this.animatedSprite.animationSpeed = speed;
		this.animatedSprite.gotoAndPlay(0);

		this.addChild(this.animatedSprite);
	}
}
