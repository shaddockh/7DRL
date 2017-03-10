import { PlayerAttributeChangedEvent } from "../../Modules/CustomEvents";
import {
    LogMessageEvent,
    LogMessage
} from "Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
"atomic component";

export default class PlayFieldUI extends CustomJSComponent {

    inspectorFields = {
        debug: false
    };
    private window: Atomic.UIWindow;
    private view: Atomic.UIView;
    start() {
        this.DEBUG("ui started");
        this.view = new Atomic.UIView();

        const WIDTH = Atomic.graphics.width;
        const HEIGHT = Atomic.graphics.height;

        this.window = new Atomic.UIWindow();
        this.window.settings = Atomic.UI_WINDOW_SETTINGS.UI_WINDOW_SETTINGS_NONE;
        this.view.addChild(this.window);
        this.window.setRect([0, Atomic.graphics.height - 100, Atomic.graphics.width, Atomic.graphics.height]);

        let log = new Atomic.UIEditField();
        log.readOnly = true;
        log.multiline = true;
        this.window.addChild(log);
        log.setRect([0, 0, 600, 100]);
        let logArray = [];
        this.subscribeToEvent(LogMessageEvent((data) => {
            logArray.push(data.message);
            if (logArray.length > 5) {
                logArray.shift();
            }
            log.text = logArray.join("\n");
            log.scrollTo(0, 1000);
        }));

        let life = new Atomic.UITextField();
        this.window.addChild(life);
        life.setRect([700, 0, 850, 20]);
        life.text = "Life: ";
        life.textAlign = Atomic.UI_TEXT_ALIGN.UI_TEXT_ALIGN_LEFT;

        let depth = new Atomic.UITextField();
        this.window.addChild(depth);
        depth.setRect([700, 20, 850, 40]);
        depth.textAlign = Atomic.UI_TEXT_ALIGN.UI_TEXT_ALIGN_LEFT;
        this.subscribeToEvent(PlayerAttributeChangedEvent((data) => {
            this.DEBUG("Got an attribute changed event: " + data.name);
            switch (data.name) {
                case "life":
                    life.text = "Life: " + data.value;
                    break;
                case "depth":
                    depth.text = `Depth: ${data.value * 10}'`;
                    break;
            }
        }));
    }
}
