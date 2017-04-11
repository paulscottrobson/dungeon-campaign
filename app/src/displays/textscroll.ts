/// <reference path="../../lib/phaser.comments.d.ts"/>

class TextScroller extends Phaser.Group {

    private static LINES:number = 7;
    private lines:Phaser.BitmapText[];
    private yCursor:number = 0;

    constructor(game:Phaser.Game,width:number,height:number) {
        super(game);
        var scr:Phaser.Image = game.add.image(0,0,"sprites","scroll",this);
        scr.width = width;scr.height = height;        
        this.lines = [];
        for (var n:number = 0;n < TextScroller.LINES;n++) {
            this.lines[n] = game.add.bitmapText(width * 0.14,(n+1)*height / (TextScroller.LINES+1),
                                                "font","",22,this);
            this.lines[n].tint = 0x000000;                                                
            this.lines[n].anchor.setTo(0,0.5);
        }
        this.yCursor = 0;
    }

    write(s:string) : void {
        if (this.yCursor == TextScroller.LINES) {
            for (var i = 0;i < TextScroller.LINES-1;i++) {
                this.lines[i].text = this.lines[i+1].text;
            }
            this.lines[TextScroller.LINES-1].text = s;
        } else {
            this.lines[this.yCursor++].text = s;
        }
    }
    
    destroy() : void {
        super.destroy();
    }
}