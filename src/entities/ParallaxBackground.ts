import { Container, TilingSprite } from "pixi.js";

type BgConfig = {
	offset: {
		x: number;
		y: number;
	};
	speed: number;
};

export default class ParallaxBackground extends Container {
	name = "Background";

	config: BgConfig;
	layers: string[];
	tilingSprites: TilingSprite[] = [];

	constructor(
		layers: string[] = [],
		config: BgConfig = { offset: { x: 0, y: 0 }, speed: 1 }
	) {
		super();

		this.config = config;
		this.layers = layers;

		this.init();
	}

	init() {
		for (const layer of this.layers) {
			const tilingSprite = TilingSprite.from(layer, {
				width: window.innerWidth,
				height: window.innerHeight,
			});

			tilingSprite.name = layer;
			tilingSprite.anchor.set(0.5);

			this.tilingSprites.push(tilingSprite);

			tilingSprite.tilePosition.y = this.config.offset.y;
			tilingSprite.tilePosition.x = this.config.offset.x;

			this.addChild(tilingSprite);
		}
	}

	updatePosition(x: number, y: number) {
		for (const [index, child] of this.children.entries()) {
			if (child instanceof TilingSprite) {
				child.tilePosition.x -= x * index * this.config.speed;
				child.tilePosition.y -= y * index * this.config.speed;
			} else {
				child.x -= x * index * this.config.speed;
				child.y -= y * index * this.config.speed;
			}
		}
	}
}
