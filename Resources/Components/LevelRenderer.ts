import { RegisterActorAiEvent } from "../Modules/CustomEvents";
import * as nodeBuilder from "atomic-blueprintlib";
import Entity from "Components/Entity";
import LevelController from "Components/LevelController";
import { TerrainType } from "Game";
import * as CustomEvents from "Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
import GridMover from "Components/GridMover";
import PlayerInputHandler from "Components/ui/PlayerInputHandler";
import EntityRenderOptions from "Components/EntityRenderOptions";
import { DeregisterActorAiEventData } from "Modules/CustomEvents";
import { Actionable } from "rot";
import BasicMonsterAi from "Components/ai/BasicMonsterAi";
import Door from "Components/Door";
"atomic component";


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

    private gridPixelSizeX: number;
    private gridPixelSizeY: number;
    private zoom: number;
    private childNodes: Atomic.Node[] = [];
    private player: Atomic.Node;

    start() {
        this.subscribeToEvent(CustomEvents.RenderCurrentLevelEvent(this.render.bind(this)));
    }
    private clear() {
        for (let i = 0; i < this.childNodes.length; i++) {
            let node = this.childNodes[i];
            if (node != this.player) {
                // TODO: Maybe descend all ai classes from the same interface?
                let ai = node.getComponent<BasicMonsterAi>("BasicMonsterAi");
                Atomic.destroy(this.childNodes[i]);
            }
        }

        this.childNodes = [];
        if (this.player) {
            this.childNodes.push(this.player);
        }
    }

    private render() {
        if (this.childNodes.length) {
            this.clear();
        }

        this.DEBUG("About to render level");
        let currentLevel = this.node.scene.getJSComponent<LevelController>("LevelController").currentLevel;
        let start = new Date().getTime();
        try {
            const scaleX = this.gridPixelSizeX * Atomic.PIXEL_SIZE;
            const scaleY = this.gridPixelSizeY * Atomic.PIXEL_SIZE;
            const offsetX = currentLevel.width / 2 * scaleX * -1;
            const offsetY = currentLevel.height / 2 * scaleY * -1;

            currentLevel.iterate((x, y, cell) => {
                if (cell.terrainType !== TerrainType.empty) {
                    // this.DEBUG(`Construction cell [${x},${y}] - ${cell.blueprint}`);
                    const tileNode = nodeBuilder.createChildAtPosition(this.node, cell.blueprint, [x * scaleX, y * scaleY]);
                    tileNode.getComponent<Atomic.StaticSprite2D>("StaticSprite2D").orderInLayer = ((currentLevel.height - y) * 4);

                    this.childNodes.push(tileNode);
                }
            });


            const scaleYChar = (this.gridPixelSizeY) * Atomic.PIXEL_SIZE;
            const defaultYOffset = 40 * Atomic.PIXEL_SIZE;
            currentLevel.entities.forEach((e, index) => {
                this.DEBUG("About to construct entity: " + e.blueprint);

                if (e.blueprint != "entity_player" || (e.blueprint == "entity_player" && !this.player)) {
                    const entityNode = nodeBuilder.createChildAtPosition(this.node, e.blueprint, [e.gridPosition[0] * scaleX, e.gridPosition[1] * scaleYChar]);
                    currentLevel.entities.replaceAt(index, entityNode.getJSComponent<Entity>("Entity"));

                    const ero = entityNode.getJSComponent<EntityRenderOptions>("EntityRenderOptions");
                    let yOffset = defaultYOffset;
                    if (ero) {
                        yOffset = ero.yOffset * Atomic.PIXEL_SIZE;
                    }

                    entityNode.translate2D([0, yOffset]);

                    // TODO: this should be less coupled.. maybe send a message
                    if (e.blueprint == "entity_player") {
                        entityNode.getJSComponent<GridMover>("GridMover").subscribeToMovementController(this.node.scene.getJSComponent<PlayerInputHandler>("PlayerInputHandler"));
                        this.player = entityNode;
                    }

                    entityNode.getJSComponent<Entity>("Entity").gridPosition = e.gridPosition;
                    this.childNodes.push(entityNode);
                } else {
                    // update the player position here
                    currentLevel.entities.replaceAt(index, this.player.getJSComponent<Entity>("Entity"));
                    this.player.getJSComponent<Entity>("Entity").gridPosition = e.gridPosition;
                    this.player.position2D = [e.gridPosition[0] * scaleX, e.gridPosition[1] * scaleYChar];

                    const ero = this.player.getJSComponent<EntityRenderOptions>("EntityRenderOptions");
                    let yOffset = defaultYOffset;
                    if (ero) {
                        yOffset = ero.yOffset * Atomic.PIXEL_SIZE;
                    }

                    this.player.translate2D([0, yOffset]);
                }
            });

            this.node.position2D = [offsetX, offsetY];

            this.DEBUG(`Changing zoom level from: ${this.node.scene.getMainCamera().zoom} to ${this.zoom}`);
            this.node.scene.getMainCamera().zoom = this.zoom;

        } finally {
            this.DEBUG(`Rendering complete after ${new Date().getTime() - start} ms`);
        }
    }
}
