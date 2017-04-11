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
        this.maze = new Maze(gameInfo["size"] || 13, gameInfo["size"] || 13, gameInfo["levels"] || 4, gameInfo["difficulty"] || 1);
    };
    GameState.prototype.create = function () {
        var bgr = this.game.add.tileSprite(0, 0, 128, 128, "sprites", "bgrtile");
        bgr.width = this.game.width;
        bgr.height = this.game.height;
        this.rend = new Renderer(this.game, 96, this.maze.getLevel(0));
        this.rend.x = -55;
        this.rend.y = -55;
        this.player = this.game.add.image(0, 0, "sprites", "player");
        this.rend.positionObject(this.player, new Pos(2, 1));
        this.rend.moveObjectTo(this.player, new Pos(6, 7));
        var r = new TestLevelRenderer(this.game, this.maze.getLevel(0), 200, 200);
        r.x = 630 - r.width;
        r.y = 950 - r.height;
        console.log(this.rend.x, this.rend.y);
    };
    GameState.prototype.destroy = function () {
    };
    GameState.prototype.update = function () {
        this.rend.x = -(this.player.x - this.game.width / 2);
        this.rend.y = -(this.player.y - this.game.height / 2);
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
        for (var _i = 0, _a = ["font"]; _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        for (var _b = 0, _c = []; _b < _c.length; _b++) {
            var audioName = _c[_b];
            this.game.load.audio(audioName, ["assets/sounds/" + audioName + ".mp3",
                "assets/sounds/" + audioName + ".ogg"]);
        }
        var info = { "difficulty": 1.0, "size": 10, "levels": 4 };
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
    CellContents[CellContents["TREASURE"] = 5] = "TREASURE";
    CellContents[CellContents["MONSTER"] = 6] = "MONSTER";
    CellContents[CellContents["MONSTERTREASURE"] = 7] = "MONSTERTREASURE";
    CellContents[CellContents["NECROMANCER"] = 8] = "NECROMANCER";
    CellContents[CellContents["PIT"] = 9] = "PIT";
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
        this.visited = false;
    }
    return Cell;
}());
var CellRenderer = (function (_super) {
    __extends(CellRenderer, _super);
    function CellRenderer(game, cell, cellSize, owner) {
        var _this = _super.call(this, game) || this;
        owner.add(_this);
        _this.cellSize = cellSize;
        var floor = game.add.image(0, 0, "sprites", (cell.contents == CellContents.ROCK) ? "rock" : "mazefloor", _this);
        floor.width = floor.height = cellSize;
        if (cell.contents != CellContents.ROCK) {
            var wall = cellSize / 4;
            _this.downWall = game.add.image(0, cellSize, "sprites", "wall", _this);
            _this.downWall.width = cellSize;
            _this.downWall.height = wall;
            _this.downWall.anchor.setTo(0, 0.5);
            _this.rightWall = game.add.image(cellSize, 0, "sprites", "wall", _this);
            _this.rightWall.width = cellSize;
            _this.rightWall.height = wall;
            _this.rightWall.anchor.setTo(0, 0.5);
            _this.rightWall.rotation = Math.PI / 2;
            _this.contents = game.add.image(wall / 2, wall / 2, "sprites", "exit", _this);
            _this.contents.width = _this.contents.height = (cellSize - wall);
        }
        return _this;
    }
    CellRenderer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.downWall = this.rightWall = this.contents = null;
    };
    CellRenderer.prototype.updateCell = function (cell) {
        this.visible = cell.visited;
        if (this.downWall != null && cell.visited) {
            this.downWall.visible = cell.wallDown;
            this.rightWall.visible = cell.wallRight;
            var sc = "";
            if (cell.contents == CellContents.EXIT) {
                sc = "exit";
            }
            if (cell.contents == CellContents.PIT) {
                sc = "pit";
            }
            if (cell.contents == CellContents.STAIRSDOWN) {
                sc = "stairsd";
            }
            if (cell.contents == CellContents.STAIRSUP) {
                sc = "stairsu";
            }
            if (cell.contents == CellContents.TREASURE) {
                sc = "treasure";
            }
            if (sc != "") {
                this.contents.loadTexture("sprites", sc);
                this.contents.visible = true;
            }
            else {
                this.contents.visible = false;
            }
        }
    };
    return CellRenderer;
}(Phaser.Group));
var BaseLevel = (function () {
    function BaseLevel(width, height, difficulty) {
        this.width = width;
        this.height = height;
        this.cells = [];
        for (var n = 0; n < this.width; n++) {
            this.cells[n] = [];
            for (var m = 0; m < this.height; m++) {
                this.cells[n][m] = new Cell();
            }
        }
        var pos = new Pos(Math.floor(Math.random() * width), Math.floor(Math.random() * height));
        this.cells[pos.x][pos.y].contents = CellContents.NOTHING;
        var count = width * height * 11 / 13;
        var done = 1000;
        while (count > 0 || done-- == 0) {
            if (this.openOne(pos))
                count--;
        }
        count = Math.round(5 * width * height / 169 / difficulty);
        var initCount = count;
        while (count-- > 0) {
            this.squareRoom(count >= Math.floor(initCount * 2 / 5));
        }
        for (var n = 0; n < Math.round(4 * width * height * difficulty / 169) + 1; n++) {
            var pos = this.findEmptySlot();
            this.cells[pos.x][pos.y].contents =
                (n == 0 ? CellContents.MONSTERTREASURE : CellContents.MONSTER);
        }
        for (var n = 0; n < Math.round(1 * width * height * difficulty / 169) + 1; n++) {
            var pos = this.findEmptySlot();
            this.cells[pos.x][pos.y].contents = CellContents.NECROMANCER;
        }
    }
    BaseLevel.prototype.openOne = function (pos) {
        var canMove = [false, false, false, false];
        if (pos.x > 0) {
            canMove[Direction.LEFT] = (this.cells[pos.x - 1][pos.y].contents == CellContents.ROCK);
        }
        if (pos.x < this.getWidth() - 1) {
            canMove[Direction.RIGHT] = (this.cells[pos.x + 1][pos.y].contents == CellContents.ROCK);
        }
        if (pos.y > 0) {
            canMove[Direction.UP] = (this.cells[pos.x][pos.y - 1].contents == CellContents.ROCK);
        }
        if (pos.y < this.getHeight() - 1) {
            canMove[Direction.DOWN] = (this.cells[pos.x][pos.y + 1].contents == CellContents.ROCK);
        }
        var countOpen = 0;
        for (var _i = 0, canMove_1 = canMove; _i < canMove_1.length; _i++) {
            var b = canMove_1[_i];
            if (b) {
                countOpen++;
            }
        }
        if ((countOpen < 3 && Math.random() < 0.2) || countOpen == 0) {
            do {
                pos.x = Math.floor(Math.random() * this.getWidth());
                pos.y = Math.floor(Math.random() * this.getHeight());
            } while (this.cells[pos.x][pos.y].contents == CellContents.ROCK);
            return false;
        }
        var direction = Math.floor(Math.random() * 4);
        while (!canMove[direction]) {
            direction = Math.floor(Math.random() * 4);
        }
        if (direction == Direction.LEFT) {
            this.cells[pos.x - 1][pos.y].wallRight = false;
        }
        if (direction == Direction.RIGHT) {
            this.cells[pos.x][pos.y].wallRight = false;
        }
        if (direction == Direction.UP) {
            this.cells[pos.x][pos.y - 1].wallDown = false;
        }
        if (direction == Direction.DOWN) {
            this.cells[pos.x][pos.y].wallDown = false;
        }
        pos.move(direction);
        this.cells[pos.x][pos.y].contents = CellContents.NOTHING;
        return true;
    };
    BaseLevel.prototype.squareRoom = function (hasTreasure) {
        var x;
        var y;
        do {
            x = Math.floor(Math.random() * (this.width - 1));
            y = Math.floor(Math.random() * (this.height - 1));
        } while (this.cells[x][y].contents != CellContents.NOTHING ||
            this.cells[x + 1][y].contents != CellContents.NOTHING ||
            this.cells[x][y + 1].contents != CellContents.NOTHING ||
            this.cells[x + 1][y + 1].contents != CellContents.NOTHING);
        this.cells[x][y].wallRight = this.cells[x][y].wallDown = false;
        this.cells[x + 1][y].wallDown = this.cells[x][y + 1].wallRight = false;
        if (hasTreasure) {
            if (Math.random() < 0.5) {
                x++;
            }
            if (Math.random() < 0.5) {
                y++;
            }
            this.cells[x][y].contents = CellContents.TREASURE;
        }
    };
    BaseLevel.prototype.findEmptySlot = function () {
        var p = new Pos();
        do {
            p.x = Math.floor(Math.random() * this.width);
            p.y = Math.floor(Math.random() * this.height);
        } while (this.cells[p.x][p.y].contents != CellContents.NOTHING);
        return p;
    };
    BaseLevel.prototype.getWidth = function () {
        return this.width;
    };
    BaseLevel.prototype.getHeight = function () {
        return this.height;
    };
    BaseLevel.prototype.getCell = function (pos) {
        return this.cells[pos.x][pos.y];
    };
    BaseLevel.prototype.setCell = function (pos, item) {
        this.cells[pos.x][pos.y].contents = item;
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
    return BaseLevel;
}());
var BottomLevel = (function (_super) {
    __extends(BottomLevel, _super);
    function BottomLevel(width, height, difficulty) {
        var _this = _super.call(this, width, height, difficulty) || this;
        var x;
        var y;
        do {
            if (Math.random() < 0.5) {
                x = Math.floor(Math.random() * _this.width);
                y = (Math.random() < 0.5 ? 0 : _this.height - 1);
            }
            else {
                x = (Math.random() < 0.5 ? 0 : _this.width - 1);
                y = Math.floor(Math.random() * _this.height);
            }
        } while (_this.cells[x][y].contents != CellContents.NOTHING);
        _this.cells[x][y].contents = CellContents.EXIT;
        return _this;
    }
    return BottomLevel;
}(BaseLevel));
var Maze = (function () {
    function Maze(mazeWidth, mazeHeight, levels, difficulty) {
        this.levels = [];
        this.levels.push(new BaseLevel(mazeWidth, mazeHeight, difficulty));
        this.levels.push(new BaseLevel(mazeWidth, mazeHeight, difficulty));
        this.levels.push(new BottomLevel(mazeWidth, mazeHeight, difficulty));
        for (var level = 0; level < this.getLevelCount(); level++) {
            for (var i = 0; i < 1 + Math.round(1 + mazeWidth * mazeHeight / 169 * difficulty); i++) {
                var pos = this.findConnectingPoint(level);
                this.getLevel(level).setCell(pos, CellContents.PIT);
            }
            if (level < this.getLevelCount() - 1) {
                for (var i = 0; i < 1 + Math.round(1 + mazeWidth * mazeHeight / 169 / difficulty); i++) {
                    var pos = this.findConnectingPoint(level);
                    this.getLevel(level).setCell(pos, CellContents.STAIRSDOWN);
                    this.getLevel(level + 1).setCell(pos, CellContents.STAIRSUP);
                }
            }
        }
    }
    Maze.prototype.findConnectingPoint = function (level) {
        if (level == this.getLevelCount() - 1) {
            return this.getLevel(level).findEmptySlot();
        }
        var ok = false;
        var pos;
        while (!ok) {
            pos = this.getLevel(level).findEmptySlot();
            ok = true;
            if (pos.x >= this.getLevel(level + 1).getWidth()) {
                ok = false;
            }
            if (pos.y >= this.getLevel(level + 1).getHeight()) {
                ok = false;
            }
            if (ok) {
                if (this.getLevel(level + 1).getCell(pos).contents != CellContents.NOTHING) {
                    ok = false;
                }
            }
        }
        return pos;
    };
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
    Pos.prototype.move = function (dir) {
        if (dir == Direction.UP) {
            this.y--;
        }
        if (dir == Direction.DOWN) {
            this.y++;
        }
        if (dir == Direction.LEFT) {
            this.x--;
        }
        if (dir == Direction.RIGHT) {
            this.x++;
        }
    };
    return Pos;
}());
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer(game, cellSize, level) {
        var _this = _super.call(this, game) || this;
        _this.cellSize = cellSize;
        _this.level = level;
        _this.cellRenderers = [];
        for (var x = level.getWidth() - 1; x >= 0; x--) {
            _this.cellRenderers[x] = [];
            for (var y = level.getHeight() - 1; y >= 0; y--) {
                var p = new Pos(x, y);
                _this.level.getCell(p).visited = true;
                var cr = new CellRenderer(_this.game, _this.level.getCell(p), cellSize, _this);
                cr.x = x * cellSize;
                cr.y = y * cellSize;
                _this.cellRenderers[x][y] = cr;
                _this.updateCell(p);
                _this.add(cr);
            }
        }
        return _this;
    }
    Renderer.prototype.updateCell = function (pos) {
        this.cellRenderers[pos.x][pos.y].updateCell(this.level.getCell(pos));
    };
    Renderer.prototype.positionObject = function (obj, pos) {
        this.add(obj);
        obj.bringToTop();
        obj.anchor.setTo(0.5, 0.5);
        obj.x = (pos.x + 0.5) * this.cellSize;
        obj.y = (pos.y + 0.5) * this.cellSize;
        obj.width = obj.height = this.cellSize * 3 / 4;
    };
    Renderer.prototype.moveObjectTo = function (obj, pos) {
        var x1 = (pos.x + 0.5) * this.cellSize;
        var y1 = (pos.y + 0.5) * this.cellSize;
        this.game.add.tween(obj).to({ x: x1, y: y1 }, (Math.abs(x1 - obj.x) + Math.abs(y1 - obj.y)) * 2, Phaser.Easing.Default, true);
    };
    Renderer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.level = null;
        this.cellRenderers = null;
    };
    return Renderer;
}(Phaser.Group));
var TestLevelRenderer = (function (_super) {
    __extends(TestLevelRenderer, _super);
    function TestLevelRenderer(game, level, width, height) {
        var _this = _super.call(this, game) || this;
        var bgr = game.add.image(0, 0, "sprites", "rectangle", _this);
        bgr.width = width;
        bgr.height = height;
        bgr.tint = 0x444444;
        for (var xc = 0; xc < level.getWidth(); xc++) {
            for (var yc = 0; yc < level.getHeight(); yc++) {
                var cell = level.getCell(new Pos(xc, yc));
                if (cell.contents != CellContents.ROCK) {
                    var x = width * xc / level.getWidth();
                    var y = height * yc / level.getHeight();
                    var w = (width * (xc + 1) / level.getWidth()) - x;
                    var h = (height * (yc + 1) / level.getHeight()) - y;
                    var floor = game.add.image(x + 1, y + 1, "sprites", "rectangle", _this);
                    floor.width = w - 2;
                    floor.height = h - 2;
                    floor.tint = 0xA0522D;
                    var s = "";
                    if (cell.contents == CellContents.TREASURE) {
                        s = "treasure";
                    }
                    if (cell.contents == CellContents.EXIT) {
                        s = "exit";
                    }
                    if (cell.contents == CellContents.PIT) {
                        s = "pit";
                    }
                    if (cell.contents == CellContents.STAIRSUP) {
                        s = "stairsu";
                    }
                    if (cell.contents == CellContents.STAIRSDOWN) {
                        s = "stairsd";
                    }
                    if (cell.contents == CellContents.NECROMANCER) {
                        s = "balrog";
                    }
                    if (cell.contents == CellContents.MONSTERTREASURE || cell.contents == CellContents.MONSTER)
                        s = "dragon";
                    if (s != "") {
                        var cont = game.add.image(x + w / 2, y + h / 2, "sprites", s, _this);
                        cont.anchor.setTo(0.5, 0.5);
                        cont.width = w * 3 / 4;
                        cont.height = h * 3 / 4;
                    }
                    if (cell.wallDown) {
                        var w1 = game.add.image(x, y + h, "sprites", "rectangle", _this);
                        w1.width = w;
                        w1.height = 8;
                        w1.anchor.setTo(0, 1);
                        w1.tint = 0xFF8000;
                    }
                    if (cell.wallRight) {
                        var w2 = game.add.image(x + w, y, "sprites", "rectangle", _this);
                        w2.width = 8;
                        w2.height = h;
                        w2.anchor.setTo(1, 0);
                        w2.tint = 0x0080FF;
                    }
                }
            }
        }
        return _this;
    }
    return TestLevelRenderer;
}(Phaser.Group));
