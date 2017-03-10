
import { LevelMap } from "Modules/LevelGen/LevelMap";
import { Position2d, Attacker } from "Game";
import LevelController from "Components/LevelController";
import * as CustomEventFactory from "./CustomEventFactory";
import * as ROT from "rot";



/**
 * Custom event sent when a new level file should be loaded
 */
export interface LoadLevelEvent {
    level: LevelMap;
    depth: number;
}

export const LoadLevelEvent = CustomEventFactory.buildEvent<LoadLevelEvent>("LoadLevel");
export const LoadLevelEventData = CustomEventFactory.buildEventData<LoadLevelEvent>("LoadLevel");

export const RenderCurrentLevelEvent = CustomEventFactory.buildNotifyEvent("RenderCurrentLevel");
export const RenderCurrentLevelEventData = CustomEventFactory.buildNotifyEventData("RenderCurrentLevel");

/**
 * Custom event that is sent when the primary controller for a scene has completed loading
 * @param callback 
 */
export const SceneReadyEvent = CustomEventFactory.buildNotifyEvent("SceneReady");
export const SceneReadyEventData = CustomEventFactory.buildNotifyEventData("SceneReady");

/**
 * Custom event that is sent to an entity to have it move
 */
export interface MoveEntityEvent {
    position: Position2d;
}

export const MoveEntityEvent = CustomEventFactory.buildEvent<MoveEntityEvent>("MoveEntity");
export const MoveEntityEventData = CustomEventFactory.buildEventData<MoveEntityEvent>("MoveEntity");
export const MoveEntityByOffsetEvent = CustomEventFactory.buildEventJson<MoveEntityEvent>("MoveEntityByOffset");
export const MoveEntityByOffsetEventData = CustomEventFactory.buildEventDataJson<MoveEntityEvent>("MoveEntityByOffset");

export interface EntityMovementInfo {
    from: Position2d;
    to: Position2d;
}
export const MoveEntityStartEvent = CustomEventFactory.buildEvent<EntityMovementInfo>("MoveEntityStart");
export const MoveEntityStartEventData = CustomEventFactory.buildEventData<EntityMovementInfo>("MoveEntityStart");
export const MoveEntityCompleteEvent = CustomEventFactory.buildNotifyEvent("MoveEntityComplete");
export const MoveEntityCompleteEventData = CustomEventFactory.buildNotifyEventData("MoveEntityComplete");
export const MoveEntityBlockedEvent = CustomEventFactory.buildEvent<EntityMovementInfo>("MoveEntityBlocked");
export const MoveEntityBlockedEventData = CustomEventFactory.buildEventData<EntityMovementInfo>("MoveEntityBlocked");

export interface LogMessage {
    message: string;
}
export const LogMessageEvent = CustomEventFactory.buildEvent<LogMessage>("LogGameMessage");
export const LogMessageEventData = CustomEventFactory.buildEventData<LogMessage>("LogGameMessage");

export interface ComponentNotificationEvent {
    senderComponent: Atomic.JSComponent;
    targetComponent: Atomic.JSComponent;
}
export const BumpEntityEvent = CustomEventFactory.buildEvent<ComponentNotificationEvent>("BumpEntity");
export const BumpEntityEventData = CustomEventFactory.buildEventData<ComponentNotificationEvent>("bumpEntity");

export const AttackEntityEvent = CustomEventFactory.buildEvent<ComponentNotificationEvent>("AttackEntity");
export const AttackEntityEventData = CustomEventFactory.buildEventData<ComponentNotificationEvent>("AttackEntity");

export const BumpedByEntityEvent = CustomEventFactory.buildEvent<ComponentNotificationEvent>("BumpedByEntity");
export const BumpedByEntityEventData = CustomEventFactory.buildEventData<ComponentNotificationEvent>("BumpedByEntity");

export const DestroyEntityEvent = CustomEventFactory.buildNotifyEvent("DestroyEntity");
export const DestroyEntityEventData = CustomEventFactory.buildNotifyEventData("DestroyEntity");

export interface DamageEntityEvent {
    value: number;
}

export const DamageEntityEvent = CustomEventFactory.buildEvent<DamageEntityEvent>("DamageEntity");
export const DamageEntityEventData = CustomEventFactory.buildEventData<DamageEntityEvent>("DamageEntity");

export interface HitEvent {
    // TODO: maybe pass a common interface for calling back to get damage so we don't care what component sent it?
    // ie: DamageHandler { getAttackDamage(defender:DefenderInterface)}
    attackerComponent: Attacker;
}

export const HitEvent = CustomEventFactory.buildEvent<HitEvent>("Hit");
export const HitEventData = CustomEventFactory.buildEventData<HitEvent>("Hit");

export const SkipTurnEvent = CustomEventFactory.buildNotifyEvent("SkipTurn");
export const SkipTurnEventData = CustomEventFactory.buildNotifyEventData("SkipTurn");


export interface RegisterLevelActorsEvent {
    levelController: LevelController;
}
export const RegisterLevelActorsEvent = CustomEventFactory.buildEvent<RegisterLevelActorsEvent>("RegisterLevelActors");
export const RegisterLevelActorsEventData = CustomEventFactory.buildEventData<RegisterLevelActorsEvent>("RegisterLevelActors");

export interface RegisterActorAiEvent {
    ai: ROT.Actionable;
}
export const RegisterActorAiEvent = CustomEventFactory.buildEvent<RegisterActorAiEvent>("RegisterActorAi");
export const RegisterActorAiEventData = CustomEventFactory.buildEventData<RegisterActorAiEvent>("RegisterActorAi");
export const DeregisterActorAiEvent = CustomEventFactory.buildEvent<RegisterActorAiEvent>("UnregisterActorAi");
export const DeregisterActorAiEventData = CustomEventFactory.buildEventData<RegisterActorAiEvent>("UnregisterActorAi");

export const PlayerActionBeginEvent = CustomEventFactory.buildNotifyEvent("PlayerActionBegin");
export const PlayerActionBeginEventData = CustomEventFactory.buildNotifyEventData("PlayerActionBegin");

export const ActionCompleteEventType = "ActionComplete";
export const ActionCompleteEvent = CustomEventFactory.buildNotifyEvent(ActionCompleteEventType);
export const ActionCompleteEventData = CustomEventFactory.buildNotifyEventData(ActionCompleteEventType);

export const TurnTakenEvent = CustomEventFactory.buildNotifyEvent("TurnTaken");
export const TurnTakenEventData = CustomEventFactory.buildNotifyEventData("TurnTaken");

export interface PlayerAttributeChangedEvent {
    name: string;
    value: number;
}
export const PlayerAttributeChangedEvent = CustomEventFactory.buildEvent<PlayerAttributeChangedEvent>("PlayerAttributeChanged");
export const PlayerAttributeChangedEventData = CustomEventFactory.buildEventData<PlayerAttributeChangedEvent>("PlayerAttributeChanged");
