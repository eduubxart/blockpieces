// ==========================
// Referências HTML/Canvas
// ==========================
const cvs = document.getElementById("gameCanvas");
const con = cvs.getContext("2d");
const scoreSist = document.getElementById("score");
const timerEl = document.getElementById("timer");
const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');

const quad = "BLACK";
const sq = 30;
const col = 10;
const linha = 20;

// ==========================
// Variáveis de Jogo
// ==========================
let bord;
let score = 0;
let lines = 0;
let level = 1;
let dropSpeed = 1000;
let gameOver = false;
let gameStarted = false;
let dropInterval;
let timerInterval;

// ==========================
// Funções do tabuleiro
// ==========================
function resetBoard() {
    bord = [];
    for (let r = 0; r < linha; r++) {
        bord[r] = Array(col).fill(quad);
    }
}

function drawSquare(x, y, color) {
    con.fillStyle = color;
    con.fillRect(x * sq, y * sq, sq, sq);
    con.strokeStyle = "BLACK";
    con.strokeRect(x * sq, y * sq, sq, sq);
}

function drawBoard() {
    con.clearRect(0, 0, cvs.width, cvs.height);
    for (let r = 0; r < linha; r++) {
        for (let c = 0; c < col; c++) {
            drawSquare(c, r, bord[r][c]);
        }
    }
}

// ==========================
// Peças
// ==========================
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = -2;
}

Piece.prototype.fill = function(color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino[r].length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Piece.prototype.draw = function() { this.fill(this.color); }
Piece.prototype.unDraw = function() { this.fill(quad); }

Piece.prototype.collision = function(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            if (!piece[r][c]) continue;
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            if (newX < 0 || newX >= col || newY >= linha) return true;
            if (newY < 0) continue;
            if (bord[newY][newX] != quad) return true;
        }
    }
    return false;
}

Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = nextP;
        nextP = randomPiece();
    }
}

Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.collision(0, 0, nextPattern)) kick = (this.x > col/2) ? -1 : 1;
    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Piece.prototype.lock = function() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino[r].length; c++) {
            if (!this.activeTetromino[r][c]) continue;
            if (this.y + r < 0) {
                gameOverHandler();
                return;
            }
            bord[this.y + r][this.x + c] = this.color;
        }
    }

    // Linhas completas
    let linhasCompletas = [];
    for (let r = linha - 1; r >= 0; r--) {
        if (bord[r].every(cell => cell != quad)) linhasCompletas.push(r);
    }

    if (linhasCompletas.length > 0) {
        let blinkCount = 0;
        let blinkInterval = setInterval(() => {
            linhasCompletas.forEach(r => {
                for (let c = 0; c < col; c++) {
                    bord[r][c] = (blinkCount % 2 === 0) ? "white" : this.color;
                }
            });
            drawBoard();
            blinkCount++;
            if (blinkCount > 5) {
                clearInterval(blinkInterval);
                linhasCompletas.forEach(r => {
                    bord.splice(r, 1);
                    bord.unshift(Array(col).fill(quad));
                });
                score += 10 * linhasCompletas.length;
                lines += linhasCompletas.length;
                level = Math.floor(score/50)+1;
                dropSpeed = Math.max(1000 - (level-1)*100, 200);
                drawBoard();
            }
        }, 100);
    }
}

// ==========================
// Peças e início do jogo
// ==========================
let p;
let nextP;
const Pieces = [ /* Aqui você coloca os arrays de Tetrominos: Z, S, T, O, L, I, J */ ];

function randomPiece() {
    let r = Math.floor(Math.random() * Pieces.length);
    return new Piece(Pieces[r][0], Pieces[r][1]);
}

// ==========================
// Loop de queda
// ==========================
function drop() {
    if(!gameOver) {
        p.moveDown();
        drawBoard();
        dropInterval = setTimeout(drop, dropSpeed);
    }
}

// ==========================
// Start / Restart
// ==========================
function startGame() {
    gameStarted = true;
    gameOver = false;
    resetBoard();
    score = 0; lines = 0; level = 1; dropSpeed = 1000;
    p = randomPiece();
    nextP = randomPiece();
    drawBoard();
    drop();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// ==========================
// Controles
// ==========================
document.addEventListener("keydown", function(event) {
    if(!gameStarted || gameOver) return;
    if([37,38,39,40].includes(event.keyCode)) event.preventDefault();

    if(event.keyCode == 37) p.moveLeft();
    if(event.keyCode == 38) p.rotate();
    if(event.keyCode == 39) p.moveRight();
    if(event.keyCode == 40) p.moveDown();
});

document.addEventListener("keydown", function(event) {
    if(event.key === "Enter") {
        if(!gameStarted || gameOver) startGame();
    }
});



