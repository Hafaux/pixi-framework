import { Assets } from "pixi.js";
import { Debug } from "../utils/debug";
import "pixi-spine";

type Asset = {
  name: string;
  url: string;
  ext: string;
  category: string;
  group: string;
};

export default class AssetLoader {
  private assetFileUrls = this.importAssetFiles();

  manifest: Asset[];

  constructor() {
    this.manifest = this.generateManifest();
  }

  importAssetFiles() {
    const assetFiles = import.meta.glob("/public/**/*.*");

    return Object.keys(assetFiles);
  }

  async loadAssetsGroup(group: string) {
    const sceneAssets = this.manifest.filter((asset) => asset.group === group);

    for (const asset of sceneAssets) {
      Assets.add(asset.name, asset.url);
    }

    const resources = await Assets.load(sceneAssets.map((asset) => asset.name));

    Debug.log("✅ Loaded assets group", group, resources);

    return resources;
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

      // Skip image files in the spine or spritesheets category
      if (category === "spritesheets" && ext !== "json") {
        return;
      }

      if (category === "spine" && ext !== "json" && ext !== "skel") {
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
