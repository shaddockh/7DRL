import * as ROT from "Modules/thirdparty/rot";
import { LevelMap } from "./LevelMap";

export default class LevelGenerator {

    constructor(private width: number, private height: number, private debug = false) {
    }

    generateLevel(): LevelMap {
        this.DEBUG(`Generating level: ${this.width},${this.height}`);
        const level = new LevelMap(this.width, this.height);
        const builder = new ROT.Map.Rogue(this.width, this.height, this);

        builder.create((x, y, value) => {
            if (level.inBounds(x, y)) {
                const cell = level.getCell(x, y);
                if (value) {
                    cell.floorGlyph = 0;
                    cell.terrainType = Game.TerrainType.wall;
                    cell.blueprint = "tile_wall";
                } else {
                    cell.floorGlyph = 1;
                    cell.terrainType = Game.TerrainType.floor;
                    cell.walkable = true;
                    cell.blueprint = "tile_floor";
                }
            } else {
                this.DEBUG(`assigning to tile out of bounds: ${x},${y}`);
            }
        });

        if (this.debug) {
            console.log("Generated Level:");
            for (let y = 0, yEnd = level.height - 1; y < yEnd; y++) {
                let line = [];
                level.getCellsInRegion(y, 0, y, level.width - 1).forEach(cell => line.push(cell.terrainType == Game.TerrainType.wall ? "#" : "."));
                console.log(line.join(""));
            }
        }

        return level;
    }

    DEBUG(message: string) {
        if (this.debug) {
            console.log("LevelGenerator: " + message);
        }
    }
}