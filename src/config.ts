import type { BgConfig } from "./prefabs/ParallaxBackground";

type Config = {
	backgrounds: Record<string, BgConfig>;
};

export default {
	backgrounds: {
		forest: {
			layers: [
				"sky",
				"clouds_1",
				"rocks",
				"clouds_2",
				"ground_1",
				"ground_2",
				"ground_3",
				"plant",
			],
			panSpeed: 0.2,
			offset: {
				x: 0,
				y: -100,
			},
		},
	},
} as Config;
