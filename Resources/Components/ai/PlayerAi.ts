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
    ActionCompleteEventType,
    ComponentNotificationEvent,
    AttackEntityEventData,
    DamageEntityEventData,
    BumpEntityEvent,
    AttackEntityEvent
} from "Modules/CustomEvents";
import Entity from "Components/Entity";
"atomic component";

export default class PlayerAi extends CustomJSComponent {
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

        // called when we bump into something
        this.subscribeToEvent(this.node, BumpEntityEvent(this.onHandleBump.bind(this)));

        // called when we want to attack something
        this.subscribeToEvent(this.node, AttackEntityEvent(this.onHandleAttackEntity.bind(this)));

        this.sendEvent(RegisterActorAiEventData({ ai: this }));
    }

    act() {
        this.DEBUG("Called Act");
        this.sendEvent(PlayerActionBeginEventData());

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

        this.node.sendEvent(ActionCompleteEventData());
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

    /**
     * Called when we bump into something.
     * @param data
     */
    onHandleBump(data: ComponentNotificationEvent) {
        this.DEBUG("Bumped Entity: " + data.targetComponent.node.name);
        // who did we bump into?
        const entityComponent = data.targetComponent.node.getJSComponent<Entity>("Entity");
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
        this.DEBUG(data.targetComponent.typeName);
        // figure out damage and send it over
        data.targetComponent.node.sendEvent(DamageEntityEventData({
            attackerComponent: this
        }));
    }



}
