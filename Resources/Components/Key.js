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
var Key = (function (_super) {
    __extends(Key, _super);
    function Key() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
        * Fields witihin the inspectorFields object will be exposed to the editor
        */
        _this.inspectorFields = {
            debug: false,
            keyId: 1
        };
        _this.keyId = 1;
        return _this;
    }
    Key.prototype.start = function () {
        this.subscribeToEvent(this.node, CustomEvents_2.BumpedByEntityEvent(this.onBumpedByEntity.bind(this)));
    };
    Key.prototype.onBumpedByEntity = function (data) {
        var _this = this;
        this.DEBUG("Got a bump event");
        var common = data.senderComponent.node.getJSComponent("Common");
        if (common.isPlayer) {
            this.node.sendEvent(CustomEvents_1.LogMessageEventData({ message: "You found a key!" }));
            this.node.sendEvent(CustomEvents_2.KeyPickedUpEventData({ keyId: this.keyId }));
            this.node.sendEvent(CustomEvents_2.DestroyEntityEventData());
            this.deferAction(function () { return Atomic.destroy(_this.node); });
        }
    };
    return Key;
}(CustomJSComponent_1.default));
exports.default = Key;
