const cvs = document.getElementById("gameCanvas");
const con = cvs.getContext("2d");
const scoreSist = document.getElementById("score");
const timerEl = document.getElementById("timer");
const gameOverScreen = document.getElementById("game-over-screen");
const restartBtn = document.getElementById("restart-btn");
const startBtn = document.getElementById("start-btn");
const starsCanvas = document.getElementById("stars-bg");
const starsCtx = starsCanvas.getContext("2d");
const nextCanvas = document.getElementById("nextPiece");
const nextCtx = nextCanvas.getContext("2d");
const tutorialEl = document.getElementById("tutorial");
const linesEl = document.getElementById("lines");
const levelEl = document.getElementById("level");

starsCanvas.width = window.innerWidth;
starsCanvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
});

const layers = [
  { count: 80, speed: 0.1, maxR: 1 },
  { count: 50, speed: 0.3, maxR: 1.5 },
  { count: 30, speed: 0.6, maxR: 2 },
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
        speed: layer.speed,
      });
    }
  });
}
createStars();

function drawStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  stars.forEach((star) => {
    const gradient = starsCtx.createRadialGradient(
      star.x,
      star.y,
      0,
      star.x,
      star.y,
      star.r
    );
    gradient.addColorStop(0, `rgba(255,255,255,${star.alpha})`);
    gradient.addColorStop(0.5, `rgba(255,255,255,${star.alpha * 0.5})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
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

// *** FLAG PRA PAUSAR INPUT / QUEDA ENQUANTO AS LINHAS PISCAM ***
let isLocking = false;

function resetBoard() {
  bord = [];
  for (let r = 0; r < linha; r++) {
    bord[r] = Array(col).fill(quad);
  }
}
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

import { Z, S, T, O, L, I, J } from "./matrizes.js";

const pecas = [
  [Z, "red"],
  [S, "green"],
  [T, "yellow"],
  [O, "blue"],
  [L, "purple"],
  [I, "cyan"],
  [J, "orange"],
];

function geraPecas() {
  const rand = Math.random();

  let r = Math.floor(Math.random() * pecas.length);
  return new Piece(pecas[r][0], pecas[r][1]);
}

let p = null;
let nextP = null;

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
    for (let c = 0; c < this.ativarTetromino[r].length; c++) {
      if (this.ativarTetromino[r][c]) desenhaQuad(this.x + c, this.y + r, cor);
    }
  }
};
Piece.prototype.draw = function () {
  this.fill(this.cor);
};
Piece.prototype.unDraw = function () {
  this.fill(quad);
};

Piece.prototype.colisao = function (x, y, piece) {
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
};

Piece.prototype.moveDown = function () {
  if (!this.colisao(0, 1, this.ativarTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    this.lock();
  }
};
Piece.prototype.moveLeft = function () {
  if (!this.colisao(-1, 0, this.ativarTetromino)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
};
Piece.prototype.moveRight = function () {
  if (!this.colisao(1, 0, this.ativarTetromino)) {
    this.unDraw();
    this.x++;
    this.draw();
  }
};
Piece.prototype.rotate = function () {
  let novoPad = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
  let kick = 0;
  if (this.colisao(0, 0, novoPad)) kick = this.x > col / 2 ? -1 : 1;
  if (!this.colisao(kick, 0, novoPad)) {
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.ativarTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
};

/*
  FIX principal: prevenir concorrência entre lock() e o loop de queda.
  - isLocking = true enquanto piscagem/remoção de linhas acontece.
  - Drop loop não chama moveDown durante isLocking.
  - Depois de spawnar a próxima peça, isLocking=false e lastDropTime resetado.
*/
Piece.prototype.lock = function () {
  // coloca a peça no board
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

  // pausa a queda e input até terminar o processo de lock (piscar/remover)
  isLocking = true;

  // coleta todas as linhas completas (todas)
  let linhasCompletas = [];
  for (let r = linha - 1; r >= 0; r--) {
    if (bord[r].every((cell) => cell != quad)) linhasCompletas.push(r);
  }

  if (linhasCompletas.length > 0) {
    // pisca todas juntas e depois remove todas de uma vez
    let blinkCount = 0;
    const originalColors = linhasCompletas.map((r) => [...bord[r]]);
    const blinkInterval = setInterval(() => {
      linhasCompletas.forEach((r, i) => {
        for (let c = 0; c < col; c++) {
          bord[r][c] = blinkCount % 2 === 0 ? "white" : originalColors[i][c];
        }
      });
      tab();
      blinkCount++;
      if (blinkCount > 5) {
        clearInterval(blinkInterval);

        // remover em ordem descendente pra não bagunçar índices
        linhasCompletas
          .slice()
          .sort((a, b) => b - a)
          .forEach((r) => {
            bord.splice(r, 1);
          });

        // empurra linhas vazias pro topo (na quantidade removida)
        for (let i = 0; i < linhasCompletas.length; i++) {
          bord.unshift(Array(col).fill(quad));
        }

        // atualizar score/level/velocidade
        score += 10 * linhasCompletas.length;
        lines += linhasCompletas.length;
        level = Math.floor(score / 50) + 1;
        dropSpeed = Math.max(1000 - (level - 1) * 100, 200);
        updateScore();
        tab();

        // spawn da próxima peça (uma só vez)
        p = nextP;
        nextP = geraPecas();
        drawNextPiece(nextP);
        if (p) p.draw();

        // libera a queda / input e reseta timer do drop
        isLocking = false;
        lastDropTime = 0;
      }
    }, 100);
  } else {
    // sem linhas completas => troca normal e libera imediatamente
    updateScore();
    tab();

    p = nextP;
    nextP = geraPecas();
    drawNextPiece(nextP);
    if (p) p.draw();

    isLocking = false;
    lastDropTime = 0;
  }
};

// ======= Ajuste do canvas de preview (pra evitar artefatos de tamanho) =======
// definimos o tamanho interno do canvas com base no CSS (uma vez e no resize)
// NÃO usamos "nextCanvas.width = nextCanvas.width" dentro do draw (isso causava glitch)
function resizeNextCanvas() {
  // garante resolução correta (evita escala que deixa "resto" de desenho)
  nextCanvas.width = Math.max(64, Math.floor(nextCanvas.clientWidth));
  nextCanvas.height = Math.max(64, Math.floor(nextCanvas.clientHeight));
}
window.addEventListener("resize", resizeNextCanvas);
resizeNextCanvas();

function drawNextPiece(piece) {
  // limpa o conteúdo (clearRect é suficiente)
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

  if (!piece || !piece.tetromino || !piece.tetromino[0]) return;

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
        nextCtx.fillRect(
          Math.floor(offsetX + c * size),
          Math.floor(offsetY + r * size),
          size,
          size
        );
        nextCtx.strokeStyle = "#222";
        nextCtx.strokeRect(
          Math.floor(offsetX + c * size),
          Math.floor(offsetY + r * size),
          size,
          size
        );
      }
    }
  }
}

// ======= Loop de queda (usar requestAnimationFrame com timestamp) =======
let lastDropTime = 0;
function dropLoop(time) {
  if (!gameStarted || gameOver) return;
  if (!lastDropTime) lastDropTime = time;

  // se isLocking true, não chamamos moveDown até liberar (evita re-locks)
  if (!isLocking) {
    const delta = time - lastDropTime;
    if (delta >= dropSpeed) {
      if (p) p.moveDown();
      lastDropTime = time;
      tab();
      if (p) p.draw();
    }
  }

  requestAnimationFrame(dropLoop);
}

// ==========================
// Start / Restart
// ==========================
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  startBtn.style.display = "none";
  tutorialEl.style.display = "block";
  resetBoard();
  score = 0;
  lines = 0;
  level = 1;
  dropSpeed = 1000;
  gameOver = false;
  p = geraPecas();
  nextP = geraPecas();
  // ajusta preview pra resolução atual antes de desenhar
  resizeNextCanvas();
  drawNextPiece(nextP);
  p.draw();
  tab();
  updateScore();
  iniciarTimer();
  lastDropTime = 0;
  requestAnimationFrame(dropLoop);
}

function restartGame() {
  gameStarted = false;
  gameOverScreen.style.visibility = "hidden";
  startBtn.style.display = "block";
  tutorialEl.style.display = "none";
  clearInterval(timerInterval);
  resetBoard();
  tab();
  score = 0;
  lines = 0;
  level = 1;
  dropSpeed = 1000;
  gameOver = false;
  p = geraPecas();
  nextP = geraPecas();
  resizeNextCanvas();
  drawNextPiece(nextP);
  p.draw();
  updateScore();
  lastDropTime = 0;
  // não dispara o loop automaticamente aqui (a tecla Enter/start faz)
}

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 13) {
    if (!gameStarted) startGame();
    else if (gameOver) restartGame();
  }
  if ([37, 38, 39, 40].includes(event.keyCode)) event.preventDefault();
  // bloqueia controles se estiver piscando/removendo linhas
  if (gameStarted && !gameOver && !isLocking) {
    if (event.keyCode == 37) p.moveLeft();
    if (event.keyCode == 38) p.rotate();
    if (event.keyCode == 39) p.moveRight();
    if (event.keyCode == 40) p.moveDown();
  }
});

async function gameOverHandler() {
  gameOver = true;
  gameOverScreen.style.visibility = "visible";
  clearInterval(timerInterval);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  try {
    // envia score pro backend
    const res = await fetch("/api/users/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: currentUser.username,
        score: score,
      }),
    });

    if (!res.ok) {
      console.error("Erro ao enviar score:", await res.text());
    }
  } catch (error) {
    console.error("Erro no gameOverHandler:", error);
  }
}
