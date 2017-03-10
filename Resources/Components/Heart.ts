import { DamageEntityEventData } from "../Modules/CustomEvents";
import { ComponentNotificationEvent, BumpedByEntityEvent } from "Modules/CustomEvents";
import { default as CustomJSComponent, CustomJSComponentInspectorFields } from "Modules/CustomJSComponent";
"atomic component";

export interface HeartInspectorFields extends CustomJSComponentInspectorFields {
    value: number;
}

export default class Heart extends CustomJSComponent {
    /**
    * Fields witihin the inspectorFields object will be exposed to the editor
    */
    inspectorFields: HeartInspectorFields = {
        debug: false,
        value: 2
    };

    value = 2;

    start() {
        this.subscribeToEvent(this.node, BumpedByEntityEvent(this.onBump.bind(this)));
    }

    onBump(data: ComponentNotificationEvent) {
        //TODO: hard coding
        if (data.senderComponent.node.name == "entity_player") {
            this.sendEvent(DamageEntityEventData({
                value: this.value * -1
            }));

            this.deferAction(() => {
                Atomic.destroy(this.node);
            });
        }

    }
}