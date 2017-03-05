"atomic component";

import * as events from "Modules/CustomEvents";
import { LevelMap } from "Modules/LevelGen/LevelMap";
import * as nodeBuilder from "atomic-blueprintlib";
import CustomJSComponent from "Modules/CustomJSComponent";

export default class LevelRenderer extends CustomJSComponent {
    /**
     * Fields witihin the inspectorFields object will be exposed to the editor
     */
    inspectorFields = {
        debug: true,
        gridPixelSizeX: 101,
        gridPixelSizeY: 80,
        zoom: 1.0
    };

    private currentLevel: LevelMap;
    private gridPixelSizeX: number;
    private gridPixelSizeY: number;
    private zoom: number;
    private childNodes: Atomic.Node[] = [];

    start() {
        this.subscribeToEvent(events.LoadLevelEvent((data) => this.loadLevel(data)));
        this.sendEvent(events.SceneReadyEventData());
    }

    update(timeStep) {
        // this.node.rotate2D(timeStep * 75 * this.speed);
    }

    private loadLevel(eventData: events.LoadLevelEvent) {
        this.DEBUG("Loading new level");

        this.currentLevel = eventData.level;
        this.render();
    }

    private render() {
        let start = new Date().getTime();
        try {
            const scaleX = this.gridPixelSizeX * Atomic.PIXEL_SIZE;
            const scaleY = this.gridPixelSizeY * Atomic.PIXEL_SIZE;
            const offsetX = this.currentLevel.width / 2 * scaleX * -1;
            const offsetY = this.currentLevel.height / 2 * scaleY * -1;

            this.currentLevel.iterate((x, y, cell) => {
                if (cell.terrainType !== Game.TerrainType.empty) {
                    // this.DEBUG(`Construction cell [${x},${y}] - ${cell.blueprint}`);
                    const tileNode = nodeBuilder.createChildAtPosition(this.node, cell.blueprint, [x * scaleX, y * scaleY]);
                    tileNode.getComponent<Atomic.StaticSprite2D>("StaticSprite2D").orderInLayer = ((this.currentLevel.height - y) * 4);

                    this.childNodes.push(tileNode);
                }
            });

            // let's just grab an empty cell and drop a player on it for now..
            // TODO: move this out
            let emptyFloor = this.currentLevel.findEmptyFloorCell();
            const scaleYChar = (this.gridPixelSizeY) * Atomic.PIXEL_SIZE;
            const yOffset = 40 * Atomic.PIXEL_SIZE;
            const playerNode = nodeBuilder.createChildAtPosition(this.node, "entity_player", [emptyFloor.x * scaleX, emptyFloor.y * scaleYChar + yOffset]);
            // playerNode.getComponent<Atomic.StaticSprite2D>("StaticSprite2D").orderInLayer = this.currentLevel.height - emptyFloor.y;
            playerNode.getComponent<Atomic.StaticSprite2D>("StaticSprite2D").orderInLayer = ((this.currentLevel.height - emptyFloor.y) * 4) + 2;
            this.DEBUG(`Placing player at ${emptyFloor.x},${emptyFloor.y}`);

            this.childNodes.push(playerNode);


            this.node.position2D = [offsetX, offsetY];

            this.DEBUG(`Changing zoom level from: ${this.node.scene.getMainCamera().zoom} to ${this.zoom}`);
            this.node.scene.getMainCamera().zoom = this.zoom;

        } finally {
            this.DEBUG(`Rendering complete after ${new Date().getTime() - start} ms`);
        }
    }
}
