
import * as ROT from "rot";
import { Grid } from "Modules/utils/Grid";
import { TerrainType, MapCell, Position2d, EntityData } from "Game";
import List from "Modules/utils/List";

export const EmptyMapCell: MapCell = {
    visible: false,
    walkable: false,
    seen: false,
    floorGlyph: 0,
    terrainType: TerrainType.empty,
    blueprint: "tile_empty"
};

export class IndexedMapCell {
    public x: number;
    public y: number;
    public cell: MapCell;
    constructor(mapCell: MapCell, x: number, y: number) {
        this.cell = mapCell;
        this.x = x;
        this.y = y;
    }
}

interface MapCellWithPosition extends MapCell {
    x: number;
    y: number;
}

export class LevelMap extends Grid<MapCell> {
    private indexed = false;
    private walkables: IndexedMapCell[];
    entities: List<EntityData> = new List<EntityData>();

    constructor(width: number, height: number) {
        super(width, height);

        this.fill(EmptyMapCell);
    }

    addEntity(entity: EntityData) {
        this.entities.add(entity);
    }

    inBounds(x: number, y: number);
    inBounds(pos: Position2d);
    inBounds(xOrPos: any, y?: number) {
        if (typeof (xOrPos) != "number") {
            return super.inBounds(xOrPos[0], xOrPos[1]);
        } else {
            return super.inBounds(xOrPos, y);
        }
    }

    getCell(x: number, y: number): MapCell;
    getCell(pos: Position2d): MapCell;
    getCell(xOrPos: any, y?: number): MapCell {
        if (typeof (xOrPos) != "number") {
            return super.getCell(xOrPos[0], xOrPos[1]);
        } else {
            return super.getCell(xOrPos, y);
        }
    }

    /**
     * Iterate all the entities at a position.  Caller should return "true" in the callback to exit early
     * @param pos
     * @param callback 
     */
    iterateEntitiesAt(pos: Position2d, callback: (e: EntityData) => boolean | null) {
        this.entities.forEach((e, idx) => {
            if (!e.deleted) {
                let ePos = e.gridPosition;
                if (ePos[0] == pos[0] && ePos[1] == pos[1]) {
                    if (callback(e)) {
                        return;
                    }
                }
            }
        });
    }

    /**
     * Build up an index of interesting things to be able to quickly retreive on the level such as walkable tiles, etc.
     */
    buildIndex() {
        // if (!this.indexed) {
        // TODO: Optimize!!

        let walkables: IndexedMapCell[] = [];
        this.iterate((x, y, cell) => {
            if (cell.walkable) {
                let clear = true;
                this.iterateEntitiesAt([x, y], (e) => {
                    if (e.blocksPath) {
                        clear = false;
                        return true;
                    }
                });

                if (clear) {
                    walkables.push(new IndexedMapCell(cell, x, y));
                }
            }
        });

        this.walkables = walkables;
        this.indexed = true;
        // }
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

    /**
     * Look through an find an empty walkable tile in the current area
     */
    findEmptyFloorCellInRadius(origin: Position2d, radius: number) {
        this.buildIndex();

        // first scan for an empty floor
        let iterations = 0;
        let nearbyWalkables = this.walkables.filter(c => {
            if (c.x == origin[0] && c.y == origin[1]) {
                return false;
            }

            return Math.abs(c.x - origin[0]) <= radius && Math.abs(c.y - origin[1]) <= radius;
        });

        while (true) {
            let cell = nearbyWalkables[ROT.RNG.getUniformInt(0, nearbyWalkables.length)];
            if (cell) {
                // force cardinal directions
                if (cell.x != 0 && cell.y != 0) {
                    if (ROT.RNG.getUniformInt(0, 1) == 0) {
                        // cell.x = 0;
                    } else {
                        // cell.y = 0;
                    }
                }
                return cell;
            }

            iterations++;
            if (iterations > 1000) {
                throw new Error("Could not find an empty floor cell after 1000 iterations");
            }
        }
    }
}