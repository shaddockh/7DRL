import { MoveEntityByOffsetEvent } from "../../Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
import { LevelMap } from "Modules/LevelGen/LevelMap";
import * as ROT from "Modules/thirdparty/rot";
import {
    RegisterActorAiEventData,
    MoveEntityCompleteEvent,
    TurnTakenEventData,
    TurnTakenEvent,
    PlayerActionCompleteEventData,
    PlayerActionCompleteEvent,
    PlayerActionBeginEventData,
    MoveEntityByOffsetEventData
} from "Modules/CustomEvents";
import LevelController from "Components/LevelController";
import { Position2d } from "Game";
import GridMover from "Components/GridMover";
import { vec2 } from "Modules/thirdparty/gl-matrix";
import Entity from "Components/Entity";
"atomic component";

export default class BasicMonsterAi extends CustomJSComponent {
    /**
     * Fields witihin the inspectorFields object will be exposed to the editor
     */
    inspectorFields = {
        debug: true,
    };

    start() {
        // only care about move complete events from ourselves
        this.subscribeToEvent(this.node, MoveEntityCompleteEvent(this.onMoveComplete.bind(this)));
        this.subscribeToEvent(this.node, TurnTakenEvent(this.onTurnTaken.bind(this)));
        // this.subscribeToEvent(this.node, PlayerActionCompleteEvent(this.onActionComplete.bind(this)));

        this.sendEvent(RegisterActorAiEventData({ ai: this }));

        this.node.getJSComponent<GridMover>("GridMover").subscribeToMovementController(this.node);
    }

    get gridPosition(): Position2d {
        return this.node.getJSComponent<GridMover>("GridMover").gridPosition;
    }

    act() {
        this.DEBUG("Called Act");
        let currentLevel = this.node.scene.getJSComponent<LevelController>("LevelController").currentLevel;

        // scan around for somewhere to randomly move
        let emptyFloor = currentLevel.findEmptyFloorCellInRadius(this.gridPosition, 1);

        if (emptyFloor) {
            this.DEBUG("moving to target:");
            this.DEBUG("empty floor");
            this.DEBUG(emptyFloor);
            //const floorPos = vec2.fromValues(emptyFloor.x, emptyFloor.y);
            const floorPos = [emptyFloor.x, emptyFloor.y];
            this.DEBUG(floorPos);
            this.DEBUG("grid position");
            this.DEBUG(this.gridPosition);
            //const targetPos = vec2.sub(vec2.create(), floorPos, this.gridPosition);
            // NOT WORKING FOR SOME REASON!!

            const targetPos = [emptyFloor.x < this.gridPosition[0] ? -1 : 1, emptyFloor.y < this.gridPosition[1] ? -1 : 1] as Position2d;
            this.DEBUG("target position");
            this.DEBUG(targetPos);
            this.node.sendEvent(MoveEntityByOffsetEventData({
                position: targetPos
            }));
        } else {
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
    }

    onMoveComplete() {
        this.DEBUG("OnMoveComplete");
        this.node.sendEvent(TurnTakenEventData());
        // gameState.getCurrentLevel().setCameraTarget(this.node);
    }

    onTurnTaken() {
        this.DEBUG("OnTurnTaken");
        /*
        this.deferAction(() => {
            GameController.gameState.incTurn();
            this.levelController.updateFov(this.getPosition());
        });
        */

        this.node.sendEvent(PlayerActionCompleteEventData());
    }

    onActionComplete() {
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
    }


}
