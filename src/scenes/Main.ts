import gsap from "gsap";
import Scene from "../core/Scene";
import SpritesheetAnimation from "../core/SpritesheetAnimation";
import { Debug } from "../utils/debug";
import { centerObjects } from "../utils/misc";
import { sound } from "@pixi/sound";
import Keyboard from "../core/Keyboard";
import { Sprite } from "pixi.js";

export default class Main extends Scene {
  jumpTween: gsap.core.Tween;
  keyboard: Keyboard;
  sprites: Record<string, Sprite | SpritesheetAnimation>;
  wizard: SpritesheetAnimation;

  load() {
    this.keyboard = Keyboard.getInstance();

    this.sprites = {
      clouds: Sprite.from("clouds"),
      skyIsland: Sprite.from("sky_island"),
      wizard: new SpritesheetAnimation("wizard"),
    };

    this.wizard = this.sprites.wizard as SpritesheetAnimation;

    this.wizard.interactive = true;
    this.wizard.cursor = "pointer";

    this.wizard.on("pointerdown", () => this.makeWizardJump());

    this.keyboard.registerKey("Space", ({ state }) => {
      if (state === "down") this.makeWizardJump();
    });

    this.positionSprites();

    this.addChild(...Object.values(this.sprites));
  }

  start() {
    this.wizard.play("idle", { loop: true, speed: 0.5 });
  }

  positionSprites() {
    centerObjects(...Object.values(this.sprites));

    this.wizard.y += 100;
    this.sprites.skyIsland.y += 250;
  }

  async makeWizardJump() {
    if (this.jumpTween && this.jumpTween.isActive()) return;

    this.wizard.play("jump");

    sound.play("jump");

    this.jumpTween = gsap.to(this.wizard, {
      y: this.wizard.y - 100,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.wizard.play("idle", { loop: true, speed: 0.5 });
      },
    });
  }

  onResize(width: number, height: number) {
    Debug.log("🖥️ Resized to", width, height);

    this.positionSprites();
  }
}
