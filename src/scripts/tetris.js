// Referências dos elementos HTML
const cvs = document.getElementById("gameCanvas");
const con = cvs.getContext("2d");
const scoreSist = document.getElementById("score");
const timerEl = document.getElementById("timer");
const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');

// Canvas da próxima peça
const nextCanvas = document.getElementById("nextPiece");
const nextCtx = nextCanvas.getContext("2d");

const linha = 20;
const col = 10;
const sq = 30;
const quad = "#0e0e0e";

let bord = [];
for (let r = 0; r < linha; r++) {
    bord[r] = [];
    for (let c = 0; c < col; c++) {
        bord[r][c] = quad;
    }
}

function desenhaQuad(x, y, cor) {
    con.fillStyle = cor;
    con.shadowBlur = 5;
    con.fillRect(x * sq, y * sq, sq, sq);
    con.shadowBlur = 0;
}

function tab() {
    for (let r = 0; r < linha; r++) {
        for (let c = 0; c < col; c++) {
            desenhaQuad(c, r, bord[r][c]);
        }
    }
}

tab();

const pecas = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

function geraPecas() {
    let r = Math.floor(Math.random() * pecas.length);
    return new Piece(pecas[r][0], pecas[r][1]);
}

let p = geraPecas();       // peça atual
let nextP = geraPecas();   // próxima peça

let score = 0;
let dropStart = Date.now();
let gameOver = false;

// Timer variables
let tempo = 0;
let timerInterval;

function iniciarTimer() {
    tempo = 0;
    timerEl.innerHTML = "Tempo: 0s";

    timerInterval = setInterval(() => {
        tempo++;
        timerEl.innerHTML = "Tempo: " + tempo + "s";
    }, 1000);
}

iniciarTimer();

function Piece(tetromino, cor) {
    this.tetromino = tetromino;
    this.cor = cor;
    this.tetrominoN = 0;
    this.ativarTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = -2;
}

Piece.prototype.fill = function (cor) {
    for (let r = 0; r < this.ativarTetromino.length; r++) {
        for (let c = 0; c < this.ativarTetromino.length; c++) {
            if (this.ativarTetromino[r][c]) {
                desenhaQuad(this.x + c, this.y + r, cor);
            }
        }
    }
}
Piece.prototype.draw = function () { this.fill(this.cor); }
Piece.prototype.unDraw = function () { this.fill(quad); }

Piece.prototype.colisao = function (x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece.length; c++) {
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

Piece.prototype.moveDown = function () {
    if (!this.colisao(0, 1, this.ativarTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        if (!gameOver) {
            p = nextP;          // próxima vira atual
            nextP = geraPecas(); // sorteia nova próxima
            drawNextPiece(nextP); // atualiza preview
        }
    }
}
Piece.prototype.moveLeft = function () {
    if (!this.colisao(-1, 0, this.ativarTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}
Piece.prototype.moveRight = function () {
    if (!this.colisao(1, 0, this.ativarTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}
Piece.prototype.rotate = function () {
    let novoPad = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.colisao(0, 0, novoPad)) {
        kick = (this.x > col / 2) ? -1 : 1;
    }
    if (!this.colisao(kick, 0, novoPad)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.ativarTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Piece.prototype.lock = function () {
    for (let r = 0; r < this.ativarTetromino.length; r++) {
        for (let c = 0; c < this.ativarTetromino.length; c++) {
            if (!this.ativarTetromino[r][c]) continue;
            if (this.y + r < 0) {
                // Game over
                gameOver = true;
                gameOverScreen.style.visibility = 'visible';
                clearInterval(timerInterval);
                return;
            }
            bord[this.y + r][this.x + c] = this.cor;
        }
    }

    // Check for full lines
    for (let r = 0; r < linha; r++) {
        let isLinhaFull = true;
        for (let c = 0; c < col; c++) {
            if (bord[r][c] === quad) {
                isLinhaFull = false;
                break;
            }
        }
        if (isLinhaFull) {
            // Move all rows down
            for (let y = r; y > 0; y--) {
                for (let c = 0; c < col; c++) {
                    bord[y][c] = bord[y - 1][c];
                }
            }
            // Clear top row
            for (let c = 0; c < col; c++) {
                bord[0][c] = quad;
            }
            score += 10;
        }
    }
    tab();
    scoreSist.innerHTML = "Score: " + score;
}

// === Preview da próxima peça ===
function drawNextPiece(piece) {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextCtx.fillStyle = piece.cor;

    let shape = piece.tetromino[0]; // desenha sempre rotação inicial
    const size = 30; // quadrado maior

    // Calcula largura e altura da peça em pixels
    const pieceWidth = shape[0].length * size;
    const pieceHeight = shape.length * size;

    // Calcula offset para centralizar
    const offsetX = (nextCanvas.width - pieceWidth) / 2;
    const offsetY = (nextCanvas.height - pieceHeight) / 2;

    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                nextCtx.fillRect(
                    offsetX + c * size,
                    offsetY + r * size,
                    size,
                    size
                );
                nextCtx.strokeStyle = "#000";
                nextCtx.strokeRect(
                    offsetX + c * size,
                    offsetY + r * size,
                    size,
                    size
                );
            }
        }
    }
}

// Controles do teclado
document.addEventListener("keydown", function (event) {
    if (gameOver) return;

    if (event.keyCode == 37) { p.moveLeft(); dropStart = Date.now(); }
    else if (event.keyCode == 38) { p.rotate(); dropStart = Date.now(); }
    else if (event.keyCode == 39) { p.moveRight(); dropStart = Date.now(); }
    else if (event.keyCode == 40) { p.moveDown(); }
});

// Função de queda automática
function drop() {
    if (gameOver) return;

    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    requestAnimationFrame(drop);
}

// === Inicializa preview já na primeira peça ===
drawNextPiece(nextP);

drop();

// Função para reiniciar o jogo
function restartGame() {
    gameOverScreen.style.visibility = 'hidden';

    // Resetar tabuleiro
    for (let r = 0; r < linha; r++) {
        for (let c = 0; c < col; c++) {
            bord[r][c] = quad;
        }
    }

    // Resetar variáveis
    score = 0;
    scoreSist.innerHTML = "Score: " + score;
    gameOver = false;

    // Nova peça
    p = geraPecas();
    nextP = geraPecas();
    drawNextPiece(nextP);

    // Redesenha o tabuleiro
    tab();

    // Reinicia timer
    clearInterval(timerInterval);
    iniciarTimer();

    // Reinicia o loop de queda
    dropStart = Date.now();
    drop();
}

restartBtn.addEventListener('click', restartGame);
