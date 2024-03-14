import SceneManager from "./core/SceneManager";
import Main from "./scenes/Main";
import Loading from "./scenes/Loading";

const sceneManager = new SceneManager();

await sceneManager.init({ background: "#0390fc" });

await sceneManager.switchScene(Loading);
await sceneManager.switchScene(Main);
