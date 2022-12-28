import { Assets, Spritesheet } from "pixi.js";
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

export default class AssetLoader {
  private assetFileUrls = importAssetFiles();

  manifest: Asset[];

  constructor() {
    this.manifest = this.generateManifest();
  }

  async loadAssetsGroup(group: string) {
    const sceneAssets = this.manifest.filter((asset) => asset.group === group);

    for (const asset of sceneAssets) {
      Assets.add(asset.name, asset.url);
    }

    const resources = await Assets.load(sceneAssets.map((asset) => asset.name));

    debug.log("✅ Loaded assets group", group, resources);

    this.prepareSpritesheets(resources);

    return resources;
  }

  prepareSpritesheets(resources: Record<string, Spritesheet>) {
    for (const [name, resource] of Object.entries(resources)) {
      if (!("animations" in resource)) continue;

      spritesheets[name] = resource;
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
