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
var CustomJSComponent = (function (_super) {
    __extends(CustomJSComponent, _super);
    function CustomJSComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.debug = false;
        _this._componentName = null;
        // Need to make this a part of the class so it doesn't get GC'd before the event fires
        _this.deferredActionHandler = null;
        return _this;
    }
    /**
     * Write a debug message to the console prefixed by the component name
     * @param {string} msg Message to write to the console
     */
    CustomJSComponent.prototype.DEBUG = function (msg) {
        if (this.debug) {
            if (!this._componentName) {
                this._componentName = Atomic.splitPath(this.componentFile.name).fileName;
            }
            if (typeof (msg) == "object") {
                console.log(this.node.name + "." + this._componentName + ": " + JSON.stringify(msg, null, 2));
            }
            else {
                console.log(this.node.name + "." + this._componentName + ": " + msg);
            }
        }
    };
    /**
     * Return the common name of the entity.  If it doesn't exist, return the node name
     * @param targetComponent
     */
    CustomJSComponent.prototype.getEntityName = function (targetComponent) {
        var common = targetComponent.node.getJSComponent("Common");
        if (common) {
            return common.name;
        }
        // fallback
        return targetComponent.node.name;
    };
    CustomJSComponent.prototype.deferAction = function (callback, eventName, sender) {
        var _this = this;
        if (eventName === void 0) { eventName = Atomic.UpdateEventType; }
        if (!this.deferredActionHandler) {
            this.deferredActionHandler = new Atomic.ScriptObject();
        }
        this.DEBUG("Waiting for deferred event: " + eventName);
        var tempCallback = function () {
            _this.DEBUG("Called deferred event: " + eventName + " from " + _this.deferredActionHandler.eventSender["name"]);
            _this.deferredActionHandler.unsubscribeFromEvent(eventName);
            callback();
        };
        if (sender) {
            this.deferredActionHandler.subscribeToEvent(sender, Atomic.ScriptEvent(eventName, tempCallback));
        }
        else {
            this.deferredActionHandler.subscribeToEvent(Atomic.ScriptEvent(eventName, tempCallback));
        }
    };
    return CustomJSComponent;
}(Atomic.JSComponent));
exports.default = CustomJSComponent;
//# sourceMappingURL=CustomJSComponent.js.map