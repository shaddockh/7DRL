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
var ROT = require("Modules/thirdparty/rot");
var Grid_1 = require("Modules/utils/Grid");
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
        _this.fill(exports.EmptyMapCell);
        return _this;
    }
    /**
     * Build up an index of interesting things to be able to quickly retreive on the level such as walkable tiles, etc.
     */
    LevelMap.prototype.buildIndex = function () {
        if (this.indexed) {
            return;
        }
        var walkables = [];
        this.iterate(function (x, y, cell) {
            if (cell.walkable) {
                walkables.push(new IndexedMapCell(cell, x, y));
            }
        });
        this.walkables = walkables;
        this.indexed = true;
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
    return LevelMap;
}(Grid_1.Grid));
exports.LevelMap = LevelMap;
//# sourceMappingURL=LevelMap.js.map