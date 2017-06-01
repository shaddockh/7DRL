import {
    BumpEntityEvent,
    ComponentNotificationEvent,
    DestroyEntityEvent,
    HitEventData
} from "../../Modules/CustomEvents";
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
    AdjustEntityHealthEventData,
    AttackEntityEvent,
    AdjustEntityHealthEvent,
    HitEvent,
    MoveEntityCompleteEventData,
    LogMessageEventData,
    DeregisterActorAiEventData
} from "Modules/CustomEvents";
import LevelController from "Components/LevelController";
import { Position2d, Attacker, EntityData } from "Game";
import GridMover from "Components/GridMover";
import { vec2 } from "gl-matrix";
import Entity from "Components/Entity";
import Attack from "Components/Attack";
import { Actionable } from "rot";
import Common from "Components/Common";
"atomic component";

/**
 * Basic monster ai
 */
export interface BasicMonsterAiInspectorFields {
    debug?: boolean;

    /**
     * The percent chance for this monster to wander
     */
    wanderChance?: number;

    /** The name of the attack component attached to this entity */
    attackComponentName?: string;

    /** Look for enemies in this range */
    sightRadius?: number;
};

export default class BasicMonsterAi extends CustomJSComponent implements Attacker, Actionable {
    /**
     * Fields witihin the inspectorFields object will be exposed to the editor
     */
    inspectorFields: BasicMonsterAiInspectorFields = {
        debug: false,
        wanderChance: 25,
        attackComponentName: "Attack",
        sightRadius: 4
    };

    /**
     * Chance 
     */
    wanderChance = 25;
    attackComponentName = "Attack";
    sightRadius = 4;

    alive = true;

    start() {
        // only care about move complete events from ourselves
        this.subscribeToEvent(this.node, MoveEntityCompleteEvent(this.onMoveComplete.bind(this)));
        // called when we bump into something
        this.subscribeToEvent(this.node, BumpEntityEvent(this.onHandleBump.bind(this)));

        // called when we want to attack something
        this.subscribeToEvent(this.node, AttackEntityEvent(this.onHandleAttackEntity.bind(this)));

        // called when we have been hit by something
        this.subscribeToEvent(this.node, HitEvent(this.onHit.bind(this)));

        // called when entity should be destroyed
        this.subscribeToEvent(this.node, DestroyEntityEvent(this.onDestroy.bind(this)));

        this.sendEvent(RegisterActorAiEventData({ ai: this }));

        // TODO: Change this to some kind of event system where whichever component provides movement handling
        // publishes an event that this can subscribe to.
        this.node.getJSComponent<GridMover>("GridMover").subscribeToMovementController(this.node);
    }

    get gridPosition(): Position2d {
        return this.node.getJSComponent<GridMover>("GridMover").gridPosition;
    }

    act() {
        if (this.alive) {
            this.DEBUG("Called Act on BasicMonsterAI");
            let currentLevel = this.node.scene.getJSComponent<LevelController>("LevelController").currentLevel;

            const levelController = this.node.scene.getJSComponent<LevelController>("LevelController");
            let hero: EntityData;
            levelController.currentLevel.iterateEntitiesInRadius(this.gridPosition, this.sightRadius, (entity) => {
                const common = entity.entityComponent.node.getJSComponent<Common>("Common");
                if (common && common.isPlayer) {
                    hero = entity;
                    return true;
                }
            });

            let waitForMove = false;

            if (hero) {
                this.DEBUG("Hero nearby, let's hunt");
                let playerPos = hero.gridPosition;
                let position = this.gridPosition;
                const astar = new ROT.Path.AStar(playerPos[0], playerPos[1],
                    (x, y) => levelController.currentLevel.getCell(x, y).walkable,
                    { topology: 4 });

                let path = [];
                astar.compute(position[0], position[1], (x, y) => {
                    path.push([x, y]);
                });

                path.shift(); // remove current position
                if (path.length < this.sightRadius && path.length > 0) {
                    this.DEBUG(`hunting enemy located ${path.length} steps away.`);
                    let target = path.shift();
                    let dir = vec2.sub(vec2.create(), target, position);
                    vec2.normalize(dir, dir);

                    // Let's defer the movement to the next update so we have time
                    // to wire up the resolve.
                    this.deferUntilUpdate(() => {
                        this.node.sendEvent(MoveEntityByOffsetEventData({
                            position: [dir[0], dir[1]]
                        }));
                    });
                    waitForMove = true;
                }
            } else {
                this.DEBUG("No hero nearby, let's wander");
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
                        this.deferUntilUpdate(() => {
                            this.node.sendEvent(MoveEntityByOffsetEventData({
                                position: targetPos
                            }));
                        });

                    } else {
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
                    then: (resolve) => {
                        this.deferUntilEvent(() => {
                            // Let the update loop happen and then resolve
                            this.DEBUG("moving");
                            this.deferUntilUpdate(resolve);
                        }, ActionCompleteEventType);
                    }
                };
            } else {
                return {
                    then: (resolve) => {
                        // Let the update loop happen and then resolve
                        this.DEBUG("waiting");
                        this.deferUntilUpdate(resolve);
                    }
                };
            }
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
        const common = data.targetComponent.node.getJSComponent<Common>("Common");
        if (entityComponent.attackable && common && common.isPlayer) {
            // here we need to recreate the event object because it will get GCd
            this.node.sendEvent(AttackEntityEventData({
                senderComponent: this,
                targetComponent: data.targetComponent
            }));
        } else {
            this.node.sendEvent(MoveEntityCompleteEventData());
        }
    }

    /**
     * Called when we need to attack something
     * @param data 
     */
    onHandleAttackEntity(data: ComponentNotificationEvent) {
        this.DEBUG("Attack Entity");
        // figure out damage and send it over
        data.targetComponent.node.sendEvent(HitEventData({
            attackerComponent: this
        }));

        this.sendEvent(LogMessageEventData({ message: `${this.getEntityName(data.senderComponent)} attacked you.` }));
        this.node.sendEvent(MoveEntityCompleteEventData());
    }

    /**
     * Called when we have been attacked by something
     * @param data
     */
    onHit(data: HitEvent) {
        this.DEBUG("Got hit by something");
        // calculate damage and then send the damage event
        this.node.sendEvent(AdjustEntityHealthEventData({
            value: data.attackerComponent.calculateAttackValue() * -1
        }));
    }

    /* Attacker Interface */
    calculateAttackValue(): number {
        const attack = this.node.getJSComponent<Attack>(this.attackComponentName);
        if (Attack) {
            return attack.attackValue;
        }

        throw new Error("No attack component defined!");
    }

    onDestroy() {
        this.DEBUG("Destroy");
        this.alive = false;
        this.sendEvent(DeregisterActorAiEventData({ ai: this }));
        this.deferUntilUpdate(() => {
            Atomic.destroy(this.node);
        });
    }
}
