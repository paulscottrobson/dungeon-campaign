/// <reference path="../../lib/phaser.comments.d.ts"/>

interface ILevel {

}

class Maze {
    /**
     * Levels in the maze
     * 
     * @private
     * @type {ILevel[]}
     * @memberOf Maze
     */
    private levels:ILevel[];

    constructor(mazeWidth:number,mazeHeight:number,levels:number) {
        this.levels = [];
        this.levels.push(new BaseLevel(mazeWidth,mazeHeight));
    }

    getLevelCount() : number {
        return this.levels.length;
    }

    getLevel(i:number) : ILevel {
        return this.levels[i];
    }
}