// ranking.js

// Puxa ranking do localStorage
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

// Função para pegar avatar do usuário
function getAvatar(username) {
  const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  const user = profiles.find(p => p.username === username);
  return user ? user.avatar : "/assets/default-avatar.png";
}

// Ordena ranking do maior para o menor score
ranking.sort((a, b) => b.score - a.score);

// Cria slot do pódio
function createPodioSlot(slotId, player) {
  const slot = document.getElementById(slotId);
  if (!player) {
    slot.innerHTML = `<p>Vazio</p>`;
    return;
  }
  slot.innerHTML = `
    <img src="${getAvatar(player.username)}" alt="${player.username}">
    <p>${player.username}</p>
    <p>${player.score} pts</p>
  `;
}

// Preenche pódio
createPodioSlot("primeiro", ranking[0]);
createPodioSlot("segundo", ranking[1]);
createPodioSlot("terceiro", ranking[2]);

// Preenche outros jogadores (4º lugar em diante)
const outrosDiv = document.getElementById("outros-ranking");
outrosDiv.innerHTML = ""; // limpa antes
for (let i = 3; i < ranking.length; i++) {
  const p = ranking[i];
  const div = document.createElement("div");
  div.classList.add("rank-slot");
  div.innerHTML = `
    <img src="${getAvatar(p.username)}" alt="${p.username}">
    <p>${p.username} - ${p.score} pts</p>
  `;
  outrosDiv.appendChild(div);
}

// Atualização online (opcional: atualiza a cada 5s)
setInterval(() => {
  ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.sort((a, b) => b.score - a.score);

  createPodioSlot("primeiro", ranking[0]);
  createPodioSlot("segundo", ranking[1]);
  createPodioSlot("terceiro", ranking[2]);

  outrosDiv.innerHTML = "";
  for (let i = 3; i < ranking.length; i++) {
    const p = ranking[i];
    const div = document.createElement("div");
    div.classList.add("rank-slot");
    div.innerHTML = `
      <img src="${getAvatar(p.username)}" alt="${p.username}">
      <p>${p.username} - ${p.score} pts</p>
    `;
    outrosDiv.appendChild(div);
  }
}, 5000); // a cada 5 segundos
