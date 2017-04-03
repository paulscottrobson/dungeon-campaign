/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Represents a single x,y position in the dungeon
 * 
 * @class Pos
 */
class Pos {
    
    public x:number;
    public y:number;

    constructor(x:number = 0,y:number = 0) {
        this.x = x;this.y = y;
    }
}