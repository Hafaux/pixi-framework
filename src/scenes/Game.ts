import config from "../config";
import ParallaxBackground from "../prefabs/ParallaxBackground";
import { Player } from "../prefabs/Player";
import { centerObjects } from "../utils/misc";
import Scene from "../core/Scene";

export default class Game extends Scene {
  name = "Game";

  load() {
    const world = new ParallaxBackground(config.backgrounds.forest);

    const player = new Player();

    world.initPlayerMovement(player);

    centerObjects(player);

    player.y += 300;

    this.addChild(world, player);
  }
}
