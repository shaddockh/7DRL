declare module Game {

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
        terrainType: Game.TerrainType;
        blueprint: string;
    }
}