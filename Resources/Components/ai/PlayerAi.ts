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
    PlayerActionBeginEventData
} from "Modules/CustomEvents";
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
                this.deferAction(resolve, "PlayerActionComplete");
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
