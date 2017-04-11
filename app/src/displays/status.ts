/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Status Display
 * 
 * @class Status
 * @extends {Phaser.Group}
 */
class Status extends Phaser.Group {
    
    private level:Phaser.BitmapText;
    private count:Phaser.BitmapText;
    private strength:Phaser.BitmapText;
    private elf:Phaser.Image;
    private dwarf:Phaser.Image;

    constructor(game:Phaser.Game) {
        var spacing:number = 64;
        var xPos:number = 32;
        super(game);
        this.level = this.game.add.bitmapText(0,0,"font","level:9",24,this);
        this.level.tint = 0xFFFF00;
        var gfx:Phaser.Image = this.game.add.image(xPos,spacing,"sprites","player",this);
        gfx.width = gfx.height = spacing;gfx.anchor.setTo(0.5);
        this.count = this.game.add.bitmapText(xPos*2.2,spacing,"font","99",20,this);
        this.count.anchor.setTo(0,1.3);
        this.strength = this.game.add.bitmapText(xPos*2.2,spacing,"font","9999",20,this);
        this.strength.anchor.setTo(0,0)
        this.count.tint = 0x0080FF;this.strength.tint = 0xFF8000;

        this.elf = this.game.add.image(xPos*2,spacing*2,"sprites","elf",this);
        this.dwarf = this.game.add.image(xPos*3.5,spacing*2,"sprites","dwarf",this);
        this.elf.width = this.dwarf.width = spacing * 0.7;
        this.elf.height = this.dwarf.height = spacing;
        this.elf.anchor.setTo(0.5,0.5);
        this.dwarf.anchor.setTo(0.5,0.5);
        this.setLevel(1);
        this.setPartySize(15);
        this.setStrength(1234);
        this.setDwarf(true);
        this.setElf(true);
    }

    setLevel(level: number): void { 
        this.level.text = "Level:" + level.toString(); 
    }

    setPartySize(size: number): void { 
        this.count.text = size.toString(); 
    }

    setStrength(strength: number): void { 
        this.strength.text = strength.toString(); 
    }

    setElf(isAlive:boolean) {
        this.elf.alpha = isAlive ? 1 : 0.7;
        this.elf.rotation = isAlive ? 0 : -Math.PI/2;
    }

    setDwarf(isAlive:boolean) : void {
        this.dwarf.alpha = isAlive ? 1 : 0.7;        
        this.dwarf.rotation = isAlive ? 0 : Math.PI/2;
    }

    destroy():void {
        super.destroy();
        this.level = this.count = this.elf = this.strength = this.dwarf = null;
    }
}
