
export const entity_base = {
    prefabDir: "Prefabs/autogen/entities",
    isPrefab: true,
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/CharacterBoy.png",
        blendMode: Atomic.BlendMode.BLEND_ALPHA
    }
};

export const entity_player = {
    inherits: "entity_base",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/CharacterBoy.png"
    }
};