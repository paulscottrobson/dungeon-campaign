/// <reference path="../lib/phaser.comments.d.ts"/>

class GameData {
    /**
     * Current level indexed from zero
     * 
     * @type {number}
     * @memberOf GameData
     */
    currentLevel:number;
    /**
     * Maze
     * 
     * @type {Maze}
     * @memberOf GameData
     */
    maze:Maze;
    /**
     * Player group
     * 
     * @type {Player}
     * @memberOf GameData
     */
    player:Player; 
    /**
     * Difficulty scalar
     * 
     * @type {number}
     * @memberOf GameData
     */
    difficulty:number;
    /**
     * Maze size
     * 
     * @type {number}
     * @memberOf GameData
     */
    size:number;
    /**
     * Number of levels.
     * 
     * @type {number}
     * @memberOf GameData
     */
    levels:number;

    constructor() {
        this.difficulty = 1.0;
        this.size = 8;
        this.levels = 4;
    }
}

