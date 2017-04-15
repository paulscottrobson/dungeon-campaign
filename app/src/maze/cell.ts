/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Things that can be in a cell permanently (monsters etc. are transient)
 * 
 * @enum {number}
 */
enum CellContents {
    NOTHING = 0,                            // Cell is empty
    ROCK = 1,                               // Rock here
    STAIRSUP = 2,                           // Stairs here 
    STAIRSDOWN = 3,                         // Stairs down here
    EXIT = 4,                               // Exit here.
    TREASURE = 5,                           // Treasure here
    MONSTER = 6,                            // Monster without treasure
    MONSTERTREASURE = 7,                    // Monster with treasure
    NECROMANCER = 8,                        // Necromancer or pterodactyl is here
    PIT = 9                                 // Pit here
}

/**
 * Directions enumeration.
 * 
 * @enum {number}
 */
enum Direction { 
    LEFT,RIGHT,UP,DOWN
}

/**
 * Types of visibility - not visible, always visible, visible by presence only.
 * 
 * @enum {number}
 */
enum Visibility {
    HIDDEN, PERMANENT, PRESENCE
}

/**
 * This represents the permanent features of a cell - monsters, boss monsters and 
 * so on are transient objects.
 * 
 * @class Cell
 */
class Cell {
    /**
     * What's in the cell ?
     * 
     * @type {CellContents}
     * @memberOf Cell
     */
    public contents:CellContents;           
    /**
     * Is there a wall immediately below ?
     * 
     * @type {boolean}
     * @memberOf Cell
     */
    public wallDown:boolean;              
    /**
     * Is there a wall immediately to the right ?
     * 
     * @type {boolean}
     * @memberOf Cell
     */
    public wallRight:boolean;               

    /**
     * Has this cell been visited by the player ?
     * 
     * @type {Visibility}
     * @memberOf Cell
     */
    public visibility:Visibility

    constructor() {
        this.contents = CellContents.ROCK;
        this.wallDown = true;
        this.wallRight = true;
        this.visibility = Visibility.HIDDEN;
    }
}
