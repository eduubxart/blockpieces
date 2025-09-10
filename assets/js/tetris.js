const cvs = document.getElementById("tetris");// pega o elemento canvas
const con = cvs.getContext("2d");// pega o contexto 2d do canvas
const scoreElement = document.getElementById("score");// pega o elemento score do html

const linha = 20;// numero de linhas
const col = 10;// numero de colunas
const sq = 20; // tamanho do quadrado
const vacant = "#FF6E30"// cor do quadro vazio

// desenha o quadro
function desenhaQuad(x,y,cor){// função que desenha o quadrado
   con.drawImage(Image, x*sq, y*sq, sq, sq);//desenha o png na posição certa.
}
let T_block = new Image();// cria um novo objeto de imagem
T_block.src = '/assets/img/T.png';// define o src da imagem
