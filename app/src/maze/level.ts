/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Interface to a level
 * 
 * @interface ILevel
 */
interface ILevel {
    getWidth(): number;
    getHeight(): number;
    getCell(pos:Pos):Cell;
    toString():string;
    canMove(pos:Pos,dir:Direction):boolean;
}

/**
 * Base level class
 * 
 * @class BaseLevel
 * @implements {ILevel}
 */
class BaseLevel implements ILevel {

    private width:number;
    private height:number;
    private cells:Cell[][];

    constructor (width:number,height:number) {
        this.width = width;
        this.height = height;
        // Create a new maze entirely filled with rock.
        this.cells = [];        
        for (var n:number = 0;n < this.width;n++) {
            this.cells[n] = [];
            for (var m:number = 0;m < this.height;m++) {
                this.cells[n][m] = new Cell();
            }
        }
        // Open up the first cell in the maze.
        var pos:Pos = new Pos(Math.floor(width/2),Math.floor(height/2));  
        this.cells[pos.x][pos.y].contents = CellContents.NOTHING;      
        // Calculate the number of holes to drill in the maze.
        var count:number = (width-2) * (height-2);

        this.dump();
    }   
    
    /**
     * Get the level width
     * 
     * @returns {number} 
     * 
     * @memberOf BaseLevel
     */
    getWidth(): number {
        return this.width;
    } 
    
    /**
     * Get the level height
     * 
     * @returns {number} 
     * 
     * @memberOf BaseLevel
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Access a cell. This should be viewed as write only (not enforced) 
     * except when creating stairs, pits and exit.
     * 
     * @param {Pos} pos
     * @returns {Cell} 
     * 
     * @memberOf BaseLevel
     */
    getCell(pos:Pos):Cell {
        return this.cells[pos.x][pos.y]
    }

    /**
     * Check if can move in a specific direction from this cell. (Walls)
     * 
     * @param {Pos} pos
     * @param {number} y 
     * @param {Direction} dir 
     * @returns {boolean} 
     * 
     * @memberOf BaseLevel
     */
    canMove(pos:Pos,dir:Direction):boolean {
        // When at the left or the top edge you cannot go left or up whatever
        if (pos.x == 0 && dir == Direction.LEFT) { return false; }
        if (pos.y == 0 && dir == Direction.UP) { return false; }
        // TODO: Check various options.
        console.log("TODO:CANMOVE NOT IMPLEMENTED")
        return false;
    }

    /**
     * Very simple ASCII Dump of the level
     * 
     * @memberOf BaseLevel
     */
    dump(): void {
        for (var y = 0;y < this.getHeight();y++) {
            var s1:string = "";
            var s2:string = "";
            for (var x = 0;x < this.getWidth();x++) {
                s1 = s1 + (" RUDX".charAt(this.cells[x][y].contents));
                s1 = s1 + ((this.cells[x][y].wallRight) ? "|":" ");
                if (this.cells[x][y].wallDown) {
                    s2 = s2 + "-" + ((this.cells[x][y].wallRight) ? "+":"-");
                } else {
                    s2 = s2 + " " + (s1.slice(-1));
                }
            }
            console.log("["+s1+"]");console.log("["+s2+"]");
        }
    }
}