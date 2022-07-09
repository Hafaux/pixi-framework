import { Loader } from "pixi.js";
import { debug, importAssetFiles } from "../utils/misc";

type Asset = {
	name: string;
	url: string;
	ext: string;
	category: string;
	group: string;
};

/**
 * Replace with https://pixijs.download/dev/docs/PIXI.Assets.html when it's released
 */
export default class AssetLoader {
	private static instance: AssetLoader;
	private assetFileUrls = importAssetFiles();

	private loader: Loader;

	cache: any;
	manifest: Asset[];

	private constructor() {
		this.loader = new Loader();
		this.manifest = this.generateManifest();
	}

	static getInstance(): AssetLoader {
		if (!AssetLoader.instance) {
			AssetLoader.instance = new AssetLoader();
		}

		return AssetLoader.instance;
	}

	loadAssetsGroup(group: any) {
		const sceneAssets = this.manifest.filter((asset) => asset.group === group);

		debug.log("Loading assets group", group, sceneAssets);

		for (const asset of sceneAssets) {
			this.loader.add(asset.name, asset.url);
		}

		return new Promise<void>((resolve, _reject) => {
			this.loader.load((_loader, resources) => {
				debug.warn("Loaded assets group", group, resources);

				this.cache = resources;

				resolve();
			});
		});
	}

	generateManifest() {
		const assetsManifest: Asset[] = [];
		const assetPathRegexp =
			/assets\/(?<group>\w+)\/(?<category>\w+)\/(?<name>[\w.]+)\.(?<ext>\w+)$/;

		this.assetFileUrls.map((assetPath) => {
			const match = assetPathRegexp.exec(assetPath);

			if (!match) {
				return console.error(
					`Invalid asset path: ${assetPath}, should match ${assetPathRegexp}`
				);
			}

			assetsManifest.push({
				...(match.groups as Omit<Asset, "url">),
				url: assetPath,
			});
		});

		return assetsManifest;
	}
}
