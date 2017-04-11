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

    move(dir:Direction): void {
        if (dir == Direction.UP) { this.y--; }
        if (dir == Direction.DOWN) { this.y++; }
        if (dir == Direction.LEFT) { this.x--; }
        if (dir == Direction.RIGHT) { this.x++; }
    }
}