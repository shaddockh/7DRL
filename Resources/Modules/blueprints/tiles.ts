
// Tiles
export const tile_base = {
    prefabDir: "Prefabs/autogen/tiles",
    isPrefab: true,
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/PlainBlock.png",
        blendMode: Atomic.BlendMode.BLEND_ALPHA
    }
};

export const tile_wall = {
    inherits: "tile_base",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/StoneBlockTall.png"
    }
};

export const tile_floor = {
    inherits: "tile_base",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/DirtBlock.png"
    }
};