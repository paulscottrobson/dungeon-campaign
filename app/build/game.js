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
    GameState.prototype.init = function (gameInfo) {
        this.difficulty = gameInfo.difficulty;
        this.maze = new Maze(gameInfo["size"] || 13, gameInfo["size"] || 13, gameInfo["levels"] || 4);
        console.log(this.difficulty);
        console.log(gameInfo);
        console.log(this.maze.toString());
    };
    GameState.prototype.create = function () {
        var bgr = this.game.add.image(0, 0, "sprites", "rock");
    };
    GameState.prototype.destroy = function () {
    };
    GameState.prototype.update = function () {
    };
    return GameState;
}(Phaser.State));
window.onload = function () {
    var game = new MainApplication();
};
var MainApplication = (function (_super) {
    __extends(MainApplication, _super);
    function MainApplication() {
        var _this = _super.call(this, 640, 960, Phaser.AUTO, "", null, false, false) || this;
        _this.state.add("Boot", new BootState());
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Main", new GameState());
        _this.state.start("Boot");
        return _this;
    }
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
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Preload", true, false, 1); }, this);
    };
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
        this.game.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
        for (var _i = 0, _a = []; _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        for (var _b = 0, _c = []; _b < _c.length; _b++) {
            var audioName = _c[_b];
            this.game.load.audio(audioName, ["assets/sounds/" + audioName + ".mp3",
                "assets/sounds/" + audioName + ".ogg"]);
        }
        var info = { "difficulty": 1.0, "size": 8, "levels": 4 };
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false, info); }, this);
    };
    return PreloadState;
}(Phaser.State));
var CellContents;
(function (CellContents) {
    CellContents[CellContents["NOTHING"] = 0] = "NOTHING";
    CellContents[CellContents["ROCK"] = 1] = "ROCK";
    CellContents[CellContents["STAIRSUP"] = 2] = "STAIRSUP";
    CellContents[CellContents["STAIRSDOWN"] = 3] = "STAIRSDOWN";
    CellContents[CellContents["EXIT"] = 4] = "EXIT";
})(CellContents || (CellContents = {}));
var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["UP"] = 2] = "UP";
    Direction[Direction["DOWN"] = 3] = "DOWN";
})(Direction || (Direction = {}));
var Cell = (function () {
    function Cell() {
        this.contents = CellContents.ROCK;
        this.wallDown = true;
        this.wallRight = true;
    }
    return Cell;
}());
var BaseLevel = (function () {
    function BaseLevel(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];
        for (var n = 0; n < this.width; n++) {
            this.cells[n] = [];
            for (var m = 0; m < this.height; m++) {
                this.cells[n][m] = new Cell();
            }
        }
        var pos = new Pos(Math.floor(width / 2), Math.floor(height / 2));
        this.cells[pos.x][pos.y].contents = CellContents.NOTHING;
        var count = (width - 2) * (height - 2);
        this.dump();
    }
    BaseLevel.prototype.getWidth = function () {
        return this.width;
    };
    BaseLevel.prototype.getHeight = function () {
        return this.height;
    };
    BaseLevel.prototype.getCell = function (pos) {
        return this.cells[pos.x][pos.y];
    };
    BaseLevel.prototype.canMove = function (pos, dir) {
        if (pos.x == 0 && dir == Direction.LEFT) {
            return false;
        }
        if (pos.y == 0 && dir == Direction.UP) {
            return false;
        }
        console.log("TODO:CANMOVE NOT IMPLEMENTED");
        return false;
    };
    BaseLevel.prototype.dump = function () {
        for (var y = 0; y < this.getHeight(); y++) {
            var s1 = "";
            var s2 = "";
            for (var x = 0; x < this.getWidth(); x++) {
                s1 = s1 + (" RUDX".charAt(this.cells[x][y].contents));
                s1 = s1 + ((this.cells[x][y].wallRight) ? "|" : " ");
                if (this.cells[x][y].wallDown) {
                    s2 = s2 + "-" + ((this.cells[x][y].wallRight) ? "+" : "-");
                }
                else {
                    s2 = s2 + " " + (s1.slice(-1));
                }
            }
            console.log("[" + s1 + "]");
            console.log("[" + s2 + "]");
        }
    };
    return BaseLevel;
}());
var Maze = (function () {
    function Maze(mazeWidth, mazeHeight, levels) {
        this.levels = [];
        this.levels.push(new BaseLevel(mazeWidth, mazeHeight));
    }
    Maze.prototype.getLevelCount = function () {
        return this.levels.length;
    };
    Maze.prototype.getLevel = function (i) {
        return this.levels[i];
    };
    return Maze;
}());
var Pos = (function () {
    function Pos(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Pos;
}());
