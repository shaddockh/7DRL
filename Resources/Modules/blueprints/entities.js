"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entity_base = {
    prefabDir: "Prefabs/autogen/entities",
    isPrefab: true,
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/CharacterBoy.png",
        blendMode: Atomic.BlendMode.BLEND_ALPHA
    },
    Entity: {
        debug: true
    },
    EntityRenderOptions: {
        yOffset: 40
    }
};
exports.entity_exit_door = {
    inherits: "entity_base",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/DoorTallClosed.png"
    },
    Entity: {
        blocksPath: true,
        bumpable: true
    },
    EntityRenderOptions: {
        yOffset: 20
    },
    Door: {
        debug: true
    }
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
        life: 15
    },
    Attack: {
        attackValue: 1
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
    },
    Attack: {
        attackValue: 1
    }
};
//# sourceMappingURL=entities.js.map