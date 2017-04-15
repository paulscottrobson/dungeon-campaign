/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Class responsible for maintaining rendering of a single cell.
 * 
 * @class CellRenderer
 * @extends {Phaser.Group}
 */
class CellRenderer extends Phaser.Group {

    private cellSize:number;
    private floor:Phaser.Image;
    private rightWall:Phaser.Image;
    private downWall:Phaser.Image;
    private contents:Phaser.Image;

    constructor (game:Phaser.Game,cell:Cell,cellSize:number,owner:Phaser.Group) {
        super(game);
        owner.add(this);
        this.cellSize = cellSize;
        // Create this.floor which is rock or maze.
        this.floor = game.add.image(0,0,"sprites",
                        (cell.contents == CellContents.ROCK) ? "rock":"mazefloor",this);
        this.floor.width = this.floor.height = cellSize;
        this.floor.visible = false;

        if (cell.contents != CellContents.ROCK) {
            // Create two walls right and bottom
            var wall:number = cellSize / 4;
            this.downWall = game.add.image(0,cellSize,"sprites","wall",this);
            this.downWall.width = cellSize;this.downWall.height = wall;
            this.downWall.anchor.setTo(0,0.5);
            this.rightWall = game.add.image(cellSize,0,"sprites","wall",this);
            this.rightWall.width = cellSize;this.rightWall.height = wall;
            this.rightWall.anchor.setTo(0,0.5);this.rightWall.rotation = Math.PI/2;

            this.downWall.visible = this.rightWall.visible = false;

            // Contents image
            this.contents = game.add.image(wall/2,wall/2,"sprites","exit",this);
            this.contents.width = this.contents.height = (cellSize-wall);
            this.contents.visible = false;
        }
    }

    destroy() : void {
        super.destroy();
        this.floor = this.downWall = this.rightWall = this.contents = null;
    }

    /**
     * Update the rendering to represent the data in the cell.
     * 
     * @param {Cell} cell 
     * 
     * @memberOf CellRenderer
     */
    updateCellContents(cell:Cell) : void {
        this.floor.visible = (cell.visibility != Visibility.HIDDEN);

        // This is a fix so we can see the maze contents but still see hidden areas.

        if (this.contents != null) {
            this.contents.visible = this.floor.visible;

            // Open walls.
            this.downWall.visible = cell.wallDown && this.contents.visible;
            this.rightWall.visible = cell.wallRight && this.contents.visible;

            // Figure out what's there. Some things, monsters, are active objects            
            var sc:string = "";
            if (cell.contents == CellContents.EXIT) { sc = "exit"; }                
            if (cell.contents == CellContents.PIT) { sc = "pit"; }                
            if (cell.contents == CellContents.STAIRSDOWN) { sc = "stairsd"; }                
            if (cell.contents == CellContents.STAIRSUP) { sc = "stairsu"; }                
            if (cell.contents == CellContents.TREASURE) { sc = "treasure"; }     
            if (sc != "") {
                this.contents.loadTexture("sprites",sc);
            } else {
                this.contents.visible = false;
            }   
        } 
    }

    setWall(dir:Direction,isOn:boolean) {
        if (this.floor.visible) { isOn = true; }
        if (dir == Direction.RIGHT && this.rightWall != null) {
            this.rightWall.visible = isOn;
        }
        if (dir == Direction.DOWN && this.downWall != null) {
            this.downWall.visible = isOn;
        }
    }
}