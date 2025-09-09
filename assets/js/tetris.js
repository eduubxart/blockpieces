function desenhaQuad(x,y,cor){
    con.fillStyle = cor;
    con.fillRect(x*sq,y*sq,sq,sq);

    con.strokeStyle = "BLACK";
    con.strokeRect(x*sq,y*sq,sq,sq);
}