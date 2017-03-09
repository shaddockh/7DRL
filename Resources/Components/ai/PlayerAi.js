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
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
var CustomEvents_1 = require("Modules/CustomEvents");
var Attack_1 = require("Components/Attack");
"atomic component";
var PlayerAi = (function (_super) {
    __extends(PlayerAi, _super);
    function PlayerAi() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields witihin the inspectorFields object will be exposed to the editor
         */
        _this.inspectorFields = {
            debug: true,
        };
        return _this;
    }
    PlayerAi.prototype.start = function () {
        var _this = this;
        // only care about move complete events from ourselves
        this.subscribeToEvent(this.node, CustomEvents_1.MoveEntityCompleteEvent(this.onMoveComplete.bind(this)));
        this.subscribeToEvent(this.node, CustomEvents_1.TurnTakenEvent(this.onTurnTaken.bind(this)));
        // this.subscribeToEvent(this.node, PlayerActionCompleteEvent(this.onActionComplete.bind(this)));
        // called when we bump into something
        this.subscribeToEvent(this.node, CustomEvents_1.BumpEntityEvent(this.onHandleBump.bind(this)));
        // called when we want to attack something
        this.subscribeToEvent(this.node, CustomEvents_1.AttackEntityEvent(this.onHandleAttackEntity.bind(this)));
        // called when we have been hit by something
        this.subscribeToEvent(this.node, CustomEvents_1.HitEvent(this.onHit.bind(this)));
        this.sendEvent(CustomEvents_1.RegisterActorAiEventData({ ai: this }));
        // called when we are moving to a new level
        this.subscribeToEvent(CustomEvents_1.RegisterLevelActorsEvent(function () {
            _this.sendEvent(CustomEvents_1.RegisterActorAiEventData({ ai: _this }));
        }));
    };
    PlayerAi.prototype.act = function () {
        var _this = this;
        this.DEBUG("Called Act");
        this.sendEvent(CustomEvents_1.PlayerActionBeginEventData());
        // we are returning a 'thenable' which tells the scheduler to not move on to the next actor
        // until this actor has completed.  This is overriding the onTurnTaken event on this class with
        // the callback passed to the then method, which means that when this class gets an onTurnTaken
        // event, it will resolve the then.
        // See: http://ondras.github.io/rot.js/manual/#timing/engine for some more information.
        return {
            then: function (resolve) {
                _this.deferAction(resolve, CustomEvents_1.ActionCompleteEventType);
            }
        };
    };
    PlayerAi.prototype.onMoveComplete = function () {
        this.DEBUG("OnMoveComplete");
        this.node.sendEvent(CustomEvents_1.TurnTakenEventData());
        // gameState.getCurrentLevel().setCameraTarget(this.node);
    };
    PlayerAi.prototype.onTurnTaken = function () {
        this.DEBUG("OnTurnTaken");
        /*
        this.deferAction(() => {
            GameController.gameState.incTurn();
            this.levelController.updateFov(this.getPosition());
        });
        */
        this.node.sendEvent(CustomEvents_1.ActionCompleteEventData());
    };
    /**
     * Called when we bump into something.
     * @param data
     */
    PlayerAi.prototype.onHandleBump = function (data) {
        this.DEBUG("Bumped Entity: " + data.targetComponent.node.name);
        // who did we bump into?
        var entityComponent = data.targetComponent.node.getJSComponent("Entity");
        if (entityComponent.attackable) {
            this.DEBUG("preparing to attack");
            // here we need to recreate the event object because it will get GCd
            this.node.sendEvent(CustomEvents_1.AttackEntityEventData({
                senderComponent: this,
                targetComponent: data.targetComponent
            }));
        }
        else {
            this.DEBUG("Sending bump");
            data.targetComponent.node.sendEvent(CustomEvents_1.BumpedByEntityEventData({
                senderComponent: this,
                targetComponent: data.targetComponent
            }));
            this.node.sendEvent(CustomEvents_1.MoveEntityCompleteEventData());
        }
    };
    /**
     * Called when we need to attack something
     * @param data
     */
    PlayerAi.prototype.onHandleAttackEntity = function (data) {
        this.DEBUG("Attack Entity");
        this.DEBUG(data.targetComponent.typeName);
        // figure out damage and send it over
        data.targetComponent.node.sendEvent(CustomEvents_1.HitEventData({
            attackerComponent: this
        }));
        this.node.sendEvent(CustomEvents_1.MoveEntityCompleteEventData());
    };
    /**
     * Called when we have been attacked by something
     * @param data
     */
    PlayerAi.prototype.onHit = function (data) {
        this.DEBUG("Got hit by something");
        // calculate damage and then send the damage event
        this.node.sendEvent(CustomEvents_1.DamageEntityEventData({
            value: data.attackerComponent.calculateAttackValue()
        }));
    };
    /* Attacker Interface */
    PlayerAi.prototype.calculateAttackValue = function () {
        var attack = this.node.getJSComponent("Attack");
        if (Attack_1.default) {
            return this.node.getJSComponent("Attack").attackValue;
        }
        throw new Error("No attack component defined!");
    };
    return PlayerAi;
}(CustomJSComponent_1.default));
exports.default = PlayerAi;
//# sourceMappingURL=PlayerAi.js.map