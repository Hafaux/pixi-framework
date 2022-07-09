import { DisplayObject, Sprite } from "pixi.js";
import Scene from "../core/Scene";

export const centerObject = (object: DisplayObject | Sprite) => {
	object.x = window.innerWidth / 2;
	object.y = window.innerHeight / 2;

	if (object instanceof Sprite) {
		object.anchor.set(0.5);
	}
};

export const importScenes = () => {
	const sceneModules = import.meta.globEager("../scenes/*.ts");

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
	const assetFiles = import.meta.glob("../../assets/**/*.*", {});

	console.warn(assetFiles);

	// for (const [, file] of Object.entries(assetFiles)) {
	// 	file().then((e) => {
	// 		console.log(`${e} loaded`);
	// 	});
	// }

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

const debugLog = (...messages: unknown[]) => {
	if (import.meta.env.DEV) {
		console.log(`[DEBUG LOG]:`, ...messages);
	}
};

const debugWarn = (...messages: unknown[]) => {
	if (import.meta.env.DEV) {
		console.warn(`[DEBUG WARN]:`, ...messages);
	}
};

export const debug = {
	log: debugLog,
	warn: debugWarn,
};
