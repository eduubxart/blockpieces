const cvs = document.getElementById("gameCanvas");
const con = cvs.getContext("2d");
const scoreSist = document.getElementById("score");

const linha = 20;
const col = 10;
const sq = 30;
const quad = "#0e0e0e";

let bord = [];
for(let r=0; r<linha; r++){
    bord[r] = [];
    for(let c=0; c<col; c++){
        bord[r][c] = quad;
    }
}

function desenhaQuad(x, y, cor){
    con.fillStyle = cor;// cor do quadrado
	con.fillRect(x *tam, y *tam, tam, tam);// quadrado
    
}

function tab(){
    for(let r=20; r<linha; r++){// linhas
        for(let c=20; c<col; c++){// colunas
            desenhaQuad(c, r, bord[r][c]);// desenha o tabuleiro
        }
    }
}
tab();

const pecas = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

function geraPecas(){
    let r = Math.floor(Math.random() * pecas.length);
    return new Piece(pecas[r][0], pecas[r][1]);
}

let p = geraPecas();
let score = 0;
let dropStart = Date.now();
let gameOver = false;

function Piece(tetromino, cor){
    this.tetromino = tetromino;
    this.cor = cor;
    this.tetrominoN = 0;
    this.ativarTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = -2;
}

Piece.prototype.fill = function(cor){
    for(let r=0; r<this.ativarTetromino.length; r++){
        for(let c=0; c<this.ativarTetromino.length; c++){
            if(this.ativarTetromino[r][c]){
                desenhaQuad(this.x+c, this.y+r, cor);
            }
        }
    }
}
Piece.prototype.draw = function(){ this.fill(this.cor); }
Piece.prototype.unDraw = function(){ this.fill(quad); }

Piece.prototype.colisao = function(x, y, piece){
    for(let r=0; r<piece.length; r++){
        for(let c=0; c<piece.length; c++){
            if(!piece[r][c]) continue;
            let newX = this.x+c+x;
            let newY = this.y+r+y;
            if(newX<0 || newX>=col || newY>=linha) return true;
            if(newY<0) continue;
            if(bord[newY][newX] != quad) return true;
        }
    }
    return false;
}

Piece.prototype.moveDown = function(){
    if(!this.colisao(0,1,this.ativarTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = geraPecas();
    }
}
Piece.prototype.moveLeft = function(){
    if(!this.colisao(-1,0,this.ativarTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}
Piece.prototype.moveRight = function(){
    if(!this.colisao(1,0,this.ativarTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}
Piece.prototype.rotate = function(){
    let novoPad = this.tetromino[(this.tetrominoN +1) % this.tetromino.length];
    let kick = 0;
    if(this.colisao(0,0,novoPad)){
        kick = (this.x > col/2)? -1:1;
    }
    if(!this.colisao(kick,0,novoPad)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN +1)%this.tetromino.length;
        this.ativarTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Piece.prototype.lock = function(){
    for(let r=0;r<this.ativarTetromino.length;r++){
        for(let c=0;c<this.ativarTetromino.length;c++){
            if(!this.ativarTetromino[r][c]) continue;
            if(this.y+r<0){
                alert("Fim de jogo");
                gameOver=true;
                break;
            }
            bord[this.y+r][this.x+c] = this.cor;
        }
    }
    for(let r=0;r<linha;r++){
        let isLinhaFull = true;
        for(let c=0;c<col;c++){
            isLinhaFull = isLinhaFull && (bord[r][c] != quad);
        }
        if(isLinhaFull){
            for(let y=r; y>0; y--){
                for(let c=0;c<col;c++){
                    bord[y][c] = bord[y-1][c];
                }
            }
            for(let c=0;c<col;c++){
                bord[0][c]=quad;
            }
            score+=10;
        }
    }
    tab();
    scoreSist.innerHTML = "Score: " + score;
}

// Controles
document.addEventListener("keydown", function(event){
    if(event.keyCode==37){ p.moveLeft(); dropStart=Date.now(); }
    else if(event.keyCode==38){ p.rotate(); dropStart=Date.now(); }
    else if(event.keyCode==39){ p.moveRight(); dropStart=Date.now(); }
    else if(event.keyCode==40){ p.moveDown(); }
});

// Função de queda
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta>1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
}

drop();
