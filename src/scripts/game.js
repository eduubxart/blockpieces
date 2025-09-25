/*
  game.js - versão corrigida
*/

import { initStars } from './stars.js';
import { resetBoard, tab } from './board.js';
import { Piece, geraPecas } from './pieces.js';
import { drawNextPiece } from './draw.js';
import { startControls } from './controls.js';

// HTML references
const cvs = document.getElementById("gameCanvas");
const con = cvs.getContext("2d");
const nextCanvas = document.getElementById("nextPiece");
const nextCtx = nextCanvas.getContext("2d");
const scoreSist = document.getElementById("score");
const timerEl = document.getElementById("timer");
const linesEl = document.getElementById("lines");
const levelEl = document.getElementById("level");
const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const tutorialEl = document.getElementById('tutorial');
const starsCanvas = document.getElementById("stars-bg");

// Fundo estrelado
initStars(starsCanvas);

// Tabuleiro e variáveis
let bord = resetBoard();
let score = 0, lines = 0, level = 1, dropSpeed = 1000;
let gameOver = false, gameStarted = false;
let timer = 0, timerInterval;

// Atualiza score/lines/level no DOM
function updateScore() {
  scoreSist.innerHTML = "Score: " + score;
  linesEl.innerHTML = "Lines: " + lines;
  levelEl.innerHTML = "Level: " + level;
}

// Game over
function gameOverHandler() {
  gameOver = true;
  gameOverScreen.style.visibility = 'visible';
  clearInterval(timerInterval);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if(currentUser){
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push({ username: currentUser.username, score });
    ranking.sort((a,b)=>b.score - a.score);
    localStorage.setItem("ranking", JSON.stringify(ranking));
  }
}

// Inicializa peças
let p = geraPecas(con, bord, updateScore, gameOverHandler);
let nextP = geraPecas(con, bord, updateScore, gameOverHandler);
drawNextPiece(nextP, nextCtx, nextCanvas);

// Timer
function iniciarTimer(){
  timer = 0;
  timerEl.innerHTML = "Timer: 0s";
  timerInterval = setInterval(()=>{
    timer++;
    timerEl.innerHTML = "Timer: " + timer + "s";
  },1000);
}

// Loop de queda corrigido
let lastDrop = 0;
function dropLoop(timestamp) {
  if (!gameStarted || gameOver) return;

  if (!lastDrop) lastDrop = timestamp;
  const elapsed = timestamp - lastDrop;

  if (elapsed > dropSpeed) {
    p.moveDown();
    lastDrop = timestamp;
  }

  tab(con, bord); // redesenha o tabuleiro
  p.draw();       // redesenha a peça
  requestAnimationFrame(dropLoop);
}

// Start / Restart
function startGame(){
  if(gameStarted) return;
  gameStarted = true;
  startBtn.style.display = 'none';
  tutorialEl.style.display = 'block';
  bord = resetBoard();
  score = 0; lines = 0; level = 1; dropSpeed = 1000; gameOver = false;
  p = geraPecas(con, bord, updateScore, gameOverHandler);
  nextP = geraPecas(con, bord, updateScore, gameOverHandler);
  drawNextPiece(nextP, nextCtx, nextCanvas);
  tab(con, bord);
  p.draw();
  updateScore();
  iniciarTimer();
  requestAnimationFrame(dropLoop); // chama o loop corrigido
}

function restartGame(){
  gameStarted = false;
  gameOverScreen.style.visibility = 'hidden';
  startBtn.style.display = 'block';
  tutorialEl.style.display = 'none';
  clearInterval(timerInterval);
  bord = resetBoard();
  tab(con, bord);
  score = 0; lines = 0; level = 1; dropSpeed = 1000; gameOver = false;
  p = geraPecas(con, bord, updateScore, gameOverHandler);
  nextP = geraPecas(con, bord, updateScore, gameOverHandler);
  drawNextPiece(nextP, nextCtx, nextCanvas);
  p.draw();
  updateScore();
}

// Botões
startBtn.addEventListener('click', ()=>startGame());
restartBtn.addEventListener('click', ()=>restartGame());

// Controles
startControls(
  ()=>p,
  ()=>gameStarted,
  ()=>gameOver,
  startGame,
  restartGame
);
