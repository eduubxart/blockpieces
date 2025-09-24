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
const sq = 20;
const col = 10;
const linha = 20;

// ==========================
// Variáveis de Jogo
// ==========================
let bord;
let score = 0;
let lines = 0;
let level = 1;
let dropStart;
let gameOver = false;
let gameStarted = false;
let dropSpeed = 1000;
let gameInterval;
let timerInterval;
let timeLeft = 120;

function tab() {
    for (let r = 0; r < linha; r++) {
        for (let c = 0; c < col; c++) {
            drawSquare(c, r, bord[r][c]);
        }
    }
}

function drawSquare(x, y, color) {
    con.fillStyle = color;
    con.fillRect(x * sq, y * sq, sq, sq);

    con.strokeStyle = "BLACK";
    con.strokeRect(x * sq, y * sq, sq, sq);
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
            if (this.ativarTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, cor);
            }
        }
    }
}

Piece.prototype.draw = function() {
    this.fill(this.cor);
}

Piece.prototype.unDraw = function() {
    this.fill(quad);
}

Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.ativarTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
}

Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.ativarTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.ativarTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > col / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
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
            bord[this.y + r][this.x + c] = this.cor;
        }
    }

    // Checa linhas completas
    let linhasCompletas = [];
    for (let r = linha - 1; r >= 0; r--) {
        if (bord[r].every(cell => cell != quad)) {
            linhasCompletas.push(r);
        }
    }

    if (linhasCompletas.length > 0) {
        let blinkCount = 0;
        let blinkInterval = setInterval(() => {
            linhasCompletas.forEach(r => {
                for (let c = 0; c < col; c++) {
                    bord[r][c] = (blinkCount % 2 === 0) ? "white" : "grey";
                }
            });
            tab();

            blinkCount++;
            if (blinkCount > 5) {
                clearInterval(blinkInterval);

                linhasCompletas.forEach(r => {
                    bord.splice(r, 1);
                    bord.unshift(Array(col).fill(quad));
                });

                score += 10 * linhasCompletas.length;
                lines += linhasCompletas.length;
                level = Math.floor(score / 50) + 1;
                dropSpeed = Math.max(1000 - (level - 1) * 100, 200);

                updateScore();
                tab();
            }
        }, 100);
    } else {
        updateScore();
        tab();
    }
}

Piece.prototype.collision = function(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            if (!piece[r][c]) continue;
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= col || newY >= linha) {
                return true;
            }
            if (newY < 0) continue;
            if (bord[newY][newX] != quad) {
                return true;
            }
        }
    }
    return false;
}

// ==========================
// Jogo
// ==========================
function randomPiece() {
    let r = Math.floor(Math.random() * Pieces.length);
    return new Piece(Pieces[r][0], Pieces[r][1]);
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
    if (!gameOver) {
        gameInterval = requestAnimationFrame(drop);
    }
}

function startTimer() {
    timeLeft = 120;
    timerEl.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOverHandler();
        }
    }, 1000);
}

function gameOverHandler() {
    gameOver = true;
    cancelAnimationFrame(gameInterval);
    clearInterval(timerInterval);
    gameOverScreen.style.display = 'block';

    setTimeout(() => {
        gameOverScreen.style.display = 'none';
    }, 1500);
}

function resetGame() {
    bord = [];
    for (let r = 0; r < linha; r++) {
        bord[r] = [];
        for (let c = 0; c < col; c++) {
            bord[r][c] = quad;
        }
    }

    gameOver = false;
    score = 0;
    lines = 0;
    level = 1;
    dropSpeed = 1000;
    updateScore();
    tab();

    p = randomPiece();
    dropStart = Date.now();
    gameInterval = requestAnimationFrame(drop);
    startTimer();
}

// ==========================
// Controles
// ==========================
document.addEventListener("keydown", function(event) {
    if (gameOver || !gameStarted) return;

    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
});

// Enter → Start ou Restart
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        if (!gameStarted || gameOver) {
            gameStarted = true;
            gameOverScreen.style.display = 'none';
            resetGame();
        }
    }
});

restartBtn.addEventListener("click", () => {
    gameOverScreen.style.display = 'none';
    resetGame();
});

startBtn.addEventListener("click", () => {
    gameStarted = true;
    gameOverScreen.style.display = 'none';
    resetGame();
});


