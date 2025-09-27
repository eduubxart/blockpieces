const formLogin = document.getElementById("loginForm");
const formRegister = document.getElementById("registerForm");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

// ===== MOCK LOGIN =====
async function loginUsuario(username, password) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify({
      username: user.username,
      profilePic: user.profilePic,
      score: user.score || 0
    }));
    return true;
  }
  return false;
}

// ===== MOCK REGISTRO =====
async function registrarUsuario(username, password) {
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some(u => u.username === username)) return false; // já existe

  const newUser = {
    username,
    password,
    profilePic: '/assets/default-avatar.png',
    score: 0
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  localStorage.setItem("currentUser", JSON.stringify({
    username: newUser.username,
    profilePic: newUser.profilePic,
    score: newUser.score
  }));

  return true;
}

// ===== LOGIN =====
formLogin.addEventListener("submit", async e => {
  e.preventDefault();
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    loginError.textContent = "Preencha todos os campos!";
    return;
  }

  const ok = await loginUsuario(username, password);

  if (ok) {
    loginError.textContent = "";

    // efeito verde
    usernameInput.classList.add("input-correct");
    passwordInput.classList.add("input-correct");

    setTimeout(() => {
      window.location.href = "game.html";
    }, 500);
  } else {
    loginError.textContent = "Usuário ou senha incorretos!";
  }
});

// ===== REGISTRO =====
formRegister.addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!username || !password) {
    registerError.textContent = "Preencha todos os campos!";
    return;
  }

  const ok = await registrarUsuario(username, password);
  if (ok) {
    registerError.textContent = "";
    window.location.href = "game.html";
  } else {
    registerError.textContent = "Não foi possível registrar! Nome pode já estar em uso.";
  }
});
