/// <reference path="../../lib/phaser.comments.d.ts"/>

class Player implements IActive  {

    cellPos:Pos;
    strength:number;
    manPower:number;
    isElfAlive:boolean;
    isDwarfAlive:boolean;
    treasure:number;

    constructor (maze:Maze) {
        this.strength = 1;
        this.manPower = 15;
        this.treasure = 0;
        this.isElfAlive = this.isDwarfAlive = true;
        this.cellPos = maze.getLevel(0).findEmptySlot();
    }

    refreshStatus(status:Status) {
        status.setDwarf(this.isDwarfAlive);
        status.setElf(this.isElfAlive);
        status.setPartySize(this.manPower);
        status.setStrength(this.strength);
        status.setTreasure(this.treasure);
    }
}