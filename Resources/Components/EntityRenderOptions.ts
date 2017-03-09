import Entity from "Components/Entity";
import LevelController from "Components/LevelController";
import { Position2d } from "Game";
import { MoveEntityCompleteEvent } from "Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
"atomic component";

export default class EntityRenderOptions extends CustomJSComponent {
    inspectorFields = {
        debug: true,
        orderInLayer: 2,
        slicesInLayer: 4,
        yOffset: 40
    };

    orderInLayer: number;
    slicesInLayer = 4;
    yOffset = 40;

    get gridPosition(): Position2d {
        return this.node.getJSComponent<Entity>("Entity").gridPosition;
    }

    get entityComponent(): Atomic.JSComponent {
        return this;
    }

    start() {
        this.subscribeToEvent(this.node, MoveEntityCompleteEvent(this.onMoveEntityComplete.bind(this)));
        this.onMoveEntityComplete();
    }

    onMoveEntityComplete() {
        let currentLevel = this.node.scene.getJSComponent<LevelController>("LevelController").currentLevel;
        this.getComponent<Atomic.StaticSprite2D>("StaticSprite2D").orderInLayer = (currentLevel.height - this.gridPosition[1]) * this.slicesInLayer + this.orderInLayer;
    }

    update(timeStep) {

    }

}
