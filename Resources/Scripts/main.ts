// This script is the main entry point of the game
import "atomic-blueprintlib.bundle";
import * as ROT from "rot";

Atomic.player.loadScene("Scenes/Scene.scene");

let scheduler = new ROT.Scheduler.Simple();
let engine = new ROT.Engine(scheduler);







