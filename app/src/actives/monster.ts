/// <reference path="../../lib/phaser.comments.d.ts"/>

class Monster extends Phaser.Group implements IActive  {

    cellPos:Pos;

    constructor (game:Phaser.Game) {
        super(game);
    }

    destroy() : void {
        super.destroy();    
    }
}