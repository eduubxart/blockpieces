/*
  pieces.js
  ------------------------
  Responsabilidade:
  - Define as peças (tetrominos) e suas cores.
  - Contém a classe Piece e a função geraPecas()
  - Importa board.js para desenhar e verificar colisão.
  - Importa matrizes.js para as formas.
*/

import { col, linha, quad, tab } from './board.js';
import { Z, S, T, O, L, I, J } from './matrizes.js';

export const pecas = [
  [Z, "red"],
  [S, "green"],
  [T, "yellow"],
  [O, "blue"],
  [L, "purple"],
  [I, "cyan"],
  [J, "orange"]
];

export function geraPecas(con, bord, updateScoreCallback, gameOverHandler) {
  let r = Math.floor(Math.random() * pecas.length);
  return new Piece(
    pecas[r][0],
    pecas[r][1],
    con,
    bord,
    updateScoreCallback,
    gameOverHandler
  );
}

export class Piece {
  constructor(tetromino, cor, con, bord, updateScoreCallback, gameOverHandler) {
    this.tetromino = tetromino;
    this.cor = cor;
    this.con = con;
    this.bord = bord;
    this.tetrominoN = 0;
    this.ativarTetromino = this.tetromino[0];
    this.x = 3;
    this.y = -2;
    this.updateScore = updateScoreCallback;
    this.gameOverHandler = gameOverHandler;
  }

  fill(cor = this.cor) {
    for (let r = 0; r < this.ativarTetromino.length; r++) {
      for (let c = 0; c < this.ativarTetromino[r].length; c++) {
        if (this.ativarTetromino[r][c]) {
          this.con.fillStyle = cor;
          this.con.fillRect((this.x + c) * 30, (this.y + r) * 30, 30, 30);
          this.con.strokeStyle = "#222";
          this.con.strokeRect((this.x + c) * 30, (this.y + r) * 30, 30, 30);
        }
      }
    }
  }

  draw() { this.fill(); }
  unDraw() { this.fill(quad); }

  colisao(x, y, piece = this.ativarTetromino) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (!piece[r][c]) continue;
        let newX = this.x + c + x;
        let newY = this.y + r + y;
        if (newX < 0 || newX >= col || newY >= linha) return true;
        if (newY < 0) continue;
        if (this.bord[newY][newX] != quad) return true;
      }
    }
    return false;
  }

  moveDown() {
    if (!this.colisao(0, 1, this.ativarTetromino)) {
      this.unDraw();
      this.y++;
      this.draw();
    } else {
      this.lock();
    }
  }

  moveLeft() {
    if (!this.colisao(-1, 0, this.ativarTetromino)) {
      this.unDraw();
      this.x--;
      this.draw();
    }
  }

  moveRight() {
    if (!this.colisao(1, 0, this.ativarTetromino)) {
      this.unDraw();
      this.x++;
      this.draw();
    }
  }

  rotate() {
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

  lock() {
    for (let r = 0; r < this.ativarTetromino.length; r++) {
      for (let c = 0; c < this.ativarTetromino[r].length; c++) {
        if (!this.ativarTetromino[r][c]) continue;
        if (this.y + r < 0) {
          this.gameOverHandler();
          return;
        }
        this.bord[this.y + r][this.x + c] = this.cor;
      }
    }

    // Linhas completas
    let linhasCompletas = [];
    for (let r = linha - 1; r >= 0; r--) {
      if (this.bord[r].every(cell => cell != quad)) {
        linhasCompletas.push(r);
      }
    }

    if (linhasCompletas.length > 0) {
      let blinkCount = 0;
      let blinkInterval = setInterval(() => {
        linhasCompletas.forEach(r => {
          for (let c = 0; c < col; c++) {
            this.bord[r][c] = (blinkCount % 2 === 0) ? "white" : this.cor;
          }
        });
        tab(this.con, this.bord);
        blinkCount++;
        if (blinkCount > 5) {
          clearInterval(blinkInterval);
          linhasCompletas.forEach(r => {
            this.bord.splice(r, 1);
            this.bord.unshift(Array(col).fill(quad));
          });
          if (this.updateScore) this.updateScore();
          tab(this.con, this.bord);
        }
      }, 100);
    } else {
      if (this.updateScore) this.updateScore();
      tab(this.con, this.bord);
    }
  }
}
