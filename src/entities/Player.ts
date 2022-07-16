import Entity, { EntityState } from "../core/Entity";
import gsap from "gsap";
import Keyboard from "../core/Keyboard";
import { wait } from "../utils/misc";
import ParallaxBackground from "./ParallaxBackground";

enum Directions {
	LEFT = -1,
	RIGHT = 1,
}

export class Player extends Entity {
	private keyboard = Keyboard.getInstance();

	static animStates: Record<string, EntityState> = {
		idle: {
			anim: "idle",
			loop: true,
			speed: 0.3,
		},
		jump: {
			anim: "jump",
			soundName: "jump2",
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
			speed: 1,
		},
	};

	config = {
		speed: 10,
		dashMultiplier: 6,
		jumpHeight: 200,
		scale: 1,
		maxJumps: 2,
		dashDuration: 0.1,
		decelerateDuration: 0.1,
	};

	state = {
		jumping: false,
		dashing: false,
		velocity: {
			x: 0,
			y: 0,
		},
	};

	private decelerationTween?: gsap.core.Tween;

	constructor() {
		super({ spritesheet: "wizard" });

		this.setState(Player.animStates.idle);

		this.keyboard.onAction(({ action, buttonState }) => {
			if (buttonState === "pressed") this.onActionPress(action);
			else if (buttonState === "released") this.onActionRelease(action);
		});
	}

	private onActionPress(action: keyof typeof Keyboard.actions) {
		switch (action) {
			case "LEFT":
				this.move(Directions.LEFT);
				break;
			case "RIGHT":
				this.move(Directions.RIGHT);
				break;
			case "JUMP":
				this.jump();
				break;
			case "SHIFT":
				this.dash();
				break;

			default:
				break;
		}
	}

	onActionRelease(action: keyof typeof Keyboard.actions) {
		if (
			(action === "LEFT" && this.state.velocity.x < 0) ||
			(action === "RIGHT" && this.state.velocity.x > 0)
		) {
			this.stopMovement();
		}
	}

	private set jumping(value: boolean) {
		this.state.jumping = value;
		this.updateAnimState();
	}

	private set dashing(value: boolean) {
		this.state.dashing = value;
		this.updateAnimState();
	}

	get jumping() {
		return this.state.jumping;
	}

	get dashing() {
		return this.state.dashing;
	}

	initPlayerMovement(world: ParallaxBackground) {
		this.ticker.add((delta) => {
			const x = this.state.velocity.x * delta;
			const y = this.state.velocity.y * delta;

			world.updatePosition(x, y);
		});
	}

	private updateAnimState() {
		const { walk, jump, dash, idle } = Player.animStates;

		if (this.dashing) {
			if (this.currentState === dash) return;

			this.setState(dash);
		} else if (this.jumping) {
			if (this.currentState === jump || this.currentState === dash) return;

			this.setState(jump);
		} else if (this.state.velocity.x !== 0) {
			if (this.currentState === walk) return;

			this.setState(walk);
		} else {
			if (this.currentState === idle) return;

			this.setState(idle);
		}
	}

	stopMovement() {
		this.decelerationTween?.progress(1);

		this.decelerationTween = gsap.to(this.state.velocity, {
			duration: this.config.decelerateDuration,
			x: 0,
			ease: "power1.in",
			onComplete: () => {
				this.updateAnimState();
			},
		});
	}

	async move(direction: Directions) {
		if (this.dashing) return;

		this.decelerationTween?.progress(1);

		this.state.velocity.x = direction * this.config.speed;

		this.updateAnimState();

		gsap.to(this.scale, {
			duration: 0.15,
			x: this.config.scale * direction,
		});
	}

	async dash() {
		if (this.state.velocity.x === 0) return;

		this.dashing = true;

		this.decelerationTween?.progress(1);

		this.state.velocity.x =
			this.config.speed * this.config.dashMultiplier * this.getDirection();

		await wait(this.config.dashDuration);

		this.state.velocity.x = this.config.speed * this.getDirection();

		this.dashing = false;
	}

	private getDirection() {
		if (this.state.velocity.x === 0)
			return this.scale.x > 0 ? Directions.RIGHT : Directions.LEFT;

		return this.state.velocity.x > 0 ? Directions.RIGHT : Directions.LEFT;
	}

	async jump() {
		if (this.jumping) return;

		this.jumping = true;

		await gsap.to(this, {
			duration: 0.3,
			y: `-=${this.config.jumpHeight}`,
			ease: "power1.out",
			yoyo: true,
			yoyoEase: "power1.in",
			repeat: 1,
		});

		this.jumping = false;
	}
}
