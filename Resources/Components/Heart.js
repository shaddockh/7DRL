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
var CustomEvents_2 = require("Modules/CustomEvents");
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
"atomic component";
var Heart = (function (_super) {
    __extends(Heart, _super);
    function Heart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
        * Fields witihin the inspectorFields object will be exposed to the editor
        */
        _this.inspectorFields = {
            debug: false,
            value: 2
        };
        _this.value = 2;
        return _this;
    }
    Heart.prototype.start = function () {
        this.subscribeToEvent(this.node, CustomEvents_2.BumpedByEntityEvent(this.onBump.bind(this)));
    };
    Heart.prototype.onBump = function (data) {
        var _this = this;
        //TODO: hard coding
        if (data.senderComponent.node.name == "entity_player") {
            this.sendEvent(CustomEvents_1.DamageEntityEventData({
                value: this.value * -1
            }));
            this.deferAction(function () {
                Atomic.destroy(_this.node);
            });
        }
    };
    return Heart;
}(CustomJSComponent_1.default));
exports.default = Heart;
//# sourceMappingURL=Heart.js.map