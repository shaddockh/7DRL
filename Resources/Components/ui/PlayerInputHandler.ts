import { LogMessageEventData } from "../../Modules/CustomEvents";
import { Position2d } from "Game";
"atomic component";
import CustomJSComponent from "Modules/CustomJSComponent";
import { PlayerActionBeginEvent, MoveEntityByOffsetEventData, SkipTurnEventData } from "Modules/CustomEvents";

const enum PlayerActions {
    None,
    MoveLeft,
    MoveRight,
    MoveUp,
    MoveDown,
    SkipTurn
};

export default class PlayerInputHandler extends CustomJSComponent {

    inspectorFields = {
        debug: false
    };

    /**
     * Are we idle, waiting for an action?
     */
    idle = false;

    start() {
        this.subscribeToEvent(PlayerActionBeginEvent(this.onPlayerActionBegin.bind(this)));
    }

    keymap = {
        [PlayerActions.MoveLeft]: [Atomic.KEY_LEFT, Atomic.KEY_H, Atomic.KEY_A],
        [PlayerActions.MoveRight]: [Atomic.KEY_RIGHT, Atomic.KEY_L, Atomic.KEY_D],
        [PlayerActions.MoveUp]: [Atomic.KEY_UP, Atomic.KEY_K, Atomic.KEY_W],
        [PlayerActions.MoveDown]: [Atomic.KEY_DOWN, Atomic.KEY_J, Atomic.KEY_S],
        [PlayerActions.SkipTurn]: [Atomic.KEY_SPACE]
        // [PlayerActions.DUMP_METRICS]: [Atomic.KEY_0]
    };

    getCurrentAction() {
        let input = Atomic.input,
            keymap = this.keymap;

        for (let action in keymap) {
            let keys = keymap[action];
            if (keys && keys.length) {
                for (let i = 0; i < keys.length; i++) {
                    if (input.getKeyPress(keys[i])) {
                        return parseInt(action);
                    }
                }
            }
        }
        return PlayerActions.None;
    }

    /**
     * On the start of our turn, we want to start listening for player commands
     */
    onPlayerActionBegin() {
        this.DEBUG("Player Action Begin.  Setting Idle");
        this.idle = true;
    }

    update( /*timeStep*/) {
        // if (!gameState.getCurrentLevel().isGameOver && this.idle) {
        if (this.idle) {
            let action = this.getCurrentAction();
            if (action !== PlayerActions.None) {
                this.idle = false;
                switch (action) {
                    case PlayerActions.MoveLeft:
                        this.DEBUG("Processing Action: move left");
                        this.sendEvent(LogMessageEventData({ message: "Walk West." }));
                        this.sendEvent(MoveEntityByOffsetEventData({ position: [-1, 0] }));
                        break;
                    case PlayerActions.MoveRight:
                        this.DEBUG("Processing Action: move right");
                        this.sendEvent(LogMessageEventData({ message: "Walk East." }));
                        this.sendEvent(MoveEntityByOffsetEventData({ position: [1, 0] }));
                        break;
                    case PlayerActions.MoveUp:
                        this.DEBUG("Processing Action: move up");
                        this.sendEvent(LogMessageEventData({ message: "Walk North." }));
                        this.sendEvent(MoveEntityByOffsetEventData({ position: [0, 1] }));
                        break;
                    case PlayerActions.MoveDown:
                        this.DEBUG("Processing Action: move down");
                        this.sendEvent(LogMessageEventData({ message: "Walk South." }));
                        this.sendEvent(MoveEntityByOffsetEventData({ position: [0, -1] }));
                        break;
                    case PlayerActions.SkipTurn:
                        this.DEBUG("Processing Action: skip turn");
                        this.sendEvent(SkipTurnEventData());
                        break;
                    // case PlayerActions.DUMP_METRICS:
                    //     this.DEBUG('Processing Action: dump metrics');
                    //     metrics.dumpMetrics();
                    //     this.idle = true;
                    //     break;

                    default:
                        this.idle = true;
                        break;
                }
            }
        }
    }
}

