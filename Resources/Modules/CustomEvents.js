"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomEventFactory = require("./CustomEventFactory");
exports.LoadLevelEvent = CustomEventFactory.buildEvent("LoadLevel");
exports.LoadLevelEventData = CustomEventFactory.buildEventData("LoadLevel");
exports.RenderCurrentLevelEvent = CustomEventFactory.buildNotifyEvent("RenderCurrentLevel");
exports.RenderCurrentLevelEventData = CustomEventFactory.buildNotifyEventData("RenderCurrentLevel");
/**
 * Custom event that is sent when the primary controller for a scene has completed loading
 * @param callback
 */
exports.SceneReadyEvent = CustomEventFactory.buildNotifyEvent("SceneReady");
exports.SceneReadyEventData = CustomEventFactory.buildNotifyEventData("SceneReady");
exports.MoveEntityEvent = CustomEventFactory.buildEvent("MoveEntity");
exports.MoveEntityEventData = CustomEventFactory.buildEventData("MoveEntity");
exports.MoveEntityByOffsetEvent = CustomEventFactory.buildEventJson("MoveEntityByOffset");
exports.MoveEntityByOffsetEventData = CustomEventFactory.buildEventDataJson("MoveEntityByOffset");
exports.MoveEntityStartEvent = CustomEventFactory.buildEvent("MoveEntityStart");
exports.MoveEntityStartEventData = CustomEventFactory.buildEventData("MoveEntityStart");
exports.MoveEntityCompleteEvent = CustomEventFactory.buildNotifyEvent("MoveEntityComplete");
exports.MoveEntityCompleteEventData = CustomEventFactory.buildNotifyEventData("MoveEntityComplete");
exports.MoveEntityBlockedEvent = CustomEventFactory.buildEvent("MoveEntityBlocked");
exports.MoveEntityBlockedEventData = CustomEventFactory.buildEventData("MoveEntityBlocked");
exports.LogMessageEvent = CustomEventFactory.buildEvent("LogMessage");
exports.LogMessageEventData = CustomEventFactory.buildEventData("LogMessage");
exports.BumpEntityEvent = CustomEventFactory.buildEvent("BumpEntity");
exports.BumpEntityEventData = CustomEventFactory.buildEventData("bumpEntity");
exports.AttackEntityEvent = CustomEventFactory.buildEvent("AttackEntity");
exports.AttackEntityEventData = CustomEventFactory.buildEventData("AttackEntity");
exports.BumpedByEntityEvent = CustomEventFactory.buildEvent("BumpedByEntity");
exports.BumpedByEntityEventData = CustomEventFactory.buildEventData("BumpedByEntity");
exports.DestroyEntityEvent = CustomEventFactory.buildNotifyEvent("DestroyEntity");
exports.DestroyEntityEventData = CustomEventFactory.buildNotifyEventData("DestroyEntity");
exports.DamageEntityEvent = CustomEventFactory.buildEvent("DamageEntity");
exports.DamageEntityEventData = CustomEventFactory.buildEventData("DamageEntity");
exports.HitEvent = CustomEventFactory.buildEvent("Hit");
exports.HitEventData = CustomEventFactory.buildEventData("Hit");
exports.SkipTurnEvent = CustomEventFactory.buildNotifyEvent("SkipTurn");
exports.SkipTurnEventData = CustomEventFactory.buildNotifyEventData("SkipTurn");
exports.RegisterLevelActorsEvent = CustomEventFactory.buildEvent("RegisterLevelActors");
exports.RegisterLevelActorsEventData = CustomEventFactory.buildEventData("RegisterLevelActors");
exports.RegisterActorAiEvent = CustomEventFactory.buildEvent("RegisterActorAi");
exports.RegisterActorAiEventData = CustomEventFactory.buildEventData("RegisterActorAi");
exports.DeregisterActorAiEvent = CustomEventFactory.buildEvent("UnregisterActorAi");
exports.DeregisterActorAiEventData = CustomEventFactory.buildEventData("UnregisterActorAi");
exports.PlayerActionBeginEvent = CustomEventFactory.buildNotifyEvent("PlayerActionBegin");
exports.PlayerActionBeginEventData = CustomEventFactory.buildNotifyEventData("PlayerActionBegin");
exports.ActionCompleteEventType = "ActionComplete";
exports.ActionCompleteEvent = CustomEventFactory.buildNotifyEvent(exports.ActionCompleteEventType);
exports.ActionCompleteEventData = CustomEventFactory.buildNotifyEventData(exports.ActionCompleteEventType);
exports.TurnTakenEvent = CustomEventFactory.buildNotifyEvent("TurnTaken");
exports.TurnTakenEventData = CustomEventFactory.buildNotifyEventData("TurnTaken");
//# sourceMappingURL=CustomEvents.js.map