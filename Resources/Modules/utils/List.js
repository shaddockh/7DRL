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
 * List class with some nice utility functions.  This descends from Atomic.ScriptObject so that
 * it can be passed through the event system
 */
var List = (function (_super) {
    __extends(List, _super);
    function List() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.internalList = [];
        return _this;
    }
    /**
     * Iterate over elements until one is found
     * @param callback
     */
    List.prototype.find = function (callback) {
        for (var i = 0, iEnd = this.internalList.length; i < iEnd; i++) {
            if (callback(this[i])) {
                return this[i];
            }
        }
        return null;
    };
    /**
     * Find the index of an item in a search.  Returns -1 if the item is not found
     * @param callback
     */
    List.prototype.findIndex = function (callback) {
        for (var i = 0, iEnd = this.internalList.length; i < iEnd; i++) {
            if (callback(this[i])) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Add an item to the list
     * @param item
     */
    List.prototype.add = function (item) {
        return this.internalList.push(item);
    };
    /**
     * Remove an item from the list
     * @param index
     */
    List.prototype.removeAtIndex = function (index) {
        this.internalList.splice(index);
    };
    Object.defineProperty(List.prototype, "length", {
        get: function () {
            return this.internalList.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
      * Performs the specified action for each element in an array.
      * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
      * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    List.prototype.forEach = function (callbackfn, thisArg) {
        this.internalList.forEach(callbackfn);
    };
    /**
     * Replace an element in the list at the provided index
     * @param index
     * @param value
     */
    List.prototype.replaceAt = function (index, value) {
        this.internalList[index] = value;
    };
    return List;
}(Atomic.ScriptObject));
exports.default = List;
//# sourceMappingURL=List.js.map