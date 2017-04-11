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

    constructor(mazeWidth:number,mazeHeight:number,levels:number,difficulty:number) {
        this.levels = [];
        this.levels.push(new BaseLevel(mazeWidth,mazeHeight,difficulty));
        this.levels.push(new BaseLevel(mazeWidth,mazeHeight,difficulty));
        this.levels.push(new BottomLevel(mazeWidth,mazeHeight,difficulty));

        for (var level:number = 0;level < this.getLevelCount();level++) {
            // Pits
            for (var i = 0;i < 1 + Math.round(1+mazeWidth * mazeHeight / 169 * difficulty);i++) {
                var pos:Pos = this.findConnectingPoint(level);
                this.getLevel(level).setCell(pos,CellContents.PIT);
            }
            // Stairs
            if (level < this.getLevelCount()-1) {
                for (var i = 0;i < 1 + Math.round(1+mazeWidth * mazeHeight / 169 / difficulty);i++) {
                    var pos:Pos = this.findConnectingPoint(level);
                    this.getLevel(level).setCell(pos,CellContents.STAIRSDOWN);
                    this.getLevel(level+1).setCell(pos,CellContents.STAIRSUP);
                }
            }            
        }
    }

    /**
     * Find an unused point on this level that has an unused slot on the next level down.
     * (except for the bottom where there is no level below)
     * 
     * @param {number} level 
     * @returns 
     * 
     * @memberOf Maze
     */
    findConnectingPoint(level:number) {
        // If its the bottom one it can be anywhere, just needs to be empty
        if (level == this.getLevelCount()-1) {
            return this.getLevel(level).findEmptySlot();
        }
        var ok:boolean = false
        var pos:Pos;
        while (!ok) {
            pos = this.getLevel(level).findEmptySlot();
            ok = true;
            if (pos.x >= this.getLevel(level+1).getWidth()) { ok = false; }
            if (pos.y >= this.getLevel(level+1).getHeight()) { ok = false; }
            if (ok) {
                if (this.getLevel(level+1).getCell(pos).contents != CellContents.NOTHING) { ok = false; }
            }
        }
        return pos;
    }
    getLevelCount() : number {
        return this.levels.length;
    }

    getLevel(i:number) : ILevel {
        return this.levels[i];
    }
}