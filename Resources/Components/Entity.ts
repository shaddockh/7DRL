import GridMover from "Components/GridMover";
import LevelRenderer from "Components/LevelRenderer";
import { EntityData, Position2d } from "Game";
import CustomJSComponent from "Modules/CustomJSComponent";
"atomic component";

export default class Entity extends CustomJSComponent implements EntityData {
    inspectorFields = {
        debug: true,
        blocksPath: false,
        bumpable: false
    };

    blocksPath: boolean;
    bumpable: boolean;
    blueprint: any;

    get gridPosition(): Position2d {
        return this.node.getJSComponent<GridMover>("GridMover").gridPosition;
    }

    get entityComponent(): Atomic.JSComponent {
        return this;
    }

    start() { }

    update(timeStep) { }

}
