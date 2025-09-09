const cvs = document.getElementById("tetris");// pega o elemento canvas
const con = cvs.getContext("2d");// pega o contexto 2d do canvas
const scoreElement = document.getElementById("score");// pega o elemento score do html

const linha = 20;// numero de linhas
const col = 10;// numero de colunas
const sq = 20; // tamanho do quadrado
const vacant = "#FF6E30"// cor do quadro vazio

// desenha o quadro
function desenhaQuad(x,y,cor){// função que desenha o quadrado
    con.fillStyle = cor;// 
    con.fillRect(x*sq,y*sq,sq,sq);// desenha o retangulo

    con.strokeStyle = "#FFC154";// cor da borda
    con.strokeRect(x*sq,y*sq,sq,sq);
}