/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private difficulty:number;  
    private maze:Maze;
    private rend:Renderer;
    private player:Phaser.Image;

    init(gameInfo:any) : void {
        this.difficulty = gameInfo.difficulty;
        this.maze = new Maze(gameInfo["size"]||13,gameInfo["size"]||13,gameInfo["levels"]||4,gameInfo["difficulty"]||1);
    }

    create() : void {

        var bgr:Phaser.TileSprite = this.game.add.tileSprite(0,0,128,128,"sprites","bgrtile");
        bgr.width = this.game.width;bgr.height = this.game.height;

        this.rend = new Renderer(this.game,96,this.maze.getLevel(0));
        this.rend.x = -55;this.rend.y = -55;

        this.player = this.game.add.image(0,0,"sprites","player");
        this.rend.positionObject(this.player,new Pos(2,1));
        this.rend.moveObjectTo(this.player,new Pos(6,7));

        var r = new TestLevelRenderer(this.game,this.maze.getLevel(0),200,200);
        r.x = 630-r.width;r.y = 950-r.height;

        console.log(this.rend.x,this.rend.y);
    }
    destroy() : void {
    }

    update() : void {    
        this.rend.x = -(this.player.x - this.game.width / 2);
        this.rend.y = -(this.player.y - this.game.height / 2);
    }
}    
