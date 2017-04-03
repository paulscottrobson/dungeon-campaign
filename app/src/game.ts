/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private difficulty:number;  
    private maze:Maze;

    init(gameInfo:any) : void {
        this.difficulty = gameInfo.difficulty;
        this.maze = new Maze(gameInfo["size"]||13,gameInfo["size"]||13,gameInfo["levels"]||4);
        console.log(this.difficulty);
        console.log(gameInfo);
        console.log(this.maze.toString());
    }

    create() : void {
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","rock");
        //bgr.width = this.game.width;bgr.height = this.game.height;
    }

    destroy() : void {
    }

    update() : void {
    }
}    
