"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entity_base = {
    prefabDir: "Prefabs/autogen/entities",
    isPrefab: true,
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/CharacterBoy.png",
        blendMode: Atomic.BlendMode.BLEND_ALPHA
    },
    Entity: {},
    EntityOrderRenderer: {}
};
exports.entity_actor = {
    inherits: "entity_base",
    GridMover: {
        gridPixelSizeX: 101,
        gridPixelSizeY: 80,
        debug: true
    }
};
exports.entity_player = {
    inherits: "entity_actor",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/CharacterBoy.png"
    },
    Entity: {
        bumpable: true,
        attackable: true,
        blocksPath: true
    },
    PlayerAi: {},
    Health: {
        debug: true,
        life: 5
    }
};
exports.entity_beetle = {
    inherits: "entity_actor",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/EnemyBug.png"
    },
    Entity: {
        bumpable: true,
        attackable: true,
        blocksPath: true
    },
    BasicMonsterAi: {
        wanderChance: 23
    },
    Health: {
        debug: true,
        life: 2
    }
};
//# sourceMappingURL=entities.js.map