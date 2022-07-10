import Entity from "../core/Entity";
import gsap from "gsap";
import { sound } from "@pixi/sound";
import Animation from "../core/Animation";

export class Wizard extends Entity {
	anim: Animation;

	constructor() {
		super("Wizard");

		this.anim = new Animation("wizard", 0.5);

		this.addChild(this.anim);

		this.anim.play("idle", {
			loop: true,
		});

		this.enableInteraction();

		this.on("pointerdown", () => {
			this.jump();
		});
	}

	async jump() {
		sound.play("jump");

		this.anim.play("jump");

		this.disableInteraction();

		await gsap.to(this, {
			duration: 0.3,
			y: "-=200",
			ease: "power1.out",
			yoyo: true,
			yoyoEase: "power1.in",
			repeat: 1,
		});

		this.enableInteraction();

		this.anim.play("idle", {
			loop: true,
		});
	}
}
