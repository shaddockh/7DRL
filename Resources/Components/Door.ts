import { LoadLevelEventData } from "../Modules/CustomEvents";
import { ComponentNotificationEvent, BumpedByEntityEvent } from "Modules/CustomEvents";
import { default as CustomJSComponent, CustomJSComponentInspectorFields } from "Modules/CustomJSComponent";
import LevelGenerator from "Modules/LevelGen/LevelGenerator";
"atomic component";

export interface DoorInspectorFields extends CustomJSComponentInspectorFields {

}
export default class Door extends CustomJSComponent {
    /**
    * Fields witihin the inspectorFields object will be exposed to the editor
    */
    inspectorFields: DoorInspectorFields = {
        debug: false
    };

    start() {
        this.subscribeToEvent(this.node, BumpedByEntityEvent(this.onBumpedByEntity.bind(this)));
    }

    onBumpedByEntity(data: ComponentNotificationEvent) {
        this.DEBUG("Generating next level");

        // let's render the next levelj
        const generator = new LevelGenerator(20, 20, true);
        const level = generator.generateLevel();

        this.sendEvent(LoadLevelEventData({
            level: level
        }));

    }
}