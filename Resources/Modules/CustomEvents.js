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
/**
 * Constructs a custom script event that can be used for subscribing to
 * @param eventType
 */
function buildNotifyEvent(eventType) {
    return function (callback) {
        return Atomic.ScriptEvent(eventType, callback);
    };
}
/**
 * Constructs a custom script data event that can used to send
 * @param eventType
 */
function buildEventData(eventType) {
    return function (callbackData) {
        return Atomic.ScriptEventData(eventType, callbackData);
    };
}
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
/**
 * Constructs a custom script data event that can used to send
 * @param eventType
 */
function buildNotifyEventData(eventType) {
    return function () {
        return Atomic.ScriptEventData(eventType);
    };
}
exports.LoadLevelEvent = buildEvent("LoadLevel");
exports.LoadLevelEventData = buildEventData("LoadLevel");
exports.RenderCurrentLevelEvent = buildNotifyEvent("RenderCurrentLevel");
exports.RenderCurrentLevelEventData = buildNotifyEventData("RenderCurrentLevel");
/**
 * Custom event that is sent when the primary controller for a scene has completed loading
 * @param callback
 */
exports.SceneReadyEvent = buildNotifyEvent("SceneReady");
exports.SceneReadyEventData = buildNotifyEventData("SceneReady");
exports.MoveEntityEvent = buildEvent("MoveEntity");
exports.MoveEntityEventData = buildEventData("MoveEntity");
exports.MoveEntityByOffsetEvent = buildEventJson("MoveEntityByOffset");
exports.MoveEntityByOffsetEventData = buildEventDataJson("MoveEntityByOffset");
exports.MoveEntityStartEvent = buildEvent("MoveEntityStart");
exports.MoveEntityStartEventData = buildEventData("MoveEntityStart");
exports.MoveEntityCompleteEvent = buildNotifyEvent("MoveEntityComplete");
exports.MoveEntityCompleteEventData = buildNotifyEventData("MoveEntityComplete");
exports.MoveEntityBlockedEvent = buildEvent("MoveEntityBlocked");
exports.MoveEntityBlockedEventData = buildEventData("MoveEntityBlocked");
exports.LogMessageEvent = buildEvent("LogMessage");
exports.LogMessageEventData = buildEventData("LogMessage");
exports.BumpEntityEvent = buildEvent("BumpEntity");
exports.BumpEntityEventData = buildEventData("bumpEntity");
exports.SkipTurnEvent = buildNotifyEvent("SkipTurn");
exports.SkipTurnEventData = buildNotifyEventData("SkipTurn");
exports.RegisterLevelActorsEvent = buildEvent("RegisterLevelActors");
exports.RegisterLevelActorsEventData = buildEventData("RegisterLevelActors");
exports.RegisterActorAiEvent = buildEvent("RegisterActorAi");
exports.RegisterActorAiEventData = buildEventData("RegisterActorAi");
exports.DeregisterActorAiEvent = buildEvent("UnregisterActorAi");
exports.DeregisterActorAiEventData = buildEventData("UnregisterActorAi");
exports.PlayerActionBeginEvent = buildNotifyEvent("PlayerActionBegin");
exports.PlayerActionBeginEventData = buildNotifyEventData("PlayerActionBegin");
exports.PlayerActionCompleteEvent = buildNotifyEvent("PlayerActionComplete");
exports.PlayerActionCompleteEventData = buildNotifyEventData("PlayerActionComplete");
exports.TurnTakenEvent = buildNotifyEvent("TurnTaken");
exports.TurnTakenEventData = buildNotifyEventData("TurnTaken");
//# sourceMappingURL=CustomEvents.js.map