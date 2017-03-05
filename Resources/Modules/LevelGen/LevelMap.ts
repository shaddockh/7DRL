
import * as ROT from "Modules/thirdparty/rot";
import { Grid } from "Modules/utils/Grid";

export const EmptyMapCell: Game.MapCell = {
    visible: false,
    walkable: false,
    seen: false,
    floorGlyph: 0,
    terrainType: Game.TerrainType.empty,
    blueprint: "tile_empty"
};

export class IndexedMapCell {
    public x: number;
    public y: number;
    public cell: Game.MapCell;
    constructor(mapCell: Game.MapCell, x: number, y: number) {
        this.cell = mapCell;
        this.x = x;
        this.y = y;
    }
}

interface MapCellWithPosition extends Game.MapCell {
    x: number;
    y: number;
}

export class LevelMap extends Grid<Game.MapCell> {
    private indexed = false;
    private walkables: IndexedMapCell[];

    constructor(width: number, height: number) {
        super(width, height);

        this.fill(EmptyMapCell);
    }

    /**
     * Build up an index of interesting things to be able to quickly retreive on the level such as walkable tiles, etc.
     */
    buildIndex() {
        if (this.indexed) {
            return;
        }

        let walkables: IndexedMapCell[] = [];
        this.iterate((x, y, cell) => {
            if (cell.walkable) {
                walkables.push(new IndexedMapCell(cell, x, y));
            }
        });

        this.walkables = walkables;
        this.indexed = true;
    }

    /**
     * Look through an find an empty walkable tile
     */
    findEmptyFloorCell() {
        this.buildIndex();

        // first scan for an empty floor
        let iterations = 0;
        while (true) {
            let cell = this.walkables[ROT.RNG.getUniformInt(0, this.walkables.length)];
            if (cell) {
                return cell;
            }

            iterations++;
            if (iterations > 1000) {
                throw new Error("Could not find an empty floor cell after 1000 iterations");
            }
        }
    }
}