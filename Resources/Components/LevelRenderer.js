"atomic component";
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
var events = require("Modules/CustomEvents");
var nodeBuilder = require("atomic-blueprintlib");
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
var LevelRenderer = (function (_super) {
    __extends(LevelRenderer, _super);
    function LevelRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields witihin the inspectorFields object will be exposed to the editor
         */
        _this.inspectorFields = {
            debug: true,
            gridPixelSizeX: 101,
            gridPixelSizeY: 80,
            zoom: 1.0
        };
        _this.childNodes = [];
        return _this;
    }
    LevelRenderer.prototype.start = function () {
        var _this = this;
        this.subscribeToEvent(events.LoadLevelEvent(function (data) { return _this.loadLevel(data); }));
        this.sendEvent(events.SceneReadyEventData());
    };
    LevelRenderer.prototype.update = function (timeStep) {
        // this.node.rotate2D(timeStep * 75 * this.speed);
    };
    LevelRenderer.prototype.loadLevel = function (eventData) {
        this.DEBUG("Loading new level");
        this.currentLevel = eventData.level;
        this.render();
    };
    LevelRenderer.prototype.render = function () {
        var _this = this;
        var start = new Date().getTime();
        try {
            var scaleX_1 = this.gridPixelSizeX * Atomic.PIXEL_SIZE;
            var scaleY_1 = this.gridPixelSizeY * Atomic.PIXEL_SIZE;
            var offsetX = this.currentLevel.width / 2 * scaleX_1 * -1;
            var offsetY = this.currentLevel.height / 2 * scaleY_1 * -1;
            this.currentLevel.iterate(function (x, y, cell) {
                if (cell.terrainType !== 0 /* empty */) {
                    // this.DEBUG(`Construction cell [${x},${y}] - ${cell.blueprint}`);
                    var tileNode = nodeBuilder.createChildAtPosition(_this.node, cell.blueprint, [x * scaleX_1, y * scaleY_1]);
                    tileNode.getComponent("StaticSprite2D").orderInLayer = ((_this.currentLevel.height - y) * 4);
                    _this.childNodes.push(tileNode);
                }
            });
            // let's just grab an empty cell and drop a player on it for now..
            // TODO: move this out
            var emptyFloor = this.currentLevel.findEmptyFloorCell();
            var scaleYChar = (this.gridPixelSizeY) * Atomic.PIXEL_SIZE;
            var yOffset = 40 * Atomic.PIXEL_SIZE;
            var playerNode = nodeBuilder.createChildAtPosition(this.node, "entity_player", [emptyFloor.x * scaleX_1, emptyFloor.y * scaleYChar + yOffset]);
            // playerNode.getComponent<Atomic.StaticSprite2D>("StaticSprite2D").orderInLayer = this.currentLevel.height - emptyFloor.y;
            playerNode.getComponent("StaticSprite2D").orderInLayer = ((this.currentLevel.height - emptyFloor.y) * 4) + 2;
            this.DEBUG("Placing player at " + emptyFloor.x + "," + emptyFloor.y);
            this.childNodes.push(playerNode);
            this.node.position2D = [offsetX, offsetY];
            this.DEBUG("Changing zoom level from: " + this.node.scene.getMainCamera().zoom + " to " + this.zoom);
            this.node.scene.getMainCamera().zoom = this.zoom;
        }
        finally {
            this.DEBUG("Rendering complete after " + (new Date().getTime() - start) + " ms");
        }
    };
    return LevelRenderer;
}(CustomJSComponent_1.default));
exports.default = LevelRenderer;
//# sourceMappingURL=LevelRenderer.js.map