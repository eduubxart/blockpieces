const cvs = document.getElementById("tetris");// pega o elemento canvas
/*cvs.getContext("2d") --> ele ta permitindo que desenhe em retangulos,linhas e etc... no canvas*/
const con = cvs.getContext("2d");// pega o contexto 2d do canvas
const scoreElement = document.getElementById("score");// pega o elemento score do html

const linha = 20;// numero de linhas
const col = 10;// numero de colunas
const sq = 20; // tamanho do quadrado
const vacant = "#FF6E30"// cor do quadro vazio

cvs.width = col * sq;      // largura do canvas = número de colunas * tamanho de cada quadradinho
cvs.height = linha * sq;   // altura do canvas = número de linhas * tamanho de cada quadradinho
con.imageSmoothingEnabled = false; // desliga o "suavizador de imagens"
// desenha o quadro
function desenhaQuad(x, y,asset) {/* desenhaQuad(x,y,cor) função que desenha um quadro da grade*/
	const px = x * sq; // posição real em px na horizontal
	const py = y * sq; // posição real em px na vertical

	con.fillStyle = cor; //quadrado com a cor escolhida
	con.fillReact(px, py, sq, sq); // desenha o quadrado

	con.stroleStyle = "black"; // cor da borda do quadrado
	con.strokeRect(px, py, sq, sq); // desenha a borda do quadrado
}
desenhaQuad(3, 5, "blue");// desenha um quadrado azul na posição (3,5)
desenhaQuad(4,5, vacant);// desenha um quadrado vazio na posição (4,5)

let O_block = new Image();// cria um novo objeto de imagem
O_block.src = './assets/images/O.png';// define o src da imagem
