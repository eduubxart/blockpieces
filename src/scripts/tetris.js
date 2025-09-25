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

const quad = "black";
const sq = 30;
const col = 10;
const linha = 20;

let board = [];
let score = 0;
let lines = 0;
let level = 1;
let dropSpeed = 1000;
let gameOver = false;
let gameStarted = false;
let p = null;
let nextP = null;
let dropStart = Date.now();
let gameInterval;
let timerInterval;

// ==========================
// Funções do tabuleiro
// ==========================
function resetBoard() {
    board = [];
    for (let r = 0; r < linha; r++) {
        board[r] = Array(col).fill(quad);
    }
}

function drawSquare(x, y, color) {
    con.fillStyle = color;
    con.fillRect(x * sq, y * sq, sq, sq);
    con.strokeStyle = "black";
    con.strokeRect(x * sq, y * sq, sq, sq);
}

function drawBoard() {
    con.clearRect(0, 0, cvs.width, cvs.height);
    for (let r = 0; r < linha; r++) {
        for (let c = 0; c < col; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

// ==========================
// Peças
// ==========================
function Piece(tetromino, cor) {
    this.tetromino = tetromino;
    this.cor = cor;
    this.tetrominoN = 0;
    this.ativarTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = -2;
}

Piece.prototype.fill = function(cor) {
    for (let r = 0; r < this.ativarTetromino.length; r++) {
        for (let c = 0; c < this.ativarTetromino[r].length; c++) {
            if (this.ativarTetromino[r][c]) drawSquare(this.x + c, this.y + r, cor);
        }
    }
}

Piece.prototype.draw = function() { this.fill(this.cor); }
Piece.prototype.unDraw = function() { this.fill(quad); }

Piece.prototype.collision = function(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            if (!piece[r][c]) continue;
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            if (newX < 0 || newX >= col || newY >= linha) return true;
            if (newY < 0) continue;
            if (board[newY][newX] != quad) return true;
        }
    }
    return false;
}

Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.ativarTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = nextP;
        nextP = randomPiece();
        drawNextPiece(nextP);
    }
}

Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.ativarTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.ativarTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.collision(0, 0, nextPattern)) {
        kick = (this.x > col / 2) ? -1 : 1;
    }
    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.ativarTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Piece.prototype.lock = function() {
    for (let r = 0; r < this.ativarTetromino.length; r++) {
        for (let c = 0; c < this.ativarTetromino[r].length; c++) {
            if (!this.ativarTetromino[r][c]) continue;
            if (this.y + r < 0) {
                gameOverHandler();
                return;
            }
            board[this.y + r][this.x + c] = this.cor;
        }
    }
    checkLines();
}

// ==========================
// Próxima peça
// ==========================
function drawNextPiece(piece) {
    const nextCanvas = document.getElementById("nextPiece");
    const nextCtx = nextCanvas.getContext("2d");
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    let shape = piece.tetromino[0];
    const size = 30;
    const offsetX = (nextCanvas.width - shape[0].length * size) / 2;
    const offsetY = (nextCanvas.height - shape.length * size) / 2;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                nextCtx.fillStyle = piece.cor;
                nextCtx.fillRect(offsetX + c * size, offsetY + r * size, size, size);
                nextCtx.strokeStyle = "black";
                nextCtx.strokeRect(offsetX + c * size, offsetY + r * size, size, size);
            }
        }
    }
}

// ==========================
// Linhas completas
// ==========================
function checkLines() {
    let linhasCompletas = [];
    for (let r = 0; r < linha; r++) {
        if (board[r].every(cell => cell != quad)) {
            linhasCompletas.push(r);
        }
    }

    if (linhasCompletas.length === 0) {
        drawBoard();
        updateScore();
        return;
    }

    let blinkCount = 0;
    let blinkInterval = setInterval(() => {
        linhasCompletas.forEach(r => {
            for (let c = 0; c < col; c++) {
                board[r][c] = (blinkCount % 2 === 0) ? "white" : "grey";
            }
        });
        drawBoard();
        blinkCount++;
        if (blinkCount > 5) {
            clearInterval(blinkInterval);
            // Remove linhas de baixo pra cima
            linhasCompletas.sort((a,b) => b - a);
            linhasCompletas.forEach(r => {
                board.splice(r, 1);
                board.unshift(Array(col).fill(quad));
            });
            score += 10 * linhasCompletas.length;
            lines += linhasCompletas.length;
            level = Math.floor(score / 50) + 1;
            dropSpeed = Math.max(1000 - (level - 1) * 100, 200);
            drawBoard();
            updateScore();
        }
    }, 100);
}

// ==========================
// Funções de jogo
// ==========================
function randomPiece() {
    const pecas = [
        [Z, "red"], [S, "green"], [T, "yellow"], 
        [O, "blue"], [L, "purple"], [I, "cyan"], [J, "orange"]
    ];
    let r = Math.floor(Math.random() * pecas.length);
    return new Piece(pecas[r][0], pecas[r][1]);
}

function updateScore() {
    scoreSist.innerHTML = `Score: ${score} | Lines: ${lines} | Level: ${level}`;
}

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > dropSpeed) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) requestAnimationFrame(drop);
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    resetBoard();
    score = 0; lines = 0; level = 1; dropSpeed = 1000; gameOver = false;
    p = randomPiece();
    nextP = randomPiece();
    drawNextPiece(nextP);
    dropStart = Date.now();
    drop();
    updateScore();
}

// ==========================
// Game over
// ==========================
function gameOverHandler() {
    gameOver = true;
    gameOverScreen.style.display = "block";
    setTimeout(() => { gameOverScreen.style.display = "none"; }, 1500);
}

// ==========================
// Controles
// ==========================
document.addEventListener("keydown", function(event) {
    if (gameOver || !gameStarted) return;
    if (event.keyCode == 37) p.moveLeft();
    if (event.keyCode == 38) p.rotate();
    if (event.keyCode == 39) p.moveRight();
    if (event.keyCode == 40) p.moveDown();
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") startGame();
});

restartBtn.addEventListener("click", startGame);
startBtn.addEventListener("click", startGame);

