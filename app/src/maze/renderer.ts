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

                this.level.getCell(p).visited = true;

                var cr:CellRenderer = new CellRenderer(this.game,
                                            this.level.getCell(p),cellSize,this);
                cr.x = x * cellSize;cr.y = y * cellSize;
                this.cellRenderers[x][y] = cr;
                this.updateCell(p);
                this.add(cr);
            }
        }
    }

    updateCell(pos:Pos) :void  {
        this.cellRenderers[pos.x][pos.y].updateCell(this.level.getCell(pos));
    }

    positionObject(obj:Phaser.Image,pos:Pos) : void {
        this.add(obj);
        obj.bringToTop();
        obj.anchor.setTo(0.5,0.5);
        obj.x = (pos.x + 0.5) * this.cellSize;
        obj.y = (pos.y + 0.5) * this.cellSize;
        obj.width = obj.height = this.cellSize * 3/4;
    }

    moveObjectTo(obj:Phaser.Image,pos:Pos) : void {
        var x1:number = (pos.x + 0.5) * this.cellSize;
        var y1:number = (pos.y + 0.5) * this.cellSize;
        this.game.add.tween(obj).to({ x: x1,y: y1 },
        (Math.abs(x1-obj.x)+Math.abs(y1-obj.y))*2,Phaser.Easing.Default,true);
    }

    destroy() : void {
        super.destroy();
        this.level = null;this.cellRenderers = null;
    }

}