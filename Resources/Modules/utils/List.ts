/**
 * List class with some nice utility functions.  This descends from Atomic.ScriptObject so that
 * it can be passed through the event system
 */
export default class List<T> extends Atomic.ScriptObject {
    private internalList: T[] = [];

    /**
     * Iterate over elements until one is found
     * @param callback 
     */
    find(callback: (item: T) => boolean): T {
        for (let i = 0, iEnd = this.internalList.length; i < iEnd; i++) {
            if (callback(this[i])) {
                return this[i];
            }
        }
        return null;
    }

    /**
     * Find the index of an item in a search.  Returns -1 if the item is not found
     * @param callback 
     */
    findIndex(callback: (item: T) => boolean): number {
        for (let i = 0, iEnd = this.internalList.length; i < iEnd; i++) {
            if (callback(this[i])) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Add an item to the list
     * @param item 
     */
    add(item: T): number {
        return this.internalList.push(item);
    }

    /**
     * Remove an item from the list
     * @param index
     */
    removeAtIndex(index: number) {
        this.internalList.splice(index);
    }

    get length(): number {
        return this.internalList.length;
    }

    /**
      * Performs the specified action for each element in an array.
      * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
      * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
        this.internalList.forEach(callbackfn);
    }

    /**
     * Replace an element in the list at the provided index
     * @param index 
     * @param value 
     */
    replaceAt(index: number, value: T) {
        this.internalList[index] = value;
    }
}