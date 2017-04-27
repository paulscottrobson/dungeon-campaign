/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * This is a test renderer, debugging purposes
 * 
 * @class TestLevelRenderer
 * @extends {Phaser.Group}
 */
class TestLevelRenderer extends Phaser.Group {
    constructor(game:Phaser.Game,level:ILevel,width:number,height:number) {
        super(game);
        var bgr:Phaser.Image = game.add.image(0,0,"sprites","rectangle",this);
        bgr.width = width;bgr.height = height;bgr.tint = 0x444444;
        for (var xc = 0;xc < level.getWidth();xc++) {
            for (var yc = 0;yc < level.getHeight();yc++) {
                var cell:Cell = level.getCell(new Pos(xc,yc));
                if (cell.contents != CellContents.ROCK) {
                    var x:number = width * xc / level.getWidth();
                    var y:number = height * yc / level.getHeight();
                    var w:number = (width * (xc+1) / level.getWidth()) - x;
                    var h:number = (height * (yc+1) / level.getHeight()) - y;
                    var floor:Phaser.Image = game.add.image(x+1,y+1,"sprites","rectangle",this);
                    floor.width = w-2;floor.height = h-2;floor.tint = 0xA0522D;
                    var s:string = "";
                    if (cell.contents == CellContents.TREASURE) { s = "treasure"; }
                    if (cell.contents == CellContents.EXIT) { s = "exit"; }
                    if (cell.contents == CellContents.PIT) { s = "pit"; }
                    if (cell.contents == CellContents.STAIRSUP) { s = "stairsu"; }
                    if (cell.contents == CellContents.STAIRSDOWN) { s = "stairsd"; }
                    if (cell.contents == CellContents.NECROMANCER) { s = "balrogs"; }
                    if (cell.contents == CellContents.MONSTERTREASURE || cell.contents == CellContents.MONSTER) s = "dragon";
                    if (s != "") {
                        var cont:Phaser.Image = game.add.image(x+w/2,y+h/2,"sprites",s,this);
                        cont.anchor.setTo(0.5,0.5);cont.width = w * 3/4;cont.height = h * 3/4;
                    }

                    if (cell.wallDown) {
                        var w1:Phaser.Image = game.add.image(x,y+h,"sprites","rectangle",this);
                        w1.width = w;w1.height = 8;w1.anchor.setTo(0,1);w1.tint = 0xFF8000;
                    }
                    if (cell.wallRight) {
                        var w2:Phaser.Image = game.add.image(x+w,y,"sprites","rectangle",this);
                        w2.width = 8;w2.height = h;w2.anchor.setTo(1,0);w2.tint = 0x0080FF;
                    }
                }
            }
        }
    }
}