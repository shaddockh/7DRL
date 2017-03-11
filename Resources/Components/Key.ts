import { LogMessageEventData } from "../Modules/CustomEvents";
import { BumpedByEntityEvent, ComponentNotificationEvent, KeyPickedUpEvent, KeyPickedUpEventData, DestroyEntityEventData } from "Modules/CustomEvents";
import { default as CustomJSComponent, CustomJSComponentInspectorFields } from "Modules/CustomJSComponent";
import Common from "Components/Common";
"atomic component";

export interface KeyInspectorFields extends CustomJSComponentInspectorFields {
    keyId?: number;
}

export default class Key extends CustomJSComponent {
    /**
    * Fields witihin the inspectorFields object will be exposed to the editor
    */
    inspectorFields: KeyInspectorFields = {
        debug: false,
        keyId: 1
    };

    keyId = 1;

    start() {
        this.subscribeToEvent(this.node, BumpedByEntityEvent(this.onBumpedByEntity.bind(this)));
    }

    onBumpedByEntity(data: ComponentNotificationEvent) {
        this.DEBUG("Got a bump event");

        let common = data.senderComponent.node.getJSComponent<Common>("Common");
        if (common.isPlayer) {
            this.node.sendEvent(LogMessageEventData({ message: "You found a key!" }));
            this.node.sendEvent(KeyPickedUpEventData({ keyId: this.keyId }));
            this.node.sendEvent(DestroyEntityEventData());
            this.deferAction(() => Atomic.destroy(this.node));
        }
    }
}