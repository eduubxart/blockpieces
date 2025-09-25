/*
  controls.js
  ------------------------
  Responsabilidade:
  - Captura eventos do teclado.
  - Funções:
      - moveLeft(), moveRight(), moveDown(), rotate()
      - Enter para start/restart
  - Pode exportar uma função startControls() para ativar os listeners no game.js.
  - Importado por game.js.
*/
/* controls.js
   Responsabilidade: capturar teclado e controlar peça
*/
export function startControls(p, gameStarted, gameOver, startGame, restartGame) {
  document.addEventListener("keydown", function(event){
      if(event.keyCode == 13){
          if(!gameStarted()) startGame();
          else if(gameOver()) restartGame();
      }

      if([37,38,39,40].includes(event.keyCode)) event.preventDefault();

      if(gameStarted() && !gameOver()){
          if(event.keyCode==37) p.moveLeft();
          if(event.keyCode==38) p.rotate();
          if(event.keyCode==39) p.moveRight();
          if(event.keyCode==40) p.moveDown();
      }
  });
}
