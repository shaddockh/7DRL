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
"atomic component";
var BasicMonsterAi = (function (_super) {
    __extends(BasicMonsterAi, _super);
    function BasicMonsterAi() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields witihin the inspectorFields object will be exposed to the editor
         */
        _this.inspectorFields = {
            debug: true,
        };
        return _this;
    }
    BasicMonsterAi.prototype.start = function () {
        // only care about move complete events from ourselves
        this.subscribeToEvent(this.node, CustomEvents_1.MoveEntityCompleteEvent(this.onMoveComplete.bind(this)));
        this.subscribeToEvent(this.node, CustomEvents_1.TurnTakenEvent(this.onTurnTaken.bind(this)));
        // this.subscribeToEvent(this.node, PlayerActionCompleteEvent(this.onActionComplete.bind(this)));
        this.sendEvent(CustomEvents_1.RegisterActorAiEventData({ ai: this }));
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
        this.DEBUG("Called Act");
        var currentLevel = this.node.scene.getJSComponent("LevelController").currentLevel;
        // scan around for somewhere to randomly move
        var emptyFloor = currentLevel.findEmptyFloorCellInRadius(this.gridPosition, 1);
        if (emptyFloor) {
            this.DEBUG("moving to target:");
            this.DEBUG("empty floor");
            this.DEBUG(emptyFloor);
            //const floorPos = vec2.fromValues(emptyFloor.x, emptyFloor.y);
            var floorPos = [emptyFloor.x, emptyFloor.y];
            this.DEBUG(floorPos);
            this.DEBUG("grid position");
            this.DEBUG(this.gridPosition);
            //const targetPos = vec2.sub(vec2.create(), floorPos, this.gridPosition);
            // NOT WORKING FOR SOME REASON!!
            var targetPos = [emptyFloor.x < this.gridPosition[0] ? -1 : 1, emptyFloor.y < this.gridPosition[1] ? -1 : 1];
            this.DEBUG("target position");
            this.DEBUG(targetPos);
            this.node.sendEvent(CustomEvents_1.MoveEntityByOffsetEventData({
                position: targetPos
            }));
        }
        else {
            this.DEBUG("Couldn't find an empty floor");
        }
        // we are returning a 'thenable' which tells the scheduler to not move on to the next actor
        // until this actor has completed.  This is overriding the onTurnTaken event on this class with
        // the callback passed to the then method, which means that when this class gets an onTurnTaken
        // event, it will resolve the then.
        // See: http://ondras.github.io/rot.js/manual/#timing/engine for some more information.
        /*return {
            then: (resolve) => {
                this.deferAction(resolve, "ActionComplete");
            }
        };*/
    };
    BasicMonsterAi.prototype.onMoveComplete = function () {
        this.DEBUG("OnMoveComplete");
        this.node.sendEvent(CustomEvents_1.TurnTakenEventData());
        // gameState.getCurrentLevel().setCameraTarget(this.node);
    };
    BasicMonsterAi.prototype.onTurnTaken = function () {
        this.DEBUG("OnTurnTaken");
        /*
        this.deferAction(() => {
            GameController.gameState.incTurn();
            this.levelController.updateFov(this.getPosition());
        });
        */
        this.node.sendEvent(CustomEvents_1.PlayerActionCompleteEventData());
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
    return BasicMonsterAi;
}(CustomJSComponent_1.default));
exports.default = BasicMonsterAi;
//# sourceMappingURL=BasicMonsterAi.js.map