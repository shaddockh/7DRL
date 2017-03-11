import { KeyPickedUpEvent, LoadLevelEventData, LogMessage, LogMessageEvent } from "../Modules/CustomEvents";
import { ComponentNotificationEvent, BumpedByEntityEvent, LogMessageEventData } from "Modules/CustomEvents";
import { default as CustomJSComponent, CustomJSComponentInspectorFields } from "Modules/CustomJSComponent";
import LevelGenerator from "Modules/LevelGen/LevelGenerator";
import LevelController from "Components/LevelController";
import Common from "Components/Common";
"atomic component";

export interface DoorInspectorFields extends CustomJSComponentInspectorFields {
    keyId?: number;
    locked: boolean;
}

export default class Door extends CustomJSComponent {
    /**
    * Fields witihin the inspectorFields object will be exposed to the editor
    */
    inspectorFields: DoorInspectorFields = {
        debug: false,
        keyId: 1,
        locked: true
    };

    currentDepth = 1;
    keyId = 1;
    locked = true;

    start() {
        this.subscribeToEvent(this.node, BumpedByEntityEvent(this.onBumpedByEntity.bind(this)));
        this.subscribeToEvent(KeyPickedUpEvent(this.onKeyPickedUp.bind(this)));
        this.currentDepth = this.node.scene.getJSComponent<LevelController>("LevelController").currentDepth;
    }

    onBumpedByEntity(data: ComponentNotificationEvent) {
        const common = data.senderComponent.node.getJSComponent<Common>("Common");
        if (common && common.isPlayer) {
            if (this.locked == false) {
                this.DEBUG("Generating next level");

                // let's render the next levelj
                const generator = new LevelGenerator(30, 30, this.currentDepth + 1, true);
                const level = generator.generateLevel();

                this.sendEvent(LoadLevelEventData({
                    level: level,
                    depth: this.currentDepth + 1
                }));
            } else {
                this.sendEvent(LogMessageEventData({
                    message: "Locked!"
                }));
            }
        }
    }

    onKeyPickedUp(data: KeyPickedUpEvent) {
        if (data.keyId == this.keyId) {
            this.locked = false;
        }
    }
}