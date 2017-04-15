/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Scrolling text scroller.
 * 
 * @class TextScroller
 * @extends {Phaser.Group}
 */
class TextScroller extends Phaser.Group {

    private static LINES:number = 7;
    private lines:Phaser.BitmapText[];
    private yCursor:number = 0;
    private toWrite:string;
    private xCursor:number = 0;
    private speedMod:number = 0;

    /**
     * Creates an instance of TextScroller.
     * @param {Phaser.Game} game 
     * @param {number} width 
     * @param {number} height 
     * 
     * @memberOf TextScroller
     */
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
        this.xCursor = 0;this.yCursor = -1;
        this.toWrite = "";
    }

    /**
     * Write a new string to the text scroller.
     * 
     * @param {string} s 
     * 
     * @memberOf TextScroller
     */
    write(s:string) : void {
        // Complete any pending write.
        if (this.xCursor < this.toWrite.length) {
            this.lines[this.yCursor].text = this.toWrite;
        }
        this.yCursor++;
        // If at bottom, scroll up to make space.
        if (this.yCursor == TextScroller.LINES) {
            for (var i:number = 0;i < TextScroller.LINES-1;i++) {
                this.lines[i].text = this.lines[i+1].text;
            }
            this.yCursor = TextScroller.LINES-1;
        }
        // Start the next one, characters changed in update()
        this.lines[this.yCursor].text = "";
        this.xCursor = 0;
        this.toWrite = s;
    }
    
    /**
     * Updates the scroller, outputting the next character if there is one.
     * 
     * 
     * @memberOf TextScroller
     */
    update() : void {
        this.speedMod++;
        if (this.speedMod % 4 == 0 && this.xCursor < this.toWrite.length) {
            this.xCursor++;
            this.lines[this.yCursor].text = this.toWrite.slice(0,this.xCursor);
        }
    }

    destroy() : void {
        super.destroy();
    }
}