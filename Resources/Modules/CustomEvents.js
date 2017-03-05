"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function LoadLevelEventData(callbackData) {
    return Atomic.ScriptEventData("LoadLevel", callbackData);
}
exports.LoadLevelEventData = LoadLevelEventData;
function LoadLevelEvent(callback) {
    return Atomic.ScriptEvent("LoadLevel", callback);
}
exports.LoadLevelEvent = LoadLevelEvent;
/**
 * Custom event that is sent when the primary controller for a scene has completed loading
 * @param callback
 */
function SceneReadyEvent(callback) {
    return Atomic.ScriptEvent("SceneReady", callback);
}
exports.SceneReadyEvent = SceneReadyEvent;
function SceneReadyEventData() {
    return Atomic.ScriptEventData("SceneReady");
}
exports.SceneReadyEventData = SceneReadyEventData;
//# sourceMappingURL=CustomEvents.js.map