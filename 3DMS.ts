class Int2 {
    x: number;
    y: number;
    
    constructor(_x: number, _y: number) {
            this.x = _x;
            this.y = _y;
        }
}

class Int3 {
    x: number;
    y: number;
    z: number;
    
    constructor(_x: number, _y: number, _z: number) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
    
    add(other: Int3) {
        return new Int3(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z,
        );
    }

    mlt(a: number) {
        return new Int3(
            this.x * a,
            this.y * a,
            this.z * a,
        );
    }
}

class Color {
    r: number;
    g: number;
    b: number;

    constructor(_r: number, _g: number, _b: number) {
        this.r = _r;
        this.g = _g;
        this.b = _b
    }
}

class Pos3D {
    x: number;
    y: number;
    z: number;
    
    constructor(_x: number, _y: number, _z: number) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
}

class Object3D extends Pos3D {
    index: Int3;
    
    constructor(_x: number, _y: number, _z: number, _index: Int3) {
        super(_x, _y, _z);
        this.index = _index;
    }

    rotate(rotZ: number, rotY: number) {
        let newX, newY, newZ;
        newX = this.x * Math.cos(rotZ) - this.y * Math.sin(rotZ);
        newY = this.x * Math.sin(rotZ) + this.y * Math.cos(rotZ);
        this.x = newX;
        this.y = newY;

        rotY = -rotY;

        newZ = this.z * Math.cos(rotY) - this.x * Math.sin(rotY);
        newX = this.z * Math.sin(rotY) + this.x * Math.cos(rotY);
        this.z = newZ;
        this.x = newX;
    }
}

class Cell extends Object3D {
    neighbors: number;
    color: Color;
    danger: boolean;
    demined: boolean;
    flag: boolean;
    label: string;
    
    constructor(_x: number, _y: number, _z: number, _index: Int3) {
        super(_x, _y, _z, _index);
        
        this.neighbors = 0;
        this.color = new Color(0, 0, 0);

        this.danger = false;
        this.demined = false;
        this.flag = false;

        this.label = "";
    }
}

class Controller extends Object3D {
    color: Color;

    constructor(_x: number, _y: number, _z: number, _index: Int3, _color: Color) {
        super(_x, _y, _z, _index);
        this.color = _color;
    }
}

class GameArea {
    canvas: Int2;

    constructor() {
        this.canvas = new Int2(800, 800);
    }
}

class Mouse {
    downPos: Int2;
    escapePos: Int2;
    updatePos: Int2;
    upPos: Int2;

    is_down: boolean;
    is_longPress: boolean;
    is_init: boolean;
    is_leftClick: boolean;

    constructor() {
        this.downPos = new Int2(0, 0);
        this.escapePos = new Int2(0, 0);
        this.updatePos = new Int2(0, 0);
        this.upPos = new Int2(0, 0);

        this.is_down = false;
        this.is_longPress = false;
        this.is_init = false;
        this.is_leftClick = false;
    }
}

class GameManager {
    cursor: Int3;
    size: Int3;
    volume: number;
    mines: number;
    rotZ: number;
    rotY: number;

    lightSource: Int3;

    cellSize: number;

    gameclear: boolean;
    gameover: boolean;

    startTime: number;
    endTime: number;

    constructor() {
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
}

let gameArea = new GameArea();
let mouse = new Mouse();
let gameManager = new GameManager();

//let canvas, ctx,
let fixedPlane: string = "x", date: number = 0, spotLight: boolean = false;

let canvas: HTMLCanvasElement = document.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");
canvas.width = gameArea.canvas.x;
canvas.height = gameArea.canvas.y;

ctx!.fillStyle = "rgb(0, 0, 0)";
ctx?.fillRect(0, 0, canvas.width, canvas.height);

let cellIndexList: Int3[]= [];
let cellList: Cell[][][] = [];
let controllerList: Controller[] = [];

let neighborList: Int3[] = [];

//for(let i = -1; i < 2; ++i) {
//    for(let j = -1; j < 2; ++j) {
//        for(let k = -1; k < 2; ++k) {
//            neighborList.push(new Int3(i, j, k));
//        }
//    }
//}

let haloList: Int3[] = [];

for(let i = -2; i < 3; ++i) {
    for(let j = -2; j < 3; ++j) {
        for(let k = -2; k < 3; ++k) {
            if(-1 <= i && i <= 1
            && -1 <= j && j <= 1
            && -1 <= k && k <= 1) {
                if(!(i == 0 && j == 0 && k == 0)){
                    neighborList.push(new Int3(i, j, k));
                }
            } else {
                haloList.push(new Int3(i, j, k));
            }
        }
    }
}

gameInitialize();

function cellIndexListInitialize(): void {
    cellIndexList = [];
    for(let i = 0; i < gameManager.size.x; ++i) {
        for(let j = 0; j < gameManager.size.y; ++j) {
            for(let k = 0; k < gameManager.size.z; ++k) {
                cellIndexList.push(new Int3(i, j, k));
            }
        }
    }
}

function controllerListInitialize(): void {
    controllerList = [];
    for(let i = 0; i < 2; ++i) {
        let sgn = 2 * i - 1;
        controllerList.push(new Controller(
            100 * sgn, 0, 0, new Int3(sgn, 0, 0), new Color(200 * i, 100, 100)
        ));
        controllerList.push(new Controller(
            0, 100 * sgn, 0, new Int3(0, sgn, 0), new Color(100, 200 * i, 100)
        ));
        controllerList.push(new Controller(
            0, 0, 100 * sgn, new Int3(0, 0, sgn), new Color(100, 100, 200 * i)
        ));
    }
}

function cellListInitialize(): void {
    cellList = Array(gameManager.size.x);
    for(let i = 0; i < gameManager.size.x; ++i) {
        cellList[i] = Array(gameManager.size.y);
        for(let j = 0; j < gameManager.size.y; ++j) {
            cellList[i][j] = Array(gameManager.size.z);
            for(let k = 0; k < gameManager.size.z; ++k) {
                cellList[i][j][k] = new Cell(
                    50 * (i - (gameManager.size.x - 1) / 2),
                    50 * (j - (gameManager.size.y - 1) / 2),
                    50 * (k - (gameManager.size.z - 1) / 2),
                    new Int3(i, j, k)
                )
            }
        }
    }

    cellIndexListInitialize();
    dangerInitialize();

    for(let i = 0; i < cellIndexList.length; ++i) {
        let p = cellIndexList[i];

        let neighbors = count(p);
        cellList[p.x][p.y][p.z].neighbors = neighbors;
        cellList[p.x][p.y][p.z].color = cellColor(neighbors);
        cellList[p.x][p.y][p.z].label = (cellList[p.x][p.y][p.z].danger)
            ? "b"
            : String(neighbors);
    }
}

function flagCounter(): number {
    let x = 0;
    for(let i = 0; i < cellIndexList.length; ++i) {
        let p = cellIndexList[i];
        if(cellList[p.x][p.y][p.z].flag
        && !cellList[p.x][p.y][p.z].demined) {
            x++;
        }
    }
    return x;
}

function modeChange(m: string): void {
    switch(m) {
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

function cellColor(x: number): Color {
    let R: number = (() => {
        switch(x % 3) {
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
    
    let G: number = (() => {
        switch(Math.floor(x / 2) % 3) {
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
    
    let B: number = (() => {
        switch(Math.floor(x / 3) % 3) {
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

function gameClearJudge(): void {
    let counter = 0;
    for(let i = 0; i < cellIndexList.length; ++i) {
        let p = cellIndexList[i];
        if(cellList[p.x][p.y][p.z].demined) {
            counter++;
        }
    }

    if(counter == (gameManager.volume - gameManager.mines)) {
        gameManager.gameclear = true;
        gameManager.gameover = true;
        mouse.is_init = false;
    }

    if(gameManager.gameclear) {
        console.log("game clear");
    }
}

function gameInitialize(): void {
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

function dangerInitialize(): void {
    let mineIndex: number[] = [];
    let newIntFlag: boolean = true;
    
    while(mineIndex.length < gameManager.mines) {
        let rand = Math.floor(Math.random() * gameManager.volume);

        newIntFlag = true;
        for(let i = 0; i < mineIndex.length; ++i) {
            if(mineIndex[i] == rand) {
                newIntFlag = false;
                break;
            }
        }
        if(newIntFlag) {
            mineIndex.push(rand);
        }
    }
    
    for(let i = 0; i < gameManager.mines; ++i) {
        let p = cellIndexList[mineIndex[i]];
        cellList[p.x][p.y][p.z].danger = true;
    }
}

function is_inBoard(p: Int3): boolean {
    if(p.x >= 0 && p.x < gameManager.size.x
    && p.y >= 0 && p.y < gameManager.size.y
    && p.z >= 0 && p.z < gameManager.size.z) {
        return true;
    } else {
        return false;
    }
}

function demine(p: Int3): void {
    for(let i = 0; i < neighborList.length; ++i) {
        demine_internal(
            p.add(neighborList[i])
        );
    }
}

function demine_internal(p: Int3): void {
    if(is_inBoard(p)
    && !cellList[p.x][p.y][p.z].demined) {
        cellList[p.x][p.y][p.z].demined = true;
        if(is_safe(p)) {
            demine(p);
        }
    }
    return;
}

function is_safe(p: Int3): boolean {
    let ans: boolean = true;
    for(let i = 0; i < neighborList.length; ++i) {
        ans = ans && is_safe_internal(
            p.add(neighborList[i])
        );
    }
    return ans;
}

function is_safe_internal(p: Int3): boolean {
    if(!is_inBoard(p)){
        return true;
    } else {
        if(cellList[p.x][p.y][p.z].danger) {
            return false;
        } else {
            return true;
        }
    }
}

function count(p: Int3) {
    let sum = 0;

    for(let i = 0; i < neighborList.length; ++i) {
        sum += count_internal(
            p.add(neighborList[i])
        );
    }

    return sum;
}

function count_internal(p: Int3): number {
    if(!is_inBoard(p)) {
        return 0;
    } else {
        return cellList[p.x][p.y][p.z].danger
            ? 1 : 0;
    }
}

function sortList(list: any[]): any[] {
    for(let i = 0; i < list.length; ++i) {
        for(let j = 0; j < list.length; ++j) {
            if(list[i].x < list[j].x) {
                let t = list[i];
                list[i] = list[j];
                list[j] = t;
            }
        }
    }
    return list;
}

function gameDisplay(): void {
    ctx!.fillStyle = "rgb(0, 0, 0)";
    ctx!.fillRect(0, 0, canvas.width, canvas.height);

    let cellList_line: Cell[] = [];

    for(let i = 0; i < gameManager.size.x; ++i) {
        for(let j = 0; j < gameManager.size.y; ++j) {
            for(let k = 0; k < gameManager.size.z; ++k) {
                cellList_line.push(cellList[i][j][k]);
            }
        }
    }

    let sortCellList: Cell[] = sortList(cellList_line);

    for(let i = 0; i < gameManager.volume; ++i) {
        let object: Cell = sortCellList[i];

        let fy: number = object.y;
        let fz: number = object.z;
        let fr: number = gameManager.lightSource.x / (gameManager.lightSource.x - object.x);
        let oy: number = gameArea.canvas.x / 2;
        let oz: number = gameArea.canvas.y * 3 / 8;
        let size: number = gameManager.cellSize;

        let ix: number = object.index.x;
        let iy: number = object.index.y;
        let iz: number = object.index.z;
        let onCursor: boolean 
            = (gameManager.cursor.x == ix)
            && (gameManager.cursor.y == iy)
            && (gameManager.cursor.z == iz);
        
        let alpha: number = (() => {       
        
            if(!spotLight) {
                return 1.0;
            } else {
                let onStrongLight: boolean = (() => {
                    for(let i = 0; i < neighborList.length; ++i) {
                        if(gameManager.cursor.x + neighborList[i].x == ix
                        && gameManager.cursor.y + neighborList[i].y == iy
                        && gameManager.cursor.z + neighborList[i].z == iz) {
                            return true;
                        }
                    }
                    return false;
                })();

                let onWeekLight: boolean = (() => {
                    for(let i = 0; i < haloList.length; ++i) {
                        if(gameManager.cursor.x + haloList[i].x == ix
                        && gameManager.cursor.y + haloList[i].y == iy
                        && gameManager.cursor.z + haloList[i].z == iz) {
                            return true;
                        }
                    }
                    return false;
                })();

                if(onStrongLight || onCursor) {
                    return 1.0;
                } else if(onWeekLight) {
                    return 0.5;
                } else {
                    return 0.01;
                }
            }
        })();
        
        let cellColor: Color = (() => {
            if(onCursor) {
                return new Color(255, 255, 255);
            } else {
                if(!object.demined) {
                    return new Color(
                        Math.floor(fr * 100 + 44),
                        Math.floor(fr * 10),
                        Math.floor(fr * 100 + 22)
                    );
                } else {
                    return object.color;
                }
            }
        })();

        let cellText: string = (() => {
            if(!object.demined) {
                if(object.flag) {
                    return "f";
                } else {
                    return "";
                }
            } else {
                return object.label;
            }
        })();

        if(!(object.demined && (object.neighbors == 0))
        || onCursor) {
            ctx!.fillStyle = "rgba("
                + cellColor.r + ","
                + cellColor.g + ","
                + cellColor.b + ","
                + alpha + ")";
            
            ctx?.beginPath();
            ctx?.arc(
                fy * fr + oy, fz * fr + oz, size * fr,
                0, 2 * Math.PI, false
            );
            ctx?.fill();
            
            if(cellText != "0") {
                ctx!.strokeStyle = "rgba(1, 1, 1, " + alpha + ")";
                ctx?.strokeText(cellText, fy * fr + oy - 2, fz * fr + oz + 2);
            }
            
            if(gameManager.gameclear) {
                ctx!.strokeStyle = "rgb(254, 254, 254)";
                ctx?.strokeText("GAME CLEAR", canvas.width / 2, canvas.height / 2);
            } else if(gameManager.gameover) {
                ctx!.strokeStyle = "rgb(254, 254, 254)";
                ctx?.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);
            }
        }
        
    }

    //controller

    let sortControllerList = sortList(controllerList);

    for(let i = 0; i < 6; ++i) {
        let object: Controller = sortControllerList[i];
        let cy: number = object.y;
        let cz: number = object.z;
        let cr: number = gameManager.lightSource.x / (gameManager.lightSource.x - object.x);
        let oy: number = canvas.width / 2;
        let oz: number = canvas.height * 13 / 16;
        let size: number = gameManager.cellSize;

        ctx!.fillStyle = "rgb("
            + object.color.r + ","
            + object.color.g + ","
            + object.color.b + ")";
            
        ctx!.beginPath();
        ctx?.arc(
            cy * cr + oy, cz * cr + oz, size * cr,
            0, 2 * Math.PI, false
        );
        ctx?.fill();

        let label: string = (() => {
            if(object.color.r != 100) {
                return "x";
            } else if(object.color.g != 100) {
                return "y";
            } else if(object.color.b != 100) {
                return "z";
            } else {
                return "";
            }
        })();

        ctx!.strokeStyle = "rgb(254, 254, 254)";
        ctx?.strokeText(label, cy * cr * 1.4 + oy - 2.5, cz * cr * 1.4 + oz + 2.5);

        if(i == 2) {
            ctx!.fillStyle = "rgb(255, 255, 255)";
            ctx?.beginPath();
            ctx?.arc(oy, oz, 2 * size, 0, 2 * Math.PI, false);
            ctx?.fill();
        }
    }

    if(!gameManager.gameover) {
        gameManager.endTime = new Date().getTime();
    }

    ctx!.strokeStyle = "rgb(254, 254, 254)";
    ctx?.strokeText("Flag : " + flagCounter(), 20, canvas.height - 40);
    ctx?.strokeText("Time : " + Math.floor((gameManager.endTime - gameManager.startTime) / 1000),
                    20, canvas.height - 20);
    
                    requestAnimationFrame(gameDisplay);
}

canvas.addEventListener("mousedown", e => {
    mouse.is_down = true;
    mouse.is_longPress = false;
    
    const target = e!.target as any;
    const rect: any = target.getBoundingClientRect();
    const x: number = e.clientX - rect.left;
    const y: number = e.clientY - rect.top;
    mouse.downPos = new Int2(x, y);
    mouse.escapePos = new Int2(x, y);
    mouse.updatePos = new Int2(x, y);
});

canvas.addEventListener("mousemove", e => {
    const target = e!.target as any;
    const rect: any = target.getBoundingClientRect();
    const x: number = e.clientX - rect.left;
    const y: number = e.clientY - rect.top;

    if(!mouse.is_longPress
    && Math.sqrt(
        (x - mouse.downPos.x) * (x - mouse.downPos.x)
        + (y - mouse.downPos.y) * (y - mouse.downPos.y)
    ) > 10) {
        mouse.is_longPress = true;
    }

    if(mouse.is_down) {
        mouse.updatePos = new Int2(x, y);
        gameManager.rotZ = (mouse.updatePos.x - mouse.escapePos.x) / 30;
        gameManager.rotY = (mouse.updatePos.y - mouse.escapePos.y) / 30;

        for(let i = 0; i < cellIndexList.length; ++i) {
            let p = cellIndexList[i];
            cellList[p.x][p.y][p.z].rotate(gameManager.rotZ, gameManager.rotY);
        }

        for(let i = 0; i < 6; ++i) {
            controllerList[i].rotate(gameManager.rotZ, gameManager.rotY);
        }

        mouse.escapePos = new Int2(x, y);
    }
});


canvas.addEventListener("mouseup", e => {
    mouse.is_down = false;
    if(mouse.is_longPress) {
        mouse.is_longPress = false;
        return;
    }

    const target=e!.target as any;
    const rect: any = target.getBoundingClientRect();
    const x: number = e.clientX - rect.left;
    const y: number = e.clientY - rect.top;
    const p: any = ctx?.getImageData(x, y, 1, 1).data;

    if(p[0] == 255
    && p[1] == 255
    && p[2] == 255) {
        mouse.is_longPress = false;

        let p: Int3 = gameManager.cursor;
        let object: Cell = cellList[p.x][p.y][p.z];
        if(!object.demined && !object.flag) {
            cellList[p.x][p.y][p.z].demined = true;
            if(object.danger) {
                gameManager.gameover = true;
                mouse.is_init = false;
                gameManager.endTime = new Date().getTime();
            } else if(is_safe(p)) {
                demine(p);
            }

            if(!gameManager.gameover) {
                if(!mouse.is_init) {
                    gameManager.startTime = new Date().getTime();
                    mouse.is_init = true;
                }
            }
        }
    }

    if(p[0] == 0
    && p[1] == 100
    && p[2] == 100) {
        gameManager.cursor.x--;
        if(gameManager.cursor.x < 0) {
            gameManager.cursor.x += gameManager.size.x;
        }
    }

    if(p[0] == 200
    && p[1] == 100
    && p[2] == 100) {
        gameManager.cursor.x++;
        if(gameManager.cursor.x >= gameManager.size.x) {
            gameManager.cursor.x -= gameManager.size.x;
        }
    }

    if(p[0] == 100
    && p[1] == 0
    && p[2] == 100) {
        gameManager.cursor.y--;
        if(gameManager.cursor.y < 0) {
            gameManager.cursor.y += gameManager.size.y;
        }
    }

    if(p[0] == 100
    && p[1] == 200
    && p[2] == 100) {
        gameManager.cursor.y++;
        if(gameManager.cursor.y >= gameManager.size.y) {
            gameManager.cursor.y -= gameManager.size.y;
        }
    }

    if(p[0] == 100
    && p[1] == 100
    && p[2] == 0) {
        gameManager.cursor.z--;
        if(gameManager.cursor.z < 0) {
            gameManager.cursor.z += gameManager.size.z;
        }
    }

    if(p[0] == 100
    && p[1] == 100
    && p[2] == 200) {
        gameManager.cursor.z++;
        if(gameManager.cursor.z >= gameManager.size.z) {
            gameManager.cursor.z -= gameManager.size.z;
        }
    }

    mouse.is_longPress = false;

});

document.addEventListener("keydown", e => {
    switch(e.key) {
        case "f":
            let p: Int3 = gameManager.cursor;
            let object: Cell = cellList[p.x][p.y][p.z];
            if(object.flag && !object.demined) {
                cellList[p.x][p.y][p.z].flag = false;
            } else if(!object.flag && !object.demined) {
                cellList[p.x][p.y][p.z].flag = true;
            }
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
            if(spotLight) {
                spotLight = false;
            } else {
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
    
    let keyRotZ: number = 0, keyRotY: number = 0;

    if(e.ctrlKey) {
        switch(e.key) {
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
    } else if(fixedPlane == "yz") {
        switch(e.key) {
            case "ArrowLeft":
                gameManager.cursor.y -= 1;
                if(gameManager.cursor.y < 0) {
                    gameManager.cursor.y += gameManager.size.y;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.y += 1;
                if(gameManager.cursor.y >= gameManager.size.y) {
                    gameManager.cursor.y -= gameManager.size.y;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.z -= 1;
                if(gameManager.cursor.z < 0) {
                    gameManager.cursor.z += gameManager.size.z;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.z += 1;
                if(gameManager.cursor.z >= gameManager.size.z) {
                    gameManager.cursor.z -= gameManager.size.z;
                }
                break;
        }
    } else if(fixedPlane == "zx") {
        switch(e.key) {
            case "ArrowLeft":
                gameManager.cursor.z -= 1;
                if(gameManager.cursor.z < 0) {
                    gameManager.cursor.z += gameManager.size.z;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.z += 1;
                if(gameManager.cursor.z >= gameManager.size.z) {
                    gameManager.cursor.z -= gameManager.size.z;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.x -= 1;
                if(gameManager.cursor.x < 0) {
                    gameManager.cursor.x += gameManager.size.x;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.x += 1;
                if(gameManager.cursor.x >= gameManager.size.x) {
                    gameManager.cursor.x -= gameManager.size.x;
                }
                break;
            

        }

    } else if(fixedPlane == "xy") {
        switch(e.key) {
            case "ArrowLeft":
                gameManager.cursor.x -= 1;
                if(gameManager.cursor.x < 0) {
                    gameManager.cursor.x += gameManager.size.x;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.x += 1;
                if(gameManager.cursor.x >= gameManager.size.x) {
                    gameManager.cursor.x -= gameManager.size.x;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.y -= 1;
                if(gameManager.cursor.y < 0) {
                    gameManager.cursor.y += gameManager.size.y;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.y += 1;
                if(gameManager.cursor.y >= gameManager.size.y) {
                    gameManager.cursor.y -= gameManager.size.y;
                }
                break;
            

        }

    }

    switch(e.key) {
        case "Enter":
            mouse.is_longPress = false;
            let p = gameManager.cursor;
            let object = cellList[p.x][p.y][p.z];
            if(!object.demined && !object.flag) {
                cellList[p.x][p.y][p.z].demined = true;
                if(object.danger) {
                    gameManager.gameover = true;
                    mouse.is_init = false;
                } else if(is_safe(p)) {
                    demine(p);
                }

                if(!gameManager.gameover) {
                    mouse.is_init = true;
                }
            }
            break;
        default:
            break;
    }

    for(let i = 0; i < cellIndexList.length; ++i) {
        let p = cellIndexList[i];
        cellList[p.x][p.y][p.z].rotate(keyRotZ, keyRotY);
    } 

    for(let i = 0; i < 6; ++i) {
        controllerList[i].rotate(keyRotZ, keyRotY);
    }
}); 
