// ranking.js — ranking online via Node + MongoDB

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
    <p>${player.score} pts</p>
  `;
}

// Função pra carregar ranking do backend
async function carregarRanking() {
  try {
    const res = await fetch('/api/users/ranking');
    const ranking = await res.json();

    // Ordena do maior pro menor (por precaução)
    ranking.sort((a, b) => b.score - a.score);

    // Preenche pódio top 3
    createPodioSlot("primeiro", ranking[0]);
    createPodioSlot("segundo", ranking[1]);
    createPodioSlot("terceiro", ranking[2]);

    // Preenche outros jogadores (4º lugar em diante)
    const outrosDiv = document.getElementById("outros-ranking");
    outrosDiv.innerHTML = "";
    for (let i = 3; i < ranking.length; i++) {
      const p = ranking[i];
      const div = document.createElement("div");
      div.classList.add("rank-slot");
      div.innerHTML = `
        <img src="${p.profilePic || '/assets/default-avatar.png'}" alt="${p.username}">
        <p>${p.username} - ${p.score} pts</p>
      `;
      outrosDiv.appendChild(div);
    }

  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
  }
}

// Atualiza ranking a cada 5 segundos
setInterval(carregarRanking, 5000);

// Carrega ranking ao iniciar a página
carregarRanking();
