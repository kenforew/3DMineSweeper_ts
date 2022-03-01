
class Int2 {
    x: number;
    y: number;
    
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }
}

class Pos2 {
    x: number;
    y: number;

    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }
}

class Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    
    constructor(_x: number, _y: number, _w: number, _h: number) {
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
    }
}

class Piece {
    pos: Int2;
    owner: string;
    onBoard: boolean;
    name: string;
    kanji: string;
    mayMoveList: Int2[];
    promotable: boolean;
    isPromoted: boolean;
    promotedKanji?: string;
    promotedMoveList?: Int2[];
    temochiIndex: number;
    listIndex: number;


    constructor(
        _listIndex: number,
        _pos: Int2,
        _owner: string,
        _onBoard: boolean,
        _name: string,
        _kanji: string,
        _mayMoveList: Int2[],
        _promotable: boolean,
        _promotedKanji?: string,
        _promotedMoveList?: Int2[],
        
    ) {
        this.pos = _pos;
        this.owner = _owner;
        this.onBoard = _onBoard;
        this.name = _name;
        this.kanji = _kanji;
        this.mayMoveList = _mayMoveList;
        this.promotable = _promotable;
        this.promotedKanji = _promotedKanji;
        this.promotedMoveList = _promotedMoveList;
        
        this.isPromoted = false;
        
        this.temochiIndex = 0;
        
        this.listIndex = _listIndex;
    }

    mayMove() {
        return this.mayMoveList;
    }
    
    moveTo(afterPos: Int2) {
        this.pos = afterPos;
    }
}

class GameArea {
    canvas: Int2;
    board: Rect;
    yourPieces: Rect;
    enemysPieces: Rect;
        
    constructor() {
        this.canvas = new Int2(400, 800);
        this.board = new Rect(0, 200, 400, 400);
        this.yourPieces = new Rect(0, 0, 150, 150);
        this.enemysPieces = new Rect(250, 650, 150, 150);
    }
}


class GameManager {
    pieces: Piece[][][];
    yourPieces: Piece[];
    enemysPieces: Piece[];
    has?: Int2;
    active: boolean[][];
    turnPlayer: ("you" | "enemy");
    size: Int2;
    

    constructor() {
        this.pieces = Array(9);
        for(let i = 0; i < 9; ++i) {
            this.pieces[i] = Array(9);
            for(let j = 0; j < 9; ++j) {
                this.pieces[i][j] = Array(1).fill([]);
            }
        }

        this.yourPieces = [];
        this.enemysPieces = [];

        this.active = Array(9);
        for(let i = 0; i < 9; ++i) {
            this.active[i] = Array(9).fill(false);
        }
        
        this.turnPlayer = "you";

        this.size = new Int2(9, 9);
    }

    turnChange():void {
        this.turnPlayer = (() => {
            if(this.turnPlayer == "you") {
                return "enemy";
            } else {
                return "you";
            }
        })();
        console.log(this.turnPlayer);
    }

    getWaitingPlayer() {
        return (() => {
            if(this.turnPlayer == "you") {
                return "enemy";
            } else {
                return "you";
            }
        })();
    }
}

class index{
    x: number;
    y: number;
    owner: string;
    temochi: boolean;
    temochiIndex: number;
    name: string;

    constructor(_x: number, _y: number, _name: string, _owner: string) {
        this.x = _x;
        this.y = _y;
        this.name = _name;
        this.owner = _owner;
        this.temochi = false;
        this.temochiIndex = 0;
    }
}

(() => {
    
    let gameManager: GameManager = new GameManager();
    
    let stage = new createjs.Stage("view");
    stage.enableMouseOver();
    
    let cell: ("you" | "enemy" | "empty") [][] = [];
    
    for(let i = 0; i < gameManager.size.x; ++i) {
        cell[i] = new Array(gameManager.size.y).fill("empty");
    }

    let activeA: boolean[][] = [];
    for(let i = 0; i < gameManager.size.x; ++i) {
        activeA[i] = new Array(gameManager.size.y).fill(false);
    }

    let boardIndexList: Int2[] = [];
    for(let i = 0; i < gameManager.size.x; ++i) {
        for(let j = 0; j < gameManager.size.y; ++j) {
            boardIndexList.push(new Int2(i, j));
        }
    }

    cell[0][0]="enemy";
    cell[1][0]="enemy";
    cell[2][0]="enemy";
    cell[3][0]="enemy";
    cell[4][0]="enemy";
    cell[5][0]="enemy";
    cell[6][0]="enemy";
    cell[7][0]="enemy";
    cell[8][0]="enemy";

    cell[1][1]="enemy";
    cell[7][1]="enemy";

    cell[0][2]="enemy";
    cell[1][2]="enemy";
    cell[2][2]="enemy";
    cell[3][2]="enemy";
    cell[4][2]="enemy";
    cell[5][2]="enemy";
    cell[6][2]="enemy";
    cell[7][2]="enemy";
    cell[8][2]="enemy";

 
    cell[0][8]="you";
    cell[1][8]="you";
    cell[2][8]="you";
    cell[3][8]="you";
    cell[4][8]="you";
    cell[5][8]="you";
    cell[6][8]="you";
    cell[7][8]="you";
    cell[8][8]="you";

    cell[1][7]="you";
    cell[7][7]="you";

    cell[0][6]="you";
    cell[1][6]="you";
    cell[2][6]="you";
    cell[3][6]="you";
    cell[4][6]="you";
    cell[5][6]="you";
    cell[6][6]="you";
    cell[7][6]="you";
    cell[8][6]="you";

    

    let list: index[] = [
        new index(0, 2, "hohei", "enemy"),
        new index(1, 2, "hohei", "enemy"),
        new index(2, 2, "hoehi", "enemy"),
        new index(3, 2, "hohei", "enemy"),
        new index(4, 2, "hohei", "enemy"),
        new index(5, 2, "hohei", "enemy"),
        new index(6, 2, "hohei", "enemy"),
        new index(7, 2, "hohei", "enemy"),
        new index(8, 2, "hohei", "enemy"),


        new index(0, 0, "kyosya", "enemy"),
        new index(8, 0, "kyosya", "enemy"),


        new index(1, 0, "keima", "enemy"),
        new index(7, 0, "keima", "enemy"),        

        new index(2, 0, "gin", "enemy"),
        new index(6, 0, "gin", "enemy"),

        new index(3, 0, "kin", "enemy"),
        new index(5, 0, "kin" ,"enemy"),
        
        new index(4, 0, "gyoku","enemy"),
        
        new index(1, 1, "hisya", "enemy"),
        new index(7, 1, "kaku", "enemy"),


        
        new index(0, 6, "hohei", "you"),
        new index(1, 6, "hohei", "you"),
        new index(2, 6, "hohei", "you"),
        new index(3, 6, "hohei", "you"),
        new index(4, 6, "hohei", "you"),
        new index(5, 6, "hohei", "you"),
        new index(6, 6, "hohei", "you"),
        new index(7, 6, "hohei", "you"),
        new index(8, 6, "hohei", "you"),
         
        new index(0, 8, "kyosya", "you"),
        new index(8, 8, "kyosya", "you"),

        new index(1, 8, "keima", "you"),
        new index(7, 8, "keima", "you"),

        new index(2, 8, "gin", "you"),
        new index(6, 8, "gin", "you"),

        new index(3, 8, "kin", "you"),
        new index(5, 8, "kin", "you"),

        new index(4, 8, "oh", "you"),

        new index(7, 7, "hisya", "you"),
        new index(1, 7, "kaku", "you"),

   
    ];
 
    //koma
    (() => {
        let count: number = 0;
        for(let i = 0; i < 2; ++i) {
            //owner
            let owner: string = (() => {
                if(i == 0) {
                    return "enemy";
                } else {
                    return "you";
                }
            })();
            
            let sgn: number = (() => {
                if(i == 0) {
                    return 1;
                } else {
                    return -1;
                }
            })();
            
            let goldList: Int2[] = [
                new Int2(1, 1 * sgn),
                new Int2(0, 1 * sgn),
                new Int2(-1, 1 * sgn),
                new Int2(1, 0),
                new Int2(-1, 0),
                new Int2(0, -1 * sgn),
            ];
            

            //hohei
            for(let j = 0; j < 9; ++j) {
                gameManager.pieces[j][2 + 4 * i][0] = new Piece(
                    count,
                    new Int2(j, 2 + 4 * i),
                    owner,
                    true,
                    "hohei",
                    "歩",
                    [
                        new Int2(0, 1 * sgn),
                    ],
                    true,
                    "と",
                    [
                        new Int2(1, 1 * sgn),
                        new Int2(0, 1 * sgn),
                        new Int2(-1, 1 * sgn),
                        new Int2(1, 0),
                        new Int2(-1, 0),
                        new Int2(0, -1 * sgn),
                    ],

                    //goldList,
                );
                count++;
            }
            
            //kyosya
            for(let j = 0; j < 2; ++j) {
                gameManager.pieces[0 + 8 * j][0 + 8 * i][0] = new Piece(
                    count,
                    new Int2(8 * j, 8 * i),
                    owner,
                    true,
                    "kyosya",
                    "香",
                    [
                        new Int2(0, 8 * sgn),
                    ],
                    true,
                    "金",
                    [
                        new Int2(1, 1 * sgn),
                        new Int2(0, 1 * sgn),
                        new Int2(-1, 1 * sgn),
                        new Int2(1, 0),
                        new Int2(-1, 0),
                        new Int2(0, -1 * sgn),
                    ],

                    //goldList,
                );
                count++
            }
            
            //keima
            for(let j = 0; j < 2; ++j) {
                gameManager.pieces[1 + 6 * j][0 + 8 * i][0] = new Piece(
                    count,
                    new Int2(1 + 6 * j, 8 * i),
                    owner,
                    true,
                    "keima",
                    "桂",
                    [
                        new Int2(1, 2 * sgn),
                        new Int2(-1, 2 * sgn),
                    ],
                    true,
                    "金",
                    [
                        new Int2(1, 1 * sgn),
                        new Int2(0, 1 * sgn),
                        new Int2(-1, 1 * sgn),
                        new Int2(1, 0),
                        new Int2(-1, 0),
                        new Int2(0, -1 * sgn),
                    ],

                    //goldList,
                );
                count++
            }
            
            //gin
            for(let j = 0; j < 2; ++j) {
                gameManager.pieces[2 + 4 * j][0 + 8 * i][0] = new Piece(
                    count,
                    new Int2(2 + 4 * j, 8 * i),
                    owner,
                    true,
                    "gin",
                    "銀",
                    [
                        new Int2(1, 1 * sgn),
                        new Int2(-1, 1 * sgn),
                        new Int2(0, 1 * sgn),
                        new Int2(1, -1 * sgn),
                        new Int2(-1, -1 * sgn),
                    ],
                    true,
                    "金",
                    [
                        new Int2(1, 1 * sgn),
                        new Int2(0, 1 * sgn),
                        new Int2(-1, 1 * sgn),
                        new Int2(1, 0),
                        new Int2(-1, 0),
                        new Int2(0, -1 * sgn),
                    ],

                    //goldList,
                );
                count++;
            }

            //kin
            for(let j = 0; j < 2; ++j) {
                gameManager.pieces[3 + 2 * j][0 + 8 * i][0] = new Piece(
                    count,
                    new Int2(3 + 2 * j, 8 * i),
                    owner,
                    true,
                    "kin",
                    "金",
                    [
                        new Int2(1, 1 * sgn),
                        new Int2(0, 1 * sgn),
                        new Int2(-1, 1 * sgn),
                        new Int2(1, 0),
                        new Int2(-1, 0),
                        new Int2(0, -1 * sgn),
                    ],
                    false,
                );
                count++;
            }

            //gyoku
            if(i == 0) {
                gameManager.pieces[4][0][0] = new Piece(
                    count,
                    new Int2(4, 0),
                    "enemy",
                    true,
                    "gyoku",
                    "玉",
                    [
                        new Int2(1, 1),
                        new Int2(1, 0),
                        new Int2(1, -1),
                        new Int2(0, 1),
                        new Int2(0, -1),
                        new Int2(-1, 1),
                        new Int2(-1, 0),
                        new Int2(-1, -1),
                    ],
                    false,
                );
            } else {
                gameManager.pieces[4][8][0] = new Piece(
                    count,
                    new Int2(4, 8),
                    "you",
                    true,
                    "oh",
                    "王",
                    [
                        new Int2(1, 1),
                        new Int2(1, 0),
                        new Int2(1, -1),
                        new Int2(0, 1),
                        new Int2(0, -1),
                        new Int2(-1, 1),
                        new Int2(-1, 0),
                        new Int2(-1, -1),
                    ],
                    false,
                );
            }
            count++;

            //hisya
            gameManager.pieces[1 + 6 * i][1 + 6 * i][0] = new Piece(
                count,
                new Int2(1 + 6 * i, 1 + 6 * i),
                owner,
                true,
                "hisya",
                "飛",
                [
                    new Int2(8, 0),
                    new Int2(-8, 0),
                    new Int2(0, 8),
                    new Int2(0, -8),
                ],
                true,
                "竜",
                [
                    new Int2(8 , 0),
                    new Int2(-8, 0),
                    new Int2(0, 8),
                    new Int2(0, -8),
                    new Int2(1, 1),
                    new Int2(-1, 1),
                    new Int2(1, -1),
                    new Int2(-1, -1),
                ],
            );
            count++;
            
            //kaku
            gameManager.pieces[7 - 6 * i][1 + 6 * i][0] = new Piece(
                count,
                new Int2(7 - 6 * i, 1 + 6 * i),
                owner,
                true,
                "kaku",
                "角",
                [
                    new Int2(8, 8),
                    new Int2(8, -8),
                    new Int2(-8, 8),
                    new Int2(-8, -8),
                ],
                true,
                "馬",
                [
                    new Int2(8, 8),
                    new Int2(8, -8),
                    new Int2(-8, 8),
                    new Int2(-8, -8),
                    new Int2(0, 1),
                    new Int2(0, -1),
                    new Int2(1, 0),
                    new Int2(-1, 0),
                ],

            );
            count++;

        }
        
    })();
    
    let board = new createjs.Container();
    let yourPieces = new createjs.Container();
    let enemysPieces = new createjs.Container();

    enemysPieces.x = 0;
    enemysPieces.y = 0;

    board.x = 0;
    board.y = 100;

    yourPieces.x = 280;
    yourPieces.y = 480;

    
    let enemysPiecesBackground = new createjs.Shape(
        new createjs
            .Graphics()
            .beginFill("#887766")
            .drawRect(0, 0, 90, 90)
    );
    enemysPiecesBackground.x = 0;
    enemysPiecesBackground.y = 0;
    //enemysPieces.addChild(enemysPiecesBackground);
    
    let boardBackground = new createjs.Shape(
        new createjs
            .Graphics()
            .beginFill("#887766")
            .drawRect(0, 0, 360, 360)
    );
    boardBackground.x = 0;
    boardBackground.y = 100;
    //board.addChild(boardBackground);

    let yourPiecesBackground = new createjs.Shape(
        new createjs
            .Graphics()
            .beginFill("#887766")
            .drawRect(0, 0, 90, 90)
    );
    yourPiecesBackground.x = 260;
    yourPiecesBackground.y = 480;
    //yourPieces.addChild(yourPiecesBackground);

    stage.addChild(
        boardBackground,
        enemysPiecesBackground,
        yourPiecesBackground,
        board, yourPieces, enemysPieces);
    
    for(let i = 0; i < gameManager.size.x; ++i) {
        let col = new createjs.Container();
        col.x = 40 * i;
        col.y = 0;
        for(let j = 0; j < gameManager.size.y; ++j) {
            let row = new createjs.Container();
            row.x = 0;
            row.y = 40 * j;
            col.addChild(row);            
        }
        board.addChild(col)
    }

    let activeC = new createjs.Container();

    stage.addChild(activeC);
    
    for(let i = 0; i < list.length; ++i) {

        let img = new createjs.Shape();
        img.graphics.beginFill("#664455").drawRect(
            0, 0, 38, 38
        );

        img.x = img.y = 0;

        let label = gameManager.pieces[list[i].x][list[i].y][0].isPromoted
            ? new createjs.Text(
                gameManager.pieces[list[i].x][list[i].y][0].promotedKanji,
                "24px serif", "#ff0000")
            : new createjs.Text(
                gameManager.pieces[list[i].x][list[i].y][0].kanji,
                "24px serif", "#001122");
        
        if(gameManager.pieces[list[i].x][list[i].y][0].owner == "you") {
            label.x = label.y = 0;
        } else {
            label.rotation = 180;
            label.x = label.y = 38;
        }

        img.cache(0, 0, 38, 38);
        
        img.addEventListener("mouseover", function(e: any) {

            let target = e.target;
            target.y = -5;
            
            target.filters = [
                new createjs.ColorFilter(0, 0, 0, 1, 128, 64, 64, 0)
            ];

            target.updateCache();            
        });

        img.addEventListener("mouseout", function(e: any) {
           
            let target = e.target;
            target.y = 0;
            target.filters = [
                new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)
            ];

            target.updateCache();            
        });

        img.addEventListener("click", function(e: any) {
            selectPiece(e, i);
        });

        board.getChildAt(list[i].x).getChildAt(list[i].y).addChild(img, label); 
        
    }

    function selectPiece(e: any, i: number): void {
        //let i: number = this.id;

        console.log("name,x,y,owner,temochi : "+list[i].name+" "+list[i].x+" "+list[i].y+" "+list[i].owner+" "+list[i].temochi);

        if(!list[i].temochi
        && gameManager.pieces[list[i].x][list[i].y][0].owner != gameManager.turnPlayer) return;
        
        if(activeA[list[i].x][list[i].y]) return;

        //activate...
        
        activeC.removeAllChildren();
        
        for(let j = 0; j < boardIndexList.length; ++j) {
            activeA[boardIndexList[j].x][boardIndexList[j].y] = false;
        }

        //console.log("list i = " + i + " temochi = " + list[i].temochi + " x,y = " + list[i].x+" "+list[i].y);
        
        if(list[i].temochi && list[i].owner == gameManager.turnPlayer) {
            //手持ちから出す　
            for(let k = 0; k < boardIndexList.length; ++k) {
                let newX: number = boardIndexList[k].x;
                let newY: number = boardIndexList[k].y;

                if(cell[newX][newY] == "empty") {//空のマスであればどこに出してもいい
                    activeA[newX][newY] = true;
                }

                if(list[i].name == "hohei") {
                    //hihu
                    for(let l = 0; l < 9; ++l) {
                        if(gameManager.pieces[newX][l].length == 0) continue;
                        if(gameManager.pieces[newX][l][0].owner == gameManager.turnPlayer
                        && gameManager.pieces[newX][l][0].name == "hohei") {
                            activeA[newX][newY] = false;
                            break;
                        }
                    }
                }

                if(list[i].name == "hohei" || list[i].name == "kyosya") {
                    //1 masu akeru
                    if(gameManager.turnPlayer == "you") {
                        if(newY == 0) activeA[newX][newY] = false;
                    } else {
                        if(newY == 8) activeA[newX][newY] = false;
                    }
                }
                
                if(list[i].name == "keima") {
                    //2 masu akeru
                    if(gameManager.turnPlayer == "you") {
                        if(newY == 0 || newY == 1) activeA[newX][newY] = false;
                    } else {
                        if(newY == 8 || newY == 7) activeA[newX][newY] = false;
                    }
            
                }                
            
            }

        } else if(list[i].owner == gameManager.turnPlayer) {
            
            //盤内で完結
            let mayMoveTo = gameManager.pieces[list[i].x][list[i].y][0].isPromoted
                ? gameManager.pieces[list[i].x][list[i].y][0].promotedMoveList!
                : gameManager.pieces[list[i].x][list[i].y][0].mayMoveList;

            //console.log("name, maymoveto.length, "+gameManager.pieces[list[i].x][list[i].y][0].name+" "+mayMoveTo.length);
            for(let j = 0; j < mayMoveTo.length; ++j) {
                if(mayMoveTo[j].x == 8 || mayMoveTo[j].x == -8
                || mayMoveTo[j].y == 8 || mayMoveTo[j].y == -8) {
                    let arrow: Int2 = new Int2(
                        Math.floor(mayMoveTo[j].x / 8),
                        Math.floor(mayMoveTo[j].y / 8));
                    
                    //kyosya hisya kaku
                    //console.log("arrow:"+arrow.x+arrow.y);
                    for(let k = 1; k < 8; ++k) {
                        let newX: number = list[i].x + arrow.x * k;
                        let newY: number = list[i].y + arrow.y * k;
                        if(newX < 0 || newX >= gameManager.size.x
                        || newY < 0 || newY >= gameManager.size.y) {
                            break;
                        }

                        activeA[newX][newY] = false;

                        if(cell[newX][newY] == gameManager.turnPlayer) {
                            break;
                        } else if(cell[newX][newY] == "empty") {
                            activeA[newX][newY] = true;
                        } else {
                            activeA[newX][newY] = true;
                            break;
                        }
                    }
                } else {
                    //console.log("arrow 1 length");
                    let newX: number = list[i].x + mayMoveTo[j].x;
                    let newY: number = list[i].y + mayMoveTo[j].y;
                    
                    if(newX < 0 || newX >= gameManager.size.x
                    || newY < 0 || newY >= gameManager.size.y) {
                        continue;
                    }
                    
                    activeA[newX][newY] = false;
                    if(cell[newX][newY] == gameManager.turnPlayer) continue;
                    activeA[newX][newY] = true;
                }
            }
        }

        //activeC.removeAllChildren();

        //activeなマスにイベントを仕込む
        for(let j = 0; j < boardIndexList.length; ++j) {
            
            let newX: number = boardIndexList[j].x;
            let newY: number = boardIndexList[j].y;
            
            if(activeA[newX][newY]) {
                //console.log(j + k + " is active cell.");
                let active = new createjs.Shape(
                    new createjs
                        .Graphics()
                        .beginFill("#00ffff")
                        .drawRect(0, 0, 38, 38)
                );

                active.alpha = 0.5;
                
                active.x = board.getChildAt(newX).x + board.x;
                active.y = board.getChildAt(newX).getChildAt(newY).y + board.y;

                active.addEventListener("click", function () {
                    putPiece(e, i, newX, newY);
                });
                    //{i: i, newX: newX, newY: newY, handleEvent: putPiece});//ove to active
                
                activeC.addChild(active);
            }
        }    
    }
    
    function putPiece(e: any, i: number, newX: number, newY: number): void{
        
        //(newX, newY) is active cell.
        //(list[i].x, list[i].y) => (newX, newY)
        //(list[i].temochi, list[i].temochiIndex) => newX, newY
        
        
        //移動先に相手のコマがいる場合の処理
        if(cell[newX][newY] == gameManager.getWaitingPlayer()) {

            //移動先に相手のコマがいる　取得処理 

            //todo ... element tree, gameManager.pieces, list, cell
            
            //element tree
            let takenImg = board
                .getChildAt(newX)
                .getChildAt(newY)
                .getChildAt(0);

            let takenLabel = new createjs.Text(
                gameManager.pieces[newX][newY][0].kanji,
                "24px serif", "#001122");
        

            if(gameManager.turnPlayer == "you") {
                takenLabel.x = takenLabel.y = 0;
                takenLabel.rotation = 0;
            } else {
                takenLabel.x = takenLabel.y = 38;
                takenLabel.rotation = 180;
            }

            let container = new createjs.Container();

            container.addChild(takenImg, takenLabel);
            
            
            if(gameManager.turnPlayer == "you") {
                yourPieces.addChild(container);
            } else {
                enemysPieces.addChild(container);
            }

            board
                .getChildAt(newX)
                .getChildAt(newY)
                .removeAllChildren();
            // element is over.


            //gameManager.pieces begin
            let oldInstance = gameManager.pieces[newX][newY][0];
            //oleInstance は取られるコマ

            //console.log("oleInstance owner : "+gameManager.turnPlayer);
            if(oldInstance.name == "oh") {
                if(window.confirm("YOU LOSE\nNEW GAME?")) {
                    //new game
                    location.reload();
                } else {
                    window.close();
                }
            }

            if(oldInstance.name == "gyoku") {
                if(window.confirm("YOU WIN\nNEW GAME?")) {
                    //new game
                    location.reload();
                } else {
                    window.close();
                }
            }
            
            oldInstance.owner = gameManager.turnPlayer;
            oldInstance.isPromoted = false;
            oldInstance.onBoard = false;

            for(let k = 0; k < oldInstance.mayMoveList.length; ++k) {
                oldInstance.mayMoveList[k].y *= (-1);
            }
            
            if(oldInstance.promotable) {
                for(let k = 0; k < oldInstance.promotedMoveList!.length; ++k) {
                    oldInstance.promotedMoveList![k].y *= (-1);
                    //console.log(i+" th element of promotedMoveList : " + oldInstance.promotedMoveList![k].x + " " + oldInstance.promotedMoveList![k].y);
                }
            }
            
            oldInstance.temochiIndex = (() => {
                if(gameManager.turnPlayer == "you") {
                    return gameManager.yourPieces.length;
                } else {
                    return gameManager.enemysPieces.length;
                }
            })();


            if(gameManager.turnPlayer == "you") {
                gameManager.yourPieces.push(oldInstance);
            } else {
                gameManager.enemysPieces.push(oldInstance);
            }


            gameManager.pieces[newX][newY] = [];            
            //gameManager.pieces over.
            
            //cell begin
            cell[newX][newY] = "empty";
            //cell over

            //list begin
            let index = oldInstance.listIndex;
            list[index].temochi = true;
            list[index].temochiIndex = (() => {
                if(gameManager.turnPlayer == "you") {
                    return gameManager.yourPieces.length;
                } else {
                    return gameManager.enemysPieces.length;
                }
            })();

            list[index].owner = gameManager.turnPlayer;            
            //list over
        }

        if(list[i].temochi && list[i].owner == gameManager.turnPlayer) {
            //手持ちから盤にコマを出す

            //element 
            let oldImg = (() => {
                if(list[i].owner == "you") {
                    return yourPieces
                        .getChildAt(list[i].temochiIndex)
                        .getChildAt(0);
                } else {
                    return enemysPieces
                        .getChildAt(list[i].temochiIndex)
                        .getChildAt(0);
                }
            })();

            let oldLabel = (() => {
                if(list[i].owner == "you") {
                    return yourPieces
                        .getChildAt(list[i].temochiIndex)
                        .getChildAt(1);
                } else {
                    return enemysPieces
                        .getChildAt(list[i].temochiIndex)
                        .getChildAt(1);
                }
            })();
            
            board
                .getChildAt(newX)
                .getChildAt(newY)
                .addChild(oldImg, oldLabel);

            if(list[i].owner == "you") {
                yourPieces.removeChildAt(list[i].temochiIndex);
            } else {
                enemysPieces.removeChildAt(list[i].temochiIndex);
            }
            //element over.

            //pieces instance begin

            let oldInstance = (() => {
                if(list[i].owner == "you") {
                    return gameManager.yourPieces[list[i].temochiIndex];
                } else {
                    return gameManager.enemysPieces[list[i].temochiIndex];
                }
            })();

            oldInstance.pos = new Int2(newX, newY);
            oldInstance.onBoard = false;
            oldInstance.owner = gameManager.turnPlayer;

            gameManager.pieces[newX][newY][0] = oldInstance;

            if(list[i].owner == "you") {
                gameManager.yourPieces.splice(list[i].temochiIndex, 1);
            } else {
                gameManager.enemysPieces.splice(list[i].temochiIndex, 1);
            }
            //pieces instance over

            //list begin
            list[i].x = newX;
            list[i].y = newY;
            list[i].temochi = false;
            //list over

            //cell begin
            cell[newX][newY] = gameManager.turnPlayer;
            //cell over


        } else if(list[i].owner == gameManager.turnPlayer) {
            //piece + element
            let oldInstance = gameManager.pieces[list[i].x][list[i].y][0];
            
            let oldImg = board
                .getChildAt(list[i].x)
                .getChildAt(list[i].y)
                .getChildAt(0);
            
            let oldLabel = board
                .getChildAt(list[i].x)
                .getChildAt(list[i].y)
                .getChildAt(1);
            
            oldImg.y = 0;

           
            if(
                ((
                    (gameManager.turnPlayer == "you")
                    && (newY <= 2)    
                ) || (
                    (gameManager.turnPlayer == "enemy")
                    && (newY >= 6)    
                )) && 
                    //既に成っているコマに対しては確認しない
                    !oldInstance.isPromoted
                && 
                    //裏面が存在するコマのみ確認する
                    oldInstance.promotable
                
            ) {
                if(window.confirm("成りますか？")) {
                    oldInstance.isPromoted = true;
                    
                    oldLabel = new createjs.Text(
                        oldInstance.promotedKanji,
                        "24px serif", "#ff0000");
                    
                    if(oldInstance.owner == "you") {
                        oldLabel.x = oldLabel.y = 0;
                    } else {
                        oldLabel.x = oldLabel.y = 38;
                        oldLabel.rotation = 180;
                    }
                }
            }
            
            oldInstance.onBoard = false;

            gameManager.pieces[newX][newY][0] = oldInstance;
            gameManager.pieces[list[i].x][list[i].y] = [];


            board
                .getChildAt(newX)
                .getChildAt(newY)
                .addChild(oldImg, oldLabel);
            board
                .getChildAt(list[i].x)
                .getChildAt(list[i].y)
                .removeAllChildren();

            let oldCell: ("you" | "enemy" | "empty") = cell[list[i].x][list[i].y];

            cell[list[i].x][list[i].y] = "empty";

            for(let j = 0; j < list.length; ++j) {
                if(list[j].x == newX
                && list[j].y == newY) {
                    list[j].owner = gameManager.turnPlayer;
                    list[j].temochi = true;
                    break;
                }
            }

            list[i].x = newX;
            list[i].y = newY;

            cell[newX][newY] = oldCell;
        }

        let target = e.target;

        target.filters = [
            new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)
        ];

        target.updateCache();

        activeC.removeAllChildren();

        for(let k = 0; k < boardIndexList.length; ++k) {
            activeA[boardIndexList[k].x][boardIndexList[k].y] = false;
        }

        gameManager.turnChange();
    }
    
    function yourPiecesSort() {
        if(gameManager.yourPieces == []) return;
        for(let i = 0; i < gameManager.yourPieces.length; ++i) {
            yourPieces.getChildAt(i).x = 40 * (i % 3);
            yourPieces.getChildAt(i).y = 40 * Math.floor(i / 3);
            list[gameManager.yourPieces[i].listIndex].temochiIndex = i
        }
    }

    function enemysPiecesSort() {
        if(gameManager.enemysPieces == []) return;
        for(let i = 0; i < gameManager.enemysPieces.length; ++i) {
            enemysPieces.getChildAt(i).x = 40 * (i % 3);
            enemysPieces.getChildAt(i).y = 40 * Math.floor(i / 3);
            list[gameManager.enemysPieces[i].listIndex].temochiIndex = i
        }
    }
    
    //createjs.Ticker.setFPS(30);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    createjs.Ticker.addEventListener("tick", stage);

    createjs.Ticker.addEventListener("tick", function () {
        yourPiecesSort();
        enemysPiecesSort();
    });

})();