import gsap from "gsap";
import { Container } from "pixi.js";
import SpritesheetAnimation from "../core/SpritesheetAnimation";
import Keyboard from "../core/Keyboard";
import { wait } from "../utils/misc";

enum Directions {
  LEFT = -1,
  RIGHT = 1,
}

type AnimState = {
  anim: string;
  soundName?: string;
  loop?: boolean;
  speed?: number;
};

/**
 * Example class showcasing the usage of the```Animation``` and ```Keyboard``` classes
 */
export class Player extends Container {
  private keyboard = Keyboard.getInstance();
  anim: SpritesheetAnimation;
  currentState: AnimState | null = null;

  static animStates: Record<string, AnimState> = {
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
    turnDuration: 0.15,
    decelerateDuration: 0.1,
    scale: 1,
    jump: {
      height: 200,
      duration: 0.3,
      ease: "sine",
    },
    dash: {
      speedMultiplier: 6,
      duration: 0.1,
    },
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
    super();

    this.anim = new SpritesheetAnimation("wizard");

    this.addChild(this.anim);

    this.setState(Player.animStates.idle);

    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === "pressed") this.onActionPress(action);
      else if (buttonState === "released") this.onActionRelease(action);
    });
  }

  setState(state: AnimState) {
    this.currentState = state;

    return this.anim.play(state);
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

  get jumping() {
    return this.state.jumping;
  }

  private set jumping(value: boolean) {
    this.state.jumping = value;
    this.updateAnimState();
  }

  private set dashing(value: boolean) {
    this.state.dashing = value;
    this.updateAnimState();
  }

  get dashing() {
    return this.state.dashing;
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
      duration: this.config.turnDuration,
      x: this.config.scale * direction,
    });
  }

  async dash() {
    if (this.state.velocity.x === 0) return;

    this.dashing = true;

    this.decelerationTween?.progress(1);

    this.state.velocity.x =
      this.config.speed *
      this.config.dash.speedMultiplier *
      this.getDirection();

    await wait(this.config.dash.duration);

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

    const { height, duration, ease } = this.config.jump;

    this.jumping = true;

    await gsap.to(this, {
      duration,
      y: `-=${height}`,
      ease: `${ease}.out`,
      yoyo: true,
      yoyoEase: `${ease}.in`,
      repeat: 1,
    });

    this.jumping = false;
  }
}
