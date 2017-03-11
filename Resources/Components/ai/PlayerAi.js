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
var Attack_1 = require("Components/Attack");
var CustomEvents_1 = require("Modules/CustomEvents");
var CustomEvents_2 = require("Modules/CustomEvents");
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
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
            attackComponentName: "Attack",
            alive: true
        };
        /** name of the component that contains the attack logic */
        _this.attackComponentName = "Attack";
        _this.alive = true;
        return _this;
    }
    PlayerAi.prototype.start = function () {
        var _this = this;
        // only care about move complete events from ourselves
        this.subscribeToEvent(this.node, CustomEvents_2.MoveEntityCompleteEvent(this.onMoveComplete.bind(this)));
        this.subscribeToEvent(this.node, CustomEvents_2.TurnTakenEvent(this.onTurnTaken.bind(this)));
        // this.subscribeToEvent(this.node, PlayerActionCompleteEvent(this.onActionComplete.bind(this)));
        // called when we bump into something
        this.subscribeToEvent(this.node, CustomEvents_2.BumpEntityEvent(this.onHandleBump.bind(this)));
        // called when we want to attack something
        this.subscribeToEvent(this.node, CustomEvents_2.AttackEntityEvent(this.onHandleAttackEntity.bind(this)));
        // called when we have been hit by something
        this.subscribeToEvent(this.node, CustomEvents_2.HitEvent(this.onHit.bind(this)));
        // called when entity should be destroyed
        this.subscribeToEvent(this.node, CustomEvents_2.DestroyEntityEvent(this.onDestroy.bind(this)));
        this.subscribeToEvent(this.node, CustomEvents_1.MoveEntityBlockedEvent(function (data) {
            _this.sendEvent(CustomEvents_1.LogMessageEventData({ message: "Blocked." }));
        }));
        this.sendEvent(CustomEvents_2.RegisterActorAiEventData({ ai: this }));
        // TODO: This is a global event.  Need to actually make this listen at the node level
        this.subscribeToEvent(CustomEvents_1.SkipTurnEvent(this.onSkipTurn.bind(this)));
        // called when we are moving to a new level
        this.subscribeToEvent(CustomEvents_2.RegisterLevelActorsEvent(function () {
            _this.sendEvent(CustomEvents_2.RegisterActorAiEventData({ ai: _this }));
        }));
        // TODO: make this message based 
        this.node.scene.getMainCamera().node.worldPosition = this.node.worldPosition;
        this.sendEvent(CustomEvents_1.PlayerAttributeChangedEventData({
            name: "life",
            value: this.node.getJSComponent("Health").life
        }));
    };
    PlayerAi.prototype.act = function () {
        var _this = this;
        this.DEBUG("Called Act");
        if (this.alive) {
            this.sendEvent(CustomEvents_2.PlayerActionBeginEventData());
            // we are returning a 'thenable' which tells the scheduler to not move on to the next actor
            // until this actor has completed.  This is overriding the onTurnTaken event on this class with
            // the callback passed to the then method, which means that when this class gets an onTurnTaken
            // event, it will resolve the then.
            // See: http://ondras.github.io/rot.js/manual/#timing/engine for some more information.
            return {
                then: function (resolve) {
                    _this.deferAction(resolve, CustomEvents_2.ActionCompleteEventType);
                }
            };
        }
    };
    PlayerAi.prototype.onMoveComplete = function () {
        this.DEBUG("OnMoveComplete");
        this.node.sendEvent(CustomEvents_2.TurnTakenEventData());
        // TODO: move this to a message to the camera
        this.node.scene.getMainCamera().node.worldPosition = this.node.worldPosition;
    };
    PlayerAi.prototype.onTurnTaken = function () {
        this.DEBUG("OnTurnTaken");
        /*
        this.deferAction(() => {
            GameController.gameState.incTurn();
            this.levelController.updateFov(this.getPosition());
        });
        */
        this.node.sendEvent(CustomEvents_2.ActionCompleteEventData());
    };
    PlayerAi.prototype.onSkipTurn = function () {
        this.sendEvent(CustomEvents_1.LogMessageEventData({ message: "Waiting..." }));
        this.onTurnTaken();
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
            this.node.sendEvent(CustomEvents_2.AttackEntityEventData({
                senderComponent: this,
                targetComponent: data.targetComponent
            }));
        }
        else {
            this.DEBUG("Sending bump");
            data.targetComponent.node.sendEvent(CustomEvents_2.BumpedByEntityEventData({
                senderComponent: this,
                targetComponent: data.targetComponent
            }));
            this.node.sendEvent(CustomEvents_2.MoveEntityCompleteEventData());
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
        data.targetComponent.node.sendEvent(CustomEvents_2.HitEventData({
            attackerComponent: this
        }));
        this.node.sendEvent(CustomEvents_2.MoveEntityCompleteEventData());
        this.sendEvent(CustomEvents_1.LogMessageEventData({ message: "Attack " + this.getEntityName(data.targetComponent) + "." }));
    };
    /**
     * Called when we have been attacked by something
     * @param data
     */
    PlayerAi.prototype.onHit = function (data) {
        this.DEBUG("Got hit by something");
        // calculate damage and then send the damage event
        this.node.sendEvent(CustomEvents_2.AdjustEntityHealthEventData({
            value: data.attackerComponent.calculateAttackValue() * -1
        }));
        this.sendEvent(CustomEvents_1.PlayerAttributeChangedEventData({
            name: "life",
            value: this.node.getJSComponent("Health").life
        }));
    };
    /* Attacker Interface */
    PlayerAi.prototype.calculateAttackValue = function () {
        var attack = this.node.getJSComponent(this.attackComponentName);
        if (Attack_1.default) {
            return attack.attackValue;
        }
        throw new Error("No attack component defined!");
    };
    PlayerAi.prototype.onDestroy = function () {
        this.DEBUG("Destroy");
        this.alive = false;
        this.node.scale2D = 0; // hide
        this.sendEvent(CustomEvents_2.PlayerDiedEventData());
        // this.deferAction(() => {
        // Atomic.destroy(this.node);
        // });
    };
    return PlayerAi;
}(CustomJSComponent_1.default));
exports.default = PlayerAi;
//# sourceMappingURL=PlayerAi.js.map