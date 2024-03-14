import { AnimatedSprite, Assets, Container } from "pixi.js";
import Deferred from "../utils/Deferred";

type PlayOptions = {
  loop?: boolean;
  speed?: number;
};

export default class SpritesheetAnimation extends Container {
  animationTextures: Record<string, AnimatedSprite["textures"]>;
  sprite: AnimatedSprite;
  speed = 1;

  animations = new Map<string, AnimatedSprite>();
  currentAnimation: string;

  constructor(name: string, speed = 1) {
    super();

    this.label = name;
    this.speed = speed;
    this.animationTextures = Assets.get(name).animations;
  }

  private initAnimation(anim: string) {
    const textures = this.animationTextures[anim];

    if (!textures) {
      console.error(`Animation ${anim} not found`);
    }

    const sprite = new AnimatedSprite(textures);

    sprite.label = anim;
    sprite.anchor.set(0.5);
    sprite.animationSpeed = this.speed;

    return sprite;
  }

  play(anim: string, { loop, speed }: PlayOptions = {}): Promise<void> {
    if (this.sprite) {
      this.sprite.stop();

      this.removeChild(this.sprite);
    }

    this.sprite = this.animations.get(anim);

    if (!this.sprite) {
      this.sprite = this.initAnimation(anim);

      this.animations.set(anim, this.sprite);
    }

    this.currentAnimation = anim;

    this.sprite.loop = loop ?? false;
    this.sprite.animationSpeed = speed ?? this.speed;
    this.sprite.gotoAndPlay(0);

    this.addChild(this.sprite);

    const deferred = new Deferred<void>();

    this.sprite.onComplete = () => {
      this.currentAnimation = null;

      deferred.resolve();
    };

    return deferred.promise;
  }
}
