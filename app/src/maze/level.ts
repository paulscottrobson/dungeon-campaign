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
    setCell(pos:Pos,item:CellContents):void;
    toString():string;
    canMove(pos:Pos,dir:Direction):boolean;
    findEmptySlot(): Pos;
}

/**
 * Base level class
 * 
 * @class BaseLevel
 * @implements {ILevel}
 */
class BaseLevel implements ILevel {

    protected width:number;
    protected height:number;
    protected cells:Cell[][];

    /**
     * Constructor builds the initial maze. Pits, Exits and Stairs are not included
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {number} difficulty scalar (1.0 = normal > 1 = harder, < 1 = easier)
     * 
     * @memberOf BaseLevel
     */
    constructor (width:number,height:number,difficulty:number) {
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
        var pos:Pos = new Pos(Math.floor(Math.random()*width),Math.floor(Math.random()*height));
        this.cells[pos.x][pos.y].contents = CellContents.NOTHING;      
        // Calculate the number of holes to drill in the maze.
        var count:number = width * height * 11 / 13;
        var done:number = 1000;
        while (count > 0 || done-- == 0) {
            if (this.openOne(pos)) count--;
        }
        // Open square rooms, optional treasure
        count = Math.round(5 * width * height / 169 / difficulty);
        var initCount:number = count;
        while (count-- > 0) {
            this.squareRoom(count >= Math.floor(initCount * 2/5));
        }
        // Add monsters , one has no treasure.
        for (var n:number = 0;n < Math.round(4 * width * height * difficulty / 169)+1;n++) {
            var pos:Pos = this.findEmptySlot();
            this.cells[pos.x][pos.y].contents = 
                (n == 0 ? CellContents.MONSTERTREASURE : CellContents.MONSTER);
        }
        // Add pterodactyls / necromancers
        for (var n:number = 0;n < Math.round(1 * width * height * difficulty / 169)+1;n++) {
            var pos:Pos = this.findEmptySlot();
            this.cells[pos.x][pos.y].contents = CellContents.NECROMANCER;
        }
    }   

    /**
     * Move the mazebuilder forward.
     * 
     * @param pos 
     */
    openOne(pos:Pos): boolean {
        // Check for rock in all directions.
        var canMove:boolean[] = [ false,false,false,false ];

        if (pos.x > 0) { 
            canMove[Direction.LEFT] = (this.cells[pos.x-1][pos.y].contents == CellContents.ROCK); 
        }
        if (pos.x < this.getWidth()-1) { 
            canMove[Direction.RIGHT] = (this.cells[pos.x+1][pos.y].contents == CellContents.ROCK); 
        }
        if (pos.y > 0) { 
            canMove[Direction.UP] = (this.cells[pos.x][pos.y-1].contents == CellContents.ROCK); 
        }
        if (pos.y < this.getHeight()-1) { 
            canMove[Direction.DOWN] = (this.cells[pos.x][pos.y+1].contents == CellContents.ROCK); 
        }
        // Count number of moves.
        var countOpen:number = 0;
        for (var b of canMove) {
            if (b) { countOpen++; }
        }
        //console.log(pos.x,pos.y,countOpen,canMove);
        // 1 in 5 chance of reposition if < 3 choices, or if no choices.
        if ((countOpen < 3 && Math.random() < 0.2) || countOpen == 0) {
            do {
                pos.x = Math.floor(Math.random() * this.getWidth());
                pos.y = Math.floor(Math.random() * this.getHeight());
            } while (this.cells[pos.x][pos.y].contents == CellContents.ROCK);
            return false;
        }
        // Find an open direction.
        var direction:number = Math.floor(Math.random() * 4);
        while (!canMove[direction]) {
            direction = Math.floor(Math.random() * 4);
        }
        //console.log(canMove[direction],direction);
        // Remove walls.
        if (direction == Direction.LEFT) { this.cells[pos.x-1][pos.y].wallRight = false;}
        if (direction == Direction.RIGHT) { this.cells[pos.x][pos.y].wallRight = false;}
        if (direction == Direction.UP) { this.cells[pos.x][pos.y-1].wallDown = false;}
        if (direction == Direction.DOWN) { this.cells[pos.x][pos.y].wallDown = false;}
        // Move to next
        pos.move(direction);
        // Open this space up 
        this.cells[pos.x][pos.y].contents = CellContents.NOTHING;
        return true;
    }

    /**
     * Open up a 'square room'
     * 
     * @memberOf BaseLevel
     */
    squareRoom(hasTreasure:boolean): void {
        var x:number;
        var y:number;
        // Find an empty square
        do {
            x = Math.floor(Math.random()*(this.width-1));
            y = Math.floor(Math.random()*(this.height-1));
        } while (this.cells[x][y].contents != CellContents.NOTHING || 
                 this.cells[x+1][y].contents != CellContents.NOTHING ||
                 this.cells[x][y+1].contents != CellContents.NOTHING ||
                 this.cells[x+1][y+1].contents != CellContents.NOTHING);
                
        // console.log(x,y,hasTreasure);      
        // Remove the walls
        this.cells[x][y].wallRight = this.cells[x][y].wallDown = false;
        this.cells[x+1][y].wallDown = this.cells[x][y+1].wallRight = false;  
        if (hasTreasure) {
            if (Math.random() < 0.5) { x++; }
            if (Math.random() < 0.5) { y++; }
            this.cells[x][y].contents = CellContents.TREASURE;
        }
    }

    /**
     * Find an empty unused square.
     * 
     * @returns {Pos} 
     * 
     * @memberOf BaseLevel
     */
    findEmptySlot(): Pos {
        var p:Pos = new Pos();
        do {
            p.x = Math.floor(Math.random() * this.width);            
            p.y = Math.floor(Math.random() * this.height);            
        } while (this.cells[p.x][p.y].contents != CellContents.NOTHING);
        return p;
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

    setCell(pos:Pos,item:CellContents):void {
        this.cells[pos.x][pos.y].contents = item;
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
        console.log("TODO:CANMOVE NOT IMPLEMENTED");
        return false;
    }
}

/**
 * Bottom level has an exit on it as well 
 * 
 * @class BottomLevel
 * @extends {BaseLevel}
 */
class BottomLevel extends BaseLevel {
    constructor (width:number,height:number,difficulty:number) {
        super(width,height,difficulty);
        var x:number;
        var y:number;
        do {
            if (Math.random() < 0.5) {
                x = Math.floor(Math.random() * this.width);
                y = (Math.random() < 0.5 ? 0 : this.height-1);
            } else {
                x = (Math.random() < 0.5 ? 0 : this.width-1);
                y = Math.floor(Math.random() * this.height);
            }
        } while (this.cells[x][y].contents != CellContents.NOTHING);
        this.cells[x][y].contents = CellContents.EXIT;
    }
}