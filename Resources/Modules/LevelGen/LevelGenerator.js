"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ROT = require("rot");
var LevelMap_1 = require("./LevelMap");
var LevelGenerator = (function () {
    function LevelGenerator(width, height, debug) {
        if (debug === void 0) { debug = false; }
        this.width = width;
        this.height = height;
        this.debug = debug;
    }
    LevelGenerator.prototype.generateLevel = function () {
        this.DEBUG("Generating level: " + this.width + "," + this.height);
        var level = new LevelMap_1.LevelMap(this.width, this.height);
        this.generateTerrain(level);
        // this.generateExit(level);
        this.generateEntities(level);
        if (this.debug) {
            console.log("Generated Level:");
            var _loop_1 = function (y, yEnd) {
                var line = [];
                level.getCellsInRegion(y, 0, y, level.width - 1).forEach(function (cell) { return line.push(cell.terrainType == 1 /* wall */ ? "#" : "."); });
                console.log(line.join(""));
            };
            for (var y = 0, yEnd = level.height - 1; y < yEnd; y++) {
                _loop_1(y, yEnd);
            }
        }
        return level;
    };
    LevelGenerator.prototype.generateTerrain = function (level) {
        var _this = this;
        var builder = new ROT.Map.Rogue(this.width, this.height, this);
        builder.create(function (x, y, value) {
            if (level.inBounds(x, y)) {
                var cell = level.getCell(x, y);
                if (value) {
                    cell.floorGlyph = 0;
                    cell.terrainType = 1 /* wall */;
                    cell.blueprint = "tile_wall";
                }
                else {
                    cell.floorGlyph = 1;
                    cell.terrainType = 2 /* floor */;
                    cell.walkable = true;
                    cell.blueprint = "tile_floor";
                }
            }
            else {
                _this.DEBUG("assigning to tile out of bounds: " + x + "," + y);
            }
        });
        // Grab a random room
        var roomSections = builder["rooms"];
        var roomlist = roomSections[1];
        var room = roomlist.pop();
        console.log(JSON.stringify(room, null, 2));
        level.addEntity({
            gridPosition: [room.x, room.y + room.height],
            blueprint: "entity_exit_door",
            blocksPath: false,
            bumpable: true,
            entityComponent: null,
            attackable: false
        });
        level.getCell(room.x, room.y + room.height).terrainType = 2 /* floor */;
    };
    LevelGenerator.prototype.generateEntities = function (level) {
        // First generate the player
        var emptyFloor = level.findEmptyFloorCell();
        this.DEBUG("Placing player at " + emptyFloor.x + "," + emptyFloor.y);
        level.addEntity({
            gridPosition: [emptyFloor.x, emptyFloor.y],
            blueprint: "entity_player",
            blocksPath: true,
            bumpable: true,
            entityComponent: null,
            attackable: false
        });
        for (var i = 0; i < 3; i++) {
            emptyFloor = level.findEmptyFloorCell();
            this.DEBUG("Placing beetle at " + emptyFloor.x + "," + emptyFloor.y);
            level.addEntity({
                gridPosition: [emptyFloor.x, emptyFloor.y],
                blueprint: "entity_beetle",
                blocksPath: true,
                bumpable: true,
                entityComponent: null,
                attackable: false
            });
        }
    };
    LevelGenerator.prototype.generateExit = function (level) {
        var emptyFloor = level.findEmptyFloorCell();
        level.addEntity({
            gridPosition: [emptyFloor.x, emptyFloor.y],
            blueprint: "entity_exit_door",
            blocksPath: false,
            bumpable: true,
            entityComponent: null,
            attackable: false
        });
    };
    LevelGenerator.prototype.DEBUG = function (message) {
        if (this.debug) {
            console.log("LevelGenerator: " + message);
        }
    };
    return LevelGenerator;
}());
exports.default = LevelGenerator;
//# sourceMappingURL=LevelGenerator.js.map