/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    create() : void {
        var bgr:Phaser.Image = this.game.add.image(0,0,"sprites","background");
        bgr.width = this.game.width;bgr.height = this.game.height;

        var musd:Object = this.game.cache.getJSON("music");
        console.log(musd);
        var mus:Music = new Music(musd);
        console.log(mus);

        var mgr:IManager = new HorizontalDisplayManager(this.game,mus,this.game.width*0.94,
                                                            this.game.height*0.84);

        mgr.x = mgr.y = 80;

        var plyr:IPlayer = MusicClassFactory.createMusicPlayer(this.game,mus);
        plyr.onPlayNote.add((bar:number,note:number) => {
            mgr.moveCursor(bar,note);
        },this);

        mgr.onSelect.add((obj:any,bar:number,note:number) => {
            plyr.moveTo(bar,note);
        },this);

        var pnl:ControlPanel = new ControlPanel(this.game,mgr,plyr,false);

        plyr.height = pnl.height;plyr.width = pnl.height * 2;
        plyr.x = this.game.width-5-plyr.width;plyr.y = 0;
        mgr.y = pnl.height+44;
    }

    destroy() : void {
    }

    update() : void {
    }
}    
