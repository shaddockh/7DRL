import {
    LogMessageEvent,
    LogMessage
} from "Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
"atomic component";

export default class RightPane extends CustomJSComponent {

    inspectorFields = {
        debug: false
    };
    private window: Atomic.UIWidget;
    private view: Atomic.UIView;
    start() {
        this.view = new Atomic.UIView();

        const WIDTH = Atomic.graphics.width;
        const HEIGHT = Atomic.graphics.height;

        let mainLayout = new Atomic.UILayout();
        mainLayout.axis = Atomic.UI_AXIS.UI_AXIS_Y;
        mainLayout.layoutDistribution = Atomic.UI_LAYOUT_DISTRIBUTION.UI_LAYOUT_DISTRIBUTION_GRAVITY;
        mainLayout.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;

        // webClient.loadURL("atomic://")
        // const url = "atomic://" + ToolCore.toolSystem.project.resourcePath + "EditorData/customEditor.html";
        let f = Atomic.cache.getResourceFileName("test.html");
        const url2 = "atomic://" + f;
        // this.view.center();

        const webView = new WebView.UIWebView(url2);
        webView.gravity = Atomic.UI_GRAVITY.UI_GRAVITY_ALL;
        const webClient = webView.webClient;

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


    }
}
