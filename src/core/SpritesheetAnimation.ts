import { sound } from "@pixi/sound";
import { AnimatedSprite, Assets, Container } from "pixi.js";

export default class SpritesheetAnimation extends Container {
  animationTextures: Record<string, AnimatedSprite["textures"]>;
  sprite?: AnimatedSprite;
  speed = 1;

  animations = new Map<string, AnimatedSprite>();

  currentAnimation: string | null = null;

  constructor(name: string, speed = 1) {
    super();

    this.name = name;
    this.speed = speed;
    this.animationTextures = Assets.get(name).animations;
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
    if (this.sprite) {
      this.sprite.stop();

      this.removeChild(this.sprite);
    }

    this.sprite = this.animations.get(anim);

    if (!this.sprite) {
      this.sprite = this.initAnimation(anim);

      if (!this.sprite) return;

      this.animations.set(anim, this.sprite);
    }

    this.currentAnimation = anim;

    this.sprite.loop = loop;
    this.sprite.animationSpeed = speed;
    this.sprite.gotoAndPlay(0);

    if (soundName) sound.play(soundName);

    this.addChild(this.sprite);

    return new Promise<void>((resolve) => {
      if (!this.sprite) return resolve();

      this.sprite.onComplete = () => {
        this.currentAnimation = null;

        resolve();
      };
    });
  }
}
