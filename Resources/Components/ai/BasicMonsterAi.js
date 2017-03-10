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
var CustomEvents_1 = require("../../Modules/CustomEvents");
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
var CustomEvents_2 = require("Modules/CustomEvents");
var Attack_1 = require("Components/Attack");
"atomic component";
;
var BasicMonsterAi = (function (_super) {
    __extends(BasicMonsterAi, _super);
    function BasicMonsterAi() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields witihin the inspectorFields object will be exposed to the editor
         */
        _this.inspectorFields = {
            debug: true,
            wanderChance: 25,
            attackComponentName: "Attack"
        };
        /**
         * Chance
         */
        _this.wanderChance = 25;
        _this.attackComponentName = "Attack";
        _this.alive = true;
        return _this;
    }
    BasicMonsterAi.prototype.start = function () {
        // only care about move complete events from ourselves
        this.subscribeToEvent(this.node, CustomEvents_2.MoveEntityCompleteEvent(this.onMoveComplete.bind(this)));
        // called when we bump into something
        this.subscribeToEvent(this.node, CustomEvents_1.BumpEntityEvent(this.onHandleBump.bind(this)));
        // called when we want to attack something
        this.subscribeToEvent(this.node, CustomEvents_2.AttackEntityEvent(this.onHandleAttackEntity.bind(this)));
        // called when we have been hit by something
        this.subscribeToEvent(this.node, CustomEvents_2.HitEvent(this.onHit.bind(this)));
        // called when entity should be destroyed
        this.subscribeToEvent(this.node, CustomEvents_1.DestroyEntityEvent(this.onDestroy.bind(this)));
        this.sendEvent(CustomEvents_2.RegisterActorAiEventData({ ai: this }));
        // TODO: Change this to some kind of event system where whichever component provides movement handling
        // publishes an event that this can subscribe to.
        this.node.getJSComponent("GridMover").subscribeToMovementController(this.node);
    };
    Object.defineProperty(BasicMonsterAi.prototype, "gridPosition", {
        get: function () {
            return this.node.getJSComponent("GridMover").gridPosition;
        },
        enumerable: true,
        configurable: true
    });
    BasicMonsterAi.prototype.act = function () {
        var _this = this;
        if (this.alive) {
            this.DEBUG("Act");
            var currentLevel = this.node.scene.getJSComponent("LevelController").currentLevel;
            if (this.wanderChance > Math.random() * 100) {
                // scan around for somewhere to randomly move
                var emptyFloor = currentLevel.findEmptyFloorCellInRadius(this.gridPosition, 1);
                if (emptyFloor) {
                    // this.DEBUG("moving to target:");
                    // this.DEBUG("empty floor");
                    // this.DEBUG(emptyFloor);
                    // const floorPos = vec2.fromValues(emptyFloor.x, emptyFloor.y);
                    var floorPos = [emptyFloor.x, emptyFloor.y];
                    // this.DEBUG(floorPos);
                    // this.DEBUG("grid position");
                    // this.DEBUG(this.gridPosition);
                    // const targetPos = vec2.sub(vec2.create(), floorPos, this.gridPosition) as Position2d;
                    // NOT WORKING FOR SOME REASON!!
                    var targetPos_1 = [emptyFloor.x < this.gridPosition[0] ? -1 : 1, emptyFloor.y < this.gridPosition[1] ? -1 : 1];
                    if (targetPos_1[0] != 0 && targetPos_1[1] != 0) {
                        // choose one so we move in a cardinal direction
                        if (Math.random() * 100 > 50) {
                            targetPos_1[0] = 0;
                        }
                        else {
                            targetPos_1[1] = 0;
                        }
                    }
                    // this.DEBUG("target position");
                    // this.DEBUG(targetPos);
                    // Let's defer the movement to the next update so we have time
                    // to wire up the resolve.
                    this.deferAction(function () {
                        _this.node.sendEvent(CustomEvents_2.MoveEntityByOffsetEventData({
                            position: targetPos_1
                        }));
                    });
                }
                else {
                    this.DEBUG("Couldn't find an empty floor");
                }
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
        }
    };
    BasicMonsterAi.prototype.onMoveComplete = function () {
        this.DEBUG("OnMoveComplete");
        this.node.sendEvent(CustomEvents_2.ActionCompleteEventData());
    };
    /**
     * Called when we bump into something.
     * @param data
     */
    BasicMonsterAi.prototype.onHandleBump = function (data) {
        this.DEBUG("Bumped Entity: " + data.targetComponent.node.name);
        // who did we bump into?
        var entityComponent = data.targetComponent.node.getJSComponent("Entity");
        // just attack, don't allow for picking up items or other bump actions
        // TODO: hard coding needs to be removed
        if (entityComponent.attackable && data.targetComponent.node.name != "entity_player") {
            // here we need to recreate the event object because it will get GCd
            this.node.sendEvent(CustomEvents_2.AttackEntityEventData({
                senderComponent: this,
                targetComponent: data.targetComponent
            }));
        }
        else {
            this.node.sendEvent(CustomEvents_2.MoveEntityCompleteEventData());
        }
    };
    /**
     * Called when we need to attack something
     * @param data
     */
    BasicMonsterAi.prototype.onHandleAttackEntity = function (data) {
        this.DEBUG("Attack Entity");
        this.DEBUG(data.targetComponent.typeName);
        // figure out damage and send it over
        data.targetComponent.node.sendEvent(CustomEvents_1.HitEventData({
            attackerComponent: this
        }));
        this.sendEvent(CustomEvents_2.LogMessageEventData({ message: this.getEntityName(data.senderComponent) + " attacked player." }));
        this.node.sendEvent(CustomEvents_2.MoveEntityCompleteEventData());
    };
    /**
     * Called when we have been attacked by something
     * @param data
     */
    BasicMonsterAi.prototype.onHit = function (data) {
        this.DEBUG("Got hit by something");
        // calculate damage and then send the damage event
        this.node.sendEvent(CustomEvents_2.DamageEntityEventData({
            value: data.attackerComponent.calculateAttackValue()
        }));
    };
    /* Attacker Interface */
    BasicMonsterAi.prototype.calculateAttackValue = function () {
        var attack = this.node.getJSComponent(this.attackComponentName);
        if (Attack_1.default) {
            return attack.attackValue;
        }
        throw new Error("No attack component defined!");
    };
    BasicMonsterAi.prototype.onActionComplete = function () {
        this.DEBUG("OnActionComplete");
        // call the callback, notifying the scheduler that we are done, but
        // wait until all pending activities have finished
        /*
        if (this.resolveTurn) {
            setImmediate(() => {
                this.DEBUG("End of turn.");
                this.resolveTurn();
            });
        }
        */
    };
    BasicMonsterAi.prototype.onDestroy = function () {
        var _this = this;
        this.DEBUG("Destroy");
        this.alive = false;
        this.deferAction(function () {
            Atomic.destroy(_this.node);
        });
    };
    return BasicMonsterAi;
}(CustomJSComponent_1.default));
exports.default = BasicMonsterAi;
//# sourceMappingURL=BasicMonsterAi.js.map