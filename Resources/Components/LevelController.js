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
var ROT = require("rot");
var CustomEvents_1 = require("Modules/CustomEvents");
"atomic component";
var LevelController = (function (_super) {
    __extends(LevelController, _super);
    function LevelController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Fields witihin the inspectorFields object will be exposed to the editor
         */
        _this.inspectorFields = {
            debug: true,
        };
        return _this;
    }
    LevelController.prototype.start = function () {
        this.subscribeToEvent(CustomEvents_1.LoadLevelEvent(this.loadLevel.bind(this)));
        this.subscribeToEvent(CustomEvents_1.RegisterActorAiEvent(this.registerActor.bind(this)));
        this.subscribeToEvent(CustomEvents_1.DeregisterActorAiEvent(this.deregisterActor.bind(this)));
        this.sendEvent(CustomEvents_1.SceneReadyEventData());
    };
    LevelController.prototype.registerActor = function (data) {
        this.DEBUG("Actor registered with scheduler");
        this.scheduler.add(data.ai, true);
        // TODO: This shouldn't be needed, but for some reason the scheduler isn't triggering if entities are added after the engine
        // has become unlocked
        this.engine.unlock();
    };
    LevelController.prototype.deregisterActor = function (data) {
        this.DEBUG("Actor deregistered from scheduler");
        this.scheduler.remove(data.ai);
    };
    LevelController.prototype.loadLevel = function (eventData) {
        var _this = this;
        this.DEBUG("Loading new level");
        this.currentLevel = eventData.level;
        this.currentDepth = eventData.depth;
        this.sendEvent(CustomEvents_1.RenderCurrentLevelEventData());
        if (!this.engine) {
            this.scheduler = new ROT.Scheduler.Simple();
            this.engine = new ROT.Engine(this.scheduler);
            this.DEBUG("Starting engine");
            this.engine.start();
        }
        else {
            this.scheduler.clear();
        }
        this.sendEvent(CustomEvents_1.PlayerAttributeChangedEventData({
            name: "depth",
            value: eventData.depth
        }));
        // Let's let eveything load an then unlock the engine
        this.deferAction(function () {
            _this.DEBUG("Asking all entities to register themselves");
            _this.sendEvent(CustomEvents_1.RegisterLevelActorsEventData({
                levelController: _this
            }));
            _this.DEBUG("Unlocking engine");
            _this.engine.unlock();
        });
        // one-time 
        // this.sendEvent(PlayerActionBeginEventData());
    };
    return LevelController;
}(CustomJSComponent_1.default));
exports.default = LevelController;
