"use strict";
// Contains the map
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generic grid structure that contains a 2-D array of elements
 */
var Grid = (function (_super) {
    __extends(Grid, _super);
    /**
     * builds a new map
     * @param width width of the map
     * @param height heigh of the map
     */
    function Grid(width, height) {
        var _this = _super.call(this) || this;
        _this.width = width;
        _this.height = height;
        _this.cells = [];
        _this.cells.length = height * width;
        return _this;
    }
    /**
     * returns the cell at x,y or throws an error if not in bounds
     * @param x
     * @param y
     */
    Grid.prototype.getCell = function (x, y) {
        this.checkBounds(x, y);
        return this.cells[(y * this.width) + x];
    };
    /**
     * Sets the value of the cell at location
     * @param x
     * @param y
     * @param cell
     */
    Grid.prototype.setCell = function (x, y, cell) {
        this.checkBounds(x, y);
        this.cells[y * this.width + x] = cell;
    };
    Grid.prototype.fill = function (cellPrototype) {
        for (var i = 0, iEnd = this.cells.length; i < iEnd; i++) {
            // use the spread operator to make a shallow clone of the object
            var copy = __assign({}, cellPrototype);
            this.cells[i] = copy;
        }
    };
    /**
     * Get all the cells within a provided rectangle
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    Grid.prototype.getCellsInRegion = function (x1, y1, x2, y2) {
        var result = [];
        for (var y = y1; y <= y2; y++) {
            for (var x = x1; x <= x2; x++) {
                result.push(this.getCell(x, y));
            }
        }
        return result;
    };
    /**
     * iterate over the grid, calling back for every cell.  return "true" in the callback to stop iterating early
     * @param callback
     */
    Grid.prototype.iterate = function (callback) {
        for (var y = 0, yEnd = this.height; y < yEnd; y++) {
            for (var x = 0, xEnd = this.width; x < xEnd; x++) {
                if (callback(x, y, this.getCell(x, y))) {
                    return;
                }
            }
        }
    };
    /**
     * iterate over the grid, calling back for every cell.  return "true" in the callback to stop iterating early
     * @param callback
     */
    Grid.prototype.iterateBottomUp = function (callback) {
        for (var y = this.height - 1; y >= 0; y--) {
            for (var x = 0, xEnd = this.width; x < xEnd; x++) {
                if (callback(x, y, this.getCell(x, y))) {
                    return;
                }
            }
        }
    };
    /**
     * Checks to make sure the coordinates are in the bounds of the grid and if not throws an error
     * @param x
     * @param y
     */
    Grid.prototype.checkBounds = function (x, y) {
        if (!this.inBounds(x, y)) {
            throw new Error("Out of bounds: (" + x + "," + y + ")");
        }
    };
    /**
     * returns whether the x,y is within the bounds of the grid
     * @param x
     * @param y
     */
    Grid.prototype.inBounds = function (x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };
    return Grid;
}(Atomic.ScriptObject));
exports.Grid = Grid;
