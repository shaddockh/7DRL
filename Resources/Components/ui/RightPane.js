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
"atomic component";
var RightPane = (function (_super) {
    __extends(RightPane, _super);
    function RightPane() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inspectorFields = {
            debug: false
        };
        return _this;
    }
    RightPane.prototype.start = function () {
        this.view = new Atomic.UIView();
        var WIDTH = Atomic.graphics.width;
        var HEIGHT = Atomic.graphics.height;
        var mainLayout = new Atomic.UILayout();
        mainLayout.axis = Atomic.UI_AXIS.UI_AXIS_Y;
        mainLayout.layoutDistribution = Atomic.UI_LAYOUT_DISTRIBUTION.UI_LAYOUT_DISTRIBUTION_GRAVITY;
        mainLayout.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;
        // webClient.loadURL("atomic://")
        // const url = "atomic://" + ToolCore.toolSystem.project.resourcePath + "EditorData/customEditor.html";
        var f = Atomic.cache.getResourceFileName("test.html");
        var url2 = "atomic://" + f;
        // this.view.center();
        var webView = new WebView.UIWebView(url2);
        webView.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;
        var webClient = webView.webClient;
        // this.view.setSize(WIDTH, HEIGHT);
        // this.view.addChild(webView);
        webView.setSize(200, HEIGHT);
        webView.setPosition(WIDTH - 200, 0);
        // this.view.setSize(WIDTH, HEIGHT);
        // this.view.setPosition(WIDTH - 200, 0);
        this.DEBUG(WIDTH);
        this.DEBUG(HEIGHT);
        // webView.opacity = 0.5;
        this.view.opacity = 0.5;
        this.window = new Atomic.UIWidget();
        this.window.load("ui/hud.ui.tb.txt");
        this.view.addChild(this.window);
        this.window.setRect([0, Atomic.graphics.height - 50, Atomic.graphics.width, Atomic.graphics.height]);
        this.window.skinBg = "";
    };
    return RightPane;
}(CustomJSComponent_1.default));
exports.default = RightPane;
//# sourceMappingURL=RightPane.js.map