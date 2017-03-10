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
var CustomEvents_1 = require("../../Modules/CustomEvents");
"atomic component";
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
var CustomEvents_2 = require("Modules/CustomEvents");
;
var PlayerInputHandler = (function (_super) {
    __extends(PlayerInputHandler, _super);
    function PlayerInputHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inspectorFields = {
            debug: false
        };
        /**
         * Are we idle, waiting for an action?
         */
        _this.idle = false;
        _this.keymap = (_a = {},
            _a[1 /* MoveLeft */] = [Atomic.KEY_LEFT, Atomic.KEY_H, Atomic.KEY_A],
            _a[2 /* MoveRight */] = [Atomic.KEY_RIGHT, Atomic.KEY_L, Atomic.KEY_D],
            _a[3 /* MoveUp */] = [Atomic.KEY_UP, Atomic.KEY_K, Atomic.KEY_W],
            _a[4 /* MoveDown */] = [Atomic.KEY_DOWN, Atomic.KEY_J, Atomic.KEY_S],
            _a[5 /* SkipTurn */] = [Atomic.KEY_SPACE],
            _a);
        return _this;
        var _a;
    }
    PlayerInputHandler.prototype.start = function () {
        this.subscribeToEvent(CustomEvents_2.PlayerActionBeginEvent(this.onPlayerActionBegin.bind(this)));
    };
    PlayerInputHandler.prototype.getCurrentAction = function () {
        var input = Atomic.input, keymap = this.keymap;
        for (var action in keymap) {
            var keys = keymap[action];
            if (keys && keys.length) {
                for (var i = 0; i < keys.length; i++) {
                    if (input.getKeyPress(keys[i])) {
                        return parseInt(action);
                    }
                }
            }
        }
        return 0 /* None */;
    };
    /**
     * On the start of our turn, we want to start listening for player commands
     */
    PlayerInputHandler.prototype.onPlayerActionBegin = function () {
        this.DEBUG("Player Action Begin.  Setting Idle");
        this.idle = true;
    };
    PlayerInputHandler.prototype.update = function () {
        // if (!gameState.getCurrentLevel().isGameOver && this.idle) {
        if (this.idle) {
            var action = this.getCurrentAction();
            if (action !== 0 /* None */) {
                this.idle = false;
                switch (action) {
                    case 1 /* MoveLeft */:
                        this.DEBUG("Processing Action: move left");
                        this.sendEvent(CustomEvents_1.LogMessageEventData({ message: "Walk West." }));
                        this.sendEvent(CustomEvents_2.MoveEntityByOffsetEventData({ position: [-1, 0] }));
                        break;
                    case 2 /* MoveRight */:
                        this.DEBUG("Processing Action: move right");
                        this.sendEvent(CustomEvents_1.LogMessageEventData({ message: "Walk East." }));
                        this.sendEvent(CustomEvents_2.MoveEntityByOffsetEventData({ position: [1, 0] }));
                        break;
                    case 3 /* MoveUp */:
                        this.DEBUG("Processing Action: move up");
                        this.sendEvent(CustomEvents_1.LogMessageEventData({ message: "Walk North." }));
                        this.sendEvent(CustomEvents_2.MoveEntityByOffsetEventData({ position: [0, 1] }));
                        break;
                    case 4 /* MoveDown */:
                        this.DEBUG("Processing Action: move down");
                        this.sendEvent(CustomEvents_1.LogMessageEventData({ message: "Walk South." }));
                        this.sendEvent(CustomEvents_2.MoveEntityByOffsetEventData({ position: [0, -1] }));
                        break;
                    case 5 /* SkipTurn */:
                        this.DEBUG("Processing Action: skip turn");
                        this.sendEvent(CustomEvents_2.SkipTurnEventData());
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
    };
    return PlayerInputHandler;
}(CustomJSComponent_1.default));
exports.default = PlayerInputHandler;
//# sourceMappingURL=PlayerInputHandler.js.map