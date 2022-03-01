var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Int2 = /** @class */ (function () {
    function Int2(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    return Int2;
}());
var Int3 = /** @class */ (function () {
    function Int3(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
    Int3.prototype.add = function (other) {
        return new Int3(this.x + other.x, this.y + other.y, this.z + other.z);
    };
    Int3.prototype.mlt = function (a) {
        return new Int3(this.x * a, this.y * a, this.z * a);
    };
    return Int3;
}());
var Color = /** @class */ (function () {
    function Color(_r, _g, _b) {
        this.r = _r;
        this.g = _g;
        this.b = _b;
    }
    return Color;
}());
var Pos3D = /** @class */ (function () {
    function Pos3D(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
    return Pos3D;
}());
var Object3D = /** @class */ (function (_super) {
    __extends(Object3D, _super);
    function Object3D(_x, _y, _z, _index) {
        var _this = _super.call(this, _x, _y, _z) || this;
        _this.index = _index;
        return _this;
    }
    Object3D.prototype.rotate = function (rotZ, rotY) {
        var newX, newY, newZ;
        newX = this.x * Math.cos(rotZ) - this.y * Math.sin(rotZ);
        newY = this.x * Math.sin(rotZ) + this.y * Math.cos(rotZ);
        this.x = newX;
        this.y = newY;
        rotY = -rotY;
        newZ = this.z * Math.cos(rotY) - this.x * Math.sin(rotY);
        newX = this.z * Math.sin(rotY) + this.x * Math.cos(rotY);
        this.z = newZ;
        this.x = newX;
    };
    return Object3D;
}(Pos3D));
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell(_x, _y, _z, _index) {
        var _this = _super.call(this, _x, _y, _z, _index) || this;
        _this.neighbors = 0;
        _this.color = new Color(0, 0, 0);
        _this.danger = false;
        _this.demined = false;
        _this.flag = false;
        _this.label = "";
        return _this;
    }
    return Cell;
}(Object3D));
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller(_x, _y, _z, _index, _color) {
        var _this = _super.call(this, _x, _y, _z, _index) || this;
        _this.color = _color;
        return _this;
    }
    return Controller;
}(Object3D));
var GameArea = /** @class */ (function () {
    function GameArea() {
        this.canvas = new Int2(800, 800);
    }
    return GameArea;
}());
var Mouse = /** @class */ (function () {
    function Mouse() {
        this.downPos = new Int2(0, 0);
        this.escapePos = new Int2(0, 0);
        this.updatePos = new Int2(0, 0);
        this.upPos = new Int2(0, 0);
        this.is_down = false;
        this.is_longPress = false;
        this.is_init = false;
        this.is_leftClick = false;
    }
    return Mouse;
}());
var GameManager = /** @class */ (function () {
    function GameManager() {
        this.cursor = new Int3(2, 2, 2);
        this.size = new Int3(6, 6, 6);
        this.volume = 6 * 6 * 6;
        this.mines = 10;
        this.rotZ = 0;
        this.rotY = 0;
        this.lightSource = new Int3(800, 0, 0);
        this.cellSize = 20;
        this.gameclear = false;
        this.gameover = false;
        this.startTime = 0;
        this.endTime = 0;
    }
    return GameManager;
}());
var gameArea = new GameArea();
var mouse = new Mouse();
var gameManager = new GameManager();
//let canvas, ctx,
var fixedPlane = "x", date = 0, spotLight = false;
var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
canvas.width = gameArea.canvas.x;
canvas.height = gameArea.canvas.y;
ctx.fillStyle = "rgb(0, 0, 0)";
ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(0, 0, canvas.width, canvas.height);
var cellIndexList = [];
var cellList = [];
var controllerList = [];
var neighborList = [];
var haloList = [];
for (var i = -2; i < 3; ++i) {
    for (var j = -2; j < 3; ++j) {
        for (var k = -2; k < 3; ++k) {
            if (-1 <= i && i <= 1
                && -1 <= j && j <= 1
                && -1 <= k && k <= 1) {
                if (!(i == 0 && j == 0 && k == 0)) {
                    neighborList.push(new Int3(i, j, k));
                }
            }
            else {
                haloList.push(new Int3(i, j, k));
            }
        }
    }
}
gameInitialize();
function cellIndexListInitialize() {
    cellIndexList = [];
    for (var i = 0; i < gameManager.size.x; ++i) {
        for (var j = 0; j < gameManager.size.y; ++j) {
            for (var k = 0; k < gameManager.size.z; ++k) {
                cellIndexList.push(new Int3(i, j, k));
            }
        }
    }
}
function controllerListInitialize() {
    controllerList = [];
    for (var i = 0; i < 2; ++i) {
        var sgn = 2 * i - 1;
        controllerList.push(new Controller(100 * sgn, 0, 0, new Int3(sgn, 0, 0), new Color(200 * i, 100, 100)));
        controllerList.push(new Controller(0, 100 * sgn, 0, new Int3(0, sgn, 0), new Color(100, 200 * i, 100)));
        controllerList.push(new Controller(0, 0, 100 * sgn, new Int3(0, 0, sgn), new Color(100, 100, 200 * i)));
    }
}
function cellListInitialize() {
    cellList = Array(gameManager.size.x);
    for (var i = 0; i < gameManager.size.x; ++i) {
        cellList[i] = Array(gameManager.size.y);
        for (var j = 0; j < gameManager.size.y; ++j) {
            cellList[i][j] = Array(gameManager.size.z);
            for (var k = 0; k < gameManager.size.z; ++k) {
                cellList[i][j][k] = new Cell(50 * (i - (gameManager.size.x - 1) / 2), 50 * (j - (gameManager.size.y - 1) / 2), 50 * (k - (gameManager.size.z - 1) / 2), new Int3(i, j, k));
            }
        }
    }
    cellIndexListInitialize();
    dangerInitialize();
    for (var i = 0; i < cellIndexList.length; ++i) {
        var p = cellIndexList[i];
        var neighbors = count(p);
        cellList[p.x][p.y][p.z].neighbors = neighbors;
        cellList[p.x][p.y][p.z].color = cellColor(neighbors);
        cellList[p.x][p.y][p.z].label = (cellList[p.x][p.y][p.z].danger)
            ? "b"
            : String(neighbors);
    }
}
function flagCounter() {
    var x = 0;
    for (var i = 0; i < cellIndexList.length; ++i) {
        var p = cellIndexList[i];
        if (cellList[p.x][p.y][p.z].flag
            && !cellList[p.x][p.y][p.z].demined) {
            x++;
        }
    }
    return x;
}
function modeChange(m) {
    switch (m) {
        case "easy":
            gameManager.size = new Int3(6, 6, 6);
            gameManager.volume = 6 * 6 * 6;
            gameManager.mines = 10;
            break;
        case "normal":
            gameManager.size = new Int3(8, 8, 8);
            gameManager.volume = 8 * 8 * 8;
            gameManager.mines = 40;
            break;
        case "hard":
            gameManager.size = new Int3(10, 10, 10);
            gameManager.volume = 1000;
            gameManager.mines = 99;
            break;
        default:
            break;
    }
    gameInitialize();
}
function cellColor(x) {
    var R = (function () {
        switch (x % 3) {
            case 0:
                return 0x11;
            case 1:
                return 0x55;
            case 2:
                return 0x99;
            default:
                return 0;
        }
    })();
    var G = (function () {
        switch (Math.floor(x / 2) % 3) {
            case 0:
                return 0x44;
            case 1:
                return 0x88;
            case 2:
                return 0xcc;
            default:
                return 0;
        }
    })();
    var B = (function () {
        switch (Math.floor(x / 3) % 3) {
            case 0:
                return 0x77;
            case 1:
                return 0xbb;
            case 2:
                return 0xff;
            default:
                return 0;
        }
    })();
    return new Color(R, G, B);
}
function gameClearJudge() {
    var counter = 0;
    for (var i = 0; i < cellIndexList.length; ++i) {
        var p = cellIndexList[i];
        if (cellList[p.x][p.y][p.z].demined) {
            counter++;
        }
    }
    if (counter == (gameManager.volume - gameManager.mines)) {
        gameManager.gameclear = true;
        gameManager.gameover = true;
        mouse.is_init = false;
    }
    if (gameManager.gameclear) {
        console.log("game clear");
    }
}
function gameInitialize() {
    gameManager.gameover = false;
    gameManager.gameclear = false;
    mouse.is_init = false;
    mouse.downPos = new Int2(0, 0);
    mouse.updatePos = new Int2(0, 0);
    mouse.upPos = new Int2(0, 0);
    gameManager.cursor = new Int3(3, 3, 3);
    gameManager.startTime = 0;
    gameManager.endTime = 0;
    controllerListInitialize();
    cellListInitialize();
    gameDisplay();
}
function dangerInitialize() {
    var mineIndex = [];
    var newIntFlag = true;
    while (mineIndex.length < gameManager.mines) {
        var rand = Math.floor(Math.random() * gameManager.volume);
        newIntFlag = true;
        for (var i = 0; i < mineIndex.length; ++i) {
            if (mineIndex[i] == rand) {
                newIntFlag = false;
                break;
            }
        }
        if (newIntFlag) {
            mineIndex.push(rand);
        }
    }
    for (var i = 0; i < gameManager.mines; ++i) {
        var p = cellIndexList[mineIndex[i]];
        cellList[p.x][p.y][p.z].danger = true;
    }
}
function is_inBoard(p) {
    if (p.x >= 0 && p.x < gameManager.size.x
        && p.y >= 0 && p.y < gameManager.size.y
        && p.z >= 0 && p.z < gameManager.size.z) {
        return true;
    }
    else {
        return false;
    }
}
function demine(p) {
    for (var i = 0; i < neighborList.length; ++i) {
        demine_internal(p.add(neighborList[i]));
    }
}
function demine_internal(p) {
    if (is_inBoard(p)
        && !cellList[p.x][p.y][p.z].demined) {
        cellList[p.x][p.y][p.z].demined = true;
        if (is_safe(p)) {
            demine(p);
        }
    }
    return;
}
function is_safe(p) {
    var ans = true;
    for (var i = 0; i < neighborList.length; ++i) {
        ans = ans && is_safe_internal(p.add(neighborList[i]));
    }
    return ans;
}
function is_safe_internal(p) {
    if (!is_inBoard(p)) {
        return true;
    }
    else {
        if (cellList[p.x][p.y][p.z].danger) {
            return false;
        }
        else {
            return true;
        }
    }
}
function count(p) {
    var sum = 0;
    for (var i = 0; i < neighborList.length; ++i) {
        sum += count_internal(p.add(neighborList[i]));
    }
    return sum;
}
function count_internal(p) {
    if (!is_inBoard(p)) {
        return 0;
    }
    else {
        return cellList[p.x][p.y][p.z].danger
            ? 1 : 0;
    }
}
function sortList(list) {
    for (var i = 0; i < list.length; ++i) {
        for (var j = 0; j < list.length; ++j) {
            if (list[i].x < list[j].x) {
                var t = list[i];
                list[i] = list[j];
                list[j] = t;
            }
        }
    }
    return list;
}
function gameDisplay() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var cellList_line = [];
    for (var i = 0; i < gameManager.size.x; ++i) {
        for (var j = 0; j < gameManager.size.y; ++j) {
            for (var k = 0; k < gameManager.size.z; ++k) {
                cellList_line.push(cellList[i][j][k]);
            }
        }
    }
    var sortCellList = sortList(cellList_line);
    var _loop_1 = function (i) {
        var object = sortCellList[i];
        var fy = object.y;
        var fz = object.z;
        var fr = gameManager.lightSource.x / (gameManager.lightSource.x - object.x);
        var oy = gameArea.canvas.x / 2;
        var oz = gameArea.canvas.y * 3 / 8;
        var size = gameManager.cellSize;
        var ix = object.index.x;
        var iy = object.index.y;
        var iz = object.index.z;
        var onCursor = (gameManager.cursor.x == ix)
            && (gameManager.cursor.y == iy)
            && (gameManager.cursor.z == iz);
        var alpha = (function () {
            if (!spotLight) {
                return 1.0;
            }
            else {
                var onStrongLight = (function () {
                    for (var i_1 = 0; i_1 < neighborList.length; ++i_1) {
                        if (gameManager.cursor.x + neighborList[i_1].x == ix
                            && gameManager.cursor.y + neighborList[i_1].y == iy
                            && gameManager.cursor.z + neighborList[i_1].z == iz) {
                            return true;
                        }
                    }
                    return false;
                })();
                var onWeekLight = (function () {
                    for (var i_2 = 0; i_2 < haloList.length; ++i_2) {
                        if (gameManager.cursor.x + haloList[i_2].x == ix
                            && gameManager.cursor.y + haloList[i_2].y == iy
                            && gameManager.cursor.z + haloList[i_2].z == iz) {
                            return true;
                        }
                    }
                    return false;
                })();
                if (onStrongLight || onCursor) {
                    return 1.0;
                }
                else if (onWeekLight) {
                    return 0.5;
                }
                else {
                    return 0.01;
                }
            }
        })();
        var cellColor_1 = (function () {
            if (onCursor) {
                return new Color(255, 255, 255);
            }
            else {
                if (!object.demined) {
                    return new Color(Math.floor(fr * 100 + 44), Math.floor(fr * 10), Math.floor(fr * 100 + 22));
                }
                else {
                    return object.color;
                }
            }
        })();
        var cellText = (function () {
            if (!object.demined) {
                if (object.flag) {
                    return "f";
                }
                else {
                    return "";
                }
            }
            else {
                return object.label;
            }
        })();
        if (!(object.demined && (object.neighbors == 0))
            || onCursor) {
            ctx.fillStyle = "rgba("
                + cellColor_1.r + ","
                + cellColor_1.g + ","
                + cellColor_1.b + ","
                + alpha + ")";
            ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
            ctx === null || ctx === void 0 ? void 0 : ctx.arc(fy * fr + oy, fz * fr + oz, size * fr, 0, 2 * Math.PI, false);
            ctx === null || ctx === void 0 ? void 0 : ctx.fill();
            if (cellText != "0") {
                ctx.strokeStyle = "rgba(1, 1, 1, " + alpha + ")";
                ctx === null || ctx === void 0 ? void 0 : ctx.strokeText(cellText, fy * fr + oy - 2, fz * fr + oz + 2);
            }
            if (gameManager.gameclear) {
                ctx.strokeStyle = "rgb(254, 254, 254)";
                ctx === null || ctx === void 0 ? void 0 : ctx.strokeText("GAME CLEAR", canvas.width / 2, canvas.height / 2);
            }
            else if (gameManager.gameover) {
                ctx.strokeStyle = "rgb(254, 254, 254)";
                ctx === null || ctx === void 0 ? void 0 : ctx.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);
            }
        }
    };
    for (var i = 0; i < gameManager.volume; ++i) {
        _loop_1(i);
    }
    //controller
    var sortControllerList = sortList(controllerList);
    var _loop_2 = function (i) {
        var object = sortControllerList[i];
        var cy = object.y;
        var cz = object.z;
        var cr = gameManager.lightSource.x / (gameManager.lightSource.x - object.x);
        var oy = gameArea.canvas.x / 2;
        var oz = gameArea.canvas.y * 13 / 16;
        var size = gameManager.cellSize;
        ctx.fillStyle = "rgb("
            + object.color.r + ","
            + object.color.g + ","
            + object.color.b + ")";
        ctx.beginPath();
        ctx === null || ctx === void 0 ? void 0 : ctx.arc(cy * cr + oy, cz * cr + oz, size * cr, 0, 2 * Math.PI, false);
        ctx === null || ctx === void 0 ? void 0 : ctx.fill();
        var label = (function () {
            if (object.color.r != 100) {
                return "x";
            }
            else if (object.color.g != 100) {
                return "y";
            }
            else if (object.color.b != 100) {
                return "z";
            }
            else {
                return "";
            }
        })();
        ctx.strokeStyle = "rgb(254, 254, 254)";
        ctx === null || ctx === void 0 ? void 0 : ctx.strokeText(label, cy * cr * 1.4 + oy - 2.5, cz * cr * 1.4 + oz + 2.5);
        if (i == 2) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
            ctx === null || ctx === void 0 ? void 0 : ctx.arc(oy, oz, 2 * size, 0, 2 * Math.PI, false);
            ctx === null || ctx === void 0 ? void 0 : ctx.fill();
        }
    };
    for (var i = 0; i < 6; ++i) {
        _loop_2(i);
    }
    if (!gameManager.gameover) {
        gameManager.endTime = new Date().getTime();
    }
    //label
    ctx.strokeStyle = "rgb(254, 254, 254)";
    ctx === null || ctx === void 0 ? void 0 : ctx.strokeText("Flag : " + flagCounter(), 20, canvas.height - 40);
    ctx === null || ctx === void 0 ? void 0 : ctx.strokeText("Time : " + (function () {
        if (mouse.is_init) {
            return Math.floor((gameManager.endTime - gameManager.startTime) / 1000);
        }
        else {
            return 0;
        }
    })(), 20, canvas.height - 20);
    //putFlag button
    ctx.fillStyle = "rgb(89, 157, 218)";
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.arc(canvas.width - 50, canvas.height - 50, 30, 0, 2 * Math.PI, false);
    ctx === null || ctx === void 0 ? void 0 : ctx.fill();
    ctx === null || ctx === void 0 ? void 0 : ctx.strokeText("FLAG", canvas.width - 50, canvas.height - 50);
    requestAnimationFrame(gameDisplay);
}
if (navigator.userAgent.indexOf("iPhone") > 0
    || navigator.userAgent.indexOf("iPhone") > 0
    || navigator.userAgent.indexOf("iPhone") > 0
    || navigator.userAgent.indexOf("iPhone") > 0) {
    canvas.addEventListener("touchstart", mouseDown);
    canvas.addEventListener("touchmove", mouseMove);
    canvas.addEventListener("touchend", mouseUp);
}
else {
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseup", mouseUp);
}
function mouseDown(e) {
    //canvas.addEventListener("mousedown", e => {
    mouse.is_down = true;
    mouse.is_longPress = false;
    var target = e.target;
    var rect = target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    mouse.downPos = new Int2(x, y);
    mouse.escapePos = new Int2(x, y);
    mouse.updatePos = new Int2(x, y);
}
;
function mouseMove(e) {
    var target = e.target;
    var rect = target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (!mouse.is_longPress
        && Math.sqrt((x - mouse.downPos.x) * (x - mouse.downPos.x)
            + (y - mouse.downPos.y) * (y - mouse.downPos.y)) > 10) {
        mouse.is_longPress = true;
    }
    if (mouse.is_down) {
        mouse.updatePos = new Int2(x, y);
        gameManager.rotZ = (mouse.updatePos.x - mouse.escapePos.x) / 30;
        gameManager.rotY = (mouse.updatePos.y - mouse.escapePos.y) / 30;
        for (var i = 0; i < cellIndexList.length; ++i) {
            var p = cellIndexList[i];
            cellList[p.x][p.y][p.z].rotate(gameManager.rotZ, gameManager.rotY);
        }
        for (var i = 0; i < 6; ++i) {
            controllerList[i].rotate(gameManager.rotZ, gameManager.rotY);
        }
        mouse.escapePos = new Int2(x, y);
    }
}
;
function mouseUp(e) {
    mouse.is_down = false;
    if (mouse.is_longPress) {
        mouse.is_longPress = false;
        return;
    }
    var target = e.target;
    var rect = target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var p = ctx === null || ctx === void 0 ? void 0 : ctx.getImageData(x, y, 1, 1).data;
    if (p[0] == 255
        && p[1] == 255
        && p[2] == 255) {
        mouse.is_longPress = false;
        var p_1 = gameManager.cursor;
        var object = cellList[p_1.x][p_1.y][p_1.z];
        if (!object.demined && !object.flag) {
            cellList[p_1.x][p_1.y][p_1.z].demined = true;
            if (object.danger) {
                gameManager.gameover = true;
                mouse.is_init = false;
                gameManager.endTime = new Date().getTime();
            }
            else if (is_safe(p_1)) {
                demine(p_1);
            }
            if (!gameManager.gameover) {
                if (!mouse.is_init) {
                    gameManager.startTime = new Date().getTime();
                    mouse.is_init = true;
                }
            }
        }
    }
    if (p[0] == 0
        && p[1] == 100
        && p[2] == 100) {
        gameManager.cursor.x--;
        if (gameManager.cursor.x < 0) {
            gameManager.cursor.x += gameManager.size.x;
        }
    }
    if (p[0] == 200
        && p[1] == 100
        && p[2] == 100) {
        gameManager.cursor.x++;
        if (gameManager.cursor.x >= gameManager.size.x) {
            gameManager.cursor.x -= gameManager.size.x;
        }
    }
    if (p[0] == 100
        && p[1] == 0
        && p[2] == 100) {
        gameManager.cursor.y--;
        if (gameManager.cursor.y < 0) {
            gameManager.cursor.y += gameManager.size.y;
        }
    }
    if (p[0] == 100
        && p[1] == 200
        && p[2] == 100) {
        gameManager.cursor.y++;
        if (gameManager.cursor.y >= gameManager.size.y) {
            gameManager.cursor.y -= gameManager.size.y;
        }
    }
    if (p[0] == 100
        && p[1] == 100
        && p[2] == 0) {
        gameManager.cursor.z--;
        if (gameManager.cursor.z < 0) {
            gameManager.cursor.z += gameManager.size.z;
        }
    }
    if (p[0] == 100
        && p[1] == 100
        && p[2] == 200) {
        gameManager.cursor.z++;
        if (gameManager.cursor.z >= gameManager.size.z) {
            gameManager.cursor.z -= gameManager.size.z;
        }
    }
    if (p[0] == 89
        && p[1] == 157
        && p[2] == 218) {
        putFlag();
    }
    mouse.is_longPress = false;
}
;
function putFlag() {
    var p = gameManager.cursor;
    var object = cellList[p.x][p.y][p.z];
    if (object.flag && !object.demined) {
        cellList[p.x][p.y][p.z].flag = false;
    }
    else if (!object.flag && !object.demined) {
        cellList[p.x][p.y][p.z].flag = true;
    }
}
document.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "f":
            //let p: Int3 = gameManager.cursor;
            //let object: Cell = cellList[p.x][p.y][p.z];
            //if(object.flag && !object.demined) {
            //    cellList[p.x][p.y][p.z].flag = false;
            //} else if(!object.flag && !object.demined) {
            //    cellList[p.x][p.y][p.z].flag = true;
            //}
            putFlag();
            break;
        case "x":
            fixedPlane = "yz";
            break;
        case "y":
            fixedPlane = "zx";
            break;
        case "z":
            fixedPlane = "xy";
            break;
        case "s":
            if (spotLight) {
                spotLight = false;
            }
            else {
                spotLight = true;
            }
            break;
        case "e":
            modeChange("easy");
            break;
        case "n":
            modeChange("normal");
            break;
        case "h":
            modeChange("hard");
            break;
        case "r":
            gameInitialize();
            break;
        default:
            break;
    }
    var keyRotZ = 0, keyRotY = 0;
    if (e.ctrlKey) {
        switch (e.key) {
            case "ArrowLeft":
                keyRotZ = -0.1;
                break;
            case "ArrowRight":
                keyRotZ = 0.1;
                break;
            case "ArrowUp":
                keyRotY = -0.1;
                break;
            case "ArrowDown":
                keyRotY = 0.1;
                break;
            default:
                break;
        }
    }
    else if (fixedPlane == "yz") {
        switch (e.key) {
            case "ArrowLeft":
                gameManager.cursor.y -= 1;
                if (gameManager.cursor.y < 0) {
                    gameManager.cursor.y += gameManager.size.y;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.y += 1;
                if (gameManager.cursor.y >= gameManager.size.y) {
                    gameManager.cursor.y -= gameManager.size.y;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.z -= 1;
                if (gameManager.cursor.z < 0) {
                    gameManager.cursor.z += gameManager.size.z;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.z += 1;
                if (gameManager.cursor.z >= gameManager.size.z) {
                    gameManager.cursor.z -= gameManager.size.z;
                }
                break;
        }
    }
    else if (fixedPlane == "zx") {
        switch (e.key) {
            case "ArrowLeft":
                gameManager.cursor.z -= 1;
                if (gameManager.cursor.z < 0) {
                    gameManager.cursor.z += gameManager.size.z;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.z += 1;
                if (gameManager.cursor.z >= gameManager.size.z) {
                    gameManager.cursor.z -= gameManager.size.z;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.x -= 1;
                if (gameManager.cursor.x < 0) {
                    gameManager.cursor.x += gameManager.size.x;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.x += 1;
                if (gameManager.cursor.x >= gameManager.size.x) {
                    gameManager.cursor.x -= gameManager.size.x;
                }
                break;
        }
    }
    else if (fixedPlane == "xy") {
        switch (e.key) {
            case "ArrowLeft":
                gameManager.cursor.x -= 1;
                if (gameManager.cursor.x < 0) {
                    gameManager.cursor.x += gameManager.size.x;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.x += 1;
                if (gameManager.cursor.x >= gameManager.size.x) {
                    gameManager.cursor.x -= gameManager.size.x;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.y -= 1;
                if (gameManager.cursor.y < 0) {
                    gameManager.cursor.y += gameManager.size.y;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.y += 1;
                if (gameManager.cursor.y >= gameManager.size.y) {
                    gameManager.cursor.y -= gameManager.size.y;
                }
                break;
        }
    }
    switch (e.key) {
        case "Enter":
            mouse.is_longPress = false;
            var p = gameManager.cursor;
            var object = cellList[p.x][p.y][p.z];
            if (!object.demined && !object.flag) {
                cellList[p.x][p.y][p.z].demined = true;
                if (object.danger) {
                    gameManager.gameover = true;
                    mouse.is_init = false;
                }
                else if (is_safe(p)) {
                    demine(p);
                }
                if (!gameManager.gameover) {
                    mouse.is_init = true;
                }
            }
            break;
        default:
            break;
    }
    for (var i = 0; i < cellIndexList.length; ++i) {
        var p = cellIndexList[i];
        cellList[p.x][p.y][p.z].rotate(keyRotZ, keyRotY);
    }
    for (var i = 0; i < 6; ++i) {
        controllerList[i].rotate(keyRotZ, keyRotY);
    }
});
