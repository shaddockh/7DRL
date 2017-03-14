"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Tiles
exports.tile_base = {
    prefabDir: "Prefabs/autogen/tiles",
    isPrefab: true,
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/PlainBlock.png",
        blendMode: Atomic.BlendMode.BLEND_ALPHA
    }
};
exports.tile_wall = {
    inherits: "tile_base",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/StoneBlockTall.png"
    }
};
exports.tile_floor = {
    inherits: "tile_base",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/DirtBlock.png"
    }
};
