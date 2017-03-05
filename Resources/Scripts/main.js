"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This script is the main entry point of the game
require("Modules/thirdparty/atomic-blueprintlib.bundle");
require("AtomicEventLoop");
var LevelGenerator_1 = require("Modules/LevelGen/LevelGenerator");
var atomic_blueprintlib_1 = require("atomic-blueprintlib");
var blueprints = require("Modules/blueprints");
var events = require("Modules/CustomEvents");
// Load up the blueprints
atomic_blueprintlib_1.catalog.loadBlueprints(blueprints, function (name) { return console.log("Loading blueprint: " + name); });
atomic_blueprintlib_1.catalog.hydrateAllBlueprints();
var so = new Atomic.ScriptObject();
so.subscribeToEvent(events.SceneReadyEvent(ready));
var scene = Atomic.player.loadScene("Scenes/Scene.scene");
function ready() {
    var generator = new LevelGenerator_1.default(20, 20, true);
    var level = generator.generateLevel();
    so.sendEvent(events.LoadLevelEventData({
        level: level
    }));
}
//# sourceMappingURL=main.js.map