// ==========================
// Variáveis globais
// ==========================
const cvs = document.getElementById("gameCanvas");
const con = cvs.getContext("2d");
const scoreSist = document.getElementById("score");
const timerEl = document.getElementById("timer");
const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const starsCanvas = document.getElementById("stars-bg");
const starsCtx = starsCanvas.getContext("2d");
const nextCanvas = document.getElementById("nextPiece");
const nextCtx = nextCanvas.getContext("2d");
const tutorialEl = document.getElementById("tutorial");

starsCanvas.width = window.innerWidth;
starsCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
});

// ==========================
// Estrelas de fundo
// ==========================
const layers = [
    { count: 80, speed: 0.1, maxR: 1 },
    { count: 50, speed: 0.3, maxR: 1.5 },
    { count: 30, speed: 0.6, maxR: 2 }
];

let stars = [];

function createStars() {
    stars = [];
    layers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
            stars.push({
                x: Math.random() * starsCanvas.width,
                y: Math.random() * starsCanvas.height,
                r: Math.random() * layer.maxR + 0.5,
                alpha: Math.random(),
                flicker: Math.random() * 0.05,
                speed: layer.speed
            });
        }
    });
}
createStars();

function drawStars() {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    stars.forEach(star => {
        const gradient = starsCtx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r);
        gradient.addColorStop(0, `rgba(255,255,255,${star.alpha})`);
        gradient.addColorStop(0.5, `rgba(255,255,255,${star.alpha * 0.5})`);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        starsCtx.fillStyle = gradient;
        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        starsCtx.fill();

        star.alpha += (Math.random() - 0.5) * star.flicker;
        if (star.alpha < 0) star.alpha = 0;
        if (star.alpha > 1) star.alpha = 1;
        star.x -= star.speed;
        if (star.x < 0) star.x = starsCanvas.width;
    });
    requestAnimationFrame(drawStars);
}
drawStars();

// ==========================
// Tabuleiro
// ==========================
const linha = 20;
const col = 10;
const sq = 30;
const quad = "black";

let bord = [];
let score = 0;
let lines = 0;
let level = 1;
let dropSpeed = 1000;
let gameOver = false;
let gameStarted = false;

let timer = 0;
let timerInterval;

const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');

function resetBoard() {
    bord = [];
    for (let r = 0; r < linha; r++) {
        bord[r] = Array(col).fill(quad);
    }
}

// ==========================
// Canvas
// ==========================
function desenhaQuad(x, y, cor) {
    con.fillStyle = cor;
    con.fillRect(x * sq, y * sq, sq, sq);
    con.strokeRect(x * sq, y * sq, sq, sq);
}

function tab() {
    con.clearRect(0, 0, cvs.width, cvs.height);
    for (let r = 0; r < linha; r++) {
        for (let c = 0; c < col; c++) {
            desenhaQuad(c, r, bord[r][c]);
        }
    }
}

// ==========================
// Peças
// ==========================
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

let p = null;
let nextP = null;

// ==========================
// Timer
// ==========================
function iniciarTimer() {
    timer = 0;
    timerEl.innerHTML = "Timer: 0s";
    timerInterval = setInterval(() => {
        timer++;
        timerEl.innerHTML = "Timer: " + timer + "s";
    }, 1000);
}

// ==========================
// Score
// ==========================
function updateScore() {
    scoreSist.innerHTML = "Score: " + score;
    linesEl.innerHTML = "Lines: " + lines;
    levelEl.innerHTML = "Level: " + level;
}

// ==========================
// Classe Piece
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
            if (this.ativarTetromino[r][c]) desenhaQuad(this.x + c, this.y + r, cor);
        }
    }
}

Piece.prototype.draw = function() { this.fill(this.cor); }
Piece.prototype.unDraw = function() { this.fill(quad); }

Piece.prototype.colisao = function(x, y, piece) {
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
    if (!this.colisao(0, 1, this.ativarTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        if (!gameOver) {
            p = nextP;
            nextP = geraPecas();
            drawNextPiece(nextP);
        }
    }
}

Piece.prototype.moveLeft = function() {
    if (!this.colisao(-1, 0, this.ativarTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.moveRight = function() {
    if (!this.colisao(1, 0, this.ativarTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Piece.prototype.rotate = function() {
    let novoPad = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.colisao(0, 0, novoPad)) kick = (this.x > col / 2) ? -1 : 1;
    if (!this.colisao(kick, 0, novoPad)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.ativarTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Piece.prototype.lock = function() {
    // Coloca a peça no tabuleiro
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

    // Verifica linhas completas com animação
    for (let r = linha - 1; r >= 0; r--) {
        if (bord[r].every(cell => cell != quad)) {
            let blinkCount = 0;
            let blinkInterval = setInterval(() => {
                for (let c = 0; c < col; c++) {
                    bord[r][c] = (blinkCount % 2 === 0) ? "white" : this.cor;
                }
                tab();
                blinkCount++;
                if (blinkCount > 5) { // 3 piscadas
                    clearInterval(blinkInterval);
                    bord.splice(r, 1);
                    bord.unshift(Array(col).fill(quad));
                    score += 10;
                    lines += 1;
                    updateScore();
                    tab();
                }
            }, 100);
        }
    }

    // Atualiza level e velocidade de queda
    level = Math.floor(score / 50) + 1;
    dropSpeed = Math.max(1000 - (level - 1) * 100, 200);

    updateScore();
    tab();
}


// ==========================
// Próxima peça
// ==========================
function drawNextPiece(piece) {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    let shape = piece.tetromino[0];
    const size = 30;
    const pieceWidth = shape[0].length * size;
    const pieceHeight = shape.length * size;
    const offsetX = (nextCanvas.width - pieceWidth) / 2;
    const offsetY = (nextCanvas.height - pieceHeight) / 2;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                nextCtx.fillStyle = piece.cor;
                nextCtx.fillRect(offsetX + c * size, offsetY + r * size, size, size);
                nextCtx.strokeStyle = "#222";
                nextCtx.strokeRect(offsetX + c * size, offsetY + r * size, size, size);
            }
        }
    }
}

// ==========================
// Loop de queda
// ==========================
function dropLoop() {
    if (!gameOver) {
        p.moveDown();
        tab();
        p.draw();
        setTimeout(dropLoop, dropSpeed);
    }
}

// ==========================
// Start / Restart
// ==========================
startBtn.addEventListener('click', () => {
    if (gameStarted) return;
    gameStarted = true;
    startBtn.style.display = 'none';
    tutorialEl.style.display = 'block';
    resetBoard();
    score = 0; lines = 0; level = 1; dropSpeed = 1000; gameOver = false;
    p = geraPecas();
    nextP = geraPecas();
    drawNextPiece(nextP);
    p.draw();
    tab();
    updateScore();
    iniciarTimer();
    dropLoop();
});

restartBtn.addEventListener('click', () => {
    gameStarted = false;
    gameOverScreen.style.visibility = 'hidden';
    startBtn.style.display = 'block';
    tutorialEl.style.display = 'none';
    clearInterval(timerInterval);
    resetBoard();
    tab();
});

// ==========================
// Controles
// ==========================
document.addEventListener("keydown", function (event) {
    if (!gameStarted || gameOver) return;
    if([37,38,39,40].includes(event.keyCode)) event.preventDefault();
    if(event.keyCode == 37) p.moveLeft();
    if(event.keyCode == 38) p.rotate();
    if(event.keyCode == 39) p.moveRight();
    if(event.keyCode == 40) p.moveDown();
});

// ==========================
// Game over
// ==========================
function gameOverHandler() {
    gameOver = true;
    gameOverScreen.style.visibility = 'visible';
    clearInterval(timerInterval);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
        ranking.push({ username: currentUser.username, score });
        ranking.sort((a,b) => b.score - a.score);
        localStorage.setItem("ranking", JSON.stringify(ranking));
    }
}
