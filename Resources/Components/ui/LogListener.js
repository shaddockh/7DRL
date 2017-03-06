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
var LogListener = (function (_super) {
    __extends(LogListener, _super);
    function LogListener() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inspectorFields = {
            debug: false
        };
        return _this;
    }
    LogListener.prototype.start = function () {
        this.subscribeToEvent(CustomEvents_1.LogMessageEvent(this.logMessage.bind(this)));
    };
    LogListener.prototype.logMessage = function (data) {
        this.DEBUG(data.message);
    };
    return LogListener;
}(CustomJSComponent_1.default));
exports.default = LogListener;
//# sourceMappingURL=LogListener.js.map