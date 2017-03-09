import { DestroyEntityEvent } from "Modules/CustomEvents";
import GridMover from "Components/GridMover";
import LevelRenderer from "Components/LevelRenderer";
import { EntityData, Position2d } from "Game";
import CustomJSComponent from "Modules/CustomJSComponent";
"atomic component";

export default class Entity extends CustomJSComponent implements EntityData {
    inspectorFields = {
        debug: true,
        blocksPath: false,
        bumpable: false,
        attackable: false,
        usable: false
    };

    blocksPath: boolean;
    bumpable: boolean;
    attackable: boolean;
    blueprint: any;
    deleted = false;
    // TODO: maybe move this into a "Usable" component
    usable: boolean;

    private gridPosition_: Position2d;
    get gridPosition(): Position2d {
        return this.gridPosition_;
    }

    set gridPosition(pos: Position2d) {
        this.gridPosition_ = pos;
    }

    get entityComponent(): Atomic.JSComponent {
        return this;
    }

    start() {
        this.subscribeToEvent(this.node, DestroyEntityEvent(this.onDestroy.bind(this)));
    }

    update(timeStep) { }

    onDestroy() {
        this.deleted = true;
    }


}
