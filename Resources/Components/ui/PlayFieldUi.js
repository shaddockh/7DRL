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
var CustomEvents_2 = require("Modules/CustomEvents");
var CustomJSComponent_1 = require("Modules/CustomJSComponent");
"atomic component";
var PlayFieldUI = (function (_super) {
    __extends(PlayFieldUI, _super);
    function PlayFieldUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inspectorFields = {
            debug: false
        };
        return _this;
    }
    PlayFieldUI.prototype.start = function () {
        var _this = this;
        this.DEBUG("ui started");
        this.view = new Atomic.UIView();
        var WIDTH = Atomic.graphics.width;
        var HEIGHT = Atomic.graphics.height;
        this.window = new Atomic.UIWindow();
        this.window.settings = Atomic.UI_WINDOW_SETTINGS.UI_WINDOW_SETTINGS_NONE;
        this.view.addChild(this.window);
        this.window.setRect([0, Atomic.graphics.height - 100, Atomic.graphics.width, Atomic.graphics.height]);
        var log = new Atomic.UIEditField();
        log.readOnly = true;
        log.multiline = true;
        this.window.addChild(log);
        log.setRect([0, 0, 600, 100]);
        var logArray = [];
        this.subscribeToEvent(CustomEvents_2.LogMessageEvent(function (data) {
            logArray.push(data.message);
            if (logArray.length > 5) {
                logArray.shift();
            }
            log.text = logArray.join("\n");
            log.scrollTo(0, 1000);
        }));
        var life = new Atomic.UITextField();
        this.window.addChild(life);
        life.setRect([700, 0, 850, 20]);
        life.text = "Life: ";
        life.textAlign = Atomic.UI_TEXT_ALIGN.UI_TEXT_ALIGN_LEFT;
        var depth = new Atomic.UITextField();
        this.window.addChild(depth);
        depth.setRect([700, 20, 850, 40]);
        depth.textAlign = Atomic.UI_TEXT_ALIGN.UI_TEXT_ALIGN_LEFT;
        this.subscribeToEvent(CustomEvents_2.PlayerAttributeChangedEvent(function (data) {
            _this.DEBUG("Got an attribute changed event: " + data.name);
            switch (data.name) {
                case "life":
                    life.text = "Life: " + data.value;
                    break;
                case "depth":
                    depth.text = "Depth: " + data.value * 10 + "'";
                    break;
            }
        }));
        var key = new Atomic.UIImageWidget();
        this.window.addChild(key);
        key.setRect([625, 25, 675, 75]);
        this.subscribeToEvent(CustomEvents_2.KeyPickedUpEvent(function (data) {
            key.setImage("Sprites/PlanetCute/Key.png");
        }));
        this.subscribeToEvent(CustomEvents_1.LoadLevelEvent(function (data) {
            key.setImage("");
        }));
        var msgWindow = new Atomic.UIMessageWindow(this.view, "id");
        msgWindow.show("Welcome to the dungeon!", "\n        MOVEMENT:\n        Movement keys are WASD, VI, or Arrow Keys\n\n        WASD:\n              W\n            A   S \n              D\n\n        VI:\n              K\n            H   L\n              J \n\n        <SPACE> to skip turn.\n\n        Each level has a locked door.  You must find the key to descend to the next level.  How far can you get?\n        ", Atomic.UI_MESSAGEWINDOW_SETTINGS.UI_MESSAGEWINDOW_SETTINGS_OK, true, 500, 500);
        // this is not getting displayed for some reason...why?
        this.subscribeToEvent(CustomEvents_1.PlayerDiedEvent(function () {
            var msgwindow2 = new Atomic.UIMessageWindow(_this.view, "death");
            msgwindow2.show("You died.", "The dungeon has taken you. How fantastic!  Now you can play again.", Atomic.UI_MESSAGEWINDOW_SETTINGS.UI_MESSAGEWINDOW_SETTINGS_OK, true, 200, 200);
            msgWindow.subscribeToEvent(Atomic.UIWidgetEvent(function (data) {
                if (data.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK) {
                    if (data.target.id == "ok") {
                        Atomic.graphics.close();
                    }
                    else {
                        _this.DEBUG(data.target.id);
                    }
                }
            }));
        }));
    };
    return PlayFieldUI;
}(CustomJSComponent_1.default));
exports.default = PlayFieldUI;
