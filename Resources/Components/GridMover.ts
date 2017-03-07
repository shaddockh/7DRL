"atomic component";
import CustomJSComponent from "Modules/CustomJSComponent";
import Entity from "./Entity";
// import gameState from '../../Modules/gameState';
// import GameController from "GameController";
import * as CustomEvents from "Modules/CustomEvents";
import { vec2 } from "gl-matrix";
// import { ComponentEvents } from "Constants";
import { Position2d, TerrainType } from "Game";
import LevelRenderer from "Components/LevelRenderer";
import LevelController from "Components/LevelController";

export default class GridMover extends CustomJSComponent {
    inspectorFields = {
        debug: false,
        gridPixelSizeX: 0,
        gridPixelSizeY: 0
    };


    speed = 1;
    smoothMovement = true;
    gridPixelSizeX = 0;
    gridPixelSizeY = 0;

    private postMoveActions = [];
    private targetPos;
    private startPos;
    private moving: boolean = false;
    private blocked: boolean = false;
    private bumping: boolean = false;
    private t: number;
    private movementVector;

    constructor() {
        super();
    }
    movementController: Atomic.AObject;

    start() {
        this.targetPos = this.node.position2D;
        this.startPos = this.node.position2D;
        this.moving = false;
    }

    subscribeToMovementController(movementController: Atomic.AObject) {
        this.DEBUG(`Subscribing to movement controller: ${movementController.typeName}`);
        this.movementController = movementController;
        this.subscribeToEvent(movementController, CustomEvents.MoveEntityByOffsetEvent(this.onTryMoveByOffset.bind(this)));
    }

    queuePostMoveAction(action) {
        this.postMoveActions.push(action);
    }

    executePostMoveActions() {
        while (this.postMoveActions.length) {
            // pull the actions off the queue and run it
            let action = this.postMoveActions.shift();
            action();
        }
    }

    private gridPosition_: Position2d;
    get gridPosition(): Position2d {
        return this.gridPosition_;
    }
    set gridPosition(pos: Position2d) {
        this.gridPosition_ = pos;
    }

    onTryMoveByOffset(data: CustomEvents.MoveEntityEvent) {
        const currentLevel = this.node.scene.getJSComponent<LevelController>("LevelController").currentLevel;
        const cellUnitSize = (data.position[0] == 0 ? this.gridPixelSizeY : this.gridPixelSizeX) * Atomic.PIXEL_SIZE;

        if (this.moving || this.bumping || this.blocked) {
            return;
        }
        try {
            this.startPos = this.node.position2D;
            this.targetPos = vec2.add(vec2.create(), this.startPos, vec2.scale(vec2.create(), data.position, cellUnitSize));
            this.t = 0;

            // see if we can move into the next space
            let mapPos = this.gridPosition;
            let newMapPos = vec2.add(vec2.create(), mapPos, data.position) as Position2d;
            this.DEBUG(`Moving from: ${mapPos[0]},${mapPos[1]} to: ${newMapPos[0]},${newMapPos[1]}`);

            this.moving = true;
            // check to see if we are blocked

            // First see if we are blocked by terrain
            if (!currentLevel.inBounds(newMapPos) ||
                currentLevel.getCell(newMapPos).terrainType !== TerrainType.floor) {
                // Queue up an action to notify the player that the move is blocked
                // this.queuePostMoveAction(() => {
                this.DEBUG("Blocked by terrain");
                this.sendEvent(CustomEvents.LogMessageEventData({ message: "Blocked." }));
                this.node.sendEvent(CustomEvents.MoveEntityBlockedEventData({ from: mapPos, to: newMapPos }));
                this.node.sendEvent(CustomEvents.MoveEntityCompleteEventData());
                // });

                this.blocked = true;
                this.moving = false;
            } else {
                currentLevel.iterateEntitiesAt(newMapPos, (entity) => {
                    // We are going to bump the top level entity if it's bumpable
                    // if (entity.entityComponent) {
                    if (entity.blocksPath) {
                        this.blocked = true;
                        this.moving = false;
                        // this.queuePostMoveAction(() => {
                        this.DEBUG("Blocked by Entity");
                        this.node.sendEvent(CustomEvents.MoveEntityBlockedEventData({ from: mapPos, to: newMapPos }));
                        this.node.sendEvent(CustomEvents.MoveEntityCompleteEventData());
                        // });
                    }
                    if (entity.bumpable) {
                        // Let's exit the loop since we only want to deal with the first entity
                        this.node.sendEvent(CustomEvents.BumpEntityEventData({ targetComponent: entity.entityComponent }));
                        return false;
                    } else {
                        return true;
                    }
                    // }
                });
            }

            if (this.moving) {
                this.movementVector = data.position;
                this.startPos = this.node.position2D;
                // this.DEBUG(`Moving to ${this.targetPos} from ${this.startPos}, vector = ${data.offset}`);

                this.node.sendEvent(CustomEvents.MoveEntityStartEventData({ from: mapPos, to: newMapPos }));

                this.gridPosition = [newMapPos[0], newMapPos[1]];
                this.node.position2D = this.targetPos;

                this.node.sendEvent(CustomEvents.MoveEntityCompleteEventData());
                // Queue up an action to notify that we are done moving.
                // this.queuePostMoveAction(() => {
                //     this.entity.setPosition(this.targetPos);
                //     NodeEvents.trigger(this.node, ComponentEvents.onMoveComplete);
                // });
            }

        } finally {
            this.moving = false;
            this.blocked = false;
            this.bumping = false;
        }
    }
}
