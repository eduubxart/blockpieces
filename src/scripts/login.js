
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault(); // evita recarregar a página

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    loginMessage.textContent = "Preencha todos os campos!";
    return;
  }

  // salva usuário no localStorage
  localStorage.setItem("currentUser", JSON.stringify({ username, password }));

  loginMessage.textContent = "Login realizado! Redirecionando...";

  // redireciona pro jogo
  setTimeout(() => {
    window.location.href = "game.html";
  }, 1000);
});
