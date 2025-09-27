// ranking.js — ranking localStorage

// Cria slot do pódio
function createPodioSlot(slotId, player) {
  const slot = document.getElementById(slotId);
  if (!player) {
    slot.innerHTML = `<p>Vazio</p>`;
    return;
  }
  slot.innerHTML = `
    <img src="${player.profilePic || '/assets/default-avatar.png'}" alt="${player.username}">
    <p>${player.username}</p>
    <p>${player.score || 0} pts</p>
  `;
}

// Carrega ranking do localStorage
function carregarRankingLocal() {
  const ranking = JSON.parse(localStorage.getItem("users") || "[]");
  ranking.sort((a,b) => (b.score || 0) - (a.score || 0));

  // Pódio top 3
  createPodioSlot("primeiro", ranking[0]);
  createPodioSlot("segundo", ranking[1]);
  createPodioSlot("terceiro", ranking[2]);

  // Outros jogadores
  const outrosDiv = document.getElementById("outros-ranking");
  outrosDiv.innerHTML = "";
  for (let i = 3; i < ranking.length; i++) {
    const p = ranking[i];
    const div = document.createElement("div");
    div.classList.add("rank-slot");
    div.innerHTML = `
      <img src="${p.profilePic || '/assets/default-avatar.png'}" alt="${p.username}">
      <p>${p.username} - ${p.score || 0} pts</p>
    `;
    outrosDiv.appendChild(div);
  }
}

// Atualiza ranking a cada 5s
setInterval(carregarRankingLocal, 5000);
carregarRankingLocal();

// ===== Painel do jogador =====
const panel = document.getElementById('player-panel');
const toggle = document.getElementById('toggle-panel');
const rankingBtn = document.getElementById('open-ranking');

toggle.addEventListener('click', () => {
  panel.classList.toggle('open');
});

rankingBtn.addEventListener('click', () => {
  window.location.href = 'ranking.html'; // leva pro ranking
});

// ===== Score do jogador =====
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {score:0};
document.getElementById('player-score').textContent = `Score: ${currentUser.score || 0}`;

function updateScore(points) {
  currentUser.score = (currentUser.score || 0) + points;
  document.getElementById('player-score').textContent = `Score: ${currentUser.score}`;

  // Atualiza no localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  users = users.map(u => u.username === currentUser.username ? currentUser : u);
  localStorage.setItem("users", JSON.stringify(users));
}
