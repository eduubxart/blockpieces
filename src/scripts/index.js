/*
  index.js
  ------------------------
  Responsabilidade:
  - Controlar a tela de login.
  - Permitir que o usuário digite um nome único.
  - Escolher um avatar entre as opções.
  - Salvar usuário no localStorage.
  - Redirecionar para game.html após login.
*/

// Referências HTML
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username-input');
const avatarChoices = document.querySelectorAll('.avatar-choice');

let selectedAvatar = avatarChoices[0].dataset.avatar; // Avatar padrão

// Seleção de avatar
avatarChoices.forEach(avatar => {
  avatar.addEventListener('click', () => {
    selectedAvatar = avatar.dataset.avatar;

    // Marca visualmente o escolhido
    avatarChoices.forEach(a => a.style.border = 'none');
    avatar.style.border = '2px solid #fff';
  });
});

// Botão login
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert('Digite um nome de usuário!');
    return;
  }

  // Checar se já existe no ranking
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  const nameExists = ranking.some(u => u.username.toLowerCase() === username.toLowerCase());
  if (nameExists) {
    alert('Nome já usado, escolha outro!');
    return;
  }

  // Salva usuário atual
  const currentUser = { username, avatar: selectedAvatar };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  // Redireciona para o jogo
  window.location.href = '/src/pages/game.html';
});
