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
var LevelGenerator_1 = require("Modules/LevelGen/LevelGenerator");
"atomic component";
var Door = (function (_super) {
    __extends(Door, _super);
    function Door() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
        * Fields witihin the inspectorFields object will be exposed to the editor
        */
        _this.inspectorFields = {
            debug: false
        };
        return _this;
    }
    Door.prototype.start = function () {
        this.subscribeToEvent(this.node, CustomEvents_2.BumpedByEntityEvent(this.onBumpedByEntity.bind(this)));
    };
    Door.prototype.onBumpedByEntity = function (data) {
        this.DEBUG("Generating next level");
        // let's render the next levelj
        var generator = new LevelGenerator_1.default(20, 20, true);
        var level = generator.generateLevel();
        this.sendEvent(CustomEvents_1.LoadLevelEventData({
            level: level
        }));
    };
    return Door;
}(CustomJSComponent_1.default));
exports.default = Door;
//# sourceMappingURL=Door.js.map