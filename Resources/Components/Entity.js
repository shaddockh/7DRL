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
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
"atomic component";
var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inspectorFields = {
            debug: true,
            blocksPath: false,
            bumpable: false
        };
        return _this;
    }
    Object.defineProperty(Entity.prototype, "gridPosition", {
        get: function () {
            return this.node.getJSComponent("GridMover").gridPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "entityComponent", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Entity.prototype.start = function () { };
    Entity.prototype.update = function (timeStep) { };
    return Entity;
}(CustomJSComponent_1.default));
exports.default = Entity;
//# sourceMappingURL=Entity.js.map