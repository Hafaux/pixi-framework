import config from "../config";
import ParallaxBackground from "../prefabs/ParallaxBackground";
import { Player } from "../prefabs/Player";
import Scene from "../core/Scene";
import SpineAnimation from "../core/SpineAnimation";

export default class Game extends Scene {
  name = "Game";

  private player!: Player;
  private background!: ParallaxBackground;

  load() {
    this.background = new ParallaxBackground(config.backgrounds.forest);
    this.player = new Player();

    this.player.x = window.innerWidth / 2;
    this.player.y = window.innerHeight - this.player.height / 3;

    this.background.initPlayerMovement(this.player);

    this.addChild(this.background, this.player);
  }

  async start() {
    // Example of how to play a spine animation
    const vine = new SpineAnimation("vine-pro");

    vine.stateData.setMix("grow", "grow", 0.5);

    vine.x = 0;
    vine.y = window.innerHeight / 2 - 50;

    this.background.addChild(vine);

    while (vine) {
      await vine.play("grow");
    }
  }

  onResize(width: number, height: number) {
    if (this.player) {
      this.player.x = width / 2;
      this.player.y = height - this.player.height / 3;
    }

    if (this.background) {
      this.background.resize(width, height);
    }
  }
}
