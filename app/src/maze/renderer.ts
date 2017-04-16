/// <reference path="../../lib/phaser.comments.d.ts"/>


class Renderer extends Phaser.Group {
    private cellSize:number;
    private level:ILevel;
    private cellRenderers:CellRenderer[][];

    constructor(game:Phaser.Game,cellSize:number,level:ILevel) {
        super(game);
        this.cellSize = cellSize;this.level = level;
        this.cellRenderers = [];
        for (var x = level.getWidth()-1; x >= 0;x--) {
            this.cellRenderers[x] = [];
            for (var y = level.getHeight()-1;y >= 0;y--) {
                var p:Pos = new Pos(x,y);                
                var cr:CellRenderer = new CellRenderer(this.game,
                                            this.level.getCell(p),cellSize,this);
                cr.x = x * cellSize;cr.y = y * cellSize;
                this.cellRenderers[x][y] = cr;
                this.add(cr);
            }
        }
        for (var x = -1;x <= level.getWidth();x++) {
            this.addFrame(x,-1);
            this.addFrame(x,level.getHeight());
        }
        for (var y = 0;y < level.getHeight();y++) {
            this.addFrame(-1,y);
            this.addFrame(level.getWidth(),y);
        }

        for (var x = level.getWidth()-1; x >= 0;x--) {
            for (var y = level.getHeight()-1;y >= 0;y--) {
                // This opens up the whole maze at the start.
                level.getCell(new Pos(x,y)).visibility = Visibility.PERMANENT;
                this.updateCell(new Pos(x,y));;
            }
        }
    }

    addFrame(x:number,y:number): void {
        var frame:Phaser.Image = this.game.add.image(x*this.cellSize,y*this.cellSize,
                                                     "sprites","frame",this);
        frame.width = frame.height = this.cellSize;                                                     
    }

    updateCell(pos:Pos) :void  {
        this.cellRenderers[pos.x][pos.y].updateCellContents(this.level.getCell(pos));
        var isOn:boolean = this.level.getCell(pos).visibility != Visibility.HIDDEN;
        if (pos.x > 0) {
            var p1:Pos = new Pos(pos.x-1,pos.y);
            if (this.level.getCell(p1).wallRight) {
                this.cellRenderers[p1.x][p1.y].setWall(Direction.RIGHT,isOn);
            }
        }
        if (pos.y > 0) {
            var p1:Pos = new Pos(pos.x,pos.y-1);
            if (this.level.getCell(p1).wallDown) {
                this.cellRenderers[p1.x][p1.y].setWall(Direction.DOWN,isOn);
            }
        }

    }

    positionObject(obj:Phaser.Sprite,cellPos:Pos) : void {
        this.add(obj);
        obj.anchor.setTo(0.5,0.5);
        obj.width = obj.height = this.cellSize * 3/4;
        obj.x = (cellPos.x + 0.5) * this.cellSize;
        obj.y = (cellPos.y + 0.5) * this.cellSize;
    }

    moveObjectTo(obj:Phaser.Sprite,cellPos:Pos) : void {        
        var x1:number = (cellPos.x + 0.5) * this.cellSize;
        var y1:number = (cellPos.y + 0.5) * this.cellSize;
        this.game.add.tween(obj).to({ x: x1,y: y1 },
        (Math.abs(x1-obj.x)+Math.abs(y1-obj.y))*2,Phaser.Easing.Default,true);
    }

    destroy() : void {
        super.destroy();
        this.level = null;this.cellRenderers = null;
    }

}