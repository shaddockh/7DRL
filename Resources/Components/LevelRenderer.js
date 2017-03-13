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
var nodeBuilder = require("atomic-blueprintlib");
var CustomEvents = require("Modules/CustomEvents");
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
"atomic component";
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
        this.subscribeToEvent(CustomEvents.RenderCurrentLevelEvent(this.render.bind(this)));
    };
    LevelRenderer.prototype.clear = function () {
        for (var i = 0; i < this.childNodes.length; i++) {
            var node = this.childNodes[i];
            if (node != this.player) {
                // TODO: Maybe descend all ai classes from the same interface?
                var ai = node.getComponent("BasicMonsterAi");
                Atomic.destroy(this.childNodes[i]);
            }
        }
        this.childNodes = [];
        if (this.player) {
            this.childNodes.push(this.player);
        }
    };
    LevelRenderer.prototype.render = function () {
        var _this = this;
        if (this.childNodes.length) {
            this.clear();
        }
        this.DEBUG("About to render level");
        var currentLevel = this.node.scene.getJSComponent("LevelController").currentLevel;
        var start = new Date().getTime();
        try {
            var scaleX_1 = this.gridPixelSizeX * Atomic.PIXEL_SIZE;
            var scaleY_1 = this.gridPixelSizeY * Atomic.PIXEL_SIZE;
            var offsetX = currentLevel.width / 2 * scaleX_1 * -1;
            var offsetY = currentLevel.height / 2 * scaleY_1 * -1;
            currentLevel.iterate(function (x, y, cell) {
                if (cell.terrainType !== 0 /* empty */) {
                    // this.DEBUG(`Construction cell [${x},${y}] - ${cell.blueprint}`);
                    var tileNode = nodeBuilder.createChildAtPosition(_this.node, cell.blueprint, [x * scaleX_1, y * scaleY_1]);
                    tileNode.getComponent("StaticSprite2D").orderInLayer = ((currentLevel.height - y) * 4);
                    _this.childNodes.push(tileNode);
                }
            });
            var scaleYChar_1 = (this.gridPixelSizeY) * Atomic.PIXEL_SIZE;
            var defaultYOffset_1 = 40 * Atomic.PIXEL_SIZE;
            currentLevel.entities.forEach(function (e, index) {
                _this.DEBUG("About to construct entity: " + e.blueprint);
                if (e.blueprint != "entity_player" || (e.blueprint == "entity_player" && !_this.player)) {
                    var entityNode = nodeBuilder.createChildAtPosition(_this.node, e.blueprint, [e.gridPosition[0] * scaleX_1, e.gridPosition[1] * scaleYChar_1]);
                    currentLevel.entities.replaceAt(index, entityNode.getJSComponent("Entity"));
                    var ero = entityNode.getJSComponent("EntityRenderOptions");
                    var yOffset = defaultYOffset_1;
                    if (ero) {
                        yOffset = ero.yOffset * Atomic.PIXEL_SIZE;
                    }
                    entityNode.translate2D([0, yOffset]);
                    // TODO: this should be less coupled.. maybe send a message
                    if (e.blueprint == "entity_player") {
                        entityNode.getJSComponent("GridMover").subscribeToMovementController(_this.node.scene.getJSComponent("PlayerInputHandler"));
                        _this.player = entityNode;
                    }
                    entityNode.getJSComponent("Entity").gridPosition = e.gridPosition;
                    _this.childNodes.push(entityNode);
                }
                else {
                    // update the player position here
                    currentLevel.entities.replaceAt(index, _this.player.getJSComponent("Entity"));
                    _this.player.getJSComponent("Entity").gridPosition = e.gridPosition;
                    _this.player.position2D = [e.gridPosition[0] * scaleX_1, e.gridPosition[1] * scaleYChar_1];
                    var ero = _this.player.getJSComponent("EntityRenderOptions");
                    var yOffset = defaultYOffset_1;
                    if (ero) {
                        yOffset = ero.yOffset * Atomic.PIXEL_SIZE;
                    }
                    _this.player.translate2D([0, yOffset]);
                }
            });
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