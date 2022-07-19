import { Container, TilingSprite } from "pixi.js";
import { centerObjects } from "../utils/misc";

export type BgConfig = {
	layers: string[];
	panSpeed: number;
	offset: {
		x: number;
		y: number;
	};
};

export default class ParallaxBackground extends Container {
	name = "Background";

	config: BgConfig;
	layers: string[] = [];
	tilingSprites: TilingSprite[] = [];

	constructor(
		config: BgConfig = { offset: { x: 0, y: 0 }, panSpeed: 1, layers: [] }
	) {
		super();

		this.config = config;

		centerObjects(this);

		this.init();
	}

	init() {
		for (const layer of this.config.layers) {
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
				child.tilePosition.x -= x * index * this.config.panSpeed;
				child.tilePosition.y -= y * index * this.config.panSpeed;
			} else {
				child.x -= x * index * this.config.panSpeed;
				child.y -= y * index * this.config.panSpeed;
			}
		}
	}
}
