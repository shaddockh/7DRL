import Common from "Components/Common";

export interface CustomJSComponentInspectorFields {
    debug?: boolean;
}

export default class CustomJSComponent extends Atomic.JSComponent {
    debug = false;
    private _componentName: string = null;

    /**
     * Write a debug message to the console prefixed by the component name
     * @param {string} msg Message to write to the console
     */
    DEBUG(msg) {
        if (this.debug) {
            if (!this._componentName) {
                this._componentName = Atomic.splitPath(this.componentFile.name).fileName;
            }
            if (typeof (msg) == "object") {
                console.log(`${this.node.name}.${this._componentName}: ${JSON.stringify(msg, null, 2)}`);
            } else {
                console.log(`${this.node.name}.${this._componentName}: ${msg}`);

            }
        }
    }

    /**
     * Return the common name of the entity.  If it doesn't exist, return the node name
     * @param targetComponent 
     */
    getEntityName(targetComponent: Atomic.JSComponent): string {
        let common = targetComponent.node.getJSComponent<Common>("Common");
        if (common) {
            return common.name;
        }

        // fallback
        return targetComponent.node.name;
    }
    // Need to make this a part of the class so it doesn't get GC'd before the event fires
    private deferredActionHandler: Atomic.ScriptObject = null;
    deferAction(callback: () => void, eventName?: string) {
        if (!this.deferredActionHandler) {
            this.deferredActionHandler = new Atomic.ScriptObject();
        }

        if (eventName) {
            this.DEBUG("Listening for deferred action:" + eventName);
            this.deferredActionHandler.subscribeToEvent(Atomic.ScriptEvent(eventName, () => {
                this.DEBUG("Called deferred event: " + eventName);
                this.deferredActionHandler.unsubscribeFromEvent(eventName);
                callback();
            }));
        } else {
            this.deferredActionHandler.subscribeToEvent(Atomic.UpdateEvent(() => {
                this.DEBUG("Called deferred event");
                this.deferredActionHandler.unsubscribeFromEvent(Atomic.UpdateEventType);
                callback();
            }));
        }
    }
}