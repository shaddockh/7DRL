"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ROT = require("rot");
var Grid_1 = require("Modules/utils/Grid");
var List_1 = require("Modules/utils/List");
exports.EmptyMapCell = {
    visible: false,
    walkable: false,
    seen: false,
    floorGlyph: 0,
    terrainType: 0 /* empty */,
    blueprint: "tile_empty"
};
var IndexedMapCell = (function () {
    function IndexedMapCell(mapCell, x, y) {
        this.cell = mapCell;
        this.x = x;
        this.y = y;
    }
    return IndexedMapCell;
}());
exports.IndexedMapCell = IndexedMapCell;
var LevelMap = (function (_super) {
    __extends(LevelMap, _super);
    function LevelMap(width, height) {
        var _this = _super.call(this, width, height) || this;
        _this.indexed = false;
        _this.entities = new List_1.default();
        _this.fill(exports.EmptyMapCell);
        return _this;
    }
    LevelMap.prototype.addEntity = function (entity) {
        this.entities.add(entity);
    };
    LevelMap.prototype.inBounds = function (xOrPos, y) {
        if (typeof (xOrPos) != "number") {
            return _super.prototype.inBounds.call(this, xOrPos[0], xOrPos[1]);
        }
        else {
            return _super.prototype.inBounds.call(this, xOrPos, y);
        }
    };
    LevelMap.prototype.getCell = function (xOrPos, y) {
        if (typeof (xOrPos) != "number") {
            return _super.prototype.getCell.call(this, xOrPos[0], xOrPos[1]);
        }
        else {
            return _super.prototype.getCell.call(this, xOrPos, y);
        }
    };
    /**
     * Iterate all the entities at a position.  Caller should return "true" in the callback to exit early
     * @param pos
     * @param callback
     */
    LevelMap.prototype.iterateEntitiesAt = function (pos, callback) {
        this.entities.forEach(function (e, idx) {
            if (!e.deleted) {
                var ePos = e.gridPosition;
                if (ePos[0] == pos[0] && ePos[1] == pos[1]) {
                    if (callback(e)) {
                        return;
                    }
                }
            }
        });
    };
    /**
     * Build up an index of interesting things to be able to quickly retreive on the level such as walkable tiles, etc.
     */
    LevelMap.prototype.buildIndex = function () {
        //if (!this.indexed) {
        //TODO: Optimize!!
        var _this = this;
        var walkables = [];
        this.iterate(function (x, y, cell) {
            if (cell.walkable) {
                var clear_1 = true;
                _this.iterateEntitiesAt([x, y], function (e) {
                    if (e.blocksPath) {
                        clear_1 = false;
                        return true;
                    }
                });
                if (clear_1) {
                    walkables.push(new IndexedMapCell(cell, x, y));
                }
            }
        });
        this.walkables = walkables;
        this.indexed = true;
        //}
    };
    /**
     * Look through an find an empty walkable tile
     */
    LevelMap.prototype.findEmptyFloorCell = function () {
        this.buildIndex();
        // first scan for an empty floor
        var iterations = 0;
        while (true) {
            var cell = this.walkables[ROT.RNG.getUniformInt(0, this.walkables.length)];
            if (cell) {
                return cell;
            }
            iterations++;
            if (iterations > 1000) {
                throw new Error("Could not find an empty floor cell after 1000 iterations");
            }
        }
    };
    /**
     * Look through an find an empty walkable tile in the current area
     */
    LevelMap.prototype.findEmptyFloorCellInRadius = function (origin, radius) {
        this.buildIndex();
        // first scan for an empty floor
        var iterations = 0;
        var nearbyWalkables = this.walkables.filter(function (c) {
            if (c.x == origin[0] && c.y == origin[1]) {
                return false;
            }
            return Math.abs(c.x - origin[0]) <= radius && Math.abs(c.y - origin[1]) <= radius;
        });
        while (true) {
            var cell = nearbyWalkables[ROT.RNG.getUniformInt(0, nearbyWalkables.length)];
            if (cell) {
                // force cardinal directions
                if (cell.x != 0 && cell.y != 0) {
                    if (ROT.RNG.getUniformInt(0, 1) == 0) {
                        // cell.x = 0;
                    }
                    else {
                        // cell.y = 0;
                    }
                }
                return cell;
            }
            iterations++;
            if (iterations > 1000) {
                throw new Error("Could not find an empty floor cell after 1000 iterations");
            }
        }
    };
    return LevelMap;
}(Grid_1.Grid));
exports.LevelMap = LevelMap;
//# sourceMappingURL=LevelMap.js.map