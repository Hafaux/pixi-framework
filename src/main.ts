import SceneManager from "./core/SceneManager";
import { wait } from "./utils/misc";

async function Main() {
	const sceneManager = SceneManager.getInstance();

	await sceneManager.switchScene("Loading");

	await sceneManager.switchScene("Game");

	await wait(2);

	await sceneManager.switchScene("Win", false);

	await wait(2);

	await sceneManager.switchScene("Game");
}

Main();
