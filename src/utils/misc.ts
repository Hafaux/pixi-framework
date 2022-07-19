import { DisplayObject, Sprite } from "pixi.js";
import type { Scene } from "../core/SceneManager";

export const centerObjects = (...toCenter: DisplayObject[]) => {
	const center = (obj: DisplayObject) => {
		obj.x = window.innerWidth / 2;
		obj.y = window.innerHeight / 2;

		if (obj instanceof Sprite) {
			obj.anchor.set(0.5);
		}
	};

	toCenter.forEach(center);
};

export const importScenes = () => {
	const sceneModules = import.meta.globEager("/src/scenes/*.ts");

	return Object.entries(sceneModules).reduce((acc, [path, module]) => {
		const fileName = path.split("/").pop()?.split(".")[0];

		if (!fileName) {
			console.error("This error shouldn't happen", path);

			return acc;
		}

		acc[fileName] = module.default;

		return acc;
	}, {} as Record<string, ConstructorType<Scene>>);
};

export const importAssetFiles = () => {
	const assetFiles = import.meta.glob("/public/**/*.*");

	return Object.keys(assetFiles);
};

export const wait = (seconds: number) => {
	return new Promise<void>((res) => setTimeout(res, seconds * 1000));
};

export const after = async (
	seconds: number,
	callback: (...args: unknown[]) => unknown
) => {
	await wait(seconds);
	return callback();
};

export const getEntries = <T>(obj: T) => {
	return Object.entries(obj) as Entries<T>;
};
