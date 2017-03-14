"atomic component";
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
// import gameState from '../../Modules/gameState';
// import GameController from "GameController";
var CustomEvents = require("Modules/CustomEvents");
var gl_matrix_1 = require("gl-matrix");
var GridMover = (function (_super) {
    __extends(GridMover, _super);
    function GridMover() {
        var _this = _super.call(this) || this;
        _this.inspectorFields = {
            debug: false,
            gridPixelSizeX: 0,
            gridPixelSizeY: 0
        };
        _this.speed = 1;
        _this.smoothMovement = true;
        _this.gridPixelSizeX = 0;
        _this.gridPixelSizeY = 0;
        _this.postMoveActions = [];
        _this.moving = false;
        _this.blocked = false;
        _this.bumping = false;
        return _this;
    }
    GridMover.prototype.start = function () {
        this.targetPos = this.node.position2D;
        this.startPos = this.node.position2D;
        this.moving = false;
    };
    GridMover.prototype.subscribeToMovementController = function (movementController) {
        this.DEBUG("Subscribing to movement controller: " + movementController.typeName);
        this.movementController = movementController;
        this.subscribeToEvent(movementController, CustomEvents.MoveEntityByOffsetEvent(this.onTryMoveByOffset.bind(this)));
    };
    GridMover.prototype.queuePostMoveAction = function (action) {
        this.postMoveActions.push(action);
    };
    GridMover.prototype.executePostMoveActions = function () {
        while (this.postMoveActions.length) {
            // pull the actions off the queue and run it
            var action = this.postMoveActions.shift();
            action();
        }
    };
    Object.defineProperty(GridMover.prototype, "gridPosition", {
        get: function () {
            // TODO: the position provider should send an event announcing itself
            return this.node.getJSComponent("Entity").gridPosition;
        },
        set: function (value) {
            this.node.getJSComponent("Entity").gridPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    GridMover.prototype.onTryMoveByOffset = function (data) {
        var _this = this;
        var currentLevel = this.node.scene.getJSComponent("LevelController").currentLevel;
        var cellUnitSize = (data.position[0] == 0 ? this.gridPixelSizeY : this.gridPixelSizeX) * Atomic.PIXEL_SIZE;
        if (this.moving || this.bumping || this.blocked) {
            return;
        }
        try {
            this.startPos = this.node.position2D;
            this.targetPos = gl_matrix_1.vec2.add(gl_matrix_1.vec2.create(), this.startPos, gl_matrix_1.vec2.scale(gl_matrix_1.vec2.create(), data.position, cellUnitSize));
            this.t = 0;
            // see if we can move into the next space
            var mapPos_1 = this.gridPosition;
            var newMapPos_1 = gl_matrix_1.vec2.add(gl_matrix_1.vec2.create(), mapPos_1, data.position);
            this.DEBUG("Moving from: " + mapPos_1[0] + "," + mapPos_1[1] + " to: " + newMapPos_1[0] + "," + newMapPos_1[1]);
            this.moving = true;
            // check to see if we are blocked
            // First see if we are blocked by terrain
            if (!currentLevel.inBounds(newMapPos_1) ||
                currentLevel.getCell(newMapPos_1).terrainType !== 2 /* floor */) {
                // Queue up an action to notify the player that the move is blocked
                // this.queuePostMoveAction(() => {
                this.DEBUG("Blocked by terrain");
                this.node.sendEvent(CustomEvents.MoveEntityBlockedEventData({ from: mapPos_1, to: newMapPos_1 }));
                this.node.sendEvent(CustomEvents.MoveEntityCompleteEventData());
                // });
                this.blocked = true;
                this.moving = false;
            }
            else {
                currentLevel.iterateEntitiesAt(newMapPos_1, function (entity) {
                    // We are going to bump the top level entity if it's bumpable
                    // if (entity.entityComponent) {
                    if (entity.blocksPath) {
                        _this.blocked = true;
                        _this.moving = false;
                        // this.queuePostMoveAction(() => {
                        _this.DEBUG("Blocked by Entity");
                        _this.node.sendEvent(CustomEvents.MoveEntityBlockedEventData({ from: mapPos_1, to: newMapPos_1 }));
                        if (!entity.bumpable) {
                            // Bump event will send the move complete
                            _this.node.sendEvent(CustomEvents.MoveEntityCompleteEventData());
                        }
                    }
                    if (entity.bumpable) {
                        // Let's exit the loop since we only want to deal with the first entity
                        _this.node.sendEvent(CustomEvents.BumpEntityEventData({
                            senderComponent: _this,
                            targetComponent: entity.entityComponent
                        }));
                        return false;
                    }
                    else {
                        return true;
                    }
                    // }
                });
            }
            if (this.moving) {
                this.movementVector = data.position;
                this.startPos = this.node.position2D;
                // this.DEBUG(`Moving to ${this.targetPos} from ${this.startPos}, vector = ${data.offset}`);
                this.node.sendEvent(CustomEvents.MoveEntityStartEventData({ from: mapPos_1, to: newMapPos_1 }));
                this.gridPosition = [newMapPos_1[0], newMapPos_1[1]];
                this.node.position2D = this.targetPos;
                this.node.sendEvent(CustomEvents.MoveEntityCompleteEventData());
                // Queue up an action to notify that we are done moving.
                // this.queuePostMoveAction(() => {
                //     this.entity.setPosition(this.targetPos);
                //     NodeEvents.trigger(this.node, ComponentEvents.onMoveComplete);
                // });
            }
        }
        finally {
            this.moving = false;
            this.blocked = false;
            this.bumping = false;
        }
    };
    return GridMover;
}(CustomJSComponent_1.default));
exports.default = GridMover;
