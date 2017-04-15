/// <reference path="../lib/phaser.comments.d.ts"/>

class StartState extends Phaser.State {

    private gameInfo:GameData;

    init(gameInfo:GameData) : void {
        // Create a maze according to information
        var m:Maze = new Maze(gameInfo.size,gameInfo.size,
                              gameInfo.levels,
                              gameInfo.difficulty);

        // Save information into gameInfo and switch to game mode on create.

        var gameInfo:GameData = new GameData();
        gameInfo.currentLevel = 0;
        gameInfo.maze = m;
        gameInfo.player = new Player(m);
        this.gameInfo = gameInfo;                                    
    }


    create() : void {
        this.game.state.start("Play",true,false,this.gameInfo);
    }
}
