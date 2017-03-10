import { LoadLevelEventData } from "../Modules/CustomEvents";
import { ComponentNotificationEvent, BumpedByEntityEvent } from "Modules/CustomEvents";
import { default as CustomJSComponent, CustomJSComponentInspectorFields } from "Modules/CustomJSComponent";
import LevelGenerator from "Modules/LevelGen/LevelGenerator";
import LevelController from "Components/LevelController";
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

    currentDepth = 1;

    start() {
        this.subscribeToEvent(this.node, BumpedByEntityEvent(this.onBumpedByEntity.bind(this)));
        this.currentDepth = this.node.scene.getJSComponent<LevelController>("LevelController").currentDepth;
    }

    onBumpedByEntity(data: ComponentNotificationEvent) {
        this.DEBUG("Generating next level");

        // let's render the next levelj
        const generator = new LevelGenerator(30, 30, this.currentDepth + 1, true);
        const level = generator.generateLevel();

        this.sendEvent(LoadLevelEventData({
            level: level,
            depth: this.currentDepth + 1
        }));

    }
}