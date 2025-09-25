/*
  board.js
  ------------------------
  Responsabilidade:
  - Gerenciar o tabuleiro do Tetris.
  - Define o tamanho (linhas, colunas) e o tamanho de cada quadrado.
  - Variável 'bord' mantém o estado do tabuleiro.
  - Funções exportadas:
      - resetBoard(): cria um tabuleiro vazio.
      - desenhaQuad(con, x, y, cor): desenha um quadrado no canvas.
      - tab(con): desenha todo o tabuleiro no canvas.
  - Importado por pieces.js e game.js.
*/
/* board.js
   Responsabilidade: gerenciamento do tabuleiro
*/
export const linha = 20;
export const col = 10;
export const sq = 30;
export const quad = "black";

export function resetBoard() {
  const bord = [];
  for(let r=0;r<linha;r++) bord[r]=Array(col).fill(quad);
  return bord; // retorna o tabuleiro
}

export function desenhaQuad(con,x,y,cor){
  con.fillStyle = cor;
  con.fillRect(x*sq,y*sq,sq,sq);
  con.strokeRect(x*sq,y*sq,sq,sq);
}

export function tab(con,bord){
  con.clearRect(0,0,col*sq,linha*sq);
  for(let r=0;r<linha;r++){
    for(let c=0;c<col;c++){
      desenhaQuad(con,c,r,bord[r][c]);
    }
  }
}
