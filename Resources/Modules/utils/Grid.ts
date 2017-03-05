// Contains the map


/**
 * Generic grid structure that contains a 2-D array of elements
 */
export class Grid<T> extends Atomic.ScriptObject {
    height: number;
    width: number;

    private cells: T[];

    /**
     * builds a new map
     * @param width width of the map
     * @param height heigh of the map
     */
    constructor(width: number, height: number) {
        super();

        this.width = width;
        this.height = height;

        this.cells = [];
        this.cells.length = height * width;
    }

    /**
     * returns the cell at x,y or throws an error if not in bounds
     * @param x 
     * @param y 
     */
    getCell(x: number, y: number): T {
        this.checkBounds(x, y);

        return this.cells[(y * this.width) + x];
    }

    /**
     * Sets the value of the cell at location
     * @param x 
     * @param y 
     * @param cell 
     */
    setCell(x: number, y: number, cell: T) {
        this.checkBounds(x, y);

        this.cells[y * this.width + x] = cell;
    }

    /**
     * Fills the grid with copies of the provided prototype cell
     * @param cellPrototype 
     */
    fill(cellPrototye: T);
    fill(cellPrototype: any) {
        for (let i = 0, iEnd = this.cells.length; i < iEnd; i++) {
            // use the spread operator to make a shallow clone of the object
            const copy = { ...cellPrototype };
            this.cells[i] = copy;
        }
    }

    /**
     * Get all the cells within a provided rectangle
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    getCellsInRegion(x1: number, y1: number, x2: number, y2: number): T[] {
        let result = [];
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                result.push(this.getCell(x, y));
            }
        }
        return result;
    }

    /**
     * iterate over the grid, calling back for every cell.  return "true" in the callback to stop iterating early
     * @param callback 
     */
    iterate(callback: (x: number, y: number, cell: T) => boolean | void) {
        for (let y = 0, yEnd = this.height; y < yEnd; y++) {
            for (let x = 0, xEnd = this.width; x < xEnd; x++) {
                if (callback(x, y, this.getCell(x, y))) {
                    return;
                }
            }
        }
    }

    /**
     * iterate over the grid, calling back for every cell.  return "true" in the callback to stop iterating early
     * @param callback 
     */
    iterateBottomUp(callback: (x: number, y: number, cell: T) => boolean | void) {
        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = 0, xEnd = this.width; x < xEnd; x++) {
                if (callback(x, y, this.getCell(x, y))) {
                    return;
                }
            }
        }
    }

    /**
     * Checks to make sure the coordinates are in the bounds of the grid and if not throws an error
     * @param x 
     * @param y 
     */
    private checkBounds(x: number, y: number) {
        if (!this.inBounds(x, y)) {
            throw new Error(`Out of bounds: (${x},${y})`);
        }
    }

    /**
     * returns whether the x,y is within the bounds of the grid
     * @param x 
     * @param y 
     */
    inBounds(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }


}