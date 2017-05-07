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
var CustomEvents_1 = require("Modules/CustomEvents");
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
"atomic component";
var EntityRenderOptions = (function (_super) {
    __extends(EntityRenderOptions, _super);
    function EntityRenderOptions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inspectorFields = {
            debug: false,
            orderInLayer: 2,
            slicesInLayer: 4,
            yOffset: 40
        };
        _this.slicesInLayer = 4;
        _this.yOffset = 40;
        return _this;
    }
    Object.defineProperty(EntityRenderOptions.prototype, "gridPosition", {
        get: function () {
            return this.node.getJSComponent("Entity").gridPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRenderOptions.prototype, "entityComponent", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    EntityRenderOptions.prototype.start = function () {
        this.subscribeToEvent(this.node, CustomEvents_1.MoveEntityCompleteEvent(this.onMoveEntityComplete.bind(this)));
        this.onMoveEntityComplete();
    };
    EntityRenderOptions.prototype.onMoveEntityComplete = function () {
        var currentLevel = this.node.scene.getJSComponent("LevelController").currentLevel;
        this.getComponent("StaticSprite2D").orderInLayer = (currentLevel.height - this.gridPosition[1]) * this.slicesInLayer + this.orderInLayer;
    };
    EntityRenderOptions.prototype.update = function (timeStep) {
    };
    return EntityRenderOptions;
}(CustomJSComponent_1.default));
exports.default = EntityRenderOptions;
