import { EntityData } from "Game";
import { AttackInspectorFields } from "../../Components/Attack";
import { BasicMonsterAiProps } from "../../Components/ai/BasicMonsterAi";
import { DoorInspectorFields } from "Components/Door";

export const entity_base = {
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

export const entity_exit_door = {
    inherits: "entity_base",
    StaticSprite2D: {
        sprite: "Sprites/PlanetCute/DoorTallClosed.png"
    },
    Entity: <EntityData>{
        blocksPath: true,
        bumpable: true
    },
    EntityRenderOptions: {
        yOffset: 20
    },
    Door: <DoorInspectorFields>{
        debug: true
    }

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
        attackable: true,
        blocksPath: true
    },
    PlayerAi: {},
    Health: {
        debug: true,
        life: 15
    },
    Attack: <AttackInspectorFields>{
        attackValue: 1
    }
};

export const entity_beetle = {
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
    } as BasicMonsterAiProps,
    Health: {
        debug: true,
        life: 2
    },
    Attack: <AttackInspectorFields>{
        attackValue: 1
    }
};