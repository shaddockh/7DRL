
/**
 * Constructs a custom script event that can be used for subscribing to
 * @param eventType
 */
export function buildEvent<T>(eventType: string): (callback: (data: T) => void) => Atomic.EventData {
    return function <T>(callback: (data: T) => void): Atomic.EventData {
        return Atomic.ScriptEvent(eventType, callback);
    };
}

/**
 * Constructs a custom script event that can be used for subscribing to
 * @param eventType
 */
export function buildNotifyEvent(eventType: string): (callback: () => void) => Atomic.EventData {
    return function <T>(callback: () => void): Atomic.EventData {
        return Atomic.ScriptEvent(eventType, callback);
    };
}


/**
 * Constructs a custom script data event that can used to send
 * @param eventType
 */
export function buildEventData<T>(eventType: string): (callbackData: T) => Atomic.EventCallbackMetaData {
    return function (callbackData: T): Atomic.EventCallbackMetaData {
        return Atomic.ScriptEventData(eventType, callbackData);
    };
}

/**
 * Constructs a custom script data event that can used to send. Will stringify the data to JSON before sending it and
 * is required for more complex objects that contain arrays.  Any object pointers, however, will get lost.
 * @param eventType
 */
export function buildEventDataJson<T>(eventType: string): (callbackData: T) => Atomic.EventCallbackMetaData {
    return function (callbackData: T): Atomic.EventCallbackMetaData {
        return Atomic.ScriptEventData(eventType, { json: JSON.stringify(callbackData) });
    };
}
/**
 * Constructs a custom script event that can be used for subscribing to.  Will convert result from JSON to an object which
 * is required for more complex objects that contain arrays.  Any object pointers, however, will get lost.
 * @param eventType
 */
export function buildEventJson<T>(eventType: string): (callback: (data: T) => void) => Atomic.EventData {
    return function <T>(callback: (data: T) => void): Atomic.EventData {
        return Atomic.ScriptEvent(eventType, (wrapper: { json: string }) => callback(JSON.parse(wrapper.json)));
    };
}


/**
 * Constructs a custom script data event that can used to send
 * @param eventType
 */
export function buildNotifyEventData(eventType: string): () => Atomic.EventCallbackMetaData {
    return function (): Atomic.EventCallbackMetaData {
        return Atomic.ScriptEventData(eventType);
    };
}

