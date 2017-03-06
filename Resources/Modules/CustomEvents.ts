
import { LevelMap } from "Modules/LevelGen/LevelMap";
import { Position2d } from "Game";
import LevelController from "Components/LevelController";
import * as ROT from "Modules/thirdparty/rot";
/**
 * Constructs a custom script event that can be used for subscribing to
 * @param eventType
 */
function buildEvent<T>(eventType: string): (callback: (data: T) => void) => Atomic.EventData {
    return function <T>(callback: (data: T) => void): Atomic.EventData {
        return Atomic.ScriptEvent(eventType, callback);
    };
}

/**
 * Constructs a custom script event that can be used for subscribing to
 * @param eventType
 */
function buildNotifyEvent(eventType: string): (callback: () => void) => Atomic.EventData {
    return function <T>(callback: () => void): Atomic.EventData {
        return Atomic.ScriptEvent(eventType, callback);
    };
}


/**
 * Constructs a custom script data event that can used to send
 * @param eventType
 */
function buildEventData<T>(eventType: string): (callbackData: T) => Atomic.EventCallbackMetaData {
    return function (callbackData: T): Atomic.EventCallbackMetaData {
        return Atomic.ScriptEventData(eventType, callbackData);
    };
}

/**
 * Constructs a custom script data event that can used to send. Will stringify the data to JSON before sending it and
 * is required for more complex objects that contain arrays.  Any object pointers, however, will get lost.
 * @param eventType
 */
function buildEventDataJson<T>(eventType: string): (callbackData: T) => Atomic.EventCallbackMetaData {
    return function (callbackData: T): Atomic.EventCallbackMetaData {
        return Atomic.ScriptEventData(eventType, { json: JSON.stringify(callbackData) });
    };
}
/**
 * Constructs a custom script event that can be used for subscribing to.  Will convert result from JSON to an object which
 * is required for more complex objects that contain arrays.  Any object pointers, however, will get lost.
 * @param eventType
 */
function buildEventJson<T>(eventType: string): (callback: (data: T) => void) => Atomic.EventData {
    return function <T>(callback: (data: T) => void): Atomic.EventData {
        return Atomic.ScriptEvent(eventType, (wrapper: { json: string }) => callback(JSON.parse(wrapper.json)));
    };
}


/**
 * Constructs a custom script data event that can used to send
 * @param eventType
 */
function buildNotifyEventData(eventType: string): () => Atomic.EventCallbackMetaData {
    return function (): Atomic.EventCallbackMetaData {
        return Atomic.ScriptEventData(eventType);
    };
}


/**
 * Custom event sent when a new level file should be loaded
 */
export interface LoadLevelEvent {
    level: LevelMap;
}

export const LoadLevelEvent = buildEvent<LoadLevelEvent>("LoadLevel");
export const LoadLevelEventData = buildEventData<LoadLevelEvent>("LoadLevel");

export const RenderCurrentLevelEvent = buildNotifyEvent("RenderCurrentLevel");
export const RenderCurrentLevelEventData = buildNotifyEventData("RenderCurrentLevel");

/**
 * Custom event that is sent when the primary controller for a scene has completed loading
 * @param callback 
 */
export const SceneReadyEvent = buildNotifyEvent("SceneReady");
export const SceneReadyEventData = buildNotifyEventData("SceneReady");

/**
 * Custom event that is sent to an entity to have it move
 */
export interface MoveEntityEvent {
    position: Position2d;
}

export const MoveEntityEvent = buildEvent<MoveEntityEvent>("MoveEntity");
export const MoveEntityEventData = buildEventData<MoveEntityEvent>("MoveEntity");
export const MoveEntityByOffsetEvent = buildEventJson<MoveEntityEvent>("MoveEntityByOffset");
export const MoveEntityByOffsetEventData = buildEventDataJson<MoveEntityEvent>("MoveEntityByOffset");

export interface EntityMovementInfo {
    from: Position2d;
    to: Position2d;
}
export const MoveEntityStartEvent = buildEvent<EntityMovementInfo>("MoveEntityStart");
export const MoveEntityStartEventData = buildEventData<EntityMovementInfo>("MoveEntityStart");
export const MoveEntityCompleteEvent = buildNotifyEvent("MoveEntityComplete");
export const MoveEntityCompleteEventData = buildNotifyEventData("MoveEntityComplete");
export const MoveEntityBlockedEvent = buildEvent<EntityMovementInfo>("MoveEntityBlocked");
export const MoveEntityBlockedEventData = buildEventData<EntityMovementInfo>("MoveEntityBlocked");

export interface LogMessage {
    message: string;
}
export const LogMessageEvent = buildEvent<LogMessage>("LogMessage");
export const LogMessageEventData = buildEventData<LogMessage>("LogMessage");

export interface ComponentNotificationEvent {
    targetComponent: Atomic.JSComponent;
}
export const BumpEntityEvent = buildEvent<ComponentNotificationEvent>("BumpEntity");
export const BumpEntityEventData = buildEventData<ComponentNotificationEvent>("bumpEntity");

export const SkipTurnEvent = buildNotifyEvent("SkipTurn");
export const SkipTurnEventData = buildNotifyEventData("SkipTurn");


export interface RegisterLevelActorsEvent {
    levelController: LevelController;
}
export const RegisterLevelActorsEvent = buildEvent<RegisterLevelActorsEvent>("RegisterLevelActors");
export const RegisterLevelActorsEventData = buildEventData<RegisterLevelActorsEvent>("RegisterLevelActors");

export interface RegisterActorAiEvent {
    ai: ROT.Actionable;
}
export const RegisterActorAiEvent = buildEvent<RegisterActorAiEvent>("RegisterActorAi");
export const RegisterActorAiEventData = buildEventData<RegisterActorAiEvent>("RegisterActorAi");
export const DeregisterActorAiEvent = buildEvent<RegisterActorAiEvent>("UnregisterActorAi");
export const DeregisterActorAiEventData = buildEventData<RegisterActorAiEvent>("UnregisterActorAi");

export const PlayerActionBeginEvent = buildNotifyEvent("PlayerActionBegin");
export const PlayerActionBeginEventData = buildNotifyEventData("PlayerActionBegin");

export const PlayerActionCompleteEvent = buildNotifyEvent("PlayerActionComplete");
export const PlayerActionCompleteEventData = buildNotifyEventData("PlayerActionComplete");

export const TurnTakenEvent = buildNotifyEvent("TurnTaken");
export const TurnTakenEventData = buildNotifyEventData("TurnTaken");