
import { LevelMap } from "Modules/LevelGen/LevelMap";

/**
 * Custom event sent when a new level file should be loaded
 */
export interface LoadLevelEvent {
    level: LevelMap;
}

export function LoadLevelEventData(callbackData: LoadLevelEvent): Atomic.EventCallbackMetaData {
    return Atomic.ScriptEventData("LoadLevel", callbackData);
}

export function LoadLevelEvent(callback: (data: LoadLevelEvent) => void): Atomic.EventMetaData {
    return Atomic.ScriptEvent("LoadLevel", callback);
}

/**
 * Custom event that is sent when the primary controller for a scene has completed loading
 * @param callback 
 */
export function SceneReadyEvent(callback: () => void): Atomic.EventMetaData {
    return Atomic.ScriptEvent("SceneReady", callback);
}

export function SceneReadyEventData(): Atomic.EventCallbackMetaData {
    return Atomic.ScriptEventData("SceneReady");
}