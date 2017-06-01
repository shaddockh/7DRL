import { PlayerAttributeChangedEvent, PlayerDiedEvent } from "../Modules/CustomEvents";
import CustomJSComponent from "Modules/CustomJSComponent";
import { LevelMap } from "Modules/LevelGen/LevelMap";
import * as ROT from "rot";
import {
    LoadLevelEvent,
    RegisterActorAiEvent,
    DeregisterActorAiEvent,
    SceneReadyEventData,
    RenderCurrentLevelEventData,
    RegisterLevelActorsEventData,
    PlayerActionBeginEventData,
    PlayerAttributeChangedEventData
} from "Modules/CustomEvents";
"atomic component";

export default class LevelController extends CustomJSComponent {
    /**
     * Fields witihin the inspectorFields object will be exposed to the editor
     */
    inspectorFields = {
        debug: true,
    };
    currentDepth: number;

    private scheduler: ROT.Scheduler;
    engine: ROT.Engine;

    currentLevel: LevelMap;

    start() {
        this.subscribeToEvent(LoadLevelEvent(this.loadLevel.bind(this)));
        this.subscribeToEvent(RegisterActorAiEvent(this.registerActor.bind(this)));
        this.subscribeToEvent(DeregisterActorAiEvent(this.deregisterActor.bind(this)));
        this.subscribeToEvent(PlayerDiedEvent(() => this.scheduler.clear()));
        this.sendEvent(SceneReadyEventData());
    }

    registerActor(data: RegisterActorAiEvent) {
        this.DEBUG("Actor registered with scheduler");
        this.scheduler.add(data.ai, true);

        // TODO: This shouldn't be needed, but for some reason the scheduler isn't triggering if entities are added after the engine
        // has become unlocked
        this.engine.unlock();
    }

    deregisterActor(data: RegisterActorAiEvent) {
        this.DEBUG("Actor deregistered from scheduler");
        this.scheduler.remove(data.ai);
    }

    private loadLevel(eventData: LoadLevelEvent) {
        this.DEBUG("Loading new level");
        this.currentLevel = eventData.level;
        this.currentDepth = eventData.depth;
        this.sendEvent(RenderCurrentLevelEventData());

        if (!this.engine) {
            this.scheduler = new ROT.Scheduler.Simple();
            this.engine = new ROT.Engine(this.scheduler);

            this.DEBUG("Starting engine");
            this.engine.start();
        } else {
            this.scheduler.clear();
        }

        this.sendEvent(PlayerAttributeChangedEventData({
            name: "depth",
            value: eventData.depth
        }));

        // Let's let eveything load an then unlock the engine
        this.DEBUG("Asking all entities to register themselves");
        this.sendEvent(RegisterLevelActorsEventData({
            levelController: this
        }));

        this.DEBUG("Unlocking engine");
        this.engine.unlock();

        // one-time 
        // this.sendEvent(PlayerActionBeginEventData());
    }
}
