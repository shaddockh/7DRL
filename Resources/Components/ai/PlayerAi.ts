import Attack from "Components/Attack";
import Common from "Components/Common";
import Entity from "Components/Entity";
import Health from "Components/Health";
import { Attacker } from "Game";
import {
    LogMessageEventData,
    MoveEntityBlockedEvent,
    PlayerAttributeChangedEventData,
    SkipTurnEvent
} from "Modules/CustomEvents";
import {
    ActionCompleteEventData,
    ActionCompleteEventType,
    AdjustEntityHealthEventData,
    AttackEntityEvent,
    AttackEntityEventData,
    BumpedByEntityEventData,
    BumpEntityEvent,
    ComponentNotificationEvent,
    DestroyEntityEvent,
    HitEvent,
    HitEventData,
    MoveEntityCompleteEvent,
    MoveEntityCompleteEventData,
    PlayerActionBeginEventData,
    PlayerDiedEventData,
    RegisterActorAiEventData,
    RegisterLevelActorsEvent,
    TurnTakenEvent,
    TurnTakenEventData,
    DeregisterActorAiEventData
} from "Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
"atomic component";

export default class PlayerAi extends CustomJSComponent implements Attacker {

    /**
     * Fields witihin the inspectorFields object will be exposed to the editor
     */
    inspectorFields = {
        debug: false,
        attackComponentName: "Attack",
        alive: true
    };

    /** name of the component that contains the attack logic */
    attackComponentName = "Attack";
    alive = true;

    start() {
        // only care about move complete events from ourselves
        this.subscribeToEvent(this.node, MoveEntityCompleteEvent(this.onMoveComplete.bind(this)));
        this.subscribeToEvent(this.node, TurnTakenEvent(this.onTurnTaken.bind(this)));
        // this.subscribeToEvent(this.node, PlayerActionCompleteEvent(this.onActionComplete.bind(this)));

        // called when we bump into something
        this.subscribeToEvent(this.node, BumpEntityEvent(this.onHandleBump.bind(this)));

        // called when we want to attack something
        this.subscribeToEvent(this.node, AttackEntityEvent(this.onHandleAttackEntity.bind(this)));

        // called when we have been hit by something
        this.subscribeToEvent(this.node, HitEvent(this.onHit.bind(this)));

        // called when entity should be destroyed
        this.subscribeToEvent(this.node, DestroyEntityEvent(this.onDestroy.bind(this)));

        this.subscribeToEvent(this.node, MoveEntityBlockedEvent((data) => {
            this.sendEvent(LogMessageEventData({ message: "Blocked." }));
        }));

        this.sendEvent(RegisterActorAiEventData({ ai: this }));

        // TODO: This is a global event.  Need to actually make this listen at the node level
        this.subscribeToEvent(SkipTurnEvent(this.onSkipTurn.bind(this)));

        // called when we are moving to a new level
        this.subscribeToEvent(RegisterLevelActorsEvent(() => {
            this.DEBUG("Got a request to register ourself");
            this.sendEvent(RegisterActorAiEventData({ ai: this }));
        }));

        // TODO: make this message based 
        this.node.scene.getMainCamera().node.worldPosition = this.node.worldPosition;

        this.sendEvent(PlayerAttributeChangedEventData({
            name: "life",
            value: this.node.getJSComponent<Health>("Health").life
        }));
    }

    act() {
        this.DEBUG("Called Act on PlayerAI");
        if (this.alive) {
            this.sendEvent(PlayerActionBeginEventData());

            // we are returning a 'thenable' which tells the scheduler to not move on to the next actor
            // until this actor has completed.  This is overriding the onTurnTaken event on this class with
            // the callback passed to the then method, which means that when this class gets an onTurnTaken
            // event, it will resolve the then.
            // See: http://ondras.github.io/rot.js/manual/#timing/engine for some more information.
            return {
                then: (resolve) => {
                    // Strange race condition here..need to get out of the event loop and call the resolve
                    // on the next update or else we get into an infinite loop because the prior event trigger
                    // has not cleared out of the queue by the time this gets scheduled again.
                    this.deferUntilEvent(() => {
                        this.deferUntilUpdate(resolve);
                    }, ActionCompleteEventType);
                }
            };
        } else {
            this.DEBUG("Actor is not alive");
            return {
                then: (resolve) => {
                    // Let the update loop happen and then resolve
                    this.deferUntilUpdate(resolve);
                }
            };
        }
    }

    onMoveComplete() {
        this.DEBUG("OnMoveComplete");
        this.node.sendEvent(TurnTakenEventData());

        // TODO: move this to a message to the camera
        this.node.scene.getMainCamera().node.worldPosition = this.node.worldPosition;
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

    onSkipTurn() {
        this.sendEvent(LogMessageEventData({ message: "Waiting..." }));
        this.onTurnTaken();
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
            this.DEBUG("preparing to attack");
            // here we need to recreate the event object because it will get GCd
            this.node.sendEvent(AttackEntityEventData({
                senderComponent: this,
                targetComponent: data.targetComponent
            }));
        } else {
            this.DEBUG("Sending bump");
            data.targetComponent.node.sendEvent(BumpedByEntityEventData({
                senderComponent: this,
                targetComponent: data.targetComponent
            }));

            this.node.sendEvent(MoveEntityCompleteEventData());
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
        data.targetComponent.node.sendEvent(HitEventData({
            attackerComponent: this
        }));
        this.node.sendEvent(MoveEntityCompleteEventData());
        this.sendEvent(LogMessageEventData({ message: `Attack ${this.getEntityName(data.targetComponent)}.` }));
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

        this.sendEvent(PlayerAttributeChangedEventData({
            name: "life",
            value: this.node.getJSComponent<Health>("Health").life
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

        this.node.scale2D = 0; // hide
        this.sendEvent(DeregisterActorAiEventData({ ai: this }));
        this.sendEvent(PlayerDiedEventData());
        this.deferUntilUpdate(() => {
            Atomic.destroy(this.node);
        });
    }
}
