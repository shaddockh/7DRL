import { AdjustEntityHealthEvent, DestroyEntityEventData } from "../Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
"atomic component";
export default class Health extends CustomJSComponent {
    /**
    * Fields witihin the inspectorFields object will be exposed to the editor
    */
    inspectorFields = {
        debug: false,
        life: 1,
    };

    life = 1;

    start() {
        this.DEBUG("Start");
        this.subscribeToEvent(this.node, AdjustEntityHealthEvent(this.onAdjustEntityHealth.bind(this)));
    }

    onAdjustEntityHealth(data: AdjustEntityHealthEvent) {
        this.life = Math.max(0, this.life + data.value);
        this.DEBUG(`onAdjustEntityHealth: (adjust value: ${data.value}, new life: ${this.life})`);
        if (this.life == 0) {
            // TODO: should we send an on health changed event?
            // TODO: kill
            this.DEBUG(`onDamageEntity: sending kill message`);
            this.node.sendEvent(DestroyEntityEventData());
        }
    }
}