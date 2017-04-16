/// <reference path="../../lib/phaser.comments.d.ts"/>

class Monster implements IActive  {

    private static MONSTERS:string[] = [ 
        "lycanthropes","gargoyles","balrogs", "vampires", "goblins", "mighty ogres", 
        "vicious orcs", "cyclopses", "skeletons", "zombies", "evil trolls", "mummies", 
        "huge spiders", "werewolves", "minotaurs", "centaurs", "berserkers", "griffons", 
        "basilisks", "gorgons"
    ];

    cellPos:Pos;
    sprite:Phaser.Sprite;
    public name:string;
    public count:number;
    public strength:number;

    constructor (game:Phaser.Game,pos:Pos,level:number) {
        this.cellPos = pos;
        this.name = Monster.MONSTERS[Math.floor(Math.random()*Monster.MONSTERS.length)];
        this.sprite = game.add.sprite(0,0,"sprites",this.name.replace(" ",""));

        this.strength = 15 + Math.floor(10 * Math.random()) + (1 + level * 20);
        this.count = Math.floor(19*Math.random()) + 5;
    }

    destroy() : void {
        this.sprite.destroy();
        this.sprite = null;
    }

    getSprite() : Phaser.Sprite {
        return this.sprite;
    }
}