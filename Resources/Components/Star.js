"atomic component";
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
/**
 * Component that will rotate a node at a configurable speed.
 */
var Star = (function (_super) {
    __extends(Star, _super);
    function Star() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields witihin the inspectorFields object will be exposed to the editor
         */
        _this.inspectorFields = {
            speed: 1.0
        };
        return _this;
    }
    /**
     * Update called every cycle with timeStep containing the delta between calls
     * @param  {number} timeStep time since last call to update
     */
    Star.prototype.update = function (timeStep) {
        this.node.rotate2D(timeStep * 75 * this.speed);
    };
    return Star;
}(Atomic.JSComponent));
exports.default = Star;
//# sourceMappingURL=Star.js.map