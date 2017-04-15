/// <reference path="../lib/phaser.comments.d.ts"/>

class StartState extends Phaser.State {

    private gameInfo:any;

    init(gameInfo:any) : void {
        // Create a maze according to information
        var m:Maze = new Maze(gameInfo["size"]||13,gameInfo["size"]||13,
                              gameInfo["levels"]||4,
                              gameInfo["difficulty"]||1);
        // Find a start position which is empty.
        var p:Pos = m.getLevel(0).findEmptySlot();

        // Save information into gameInfo and switch to game mode on create.
        gameInfo["currentLevel"] = 0;                                    
        gameInfo["maze"] = m;
        gameInfo["pos"] = p;
        this.gameInfo = gameInfo;                                    
    }


    create() : void {
        this.game.state.start("Play",true,false,this.gameInfo);
    }
}
