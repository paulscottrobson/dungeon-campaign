/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private gameInfo:GameData;
    private mazeRenderer:Renderer;
    private player:Player;
    private textScroller:TextScroller;
    private playerSprite:Phaser.Sprite;
    private statusArea:Status;
    private monsterList:Monster[];

    private static TILESIZE:number = 96;

    init(gameInfo:GameData) : void {
        this.gameInfo = gameInfo;
    }

    /**
     * Create game and start on provided level.
     * 
     * @memberOf GameState
     */
    create() : void {

        var bgr:Phaser.TileSprite = this.game.add.tileSprite(0,0,128,128,"sprites","bgrtile");
        bgr.width = this.game.width;bgr.height = this.game.height;
        bgr.inputEnabled = true;
        bgr.events.onInputDown.add(this.clickHandler,this);
        this.player = this.gameInfo.player;
        this.playerSprite = this.game.add.sprite(0,0,"sprites","player");
        this.statusArea = new Status(this.game);
        this.statusArea.y = 20;this.statusArea.x = this.game.width-20-this.statusArea.width;
        this.textScroller = new TextScroller(this.game,this.game.width,250);
        this.textScroller.y = this.game.height - this.textScroller.height;
        this.mazeRenderer = null;
        this.monsterList = [];
        this.moveToLevel(this.gameInfo.currentLevel);

        var m:TestLevelRenderer = new TestLevelRenderer(this.game,
                                this.gameInfo.maze.getLevel(0),200,200);
        m.x = m.y = 10;
        
        //this.addMonster(new Pos(this.player.cellPos.x+1,this.player.cellPos.y),true);
    }

    /**
     * Handle clicks - we use the background for clicks.
     * 
     * @param {*} object 
     * @param {Phaser.Pointer} pointer 
     * 
     * @memberOf GameState
     */
    clickHandler(object:any,pointer:Phaser.Pointer) : void {

        // Stop the tween and move the player where it's supposed to be.
        this.game.tweens.removeFrom(this.playerSprite);
        this.mazeRenderer.positionObject(this.playerSprite,this.player.cellPos);

        // Get click position, adjust for maze scrolling
        var x:number = pointer.x - this.mazeRenderer.x;
        var y:number = pointer.y - this.mazeRenderer.y;

        // Change to a tile, relative to player.
        x = Math.floor(x/GameState.TILESIZE);
        y = Math.floor(y/GameState.TILESIZE);

        var level:ILevel = this.gameInfo.maze.getLevel(this.gameInfo.currentLevel);
        // Must be legit, horizontal or vertical not both and not more than two squares.
        if (x >= 0 && y >= 0 && x < level.getWidth() && y < level.getHeight()) {
            if (x == this.player.cellPos.x || y == this.player.cellPos.y) {
                var count:number = Math.abs(x-this.player.cellPos.x) + Math.abs(y-this.player.cellPos.y);
                if (count > 0 && count <= 2) {
                    this.movePlayer(x-this.player.cellPos.x,y-this.player.cellPos.y,count);
                }
                if (count == 0) {
                    this.actionCell(new Pos(x,y));
                }
            }
        }

    }

    /**
     * Move player in given direction count times. Only the landing square counts for final 
     * effect (allows jumping). If jumps onto a monster no move is made. Jumping over or onto a
     * monster activates that monster.
     * 
     * @param {number} dx 
     * @param {number} dy 
     * @param {number} count 
     * 
     * @memberOf GameState
     */
    movePlayer(dx:number,dy:number,count:number) {
        // Force dx dy into range 1,0,-1
        if (dx != 0) { dx = (dx > 0) ? 1 : -1; }
        if (dy != 0) { dy = (dy > 0) ? 1 : -1; }
        // Workout direction and level
        var dir:Direction = (dx != 0) ? (dx < 0 ? Direction.LEFT:Direction.RIGHT) 
                                      : (dy < 0 ? Direction.UP:Direction.DOWN);
        var level:ILevel = this.gameInfo.maze.getLevel(this.gameInfo.currentLevel);

        // Remove visibility if we've lost the dwarf and it's presence driven.
        if (!this.player.isDwarfAlive) {
            if (level.getCell(this.player.cellPos).visibility == Visibility.PRESENCE) {
                level.getCell(this.player.cellPos).visibility = Visibility.HIDDEN;
                this.mazeRenderer.updateCell(this.player.cellPos);
            }
        }
        // Attempt the moves.
        while (count > 0) {
            count = count - 1;
            // If walk into rock make that rock wall visible.
            var newPos:Pos = new Pos(this.player.cellPos.x+dx,this.player.cellPos.y+dy);
            if (level.getCell(newPos).contents == CellContents.ROCK && this.player.isDwarfAlive) {
                this.lightSquare(this.gameInfo.currentLevel,newPos);
            }
            // Move if can move (e.g. not a wall)
            if (level.canMove(this.player.cellPos,dir)) {
                this.player.cellPos.x += dx;
                this.player.cellPos.y += dy;
                if (this.player.isDwarfAlive) {
                    this.lightSquare(this.gameInfo.currentLevel,this.player.cellPos);
                }
                // TODO: Instantiate monster and go back one square if found.
                console.log(level.getCell(this.player.cellPos).contents);
            }
        }
        // Find out what you've landed in.
        var cellContents:CellContents = level.getCell(this.player.cellPos).contents;

        // Move the player to the new position.
        this.mazeRenderer.moveObjectTo(this.playerSprite,this.player.cellPos);
        this.warningMessages();
        // Add presence visibility if we've lost the dwarf
        if (!this.player.isDwarfAlive) {
            if (level.getCell(this.player.cellPos).visibility == Visibility.HIDDEN) {
                level.getCell(this.player.cellPos).visibility = Visibility.PRESENCE;
                this.mazeRenderer.updateCell(this.player.cellPos);
            }
        }
    }

    /**
     * Action on cell referred to. This can be stairs, monsters etc.
     * 
     * @param {Pos} pos 
     * 
     * @memberOf GameState
     */
    actionCell(pos:Pos) : void {
        console.log("Action ",pos.x,pos.y);
    }


    addMonster(pos:Pos,hasTreasure:boolean) {
        var m:Monster = new Monster(this.game,pos,this.gameInfo.currentLevel);
        this.mazeRenderer.add(m.getSprite());
        this.game.world.bringToTop(m);
        this.monsterList.push(m);
        this.gameInfo.maze.getLevel(this.gameInfo.currentLevel).getCell(pos).contents = 
                                (hasTreasure ? CellContents.TREASURE:CellContents.NOTHING);
        this.mazeRenderer.updateCell(pos);                                
        this.mazeRenderer.positionObject(m.getSprite(), m.cellPos);
        this.textScroller.write("You've come upon");
        this.textScroller.write(m.count+" "+m.name);
        this.textScroller.write("Their strength is "+m.strength);
    }

    /**
     * Move to a new level.
     * 
     * @param {number} newLevel 
     * 
     * @memberOf GameState
     */
    moveToLevel(newLevel:number) {
        // Dump current renderer if any
        if (this.mazeRenderer != null) {
            this.mazeRenderer.destroy();
        }
        // Destroy all monsters ! (including Varan the Unbelievable)
        for (var m of this.monsterList) {
            m.destroy();
        }
        this.monsterList = [];
        // Create new renderer
        this.mazeRenderer = new Renderer(this.game,GameState.TILESIZE,this.gameInfo.maze.getLevel(newLevel));
        this.mazeRenderer.positionObject(this.playerSprite,this.player.cellPos);
        // Light current square
        this.lightSquare(newLevel,this.player.cellPos);        
        // Set status area level
        this.statusArea.setLevel(newLevel+1);
        // Rest of status
        this.player.refreshStatus(this.statusArea);
        this.gameInfo.currentLevel = newLevel;
        // Bring scroller, player above renderer.
        this.game.world.bringToTop(this.textScroller);
        this.game.world.bringToTop(this.playerSprite);
        this.game.world.bringToTop(this.statusArea);
        
        this.textScroller.write("Entering level "+(newLevel+1));
        // Announce warning messages
        this.warningMessages();
    }

    /**
     * Display warning messages for Pterodactly/Necromancer or pit if Elf is alive.
     * (horizontally/vertically adjacent only)
     * 
     * @memberOf GameState
     */
    warningMessages() : void {
        if (this.player.isElfAlive) {
            var searchList:Pos[] = [];
            searchList.push(new Pos(this.player.cellPos.x-1,this.player.cellPos.y));
            searchList.push(new Pos(this.player.cellPos.x+1,this.player.cellPos.y));
            searchList.push(new Pos(this.player.cellPos.x,this.player.cellPos.y-1));
            searchList.push(new Pos(this.player.cellPos.x,this.player.cellPos.y+1));
            var found:boolean = false;
            for (var pos of searchList) {
                var cell:Cell = this.gameInfo.maze.getLevel(this.gameInfo.currentLevel).getCell(pos);
                if (cell != null) {
                    if (cell.contents == CellContents.NECROMANCER || cell.contents == CellContents.PIT) {
                        found = true;
                    }
                }
            }
            if (found) {
                this.textScroller.write("Beware! Danger Near!");
            }
        }
    }

    /**
     * Make given square visible dependent on dwarf state ; can force permanence.
     * 
     * @param {number} clevel 
     * @param {Pos} pos 
     * @param {boolean} makeAlways
     * 
     * @memberOf GameState
     */
    lightSquare(clevel:number,pos:Pos,makeAlways:boolean = false) : void {
        var level:ILevel = this.gameInfo.maze.getLevel(clevel);
        level.getCell(pos).visibility = 
                    (this.player.isDwarfAlive || makeAlways ? Visibility.PERMANENT : 
                                                              Visibility.PRESENCE);
        this.mazeRenderer.updateCell(pos);
    }

    destroy() : void {
    }

    update() : void {    
        this.mazeRenderer.x = -(this.playerSprite.x - this.game.width / 2);
        this.mazeRenderer.y = -(this.playerSprite.y - this.textScroller.y / 2);
        
        this.player.refreshStatus(this.statusArea);
    }
}    
