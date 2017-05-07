import "AtomicEventLoop";
import "atomic-blueprintlib.bundle";
import { catalog } from "atomic-blueprintlib";
import * as blueprints from "Modules/blueprints";
import * as CustomEvents from "Modules/CustomEvents";
import LevelGenerator from "Modules/LevelGen/LevelGenerator";
// This script is the main entry point of the game

// Load up the blueprints
catalog.loadBlueprints(blueprints, (name) => console.log(`Loading blueprint: ${name}`));
catalog.hydrateAllBlueprints();

const scene = Atomic.player.loadScene("Scenes/Scene.scene");

// Let the scene load and then start working on the first update cycle
let so = new Atomic.ScriptObject();
so.subscribeToEvent(Atomic.SceneUpdateEvent(ready));

function ready() {
    so.unsubscribeFromAllEvents();

    const generator = new LevelGenerator(30, 30, true);
    const level = generator.generateLevel();

    so.sendEvent(CustomEvents.LoadLevelEventData({
        level: level,
        depth: 1
    }));
}






