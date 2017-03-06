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
var EntityOrderRenderer = (function (_super) {
    __extends(EntityOrderRenderer, _super);
    function EntityOrderRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inspectorFields = {
            debug: true,
            orderInLayer: 2,
            slicesInLayer: 4
        };
        _this.slicesInLayer = 4;
        return _this;
    }
    Object.defineProperty(EntityOrderRenderer.prototype, "gridPosition", {
        get: function () {
            return this.node.getJSComponent("Entity").gridPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityOrderRenderer.prototype, "entityComponent", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    EntityOrderRenderer.prototype.start = function () {
        this.subscribeToEvent(CustomEvents_1.MoveEntityCompleteEvent(this.onMoveEntityComplete.bind(this)));
    };
    EntityOrderRenderer.prototype.onMoveEntityComplete = function () {
        var currentLevel = this.node.scene.getJSComponent("LevelController").currentLevel;
        this.getComponent("StaticSprite2D").orderInLayer = (currentLevel.height - this.gridPosition[1]) * this.slicesInLayer + this.orderInLayer;
    };
    EntityOrderRenderer.prototype.update = function (timeStep) {
    };
    return EntityOrderRenderer;
}(CustomJSComponent_1.default));
exports.default = EntityOrderRenderer;
//# sourceMappingURL=EntityOrderRenderer.js.map