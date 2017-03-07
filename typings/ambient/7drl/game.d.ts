
declare module "Game" {
    export type Position2d = [number, number];

    /**
     * Terrain types
     */
    export const enum TerrainType {
        empty = 0,
        wall = 1,
        floor = 2
    }

    export interface MapCell {
        visible: boolean;
        walkable: boolean;
        seen: boolean;
        floorGlyph: number;
        terrainType: TerrainType;
        blueprint: string;
    }

    export interface EntityData {
        gridPosition: Position2d;
        // TODO: blueprint should be strongly typed
        blueprint: any,
        blocksPath: boolean;
        bumpable: boolean;
        attackable: boolean;
        // TODO: Not sure I like this here
        entityComponent: Atomic.JSComponent;
    }
}