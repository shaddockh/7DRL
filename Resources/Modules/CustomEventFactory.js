"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Constructs a custom script event that can be used for subscribing to
 * @param eventType
 */
function buildEvent(eventType) {
    return function (callback) {
        return Atomic.ScriptEvent(eventType, callback);
    };
}
exports.buildEvent = buildEvent;
/**
 * Constructs a custom script event that can be used for subscribing to
 * @param eventType
 */
function buildNotifyEvent(eventType) {
    return function (callback) {
        return Atomic.ScriptEvent(eventType, callback);
    };
}
exports.buildNotifyEvent = buildNotifyEvent;
/**
 * Constructs a custom script data event that can used to send
 * @param eventType
 */
function buildEventData(eventType) {
    return function (callbackData) {
        return Atomic.ScriptEventData(eventType, callbackData);
    };
}
exports.buildEventData = buildEventData;
/**
 * Constructs a custom script data event that can used to send. Will stringify the data to JSON before sending it and
 * is required for more complex objects that contain arrays.  Any object pointers, however, will get lost.
 * @param eventType
 */
function buildEventDataJson(eventType) {
    return function (callbackData) {
        return Atomic.ScriptEventData(eventType, { json: JSON.stringify(callbackData) });
    };
}
exports.buildEventDataJson = buildEventDataJson;
/**
 * Constructs a custom script event that can be used for subscribing to.  Will convert result from JSON to an object which
 * is required for more complex objects that contain arrays.  Any object pointers, however, will get lost.
 * @param eventType
 */
function buildEventJson(eventType) {
    return function (callback) {
        return Atomic.ScriptEvent(eventType, function (wrapper) { return callback(JSON.parse(wrapper.json)); });
    };
}
exports.buildEventJson = buildEventJson;
/**
 * Constructs a custom script data event that can used to send
 * @param eventType
 */
function buildNotifyEventData(eventType) {
    return function () {
        return Atomic.ScriptEventData(eventType);
    };
}
exports.buildNotifyEventData = buildNotifyEventData;
//# sourceMappingURL=CustomEventFactory.js.map