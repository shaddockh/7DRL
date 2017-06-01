import { AdjustEntityHealthEventData, LogMessageEvent } from "../Modules/CustomEvents";
import { ComponentNotificationEvent, BumpedByEntityEvent, DestroyEntityEventData, PlayerAttributeChangedEventData, LogMessageEventData } from "Modules/CustomEvents";
import { default as CustomJSComponent, CustomJSComponentInspectorFields } from "Modules/CustomJSComponent";
import Common from "Components/Common";
import Health from "Components/Health";
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
        let common = data.senderComponent.node.getJSComponent<Common>("Common");
        if (common.isPlayer) {
            this.DEBUG("Consumed heart");
            data.senderComponent.node.sendEvent(AdjustEntityHealthEventData({
                value: this.value
            }));

            const life = data.senderComponent.node.getJSComponent<Health>("Health").life;
            data.senderComponent.node.sendEvent(PlayerAttributeChangedEventData({
                name: "life",
                value: life
            }));

            this.sendEvent(LogMessageEventData({
                message: "You feel healthier!"
            }));

            this.node.sendEvent(DestroyEntityEventData());
            this.deferUntilUpdate(() => Atomic.destroy(this.node));
        }
    }
}