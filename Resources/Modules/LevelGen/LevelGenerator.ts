import * as ROT from "rot";
import { LevelMap } from "./LevelMap";
import { TerrainType } from "Game";

export default class LevelGenerator {

    constructor(private width: number, private height: number, private debug = false) {
    }

    generateLevel(): LevelMap {
        this.DEBUG(`Generating level: ${this.width},${this.height}`);
        const level = new LevelMap(this.width, this.height);
        this.generateTerrain(level);
        // this.generateExit(level);
        this.generateEntities(level);

        if (this.debug) {
            console.log("Generated Level:");
            for (let y = 0, yEnd = level.height - 1; y < yEnd; y++) {
                let line = [];
                level.getCellsInRegion(y, 0, y, level.width - 1).forEach(cell => line.push(cell.terrainType == TerrainType.wall ? "#" : "."));
                console.log(line.join(""));
            }
        }

        return level;
    }

    private generateTerrain(level: LevelMap) {
        const builder = new ROT.Map.Rogue(this.width, this.height, this);

        builder.create((x, y, value) => {
            if (level.inBounds(x, y)) {
                const cell = level.getCell(x, y);
                if (value) {
                    cell.floorGlyph = 0;
                    cell.terrainType = TerrainType.wall;
                    cell.blueprint = "tile_wall";
                } else {
                    cell.floorGlyph = 1;
                    cell.terrainType = TerrainType.floor;
                    cell.walkable = true;
                    cell.blueprint = "tile_floor";
                }
            } else {
                this.DEBUG(`assigning to tile out of bounds: ${x},${y}`);
            }
        });

        // Grab a random room
        let roomSections = builder["rooms"];
        let roomlist = roomSections[1];
        let room = roomlist.pop() as {
            x: number,
            y: number,
            width: number,
            height: number,
            connections: [[number, number]],
            cellx: number,
            celly: number
        };

        console.log(JSON.stringify(room, null, 2));

        level.addEntity({
            gridPosition: [room.x, room.y + room.height],
            blueprint: "entity_exit_door",
            blocksPath: false,
            bumpable: true,
            entityComponent: null,
            attackable: false
        });
        level.getCell(room.x, room.y + room.height).terrainType = TerrainType.floor;
    }

    private generateEntities(level: LevelMap) {
        // First generate the player
        let emptyFloor = level.findEmptyFloorCell();
        this.DEBUG(`Placing player at ${emptyFloor.x},${emptyFloor.y}`);
        level.addEntity({
            gridPosition: [emptyFloor.x, emptyFloor.y],
            blueprint: "entity_player",
            blocksPath: true,
            bumpable: true,
            entityComponent: null,
            attackable: false
        });

        for (let i = 0; i < 3; i++) {
            emptyFloor = level.findEmptyFloorCell();
            this.DEBUG(`Placing beetle at ${emptyFloor.x},${emptyFloor.y}`);
            level.addEntity({
                gridPosition: [emptyFloor.x, emptyFloor.y],
                blueprint: "entity_beetle",
                blocksPath: true,
                bumpable: true,
                entityComponent: null,
                attackable: false
            });
        }
    }

    private generateExit(level: LevelMap) {
        let emptyFloor = level.findEmptyFloorCell();
        level.addEntity({
            gridPosition: [emptyFloor.x, emptyFloor.y],
            blueprint: "entity_exit_door",
            blocksPath: false,
            bumpable: true,
            entityComponent: null,
            attackable: false
        });
    }

    DEBUG(message: string) {
        if (this.debug) {
            console.log("LevelGenerator: " + message);
        }
    }
}