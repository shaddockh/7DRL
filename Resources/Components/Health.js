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
var CustomEvents_1 = require("../Modules/CustomEvents");
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
"atomic component";
var Health = (function (_super) {
    __extends(Health, _super);
    function Health() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
        * Fields witihin the inspectorFields object will be exposed to the editor
        */
        _this.inspectorFields = {
            debug: false,
            life: 1,
        };
        _this.life = 1;
        return _this;
    }
    Health.prototype.start = function () {
        this.DEBUG("Start");
        this.subscribeToEvent(this.node, CustomEvents_1.AdjustEntityHealthEvent(this.onAdjustEntityHealth.bind(this)));
    };
    Health.prototype.onAdjustEntityHealth = function (data) {
        this.life = Math.max(0, this.life + data.value);
        this.DEBUG("onAdjustEntityHealth: (adjust value: " + data.value + ", new life: " + this.life + ")");
        if (this.life == 0) {
            // TODO: should we send an on health changed event?
            // TODO: kill
            this.DEBUG("onDamageEntity: sending kill message");
            this.node.sendEvent(CustomEvents_1.DestroyEntityEventData());
        }
    };
    return Health;
}(CustomJSComponent_1.default));
exports.default = Health;
//# sourceMappingURL=Health.js.map