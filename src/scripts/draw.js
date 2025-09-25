/*
  draw.js
  ------------------------
  Responsabilidade:
  - Funções de renderização adicionais.
  - Exemplo principal: drawNextPiece(piece)
      - Desenha a próxima peça no canvas lateral do jogo.
  - Mantém separada a lógica de renderização da lógica do tabuleiro e das peças.
  - Importado por game.js.
*/
/* draw.js
   Responsabilidade: desenhar a próxima peça no canvas lateral
*/
export function drawNextPiece(piece, nextCtx, nextCanvas) {
  nextCtx.clearRect(0,0,nextCanvas.width,nextCanvas.height);
  let shape = piece.tetromino[0];
  const size = 30;
  const pieceWidth = shape[0].length*size;
  const pieceHeight = shape.length*size;
  const offsetX = (nextCanvas.width-pieceWidth)/2;
  const offsetY = (nextCanvas.height-pieceHeight)/2;
  for(let r=0;r<shape.length;r++){
      for(let c=0;c<shape[r].length;c++){
          if(shape[r][c]){
              nextCtx.fillStyle = piece.cor;
              nextCtx.fillRect(offsetX+c*size, offsetY+r*size, size, size);
              nextCtx.strokeStyle="#222";
              nextCtx.strokeRect(offsetX+c*size, offsetY+r*size, size, size);
          }
      }
  }
}
