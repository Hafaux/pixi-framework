import SceneManager from "./core/SceneManager";

async function Start() {
	const sceneManager = SceneManager.getInstance();

	await sceneManager.switchScene("Loading");

	await sceneManager.switchScene("Game");
}

Start();
