"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entity_base = {
    prefabDir: "Prefabs/autogen/entities",
    isPrefab: true,
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/CharacterBoy.png",
        blendMode: Atomic.BlendMode.BLEND_ALPHA
    }
};
exports.entity_player = {
    inherits: "entity_base",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/CharacterBoy.png"
    }
};
//# sourceMappingURL=entities.js.map