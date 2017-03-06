
export const entity_base = {
    prefabDir: "Prefabs/autogen/entities",
    isPrefab: true,
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/CharacterBoy.png",
        blendMode: Atomic.BlendMode.BLEND_ALPHA
    },
    Entity: {},
    EntityOrderRenderer: {}
};

export const entity_actor = {
    inherits: "entity_base",
    GridMover: {
        gridPixelSizeX: 101,
        gridPixelSizeY: 80,
        debug: true
    }
};

export const entity_player = {
    inherits: "entity_actor",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/CharacterBoy.png"
    },
    Entity: {
        bumpable: true,
        blocksPath: true
    },
    PlayerAi: {}
};

export const entity_beetle = {
    inherits: "entity_actor",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/EnemyBug.png"
    },
    Entity: {
        bumpable: true,
        blocksPath: true
    },
    BasicMonsterAi: {}
};