import Entity, { EntityState } from "../core/Entity";
import gsap from "gsap";
import Keyboard from "../core/Keyboard";
import { IMediaInstance } from "@pixi/sound";
import { wait } from "../utils/misc";

enum Directions {
	LEFT = -1,
	RIGHT = 1,
}

export class Player extends Entity {
	keyboard = Keyboard.getInstance();

	config = {
		speed: 10,
		dashMultiplier: 6,
		jumpHeight: 200,
		scale: 1,
		maxJumps: 2,
		dashDuration: 0.1,
		decelerateDuration: 0.1,
	};

	velocity = {
		x: 0,
		y: 0,
	};

	decelerationTween?: gsap.core.Tween;

	jumping = false;
	dashing = false;

	jumpCounter = 0;

	walkingSound?: IMediaInstance;

	static animStates: Record<string, EntityState> = {
		idle: {
			anim: "idle",
			loop: true,
			speed: 0.5,
		},
		jump: {
			anim: "jump",
			soundName: "jump",
			loop: false,
			speed: 0.5,
		},
		walk: {
			anim: "walk",
			loop: true,
			speed: 1,
		},
		dash: {
			anim: "dash",
			soundName: "dash",
			loop: false,
			speed: 1.5,
		},
	};

	constructor() {
		super({ spritesheet: "wizard" });

		this.setState(Player.animStates.idle);

		const actionFnMap = {
			LEFT: () => this.move(Directions.LEFT),
			RIGHT: () => this.move(Directions.RIGHT),
			JUMP: () => this.jump(),
			DASH: () => this.dash(),
		};

		this.keyboard.onAction(({ action, state }) => {
			if (state === "pressed") {
				actionFnMap[action]();
			} else {
				if (
					(action === "LEFT" && this.velocity.x < 0) ||
					(action === "RIGHT" && this.velocity.x > 0)
				) {
					this.stopMovement();
				}
			}
		});

		this.ticker.add((delta) => {
			this.x += this.velocity.x * delta;
			this.y += this.velocity.y * delta;
		});
	}

	updateAnimState() {
		const { walk, jump, dash, idle } = Player.animStates;

		if (this.dashing) {
			if (this.currentState === dash) return;

			this.setState(dash);
		} else if (this.jumping) {
			if (this.currentState === jump || this.currentState === dash) return;

			this.setState(jump);
		} else if (this.velocity.x !== 0) {
			if (this.currentState === walk) return;

			this.setState(walk);
		} else {
			if (this.currentState === idle) return;

			this.setState(idle);
		}
	}

	stopMovement() {
		this.decelerationTween?.progress(1);

		this.decelerationTween = gsap.to(this.velocity, {
			duration: this.config.decelerateDuration,
			x: 0,
			ease: "power1.in",
			onComplete: () => {
				this.updateAnimState();
			},
		});
	}

	async move(direction: Directions) {
		this.decelerationTween?.progress(1);

		this.velocity.x = direction * this.config.speed;

		this.updateAnimState();

		gsap.to(this.scale, {
			duration: 0.15,
			x: this.config.scale * direction,
		});
	}

	async dash() {
		if (this.velocity.x === 0) return;

		this.decelerationTween?.progress(1);

		this.dashing = true;

		this.updateAnimState();

		const sign = this.velocity.x > 0 ? Directions.RIGHT : Directions.LEFT;

		this.velocity.x = this.config.speed * this.config.dashMultiplier * sign;

		await wait(this.config.dashDuration);

		this.velocity.x = this.config.speed * sign;

		this.dashing = false;
		this.updateAnimState();
	}

	async jump() {
		if (this.jumping) return;

		this.jumping = true;
		this.updateAnimState();

		await gsap.to(this, {
			duration: 0.3,
			y: `-=${this.config.jumpHeight}`,
			ease: "power1.out",
			yoyo: true,
			yoyoEase: "power1.in",
			repeat: 1,
		});

		this.jumping = false;
		this.updateAnimState();
	}
}
