import { Loader, LoaderResource, Spritesheet } from "pixi.js";
import { debug } from "../utils/debug";
import { importAssetFiles } from "../utils/misc";

type Asset = {
	name: string;
	url: string;
	ext: string;
	category: string;
	group: string;
};

export const spritesheets: Record<string, Spritesheet> = {};

/**
 * Replace with https://pixijs.download/dev/docs/PIXI.Assets.html when it's released
 */
export default class AssetLoader {
	private static instance: AssetLoader;
	private assetFileUrls = importAssetFiles();

	manifest: Asset[];

	private constructor() {
		this.manifest = this.generateManifest();
	}

	static getInstance(): AssetLoader {
		if (!AssetLoader.instance) {
			AssetLoader.instance = new AssetLoader();
		}

		return AssetLoader.instance;
	}

	loadAssetsGroup(group: any) {
		const loader = new Loader();
		const sceneAssets = this.manifest.filter((asset) => asset.group === group);

		for (const asset of sceneAssets) {
			loader.add(asset.name, asset.url);
		}

		return new Promise<Asset[]>((resolve, _reject) => {
			loader.load((_loader, resources) => {
				this.prepareSpritesheets(resources);

				debug.warn("✅ Loaded assets group", group, resources);

				if (Object.keys(spritesheets).length)
					debug.warn("🌟 Spritesheets: ", spritesheets);

				resolve(sceneAssets);
			});
		});
	}

	prepareSpritesheets(resources: Record<string, LoaderResource>) {
		for (const [name, resource] of Object.entries(resources)) {
			const { spritesheet } = resource;

			if (!spritesheet) continue;

			spritesheets[name] = spritesheet;
		}
	}

	generateManifest() {
		const assetsManifest: Asset[] = [];
		const assetPathRegexp =
			/public\/(?<group>[\w.-]+)\/(?<category>[\w.-]+)\/(?<name>[\w.-]+)\.(?<ext>\w+)$/;

		this.assetFileUrls.forEach((assetPath) => {
			const match = assetPathRegexp.exec(assetPath);

			if (!match || !match.groups) {
				return console.error(
					`Invalid asset path: ${assetPath}, should match ${assetPathRegexp}`
				);
			}

			const { group, category, name, ext } = match.groups;

			if (category === "spritesheets" && ext !== "json") {
				// Skip image files in spritesheets category
				return;
			}

			assetsManifest.push({
				group,
				category,
				name,
				ext,
				url: assetPath.replace(/.*public/, ""),
			});
		});

		return assetsManifest;
	}
}
