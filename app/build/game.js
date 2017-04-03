var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameState.prototype.create = function () {
        var bgr = this.game.add.image(0, 0, "sprites", "background");
        bgr.width = this.game.width;
        bgr.height = this.game.height;
        var musd = this.game.cache.getJSON("music");
        console.log(musd);
        var mus = new Music(musd);
        console.log(mus);
        var mgr = new HorizontalDisplayManager(this.game, mus, this.game.width * 0.94, this.game.height * 0.84);
        mgr.x = mgr.y = 80;
        var plyr = MusicClassFactory.createMusicPlayer(this.game, mus);
        plyr.onPlayNote.add(function (bar, note) {
            mgr.moveCursor(bar, note);
        }, this);
        mgr.onSelect.add(function (obj, bar, note) {
            plyr.moveTo(bar, note);
        }, this);
        var pnl = new ControlPanel(this.game, mgr, plyr, false);
        plyr.height = pnl.height;
        plyr.width = pnl.height * 2;
        plyr.x = this.game.width - 5 - plyr.width;
        plyr.y = 0;
        mgr.y = pnl.height + 44;
    };
    GameState.prototype.destroy = function () {
    };
    GameState.prototype.update = function () {
    };
    return GameState;
}(Phaser.State));
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer(game, bar, width, height) {
        var _this = _super.call(this, game) || this;
        _this.bar = bar;
        _this.tabHeight = height;
        _this.tabWidth = width;
        _this.renderBar();
        return _this;
    }
    Renderer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.bar = null;
    };
    Renderer.prototype.getWidth = function () {
        return (this.bar.count + 0.5) * this.tabWidth;
    };
    Renderer.prototype.getHeight = function () {
        return this.tabHeight;
    };
    Renderer.prototype.renderBar = function () {
        this.forEachAlive(function (obj) { obj.pendingDestroy = true; }, this);
        this.yStaveHeight = this.tabHeight * 0.7;
        this.yBarBottom = this.tabHeight * 0.95;
        var img;
        for (var n = 0; n < this.bar.music.voices; n++) {
            img = this.game.add.image(0, this.getYString(n), "sprites", "rectangle", this);
            img.tint = 0x000000;
            img.anchor.setTo(0, 0.5);
            img.width = this.getWidth();
            img.height = Math.max(1, this.yStaveHeight / 32);
        }
        for (var n = 0; n < 2; n++) {
            img = this.game.add.image(n * this.getWidth(), this.getYString(0), "sprites", "rectangle", this);
            img.tint = 0x000000;
            img.anchor.setTo(0.5, 0);
            img.width = Math.max(1, this.yStaveHeight / 16);
            img.height = this.getYString(this.bar.music.voices - 1) - this.getYString(0);
        }
        for (var n = 0; n < this.bar.count; n++) {
            this.drawNote(n);
        }
        var crotchet = Math.floor(1000 / this.bar.music.beats / 2) + 1;
        var n = 0;
        while (n < this.bar.count) {
            if (this.bar.note[n].mbLength < crotchet) {
                var start = n;
                while (n != this.bar.count && this.bar.note[n].mbLength < crotchet) {
                    n++;
                }
                n--;
                this.connectNotes(start, n);
            }
            n = n + 1;
        }
        if (Renderer.DEBUG) {
            img = this.game.add.image(0, 0, "sprites", "frame", this);
            img.width = this.getWidth();
            img.height = this.getHeight();
            img.tint = 0xFF0000;
            img.alpha = 0.3;
        }
    };
    Renderer.prototype.drawNote = function (n) {
        var isRest = true;
        for (var str = 0; str < this.bar.music.voices; str++) {
            if (this.bar.note[n].chromaticOffset[str] != Note.QUIET) {
                isRest = false;
            }
        }
        if (isRest) {
            return;
        }
        var img = this.game.add.image(this.getX(n), this.getYString(this.bar.music.voices - 0.5), "sprites", "rectangle", this);
        img.width = Math.max(1, this.yStaveHeight / 32);
        img.height = this.yBarBottom - img.y;
        img.anchor.setTo(0.5, 0);
        img.tint = 0x000000;
        for (var str = 0; str < this.bar.music.voices; str++) {
            var note = this.bar.note[n].chromaticOffset[str];
            if (note != Note.QUIET) {
                var n1 = note;
                if (this.bar.music.isDiatonic) {
                    n1 = Renderer.TODIATONIC[n1 % 12] + Math.floor(n1 / 12) * 7;
                }
                var s = Math.floor(n1 - this.bar.music.capo).toString();
                if (n1 != Math.floor(n1)) {
                    s = s + "plus";
                }
                img = this.game.add.image(this.getX(n), this.getYString(str), "sprites", s, this);
                img.anchor.setTo(0.5, 0.5);
                img.width = this.tabWidth * 0.7;
                img.height = (this.getYString(1) - this.getYString(0)) * 0.8;
            }
        }
        if (this.bar.note[n].mbLength >= Math.floor(1000 * 2 / this.bar.music.beats)) {
            var crc = this.game.add.image(img.x, img.y, "sprites", "circle", this);
            crc.tint = 0x000000;
            crc.anchor.setTo(0.5, 0.5);
            crc.width = crc.height = this.getHeight() * 0.25;
        }
    };
    Renderer.prototype.connectNotes = function (first, last) {
        if (first == last) {
            if (first > 0) {
                this.drawConnection(first - 0.5, first, this.bar.note[first].mbLength);
            }
            else {
                this.drawConnection(first, first + 0.5, this.bar.note[first].mbLength);
            }
            return;
        }
        var shortestNote = 1000;
        var allSameLength = true;
        for (var n = first; n <= last; n++) {
            shortestNote = Math.min(shortestNote, this.bar.note[n].mbLength);
            if (Math.abs(this.bar.note[first].mbLength - this.bar.note[n].mbLength) > 3) {
                allSameLength = false;
            }
        }
        if (allSameLength) {
            this.drawConnection(first, last, shortestNote);
            return;
        }
        this.drawConnection(first, last, 1000 / this.bar.music.beats / 2);
        var n = first;
        while (n <= last) {
            if (Math.abs(this.bar.note[n].mbLength - 1000 / this.bar.music.beats / 4) < 3) {
                var isNext = false;
                var isPrev = false;
                if (n < last) {
                    if (Math.abs(this.bar.note[n + 1].mbLength - 1000 / this.bar.music.beats / 4) < 3) {
                        isNext = true;
                    }
                }
                if (n > first) {
                    if (Math.abs(this.bar.note[n - 1].mbLength - 1000 / this.bar.music.beats / 4) < 3) {
                        isPrev = true;
                    }
                }
                if (!isPrev) {
                    if (isNext) {
                        this.drawConnection(n, n + 1, this.bar.note[n].mbLength);
                    }
                    else {
                        this.drawConnection(n - 0.5, n, this.bar.note[n].mbLength);
                    }
                }
            }
            n++;
        }
    };
    Renderer.prototype.drawConnection = function (start, end, length) {
        var isDouble = (Math.abs(length - 1000 / this.bar.music.beats / 4) < 3);
        this.drawConnectingBar(start, end, this.yBarBottom);
        if (isDouble) {
            this.drawConnectingBar(start, end, this.yBarBottom - this.yStaveHeight / 8);
        }
    };
    Renderer.prototype.drawConnectingBar = function (start, end, y) {
        start = this.getX(start);
        end = this.getX(end);
        var img = this.game.add.image(start, y, "sprites", "rectangle", this);
        img.tint = 0x000000;
        img.anchor.setTo(0, 1);
        img.width = end - start;
        img.height = this.yStaveHeight / 16;
    };
    Renderer.prototype.positionCursor = function (pos, object) {
        var x = this.x + this.getX(pos);
        var y = this.y + this.yStaveHeight / 2;
        object.bringToTop();
        object.x = x;
        object.y = y;
    };
    Renderer.prototype.getX = function (n) {
        return Math.round((n + 0.75) * this.tabWidth);
    };
    Renderer.prototype.getNote = function (x) {
        var result = 0;
        for (var n = 0; n < this.bar.count; n++) {
            if (x >= this.getX(n - 0.5) && x < this.getX(n + 0.5)) {
                result = n;
            }
        }
        return result;
    };
    Renderer.prototype.getYString = function (str) {
        return (str + 1) * this.yStaveHeight / (this.bar.music.voices + 1);
    };
    return Renderer;
}(Phaser.Group));
Renderer.DEBUG = false;
Renderer.TODIATONIC = [
    0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 6, 6.5
];
window.onload = function () {
    var game = MusicClassFactory.createApplication();
};
var MainApplication = (function (_super) {
    __extends(MainApplication, _super);
    function MainApplication() {
        var _this = _super.call(this, SetupPhaserInformation.WIDTH, SetupPhaserInformation.HEIGHT, Phaser.AUTO, "", null, false, false) || this;
        _this.state.add("Boot", MusicClassFactory.createBootState());
        _this.state.add("Preload", MusicClassFactory.createPreloadState());
        _this.addExtraStates();
        _this.state.add("Main", _this.getMainState());
        _this.state.start("Boot");
        return _this;
    }
    MainApplication.getMusicName = function () {
        var name = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("music").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        return (name == "") ? "music2.json" : name;
    };
    return MainApplication;
}(Phaser.Game));
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        var _this = this;
        this.game.load.image("loader", "assets/sprites/loader.png");
        this.preloadInBootState(MainApplication.getMusicName());
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Preload", true, false, 1); }, this);
    };
    BootState.prototype.preloadInBootState = function (musicName) { };
    BootState.prototype.create = function () {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    return BootState;
}(Phaser.State));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        var _this = this;
        this.game.stage.backgroundColor = "#000000";
        var loader = this.add.sprite(this.game.width / 2, this.game.height / 2, "loader");
        loader.width = this.game.width * 9 / 10;
        loader.height = this.game.height / 8;
        loader.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loader);
        PreloadState.NOTE_COUNT = this.getNoteCount();
        this.game.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
        for (var _i = 0, _a = this.getFontList(); _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        var noteDir = this.getNoteDirectory();
        for (var i = 1; i <= PreloadState.NOTE_COUNT; i++) {
            var sound = i.toString();
            this.game.load.audio(sound, [noteDir + "/" + sound + ".mp3", noteDir + "/" + sound + ".ogg"]);
        }
        this.game.load.audio("metronome", ["assets/sounds/metronome.mp3",
            "assets/sounds/metronome.ogg"]);
        for (var _b = 0, _c = this.getAudioList(); _b < _c.length; _b++) {
            var audioName = _c[_b];
            this.game.load.audio(audioName, ["assets/sounds/" + audioName + ".mp3",
                "assets/sounds/" + audioName + ".ogg"]);
        }
        this.loadOtherResources(MainApplication.getMusicName());
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false, 1); }, this);
    };
    return PreloadState;
}(Phaser.State));
var StaticTabDisplayManager = (function (_super) {
    __extends(StaticTabDisplayManager, _super);
    function StaticTabDisplayManager(game, music, width, height) {
        if (width === void 0) { width = null; }
        if (height === void 0) { height = null; }
        var _this = _super.call(this, game) || this;
        _this.drawWidth = width || game.width;
        _this.drawHeight = height || game.height;
        _this.music = music;
        _this.onSelect = new Phaser.Signal();
        _this.renderer = null;
        _this.fitToArea();
        _this.redrawAll();
        _this.layout();
        _this.controlGraphics();
        return _this;
    }
    StaticTabDisplayManager.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.musicCursor = this.onSelect = this.music = this.renderer = null;
    };
    StaticTabDisplayManager.prototype.redrawAll = function () {
        if (this.renderer == null) {
            this.renderer = [];
            for (var n = 0; n < this.music.count; n++) {
                this.renderer[n] = new Renderer(this.game, this.music.bar[n], this.tabWidth, this.tabHeight);
                this.add(this.renderer[n]);
            }
        }
        else {
            for (var n = 0; n < this.music.count; n++) {
                this.renderer[n].renderBar();
            }
        }
    };
    StaticTabDisplayManager.prototype.moveCursor = function (bar, note) {
        this.musicCursor.x = this.renderer[bar].x + this.renderer[bar].getX(note);
        this.musicCursor.y = this.renderer[bar].y;
    };
    StaticTabDisplayManager.prototype.controlGraphics = function () {
        var img = this.game.add.image(0, 0, "sprites", "rectangle", this);
        img.width = this.drawWidth;
        img.height = this.drawHeight;
        img.inputEnabled = true;
        img.events.onInputDown.add(this.clickHandler, this);
        img.sendToBack();
        this.musicCursor = this.game.add.image(0, 0, "sprites", "rectangle", this);
        this.musicCursor.tint = 0x0040C0;
        this.musicCursor.alpha = 0.35;
        this.musicCursor.anchor.setTo(0.5, 0);
        this.musicCursor.width = this.tabWidth;
        this.musicCursor.height = this.tabHeight;
        this.moveCursor(0, 0);
    };
    StaticTabDisplayManager.prototype.clickHandler = function (obj, ptr) {
        var x = ptr.x - this.x;
        var y = ptr.y - this.y;
        for (var bar = 0; bar < this.music.count; bar++) {
            var b = this.renderer[bar];
            if (x >= b.x && y >= b.y && x < b.x + b.getWidth() && y < b.y + b.getHeight()) {
                var note = b.getNote(x - b.x);
                this.onSelect.dispatch(this, bar, note);
                this.moveCursor(bar, note);
            }
        }
    };
    StaticTabDisplayManager.prototype.fitToArea = function () {
        var fitted = false;
        this.tabWidth = 128;
        while (!fitted) {
            this.tabHeight = Math.round(this.tabWidth * 2.8);
            if (this.calculateHeight(this.tabWidth, this.tabHeight) < this.drawHeight) {
                fitted = true;
            }
            else {
                this.tabWidth = Math.round(this.tabWidth / 1.04);
            }
        }
    };
    StaticTabDisplayManager.prototype.layout = function () {
        var x = 0;
        var y = 0;
        for (var b = 0; b < this.music.count; b++) {
            var width = this.renderer[b].getWidth();
            if (x + width > this.drawWidth) {
                x = 0;
                y = y + this.renderer[b].getHeight();
            }
            this.renderer[b].x = x;
            this.renderer[b].y = y;
            x = x + width;
        }
        this.totalHeight = y + this.renderer[0].getHeight();
    };
    StaticTabDisplayManager.prototype.calculateHeight = function (noteSize, height) {
        var x = 0;
        var y = 0;
        for (var b = 0; b < this.music.count; b++) {
            var width = noteSize * (this.music.bar[b].count + 0.5);
            if (width > this.drawWidth) {
                return 999999;
            }
            if (x + width > this.drawWidth) {
                x = 0;
                y = y + height;
            }
            x = x + width;
        }
        return y + height - 1;
    };
    return StaticTabDisplayManager;
}(Phaser.Group));
var HorizontalDisplayManager = (function (_super) {
    __extends(HorizontalDisplayManager, _super);
    function HorizontalDisplayManager(game, music, width, height) {
        if (width === void 0) { width = null; }
        if (height === void 0) { height = null; }
        var _this = _super.call(this, game) || this;
        _this.drawWidth = width || game.width;
        _this.drawHeight = height || game.height;
        _this.music = music;
        _this.onSelect = new Phaser.Signal();
        for (var n = 0; n < 4; n++) {
            var rnd = new HorizontalScrollRenderer(game, music.bar[n], 600, 300);
            _this.add(rnd);
            rnd.x = (n % 2) * 600;
            rnd.y = Math.floor(n / 2) * 400;
        }
        return _this;
    }
    HorizontalDisplayManager.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.music = null;
        this.onSelect = null;
    };
    HorizontalDisplayManager.prototype.moveCursor = function (bar, note) {
    };
    return HorizontalDisplayManager;
}(Phaser.Group));
HorizontalDisplayManager.DEBUG = false;
var HorizontalScrollRenderer = (function (_super) {
    __extends(HorizontalScrollRenderer, _super);
    function HorizontalScrollRenderer(game, bar, width, height) {
        var _this = _super.call(this, game) || this;
        _this.rWidth = width;
        _this.rHeight = height;
        _this.bar = bar;
        _this.drawFrame();
        return _this;
    }
    HorizontalScrollRenderer.prototype.drawFrame = function () {
        var bgr = this.game.add.image(0, 0, "sprites", "rectangle", this);
        bgr.width = this.rWidth;
        bgr.height = this.rHeight * 0.9;
        bgr.tint = 0x303030;
        var bgr2 = this.game.add.image(0, bgr.bottom, "sprites", "rectangle", this);
        bgr2.height = this.rHeight - bgr.height;
        bgr2.width = this.width;
        bgr2.tint = 0x000000;
        console.log(this.bar);
        for (var n = 0; n <= this.bar.music.beats; n++) {
            var vbr = this.game.add.image(this.rWidth * n / this.bar.music.beats, 0, "sprites", "rectangle", this);
            vbr.width = Math.max(2, this.rWidth / 128);
            vbr.height = bgr.height;
            vbr.tint = 0x00000;
            vbr.anchor.setTo(0.5, 0);
            if (n == 0 || n == this.bar.music.beats) {
                vbr.tint = 0xFFD700;
                vbr.width *= 2;
                vbr.anchor.setTo(n == 0 ? 0 : 1, 0);
            }
        }
        var c = (this.bar.music.voices == 3) ? 4 : this.bar.music.voices;
        for (var s = 0; s < c; s++) {
            var str = this.game.add.image(0, this.yString(s), "sprites", "rectangle", this);
            str.width = this.rWidth;
            str.anchor.setTo(0, 0.5);
            str.tint = 0xE0DFDB;
            if (this.bar.music.voices != 3) {
                str.height = this.rHeight / 64 + s * 2;
            }
            else {
                str.height = this.rHeight / 64 + (this.bar.music.voices - s) * 2;
                if (s == 3) {
                    str.y = this.yString(2) - str.height * 3;
                    str.height += 2;
                }
            }
            var ss = this.game.add.image(0, str.bottom, "sprites", "rectangle", this);
            ss.width = this.rWidth;
            ss.height = this.rHeight / 128;
            ss.tint = 0x000000;
        }
        var dbg = this.game.add.image(0, 0, "sprites", "frame", this);
        dbg.width = this.rWidth;
        dbg.height = this.rHeight;
        dbg.tint = 0xFF8000;
        dbg.alpha = 0.3;
    };
    HorizontalScrollRenderer.prototype.yString = function (s) {
        return (s + 0.5) / (this.bar.music.voices + 0) * this.rHeight * 0.9;
    };
    HorizontalScrollRenderer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.bar = null;
    };
    return HorizontalScrollRenderer;
}(Phaser.Group));
var MusicPlayer = (function (_super) {
    __extends(MusicPlayer, _super);
    function MusicPlayer(game, music, firstNote, lastNote) {
        if (firstNote === void 0) { firstNote = 1; }
        if (lastNote === void 0) { lastNote = PreloadState.NOTE_COUNT; }
        var _this = _super.call(this, game) || this;
        _this.music = music;
        _this.firstNote = firstNote;
        _this.lastNote = lastNote;
        _this.metronome = _this.game.add.audio("metronome");
        _this.isPaused = false;
        _this.bpsAdjust = 0.0;
        _this.onPlayNote = new Phaser.Signal();
        _this.isTuneOn = _this.isMetronomeOn = true;
        _this.moveTo(0, 0);
        _this.speed = _this.game.add.bitmapText(0, 0, "7seg", "000", 96, _this);
        _this.speed.anchor.setTo(0, 0);
        _this.noteInstance = [];
        for (var n = firstNote; n <= lastNote; n++) {
            _this.noteInstance[n] = _this.game.add.audio(n.toString());
        }
        return _this;
    }
    MusicPlayer.prototype.destroy = function () {
        this.music = null;
        this.metronome.destroy();
        this.metronome = null;
        this.speed = null;
        for (var _i = 0, _a = this.noteInstance; _i < _a.length; _i++) {
            var ni = _a[_i];
            if (ni != null) {
                ni.destroy();
            }
        }
        this.noteInstance = null;
        _super.prototype.destroy.call(this);
    };
    MusicPlayer.prototype.update = function () {
        if (!this.isPaused) {
            var oldMillibeat = this.millibeat;
            var elapsed = this.game.time.elapsed / 1000;
            var bps = (this.music.beatsPerMinute + this.bpsAdjust);
            if (bps < 20 || bps > 240) {
                bps = (bps < 20) ? 20 : 240;
                this.bpsAdjust = bps - this.music.beatsPerMinute;
            }
            this.speed.text = ("000" + bps.toString()).slice(-3);
            var mbElapsed = elapsed * bps / 60 * 1000 / this.music.beats;
            this.millibeat = this.millibeat + Math.round(mbElapsed);
            if (!this.endOfTune && this.bar == this.nextNoteBar) {
                if (this.millibeat >= this.music.bar[this.bar].note[this.nextNoteNumber].mbTime) {
                    this.onPlayNote.dispatch(this.bar, this.nextNoteNumber, this.music.bar[this.bar].note[this.nextNoteNumber]);
                    if (this.isTuneOn) {
                        this.playChord(this.music.bar[this.bar].note[this.nextNoteNumber].chromaticOffset);
                    }
                    this.nextNoteNumber++;
                    if (this.nextNoteNumber == this.music.bar[this.bar].count) {
                        var foundNext = false;
                        while ((!foundNext) && this.nextNoteBar < this.music.count - 1) {
                            this.nextNoteBar++;
                            this.nextNoteNumber = 0;
                            if (this.music.bar[this.nextNoteBar].count > 0) {
                                foundNext = true;
                            }
                        }
                        if (!foundNext) {
                            this.endOfTune = true;
                        }
                    }
                }
            }
            if (this.millibeat >= 1000) {
                this.millibeat = 0;
                this.bar++;
            }
            var beatMB = Math.round(1000 / this.music.beats);
            if (Math.floor(this.millibeat / beatMB) != Math.floor(oldMillibeat / beatMB) || this.doFirstClick) {
                if (this.isMetronomeOn) {
                    this.metronome.play();
                }
                this.doFirstClick = false;
            }
        }
    };
    MusicPlayer.prototype.moveTo = function (bar, note) {
        this.bar = bar;
        this.millibeat = this.music.bar[bar].note[note].mbTime;
        if (this.bar >= this.music.count) {
            this.endOfTune = true;
            return;
        }
        this.nextNoteBar = bar;
        this.nextNoteNumber = 0;
        var found = false;
        while ((!found) && this.nextNoteBar <= this.music.count) {
            var bn = this.nextNoteBar;
            if (this.music.bar[bn].count > 0) {
                for (var n = 0; n < this.music.bar[bn].count; n++) {
                    if ((!found) && (bn > bar || this.music.bar[bn].note[n].mbTime >= this.millibeat)) {
                        found = true;
                        this.nextNoteNumber = n;
                    }
                }
            }
            if (!found) {
                this.nextNoteBar++;
            }
        }
        this.endOfTune = (!found);
        this.doFirstClick = found;
    };
    MusicPlayer.prototype.playChord = function (offset) {
        for (var v = 0; v < offset.length; v++) {
            if (offset[v] >= 0) {
                var note = this.fretToNote(v, offset[v]);
                this.noteInstance[note].stop();
                this.noteInstance[note].play();
                this.noteInstance[note].volume = this.getStringVolume(v) / 100;
            }
        }
    };
    return MusicPlayer;
}(Phaser.Group));
var ScrollingTabDisplayManager = (function (_super) {
    __extends(ScrollingTabDisplayManager, _super);
    function ScrollingTabDisplayManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScrollingTabDisplayManager.prototype.fitToArea = function () {
        this.tabHeight = Math.floor(this.drawHeight / 4);
        this.tabWidth = Math.floor(this.tabHeight / 2.8);
        var altTabWidth = Math.floor(this.drawWidth / 20);
        var altTabHeight = Math.floor(altTabWidth * 2.8);
        if (Math.floor(this.drawHeight / altTabHeight) > 4) {
            this.tabHeight = altTabHeight;
            this.tabWidth = altTabWidth;
        }
    };
    ScrollingTabDisplayManager.prototype.redrawAll = function () {
        _super.prototype.redrawAll.call(this);
        for (var _i = 0, _a = this.renderer; _i < _a.length; _i++) {
            var renderer = _a[_i];
            renderer.visible = false;
        }
    };
    ScrollingTabDisplayManager.prototype.moveCursor = function (bar, note) {
        this.yScroll = this.yScroll || 0;
        var realYPos = this.renderer[bar].y + this.yScroll;
        var reqScroll = Math.floor(realYPos - this.tabHeight);
        reqScroll = Math.min(reqScroll, this.totalHeight - this.drawHeight);
        reqScroll = Math.max(reqScroll, 0);
        for (var _i = 0, _a = this.renderer; _i < _a.length; _i++) {
            var renderer = _a[_i];
            renderer.y = renderer.y + this.yScroll - reqScroll;
        }
        this.yScroll = reqScroll;
        this.makeVisibleInDisplayArea();
        _super.prototype.moveCursor.call(this, bar, note);
    };
    ScrollingTabDisplayManager.prototype.makeVisibleInDisplayArea = function () {
        for (var _i = 0, _a = this.renderer; _i < _a.length; _i++) {
            var renderer = _a[_i];
            renderer.visible = true;
            if (renderer.y < -2) {
                renderer.visible = false;
            }
            if (renderer.y + this.tabHeight > this.drawHeight) {
                renderer.visible = false;
            }
        }
    };
    return ScrollingTabDisplayManager;
}(StaticTabDisplayManager));
var Bar = (function () {
    function Bar(music, barNumber, beats) {
        this.note = [];
        this.count = 0;
        this.barNumber = barNumber;
        this.beats = beats;
        this.music = music;
    }
    Bar.prototype.updateMillibeatData = function () {
        if (this.count > 0) {
            for (var n = 0; n < this.count; n++) {
                this.note[n].mbTime = Math.floor(1000 / this.beats / 4 * this.note[n].quarterBeatPos);
            }
            for (var n = 0; n < this.count - 1; n++) {
                this.note[n].mbLength = this.note[n + 1].mbTime - this.note[n].mbTime;
            }
            this.note[this.count - 1].mbLength = 1000 - this.note[this.count - 1].mbTime;
        }
    };
    return Bar;
}());
var Music = (function () {
    function Music(data) {
        this.name = data["name"] || "(unknown)";
        this.author = data["author"] || "(unknown)";
        this.beats = data["beats"] || 4;
        this.beatsPerMinute = data["speed"] || 120;
        this.voices = data["voices"] || 3;
        this.tuning = (data["tuning"] || "").toLowerCase();
        this.isDiatonic = (data["diatonic"] || 0) != 0;
        this.capo = data["capo"] || 0;
        this.bar = [];
        this.count = 0;
        for (var _i = 0, _a = data["bars"]; _i < _a.length; _i++) {
            var barDef = _a[_i];
            var b = MusicClassFactory.createBar(this, this.count, this.beats);
            b.load(barDef);
            this.bar[this.count] = b;
            this.count++;
        }
    }
    return Music;
}());
var Note = (function () {
    function Note() {
        this.chromaticOffset = [];
    }
    Note.prototype.toString = function () {
        var s = "";
        for (var n = 0; n < this.chromaticOffset.length; n++) {
            s = s + this.chromaticOffset[n] + ":";
        }
        s = s + "@ " + this.mbTime.toString();
        return s;
    };
    return Note;
}());
Note.QUIET = -1;
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(game, image) {
        var _this = _super.call(this, game) || this;
        _this.onPress = new Phaser.Signal();
        _this.box = game.add.image(0, 0, "sprites", "icon_frame", _this);
        _this.stdSize = _this.game.width / 10;
        _this.box.anchor.setTo(0.5, 0.5);
        _this.box.inputEnabled = true;
        _this.box.events.onInputDown.add(_this.clickHandler, _this);
        _this.icon = game.add.image(0, 0, "sprites", image, _this);
        _this.icon.anchor.setTo(0.5, 0.5);
        _this.resetSize();
        return _this;
    }
    Button.prototype.resetSize = function () {
        this.box.width = this.box.height = this.stdSize;
        this.icon.width = this.icon.height = this.stdSize * 0.75;
    };
    Button.prototype.clickHandler = function () {
        this.onPress.dispatch(this);
        if (!this.game.tweens.isTweening(this)) {
            this.game.add.tween(this).to({ "width": this.width - 10, "height": this.height - 10 }, 50, Phaser.Easing.Bounce.In, true, 0, 0, true);
        }
    };
    Button.prototype.destroy = function () {
        this.onPress = null;
        this.icon = null;
        _super.prototype.destroy.call(this);
    };
    return Button;
}(Phaser.Group));
var ToggleButton = (function (_super) {
    __extends(ToggleButton, _super);
    function ToggleButton(game, onImage, offImage) {
        var _this = _super.call(this, game, onImage) || this;
        _this.onImage = onImage;
        _this.offImage = offImage;
        _this.isOn = true;
        return _this;
    }
    ToggleButton.prototype.clickHandler = function () {
        this.isOn = !this.isOn;
        this.icon.loadTexture("sprites", this.isOn ? this.onImage : this.offImage);
        _super.prototype.clickHandler.call(this);
    };
    return ToggleButton;
}(Button));
var ControlPanel = (function (_super) {
    __extends(ControlPanel, _super);
    function ControlPanel(game, displayManager, player, isVertical) {
        if (isVertical === void 0) { isVertical = false; }
        var _this = _super.call(this, game) || this;
        _this.count = 0;
        _this.manager = displayManager;
        _this.player = player;
        _this.isVertical = isVertical;
        _this.addButton("RST", new Button(game, "i_restart")).onPress.add(function (btn) {
            _this.manager.moveCursor(0, 0);
            _this.player.moveTo(0, 0);
        }, _this);
        _this.addButton("SLO", new Button(game, "i_slower")).onPress.add(function (btn) {
            _this.player.bpsAdjust -= 10;
        }, _this);
        _this.addButton("NRM", new Button(game, "i_normal")).onPress.add(function (btn) {
            _this.player.bpsAdjust = 0;
        }, _this);
        _this.addButton("FST", new Button(game, "i_faster")).onPress.add(function (btn) {
            _this.player.bpsAdjust += 10;
        }, _this);
        _this.addButton("PAU", new ToggleButton(game, "i_stop", "i_play")).onPress.add(function (btn) {
            _this.player.isPaused = !btn.isOn;
        }, _this);
        _this.addButton("MUS", new ToggleButton(game, "i_music_off", "i_music_on")).onPress.add(function (btn) {
            _this.player.isTuneOn = btn.isOn;
        }, _this);
        _this.addButton("MET", new ToggleButton(game, "i_metronome_off", "i_metronome_on")).onPress.add(function (btn) {
            _this.player.isMetronomeOn = btn.isOn;
        }, _this);
        return _this;
    }
    ControlPanel.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.manager = this.player = null;
    };
    ControlPanel.prototype.addButton = function (key, button) {
        button.height = button.width = button.game.width / 16;
        if (this.isVertical) {
            button.x = button.width / 2;
            button.y = (this.count + 0.5) * (button.width + 4);
        }
        else {
            button.x = (this.count + 0.5) * (button.width + 4);
            button.y = button.height / 2;
        }
        this.add(button);
        this.count++;
        return button;
    };
    return ControlPanel;
}(Phaser.Group));
var SetupPhaserInformation = (function () {
    function SetupPhaserInformation() {
    }
    return SetupPhaserInformation;
}());
SetupPhaserInformation.WIDTH = 1600;
SetupPhaserInformation.HEIGHT = 1024;
var MyApplication = (function (_super) {
    __extends(MyApplication, _super);
    function MyApplication() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyApplication.prototype.getMainState = function () {
        return new GameState();
    };
    MyApplication.prototype.addExtraStates = function () {
    };
    return MyApplication;
}(MainApplication));
var MyBootState = (function (_super) {
    __extends(MyBootState, _super);
    function MyBootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyBootState.prototype.preloadInBootState = function (musicName) {
        this.game.load.json("music", musicName);
    };
    return MyBootState;
}(BootState));
var MyPreloadState = (function (_super) {
    __extends(MyPreloadState, _super);
    function MyPreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyPreloadState.prototype.getNoteCount = function () {
        return 37;
    };
    MyPreloadState.prototype.getNoteDirectory = function () {
        return "assets/sounds";
    };
    MyPreloadState.prototype.getFontList = function () {
        return ["font", "7seg"];
    };
    MyPreloadState.prototype.getAudioList = function () {
        return [];
    };
    MyPreloadState.prototype.loadOtherResources = function (musicName) {
    };
    return MyPreloadState;
}(PreloadState));
var MyBar = (function (_super) {
    __extends(MyBar, _super);
    function MyBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyBar.prototype.load = function (defn) {
        var p = 0;
        var qbPos = 0;
        while (p < defn.length) {
            var cc = defn.charCodeAt(p);
            if (cc >= 48 && cc <= 57) {
                qbPos += (cc - 48);
                p = p + 1;
            }
            else {
                var note = new Note();
                for (var s = 0; s < this.music.voices; s++) {
                    note.chromaticOffset[s] = defn.charCodeAt(p) - 65;
                    if (defn.charAt(p) == '-') {
                        note.chromaticOffset[s] = Note.QUIET;
                    }
                    p = p + 1;
                }
                note.quarterBeatPos = qbPos;
                this.note[this.count] = note;
                this.count++;
            }
        }
        this.updateMillibeatData();
    };
    return MyBar;
}(Bar));
var MyPlayer = (function (_super) {
    __extends(MyPlayer, _super);
    function MyPlayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tuning = null;
        return _this;
    }
    MyPlayer.prototype.fretToNote = function (str, fret) {
        if (this.tuning == null) {
            var tuning = this.music.tuning.toLowerCase();
            if (tuning == "dad") {
                tuning = "d0,a0,d1";
            }
            if (tuning == "daa") {
                tuning = "d0,a0,a0";
            }
            this.tuning = [];
            for (var _i = 0, _a = tuning.toLowerCase().split(","); _i < _a.length; _i++) {
                var baseNote = _a[_i];
                var n = MyPlayer.NOTETOINDEX[baseNote.slice(0, -1)];
                n = n + 1 + 12 * parseInt(baseNote.slice(-1), 10);
                this.tuning.push(n);
            }
        }
        return fret + this.tuning[str];
    };
    MyPlayer.prototype.getStringVolume = function (str) {
        return (str == 2 ? 100 : 50);
    };
    return MyPlayer;
}(MusicPlayer));
MyPlayer.NOTETOINDEX = {
    "c": 0, "c#": 1, "d": 2, "d#": 3, "e": 4, "f": 5, "f#": 6, "g": 7, "g#": 8, "a": 9, "a#": 10, "b": 11
};
var MusicClassFactory = (function () {
    function MusicClassFactory() {
    }
    MusicClassFactory.createBar = function (music, barNumber, beats) {
        return new MyBar(music, barNumber, beats);
    };
    MusicClassFactory.createApplication = function () {
        return new MyApplication();
    };
    MusicClassFactory.createBootState = function () {
        return new MyBootState();
    };
    MusicClassFactory.createPreloadState = function () {
        return new MyPreloadState();
    };
    MusicClassFactory.createMusicPlayer = function (game, music, firstNote, lastNote) {
        if (firstNote === void 0) { firstNote = 1; }
        if (lastNote === void 0) { lastNote = PreloadState.NOTE_COUNT; }
        return new MyPlayer(game, music, firstNote, lastNote);
    };
    return MusicClassFactory;
}());
