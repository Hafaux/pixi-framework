import { Container, TilingSprite, Ticker, Texture } from "pixi.js";
import { centerObjects } from "../utils/misc";

export type BgConfig = {
  layers: string[];
  panSpeed: number;
};

export default class ParallaxBackground extends Container {
  name = "Background";

  layers: string[] = [];
  tilingSprites: TilingSprite[] = [];

  constructor(
    protected config: BgConfig = {
      panSpeed: 1,
      layers: [],
    }
  ) {
    super();

    this.init();

    centerObjects(this);
  }

  init() {
    for (const layer of this.config.layers) {
      const texture = Texture.from(layer);
      const scaleFactor = window.innerHeight / texture.height;

      const tilingSprite = new TilingSprite(
        texture,
        window.innerWidth / scaleFactor,
        texture.height
      );

      tilingSprite.scale.set(scaleFactor);

      tilingSprite.name = layer;
      tilingSprite.anchor.set(0.5);

      this.tilingSprites.push(tilingSprite);

      this.addChild(tilingSprite);
    }
  }

  initPlayerMovement(object: {
    state: { velocity: { x: number; y: number } };
  }) {
    Ticker.shared.add((delta) => {
      const x = object.state.velocity.x * delta;
      const y = object.state.velocity.y * delta;

      this.updatePosition(x, y);
    });
  }

  updatePosition(x: number, y: number) {
    for (const [index, child] of this.children.entries()) {
      if (child instanceof TilingSprite) {
        child.tilePosition.x -= x * index * this.config.panSpeed;
        child.tilePosition.y -= y * index * this.config.panSpeed;
      } else {
        child.x -= x * index * this.config.panSpeed;
        child.y -= y * index * this.config.panSpeed;
      }
    }
  }

  resize(width: number, height: number) {
    for (const layer of this.tilingSprites) {
      const scaleFactor = height / layer.texture.height;

      layer.width = width / scaleFactor;
      layer.scale.set(scaleFactor);
    }

    centerObjects(this);
  }
}
