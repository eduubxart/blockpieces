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
starsCanvas.width = window.innerWidth;
starsCanvas.height = window.innerHeight;

// ==========================
// Partículas de linha completa estilo Tetris clássico
// ==========================
let particles = [];

function createParticles(x, y, color) {
    for (let i = 0; i < 20; i++) { // mais partículas por célula
        let angle = Math.random() * 2 * Math.PI; // direção aleatória
        let speed = Math.random() * 10 + 4; // velocidade aleatória
        particles.push({
            x: x + sq/2,
            y: y + sq/2,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            alpha: 1,
            color: color,
            size: Math.random() * 6 + 4
        });
    }
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];

        // movimenta partículas
        p.x += p.dx;
        p.y += p.dy;

        // desintegração gradual
        p.alpha -= 0.03;
        p.size *= 0.95;

        // desenha partícula
        con.fillStyle = p.color;
        con.fillRect(p.x, p.y, p.size, p.size);

        // remove quando sumir
        if (p.alpha <= 0.05 || p.size < 0.5) {
            particles.splice(i, 1);
        }
    }
}

// ==========================
// Redimensiona canvas das estrelas
// ==========================
function resizeStarsCanvas() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeStarsCanvas);
resizeStarsCanvas();

// ==========================
// Criação das estrelas
// ==========================
const layers = [
    { count: 80, speed: 0.1, maxR: 1 },
    { count: 50, speed: 0.3, maxR: 1.5 },
    { count: 30, speed: 0.6, maxR: 2 }
];

let stars = [];

function createStars() {
    stars = [];
    layers.forEach((layer) => {
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
        bord[r] = [];
        for (let c = 0; c < col; c++) {
            bord[r][c] = quad;
        }
    }
}

// ==========================
// Funções do canvas
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

    drawParticles(); // desenha partículas
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
//tutorial
// ==========================
const tutorialEl = document.getElementById("tutorial");

startBtn.addEventListener('click', () => {
    if (gameStarted) return;
    gameStarted = true;
    startBtn.style.display = 'none';
    
    // mostra tutorial fixo
    tutorialEl.style.display = 'block';

    resetBoard();
    score = 0;
    lines = 0;
    level = 1;
    dropSpeed = 1000;
    gameOver = false;

    p = geraPecas();
    nextP = geraPecas();
    drawNextPiece(nextP);
    p.draw();
    tab();
    updateScore();
    iniciarTimer();
    dropLoop();
});

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
            if (this.ativarTetromino[r][c]) {
                desenhaQuad(this.x + c, this.y + r, cor);
            }
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
    for (let r = 0; r < this.ativarTetromino.length; r++) {
        for (let c = 0; c < this.ativarTetromino[r].length; c++) {
            if (!this.ativarTetromino[r][c]) continue;
            if (this.y + r < 0) {
                gameOver = true;
                gameOverScreen.style.visibility = 'visible';
                clearInterval(timerInterval);
                return;
            }
            bord[this.y + r][this.x + c] = this.cor;
        }
    }

    // Checa linhas completas e cria partículas estilo Tetris clássico
    for (let r = linha -1; r >= 0; r--) {
        if (bord[r].every(cell => cell != quad)) {
            for (let c = 0; c < col; c++) {
                createParticles(c * sq, r * sq, bord[r][c]);
            }
            // Remove a linha após pequeno delay para ver a explosão
            setTimeout(() => {
                bord.splice(r, 1);
                bord.unshift(Array(col).fill(quad));
            }, 50);
            score += 10;
            lines += 1;
        }
    }

    level = Math.floor(score / 50) + 1;
    dropSpeed = 1000 - (level - 1) * 100;
    if (dropSpeed < 200) dropSpeed = 200;

    updateScore();
    tab();
}

// ==========================
// Preview da próxima peça
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
// Start e restart
// ==========================
startBtn.addEventListener('click', () => {
    if (gameStarted) return;
    gameStarted = true;
    startBtn.style.display = 'none';
    resetBoard();
    score = 0;
    lines = 0;
    level = 1;
    dropSpeed = 1000;
    gameOver = false;

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
    clearInterval(timerInterval);
    resetBoard();
    tab();
});

// ==========================
// Controles do teclado
// ==========================
document.addEventListener("keydown", function (event) {
    if (!gameStarted || gameOver) return;
    if([37,38,39,40].includes(event.keyCode)) event.preventDefault();
    if(event.keyCode == 37) p.moveLeft();
    if(event.keyCode == 38) p.rotate();
    if(event.keyCode == 39) p.moveRight();
    if(event.keyCode == 40) p.moveDown();
});
function gameOverHandler() {
  gameOver = true;
  gameOverScreen.style.visibility = 'visible';
  clearInterval(timerInterval);

  // pega usuário logado
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push({ username: currentUser.username, score });
    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem("ranking", JSON.stringify(ranking));
  }
}
