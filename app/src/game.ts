/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private gameInfo:any;
    private difficulty:number;  
    private maze:Maze;
    private rend:Renderer;
    private player:Phaser.Image;
    private scr:TextScroller;
    private n:number = 0;

    init(gameInfo:any) : void {
        this.gameInfo = gameInfo;
        this.difficulty = gameInfo.difficulty;
        this.maze = gameInfo.maze;
    }

    create() : void {

        var bgr:Phaser.TileSprite = this.game.add.tileSprite(0,0,128,128,"sprites","bgrtile");
        bgr.width = this.game.width;bgr.height = this.game.height;

        this.rend = new Renderer(this.game,96,this.maze.getLevel(this.gameInfo.currentLevel));
        this.rend.x = -55;this.rend.y = -55;

        this.player = this.game.add.image(0,0,"sprites","player");
        this.rend.positionObject(this.player,this.gameInfo["pos"]);
        this.maze.getLevel(this.gameInfo.currentLevel).getCell(this.gameInfo.pos).visibility = Visibility.PERMANENT;
        console.log(this.gameInfo.currentLevel,this.gameInfo.pos);
        console.log(this.maze.getLevel(this.gameInfo.currentLevel).getCell(this.gameInfo.pos));
//        this.rend.moveObjectTo(this.player,new Pos(6,7));
        this.rend.updateCell(this.gameInfo.pos);

        var r = new TestLevelRenderer(this.game,this.maze.getLevel(this.gameInfo.currentLevel),200,200);
        r.x = r.y = 10; 

        var s:Status = new Status(this.game);
        s.y = 20;s.x = this.game.width-20-s.width;
        s.setLevel(this.gameInfo.currentLevel+1);

        this.scr = new TextScroller(this.game,this.game.width,250);
        this.scr.y = this.game.height - this.scr.height;
    }

    destroy() : void {
    }

    update() : void {    
        this.rend.x = -(this.player.x - this.game.width / 2);
        this.rend.y = -(this.player.y - this.game.height / 2);
        if (++this.n % 30 == 0) this.scr.write(Math.random().toString());
    }


}    
