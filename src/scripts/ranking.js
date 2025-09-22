const rankingBody = document.getElementById("ranking-body");

// pega o ranking do localStorage
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

// se não tiver nada salvo
if (ranking.length === 0) {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = 3;
  cell.textContent = "Nenhum score ainda.";
  cell.style.textAlign = "center";
  row.appendChild(cell);
  rankingBody.appendChild(row);
} else {
  ranking.slice(0, 10).forEach((player, index) => {
    const row = document.createElement("tr");

    const posCell = document.createElement("td");
    posCell.textContent = index + 1;

    const nameCell = document.createElement("td");
    nameCell.textContent = player.username;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = player.score;

    row.appendChild(posCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);

    rankingBody.appendChild(row);
  });
}
