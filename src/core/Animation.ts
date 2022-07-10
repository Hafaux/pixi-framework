import { sound } from "@pixi/sound";
import { AnimatedSprite, Container } from "pixi.js";
import { spritesheets } from "./AssetLoader";

export default class Animation extends Container {
	animationTextures: typeof spritesheets[""]["animations"];
	animatedSprite: AnimatedSprite | undefined;
	speed: number = 1;

	animations = new Map<string, AnimatedSprite>();

	currentAnimation: string | null = null;

	constructor(name: string, speed = 1) {
		super();

		this.name = name;
		this.speed = speed;
		this.animationTextures = spritesheets[name].animations;
	}

	private initAnimation(anim: string) {
		const textures = this.animationTextures[anim];

		if (!textures) {
			console.error(`Animation ${anim} not found`);

			return;
		}

		const sprite = new AnimatedSprite(textures);

		sprite.name = anim;
		sprite.anchor.set(0.5);
		sprite.animationSpeed = this.speed;

		return sprite;
	}

	play({
		anim,
		soundName,
		loop = false,
		speed = this.speed,
	}: {
		anim: string;
		soundName?: string;
		loop?: boolean;
		speed?: number;
	}) {
		if (this.animatedSprite) {
			this.animatedSprite.stop();

			this.removeChild(this.animatedSprite);
		}

		this.animatedSprite = this.animations.get(anim);

		if (!this.animatedSprite) {
			this.animatedSprite = this.initAnimation(anim);

			if (!this.animatedSprite) return;

			this.animations.set(anim, this.animatedSprite);
		}

		this.currentAnimation = anim;

		this.animatedSprite.loop = loop;
		this.animatedSprite.animationSpeed = speed;
		this.animatedSprite.gotoAndPlay(0);

		if (soundName) sound.play(soundName);

		this.addChild(this.animatedSprite);

		return new Promise<void>((resolve) => {
			if (!this.animatedSprite) return resolve();

			this.animatedSprite.onComplete = () => {
				this.currentAnimation = null;

				resolve();
			};
		});
	}
}
