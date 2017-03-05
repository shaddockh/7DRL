// This script is the main entry point of the game
import "Modules/thirdparty/atomic-blueprintlib.bundle";
import "AtomicEventLoop";
import LevelGenerator from "Modules/LevelGen/LevelGenerator";
import { catalog } from "atomic-blueprintlib";
import * as blueprints from "Modules/blueprints";
import * as events from "Modules/CustomEvents";

// Load up the blueprints
catalog.loadBlueprints(blueprints, (name) => console.log(`Loading blueprint: ${name}`));
catalog.hydrateAllBlueprints();

let so = new Atomic.ScriptObject();
so.subscribeToEvent(events.SceneReadyEvent(ready));
const scene = Atomic.player.loadScene("Scenes/Scene.scene");

function ready() {
    const generator = new LevelGenerator(20, 20, true);
    const level = generator.generateLevel();

    so.sendEvent(events.LoadLevelEventData({
        level: level
    }));
}






