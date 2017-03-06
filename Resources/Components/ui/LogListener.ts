import {
    LogMessageEvent,
    LogMessage
} from "Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
"atomic component";

export default class LogListener extends CustomJSComponent {

    inspectorFields = {
        debug: false
    };

    start() {
        this.subscribeToEvent(LogMessageEvent(this.logMessage.bind(this)));
    }

    logMessage(data: LogMessage) {
        this.DEBUG(data.message);
    }
}