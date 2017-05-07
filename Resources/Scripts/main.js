"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("AtomicEventLoop");
require("atomic-blueprintlib.bundle");
var atomic_blueprintlib_1 = require("atomic-blueprintlib");
var blueprints = require("Modules/blueprints");
var CustomEvents = require("Modules/CustomEvents");
var LevelGenerator_1 = require("Modules/LevelGen/LevelGenerator");
// This script is the main entry point of the game
// Load up the blueprints
atomic_blueprintlib_1.catalog.loadBlueprints(blueprints, function (name) { return console.log("Loading blueprint: " + name); });
atomic_blueprintlib_1.catalog.hydrateAllBlueprints();
var scene = Atomic.player.loadScene("Scenes/Scene.scene");
// Let the scene load and then start working on the first update cycle
var so = new Atomic.ScriptObject();
so.subscribeToEvent(Atomic.SceneUpdateEvent(ready));
function ready() {
    so.unsubscribeFromAllEvents();
    var generator = new LevelGenerator_1.default(30, 30, true);
    var level = generator.generateLevel();
    so.sendEvent(CustomEvents.LoadLevelEventData({
        level: level,
        depth: 1
    }));
}
