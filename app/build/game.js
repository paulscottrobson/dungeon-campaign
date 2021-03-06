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
        this.gameInfo = gameInfo;
    };
    GameState.prototype.create = function () {
        var bgr = this.game.add.tileSprite(0, 0, 128, 128, "sprites", "bgrtile");
        bgr.width = this.game.width;
        bgr.height = this.game.height;
        bgr.inputEnabled = true;
        bgr.events.onInputDown.add(this.clickHandler, this);
        this.player = this.gameInfo.player;
        this.playerSprite = this.game.add.sprite(0, 0, "sprites", "player");
        this.statusArea = new Status(this.game);
        this.statusArea.y = 20;
        this.statusArea.x = this.game.width - 20 - this.statusArea.width;
        this.textScroller = new TextScroller(this.game, this.game.width, 250);
        this.textScroller.y = this.game.height - this.textScroller.height;
        this.mazeRenderer = null;
        this.monsterList = [];
        this.moveToLevel(this.gameInfo.currentLevel);
        var m = new TestLevelRenderer(this.game, this.gameInfo.maze.getLevel(0), 200, 200);
        m.x = m.y = 10;
    };
    GameState.prototype.clickHandler = function (object, pointer) {
        this.game.tweens.removeFrom(this.playerSprite);
        this.mazeRenderer.positionObject(this.playerSprite, this.player.cellPos);
        var x = pointer.x - this.mazeRenderer.x;
        var y = pointer.y - this.mazeRenderer.y;
        x = Math.floor(x / GameState.TILESIZE);
        y = Math.floor(y / GameState.TILESIZE);
        var level = this.gameInfo.maze.getLevel(this.gameInfo.currentLevel);
        if (x >= 0 && y >= 0 && x < level.getWidth() && y < level.getHeight()) {
            if (x == this.player.cellPos.x || y == this.player.cellPos.y) {
                var count = Math.abs(x - this.player.cellPos.x) + Math.abs(y - this.player.cellPos.y);
                if (count > 0 && count <= 2) {
                    this.movePlayer(x - this.player.cellPos.x, y - this.player.cellPos.y, count);
                }
                if (count == 0) {
                    this.actionCell(new Pos(x, y));
                }
            }
        }
    };
    GameState.prototype.movePlayer = function (dx, dy, count) {
        if (dx != 0) {
            dx = (dx > 0) ? 1 : -1;
        }
        if (dy != 0) {
            dy = (dy > 0) ? 1 : -1;
        }
        var dir = (dx != 0) ? (dx < 0 ? Direction.LEFT : Direction.RIGHT)
            : (dy < 0 ? Direction.UP : Direction.DOWN);
        var level = this.gameInfo.maze.getLevel(this.gameInfo.currentLevel);
        if (!this.player.isDwarfAlive) {
            if (level.getCell(this.player.cellPos).visibility == Visibility.PRESENCE) {
                level.getCell(this.player.cellPos).visibility = Visibility.HIDDEN;
                this.mazeRenderer.updateCell(this.player.cellPos);
            }
        }
        while (count > 0) {
            count = count - 1;
            var newPos = new Pos(this.player.cellPos.x + dx, this.player.cellPos.y + dy);
            if (level.getCell(newPos).contents == CellContents.ROCK && this.player.isDwarfAlive) {
                this.lightSquare(this.gameInfo.currentLevel, newPos);
            }
            if (level.canMove(this.player.cellPos, dir)) {
                this.player.cellPos.x += dx;
                this.player.cellPos.y += dy;
                if (this.player.isDwarfAlive) {
                    this.lightSquare(this.gameInfo.currentLevel, this.player.cellPos);
                }
                console.log(level.getCell(this.player.cellPos).contents);
            }
        }
        var cellContents = level.getCell(this.player.cellPos).contents;
        this.mazeRenderer.moveObjectTo(this.playerSprite, this.player.cellPos);
        this.warningMessages();
        if (!this.player.isDwarfAlive) {
            if (level.getCell(this.player.cellPos).visibility == Visibility.HIDDEN) {
                level.getCell(this.player.cellPos).visibility = Visibility.PRESENCE;
                this.mazeRenderer.updateCell(this.player.cellPos);
            }
        }
    };
    GameState.prototype.actionCell = function (pos) {
        console.log("Action ", pos.x, pos.y);
    };
    GameState.prototype.addMonster = function (pos, hasTreasure) {
        var m = new Monster(this.game, pos, this.gameInfo.currentLevel);
        this.mazeRenderer.add(m.getSprite());
        this.game.world.bringToTop(m);
        this.monsterList.push(m);
        this.gameInfo.maze.getLevel(this.gameInfo.currentLevel).getCell(pos).contents =
            (hasTreasure ? CellContents.TREASURE : CellContents.NOTHING);
        this.mazeRenderer.updateCell(pos);
        this.mazeRenderer.positionObject(m.getSprite(), m.cellPos);
        this.textScroller.write("You've come upon");
        this.textScroller.write(m.count + " " + m.name);
        this.textScroller.write("Their strength is " + m.strength);
    };
    GameState.prototype.moveToLevel = function (newLevel) {
        if (this.mazeRenderer != null) {
            this.mazeRenderer.destroy();
        }
        for (var _i = 0, _a = this.monsterList; _i < _a.length; _i++) {
            var m = _a[_i];
            m.destroy();
        }
        this.monsterList = [];
        this.mazeRenderer = new Renderer(this.game, GameState.TILESIZE, this.gameInfo.maze.getLevel(newLevel));
        this.mazeRenderer.positionObject(this.playerSprite, this.player.cellPos);
        this.lightSquare(newLevel, this.player.cellPos);
        this.statusArea.setLevel(newLevel + 1);
        this.player.refreshStatus(this.statusArea);
        this.gameInfo.currentLevel = newLevel;
        this.game.world.bringToTop(this.textScroller);
        this.game.world.bringToTop(this.playerSprite);
        this.game.world.bringToTop(this.statusArea);
        this.textScroller.write("Entering level " + (newLevel + 1));
        this.warningMessages();
    };
    GameState.prototype.warningMessages = function () {
        if (this.player.isElfAlive) {
            var searchList = [];
            searchList.push(new Pos(this.player.cellPos.x - 1, this.player.cellPos.y));
            searchList.push(new Pos(this.player.cellPos.x + 1, this.player.cellPos.y));
            searchList.push(new Pos(this.player.cellPos.x, this.player.cellPos.y - 1));
            searchList.push(new Pos(this.player.cellPos.x, this.player.cellPos.y + 1));
            var found = false;
            for (var _i = 0, searchList_1 = searchList; _i < searchList_1.length; _i++) {
                var pos = searchList_1[_i];
                var cell = this.gameInfo.maze.getLevel(this.gameInfo.currentLevel).getCell(pos);
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
    };
    GameState.prototype.lightSquare = function (clevel, pos, makeAlways) {
        if (makeAlways === void 0) { makeAlways = false; }
        var level = this.gameInfo.maze.getLevel(clevel);
        level.getCell(pos).visibility =
            (this.player.isDwarfAlive || makeAlways ? Visibility.PERMANENT :
                Visibility.PRESENCE);
        this.mazeRenderer.updateCell(pos);
    };
    GameState.prototype.destroy = function () {
    };
    GameState.prototype.update = function () {
        this.mazeRenderer.x = -(this.playerSprite.x - this.game.width / 2);
        this.mazeRenderer.y = -(this.playerSprite.y - this.textScroller.y / 2);
        this.player.refreshStatus(this.statusArea);
    };
    return GameState;
}(Phaser.State));
GameState.TILESIZE = 96;
var GameData = (function () {
    function GameData() {
        this.difficulty = 1.0;
        this.size = 8;
        this.levels = 4;
    }
    return GameData;
}());
var StartState = (function (_super) {
    __extends(StartState, _super);
    function StartState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StartState.prototype.init = function (gameInfo) {
        var m = new Maze(gameInfo.size, gameInfo.size, gameInfo.levels, gameInfo.difficulty);
        var gameInfo = new GameData();
        gameInfo.currentLevel = 0;
        gameInfo.maze = m;
        gameInfo.player = new Player(m);
        this.gameInfo = gameInfo;
    };
    StartState.prototype.create = function () {
        this.game.state.start("Play", true, false, this.gameInfo);
    };
    return StartState;
}(Phaser.State));
var Monster = (function () {
    function Monster(game, pos, level) {
        this.cellPos = pos;
        this.name = Monster.MONSTERS[Math.floor(Math.random() * Monster.MONSTERS.length)];
        this.sprite = game.add.sprite(0, 0, "sprites", this.name.replace(" ", ""));
        this.strength = 15 + Math.floor(10 * Math.random()) + (1 + level * 20);
        this.count = Math.floor(19 * Math.random()) + 5;
    }
    Monster.prototype.destroy = function () {
        this.sprite.destroy();
        this.sprite = null;
    };
    Monster.prototype.getSprite = function () {
        return this.sprite;
    };
    return Monster;
}());
Monster.MONSTERS = [
    "lycanthropes", "gargoyles", "balrogs", "vampires", "goblins", "mighty ogres",
    "vicious orcs", "cyclopses", "skeletons", "zombies", "evil trolls", "mummies",
    "huge spiders", "werewolves", "minotaurs", "centaurs", "berserkers", "griffons",
    "basilisks", "gorgons"
];
var Player = (function () {
    function Player(maze) {
        this.strength = 1;
        this.manPower = 15;
        this.treasure = 0;
        this.isElfAlive = this.isDwarfAlive = true;
        this.cellPos = maze.getLevel(0).findEmptySlot();
    }
    Player.prototype.refreshStatus = function (status) {
        status.setDwarf(this.isDwarfAlive);
        status.setElf(this.isElfAlive);
        status.setPartySize(this.manPower);
        status.setStrength(this.strength);
        status.setTreasure(this.treasure);
    };
    return Player;
}());
window.onload = function () {
    var game = new MainApplication();
};
var MainApplication = (function (_super) {
    __extends(MainApplication, _super);
    function MainApplication() {
        var _this = _super.call(this, 640, 960, Phaser.AUTO, "", null, false, false) || this;
        _this.state.add("Boot", new BootState());
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Start", new StartState());
        _this.state.add("Play", new GameState());
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
        var gameInfo = new GameData();
        this.game.load.onLoadComplete.add(function () {
            _this.game.state.start("Start", true, false, gameInfo);
        }, this);
    };
    return PreloadState;
}(Phaser.State));
var Status = (function (_super) {
    __extends(Status, _super);
    function Status(game) {
        var _this = this;
        var spacing = 64;
        var xPos = 32;
        _this = _super.call(this, game) || this;
        _this.level = _this.game.add.bitmapText(0, 0, "font", "level:9", 24, _this);
        _this.level.tint = 0xFFFF00;
        var gfx = _this.game.add.image(xPos, spacing, "sprites", "player", _this);
        gfx.width = gfx.height = spacing;
        gfx.anchor.setTo(0.5);
        _this.count = _this.game.add.bitmapText(xPos * 2.2, spacing, "font", "99", 20, _this);
        _this.count.anchor.setTo(0, 1.3);
        _this.strength = _this.game.add.bitmapText(xPos * 2.2, spacing, "font", "9999", 20, _this);
        _this.strength.anchor.setTo(0, 0);
        _this.count.tint = 0x0080FF;
        _this.strength.tint = 0xFF8000;
        _this.elf = _this.game.add.image(xPos * 2, spacing * 2, "sprites", "elf", _this);
        _this.dwarf = _this.game.add.image(xPos * 3.5, spacing * 2, "sprites", "dwarf", _this);
        _this.elf.width = _this.dwarf.width = spacing * 0.7;
        _this.elf.height = _this.dwarf.height = spacing;
        _this.elf.anchor.setTo(0.5, 0.5);
        _this.dwarf.anchor.setTo(0.5, 0.5);
        _this.setLevel(1);
        _this.setPartySize(15);
        _this.setStrength(1234);
        _this.setDwarf(true);
        _this.setElf(true);
        return _this;
    }
    Status.prototype.setLevel = function (level) {
        this.level.text = "Level:" + level.toString();
    };
    Status.prototype.setPartySize = function (size) {
        this.count.text = size.toString();
    };
    Status.prototype.setStrength = function (strength) {
        this.strength.text = strength.toString();
    };
    Status.prototype.setElf = function (isAlive) {
        this.elf.alpha = isAlive ? 1 : 0.7;
        this.elf.rotation = isAlive ? 0 : -Math.PI / 2;
    };
    Status.prototype.setDwarf = function (isAlive) {
        this.dwarf.alpha = isAlive ? 1 : 0.7;
        this.dwarf.rotation = isAlive ? 0 : Math.PI / 2;
    };
    Status.prototype.setTreasure = function (amount) {
    };
    Status.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.level = this.count = this.elf = this.strength = this.dwarf = null;
    };
    return Status;
}(Phaser.Group));
var TextScroller = (function (_super) {
    __extends(TextScroller, _super);
    function TextScroller(game, width, height) {
        var _this = _super.call(this, game) || this;
        _this.yCursor = 0;
        _this.xCursor = 0;
        _this.speedMod = 0;
        var scr = game.add.image(0, 0, "sprites", "scroll", _this);
        scr.width = width;
        scr.height = height;
        _this.lines = [];
        _this.queue = [];
        for (var n = 0; n < TextScroller.LINES; n++) {
            _this.lines[n] = game.add.bitmapText(width * 0.14, (n + 1) * height / (TextScroller.LINES + 1), "font", "", 22, _this);
            _this.lines[n].tint = 0x000000;
            _this.lines[n].anchor.setTo(0, 0.5);
        }
        _this.xCursor = 0;
        _this.yCursor = 0;
        _this.toWrite = "";
        return _this;
    }
    TextScroller.prototype.write = function (s) {
        this.queue.push(s);
        ;
    };
    TextScroller.prototype.nextLine = function () {
        this.yCursor++;
        if (this.yCursor == TextScroller.LINES) {
            for (var i = 0; i < TextScroller.LINES - 1; i++) {
                this.lines[i].text = this.lines[i + 1].text;
            }
            this.yCursor = TextScroller.LINES - 1;
        }
        this.toWrite = "";
        this.xCursor = 0;
        this.lines[this.yCursor].text = "";
    };
    TextScroller.prototype.update = function () {
        this.speedMod++;
        if (this.speedMod % 4 == 0 && this.xCursor < this.toWrite.length) {
            this.xCursor++;
            this.lines[this.yCursor].text = this.toWrite.slice(0, this.xCursor);
            if (this.xCursor == this.toWrite.length) {
                this.nextLine();
            }
        }
        if (this.xCursor == 0 && this.toWrite == "" && this.queue.length > 0) {
            this.toWrite = this.queue.shift();
        }
    };
    TextScroller.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return TextScroller;
}(Phaser.Group));
TextScroller.LINES = 7;
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
var Visibility;
(function (Visibility) {
    Visibility[Visibility["HIDDEN"] = 0] = "HIDDEN";
    Visibility[Visibility["PERMANENT"] = 1] = "PERMANENT";
    Visibility[Visibility["PRESENCE"] = 2] = "PRESENCE";
})(Visibility || (Visibility = {}));
var Cell = (function () {
    function Cell() {
        this.contents = CellContents.ROCK;
        this.wallDown = true;
        this.wallRight = true;
        this.visibility = Visibility.HIDDEN;
    }
    return Cell;
}());
var CellRenderer = (function (_super) {
    __extends(CellRenderer, _super);
    function CellRenderer(game, cell, cellSize, owner) {
        var _this = _super.call(this, game) || this;
        owner.add(_this);
        _this.cellSize = cellSize;
        _this.floor = game.add.image(0, 0, "sprites", (cell.contents == CellContents.ROCK) ? "rock" : "mazefloor", _this);
        _this.floor.width = _this.floor.height = cellSize;
        _this.floor.visible = false;
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
            _this.downWall.visible = _this.rightWall.visible = false;
            _this.contents = game.add.image(wall / 2, wall / 2, "sprites", "exit", _this);
            _this.contents.width = _this.contents.height = (cellSize - wall);
            _this.contents.visible = false;
        }
        return _this;
    }
    CellRenderer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.floor = this.downWall = this.rightWall = this.contents = null;
    };
    CellRenderer.prototype.updateCellContents = function (cell) {
        this.floor.visible = (cell.visibility != Visibility.HIDDEN);
        if (this.contents != null) {
            this.contents.visible = this.floor.visible;
            this.downWall.visible = cell.wallDown && this.contents.visible;
            this.rightWall.visible = cell.wallRight && this.contents.visible;
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
            }
            else {
                this.contents.visible = false;
            }
        }
    };
    CellRenderer.prototype.setWall = function (dir, isOn) {
        if (this.floor.visible) {
            isOn = true;
        }
        if (dir == Direction.RIGHT && this.rightWall != null) {
            this.rightWall.visible = isOn;
        }
        if (dir == Direction.DOWN && this.downWall != null) {
            this.downWall.visible = isOn;
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
        if (pos.x < 0 || pos.y < 0 || pos.x >= this.width || pos.y >= this.height) {
            return null;
        }
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
        if (dir == Direction.LEFT) {
            return !(this.cells[pos.x - 1][pos.y].wallRight);
        }
        if (dir == Direction.RIGHT) {
            return !(this.cells[pos.x][pos.y].wallRight);
        }
        if (dir == Direction.UP) {
            return !(this.cells[pos.x][pos.y - 1].wallDown);
        }
        if (dir == Direction.DOWN) {
            return !(this.cells[pos.x][pos.y].wallDown);
        }
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
                var cr = new CellRenderer(_this.game, _this.level.getCell(p), cellSize, _this);
                cr.x = x * cellSize;
                cr.y = y * cellSize;
                _this.cellRenderers[x][y] = cr;
                _this.add(cr);
            }
        }
        for (var x = -1; x <= level.getWidth(); x++) {
            _this.addFrame(x, -1);
            _this.addFrame(x, level.getHeight());
        }
        for (var y = 0; y < level.getHeight(); y++) {
            _this.addFrame(-1, y);
            _this.addFrame(level.getWidth(), y);
        }
        for (var x = level.getWidth() - 1; x >= 0; x--) {
            for (var y = level.getHeight() - 1; y >= 0; y--) {
                level.getCell(new Pos(x, y)).visibility = Visibility.PERMANENT;
                _this.updateCell(new Pos(x, y));
                ;
            }
        }
        return _this;
    }
    Renderer.prototype.addFrame = function (x, y) {
        var frame = this.game.add.image(x * this.cellSize, y * this.cellSize, "sprites", "frame", this);
        frame.width = frame.height = this.cellSize;
    };
    Renderer.prototype.updateCell = function (pos) {
        this.cellRenderers[pos.x][pos.y].updateCellContents(this.level.getCell(pos));
        var isOn = this.level.getCell(pos).visibility != Visibility.HIDDEN;
        if (pos.x > 0) {
            var p1 = new Pos(pos.x - 1, pos.y);
            if (this.level.getCell(p1).wallRight) {
                this.cellRenderers[p1.x][p1.y].setWall(Direction.RIGHT, isOn);
            }
        }
        if (pos.y > 0) {
            var p1 = new Pos(pos.x, pos.y - 1);
            if (this.level.getCell(p1).wallDown) {
                this.cellRenderers[p1.x][p1.y].setWall(Direction.DOWN, isOn);
            }
        }
    };
    Renderer.prototype.positionObject = function (obj, cellPos) {
        this.add(obj);
        obj.anchor.setTo(0.5, 0.5);
        obj.width = obj.height = this.cellSize * 3 / 4;
        obj.x = (cellPos.x + 0.5) * this.cellSize;
        obj.y = (cellPos.y + 0.5) * this.cellSize;
    };
    Renderer.prototype.moveObjectTo = function (obj, cellPos) {
        var x1 = (cellPos.x + 0.5) * this.cellSize;
        var y1 = (cellPos.y + 0.5) * this.cellSize;
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
                        s = "balrogs";
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
