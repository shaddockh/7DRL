"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This script is the main entry point of the game
require("atomic-blueprintlib.bundle");
var ROT = require("rot");
Atomic.player.loadScene("Scenes/Scene.scene");
var scheduler = new ROT.Scheduler.Simple();
var engine = new ROT.Engine(scheduler);
//# sourceMappingURL=main.js.map