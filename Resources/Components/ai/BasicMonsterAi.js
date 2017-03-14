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
var ROT = require("rot");
var CustomEvents_2 = require("Modules/CustomEvents");
var gl_matrix_1 = require("gl-matrix");
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
            attackComponentName: "Attack",
            sightRadius: 4
        };
        /**
         * Chance
         */
        _this.wanderChance = 25;
        _this.attackComponentName = "Attack";
        _this.sightRadius = 4;
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
            var levelController_1 = this.node.scene.getJSComponent("LevelController");
            var hero_1;
            levelController_1.currentLevel.iterateEntitiesInRadius(this.gridPosition, this.sightRadius, function (entity) {
                var common = entity.entityComponent.node.getJSComponent("Common");
                if (common && common.isPlayer) {
                    hero_1 = entity;
                    return true;
                }
            });
            var waitForMove = false;
            if (hero_1) {
                this.DEBUG("Hero nearby, let's hunt");
                var playerPos = hero_1.gridPosition;
                var position = this.gridPosition;
                var astar = new ROT.Path.AStar(playerPos[0], playerPos[1], function (x, y) { return levelController_1.currentLevel.getCell(x, y).walkable; }, { topology: 4 });
                var path_1 = [];
                astar.compute(position[0], position[1], function (x, y) {
                    path_1.push([x, y]);
                });
                path_1.shift(); // remove current position
                if (path_1.length < this.sightRadius && path_1.length > 0) {
                    this.DEBUG("hunting enemy located " + path_1.length + " steps away.");
                    var target = path_1.shift();
                    var dir_1 = gl_matrix_1.vec2.sub(gl_matrix_1.vec2.create(), target, position);
                    gl_matrix_1.vec2.normalize(dir_1, dir_1);
                    // Let's defer the movement to the next update so we have time
                    // to wire up the resolve.
                    this.deferAction(function () {
                        _this.node.sendEvent(CustomEvents_2.MoveEntityByOffsetEventData({
                            position: [dir_1[0], dir_1[1]]
                        }));
                    });
                    waitForMove = true;
                }
            }
            else {
                this.DEBUG("No hero nearby, let's wander");
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
                    waitForMove = true;
                }
            }
            // we are returning a 'thenable' which tells the scheduler to not move on to the next actor
            // until this actor has completed.  This is overriding the onTurnTaken event on this class with
            // the callback passed to the then method, which means that when this class gets an onTurnTaken
            // event, it will resolve the then.
            // See: http://ondras.github.io/rot.js/manual/#timing/engine for some more information.
            if (waitForMove) {
                return {
                    then: function (resolve) {
                        _this.deferAction(resolve, CustomEvents_2.ActionCompleteEventType, _this.node);
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
        var common = data.targetComponent.node.getJSComponent("Common");
        if (entityComponent.attackable && common && common.isPlayer) {
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
        // figure out damage and send it over
        data.targetComponent.node.sendEvent(CustomEvents_1.HitEventData({
            attackerComponent: this
        }));
        this.sendEvent(CustomEvents_2.LogMessageEventData({ message: this.getEntityName(data.senderComponent) + " attacked you." }));
        this.node.sendEvent(CustomEvents_2.MoveEntityCompleteEventData());
    };
    /**
     * Called when we have been attacked by something
     * @param data
     */
    BasicMonsterAi.prototype.onHit = function (data) {
        this.DEBUG("Got hit by something");
        // calculate damage and then send the damage event
        this.node.sendEvent(CustomEvents_2.AdjustEntityHealthEventData({
            value: data.attackerComponent.calculateAttackValue() * -1
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