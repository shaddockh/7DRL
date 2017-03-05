"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ROT = require("Modules/thirdparty/rot");
var LevelMap_1 = require("./LevelMap");
var LevelGenerator = (function () {
    function LevelGenerator(width, height, debug) {
        if (debug === void 0) { debug = false; }
        this.width = width;
        this.height = height;
        this.debug = debug;
    }
    LevelGenerator.prototype.generateLevel = function () {
        var _this = this;
        this.DEBUG("Generating level: " + this.width + "," + this.height);
        var level = new LevelMap_1.LevelMap(this.width, this.height);
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
    LevelGenerator.prototype.DEBUG = function (message) {
        if (this.debug) {
            console.log("LevelGenerator: " + message);
        }
    };
    return LevelGenerator;
}());
exports.default = LevelGenerator;
//# sourceMappingURL=LevelGenerator.js.map