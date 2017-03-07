import { BumpEntityEvent, ComponentNotificationEvent } from "../../Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
import { LevelMap } from "Modules/LevelGen/LevelMap";
import * as ROT from "rot";
import {
    RegisterActorAiEventData,
    MoveEntityCompleteEvent,
    TurnTakenEventData,
    TurnTakenEvent,
    ActionCompleteEventData,
    ActionCompleteEvent,
    PlayerActionBeginEventData,
    MoveEntityByOffsetEventData,
    ActionCompleteEventType,
    MoveEntityByOffsetEvent,
    AttackEntityEventData,
    DamageEntityEventData,
    AttackEntityEvent
} from "Modules/CustomEvents";
import LevelController from "Components/LevelController";
import { Position2d } from "Game";
import GridMover from "Components/GridMover";
import { vec2 } from "gl-matrix";
import Entity from "Components/Entity";
"atomic component";

/**
 * Basic monster ai
 */
export interface BasicMonsterAiProps {
    debug?: boolean;

    /**
     * The percent chance for this monster to wander
     */
    wanderChance?: number;
};

export default class BasicMonsterAi extends CustomJSComponent {
    /**
     * Fields witihin the inspectorFields object will be exposed to the editor
     */
    inspectorFields: BasicMonsterAiProps = {
        debug: true,
        wanderChance: 25
    };

    /**
     * Chance 
     */
    wanderChance = 25;

    start() {
        // only care about move complete events from ourselves
        this.subscribeToEvent(this.node, MoveEntityCompleteEvent(this.onMoveComplete.bind(this)));
        // called when we bump into something
        this.subscribeToEvent(this.node, BumpEntityEvent(this.onHandleBump.bind(this)));

        // called when we want to attack something
        this.subscribeToEvent(this.node, AttackEntityEvent(this.onHandleAttackEntity.bind(this)));


        this.sendEvent(RegisterActorAiEventData({ ai: this }));

        // TODO: Change this to some kind of event system where whichever component provides movement handling
        // publishes an event that this can subscribe to.
        this.node.getJSComponent<GridMover>("GridMover").subscribeToMovementController(this.node);
    }

    get gridPosition(): Position2d {
        return this.node.getJSComponent<GridMover>("GridMover").gridPosition;
    }

    act() {
        this.DEBUG("Act");
        let currentLevel = this.node.scene.getJSComponent<LevelController>("LevelController").currentLevel;

        if (this.wanderChance > Math.random() * 100) {
            // scan around for somewhere to randomly move
            let emptyFloor = currentLevel.findEmptyFloorCellInRadius(this.gridPosition, 1);

            if (emptyFloor) {
                // this.DEBUG("moving to target:");
                // this.DEBUG("empty floor");
                // this.DEBUG(emptyFloor);
                // const floorPos = vec2.fromValues(emptyFloor.x, emptyFloor.y);
                const floorPos = [emptyFloor.x, emptyFloor.y];
                // this.DEBUG(floorPos);
                // this.DEBUG("grid position");
                // this.DEBUG(this.gridPosition);
                // const targetPos = vec2.sub(vec2.create(), floorPos, this.gridPosition) as Position2d;
                // NOT WORKING FOR SOME REASON!!

                const targetPos = [emptyFloor.x < this.gridPosition[0] ? -1 : 1, emptyFloor.y < this.gridPosition[1] ? -1 : 1] as Position2d;
                if (targetPos[0] != 0 && targetPos[1] != 0) {
                    // choose one so we move in a cardinal direction
                    if (Math.random() * 100 > 50) {
                        targetPos[0] = 0;
                    } else {
                        targetPos[1] = 0;
                    }
                }
                // this.DEBUG("target position");
                // this.DEBUG(targetPos);

                // Let's defer the movement to the next update so we have time
                // to wire up the resolve.
                this.deferAction(() => {
                    this.node.sendEvent(MoveEntityByOffsetEventData({
                        position: targetPos
                    }));
                });

            } else {
                this.DEBUG("Couldn't find an empty floor");
            }
            // we are returning a 'thenable' which tells the scheduler to not move on to the next actor
            // until this actor has completed.  This is overriding the onTurnTaken event on this class with
            // the callback passed to the then method, which means that when this class gets an onTurnTaken
            // event, it will resolve the then.
            // See: http://ondras.github.io/rot.js/manual/#timing/engine for some more information.
            return {
                then: (resolve) => {
                    this.deferAction(resolve, ActionCompleteEventType);
                }
            };
        }
    }

    onMoveComplete() {
        this.DEBUG("OnMoveComplete");
        this.node.sendEvent(ActionCompleteEventData());
    }

    /**
     * Called when we bump into something.
     * @param data
     */
    onHandleBump(data: ComponentNotificationEvent) {
        this.DEBUG("Bumped Entity: " + data.targetComponent.node.name);
        // who did we bump into?
        const entityComponent = data.targetComponent.node.getJSComponent<Entity>("Entity");
        // just attack, don't allow for picking up items or other bump actions
        if (entityComponent.attackable) {
            // here we need to recreate the event object because it will get GCd
            this.node.sendEvent(AttackEntityEventData({
                targetComponent: data.targetComponent
            }));
        }
    }

    /**
     * Called when we need to attack something
     * @param data 
     */
    onHandleAttackEntity(data: ComponentNotificationEvent) {
        this.DEBUG("Attack Entity");
        // figure out damage and send it over
        data.targetComponent.node.sendEvent(DamageEntityEventData({
            attackerComponent: this
        }));
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
