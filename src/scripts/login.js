const formLogin = document.getElementById("loginForm");
const formRegister = document.getElementById("registerForm");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

// FUNÇÃO LOGIN
async function loginUsuario(username, password) {
  if (!username || !password) return false;
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("currentUser", JSON.stringify({
      username: data.username,
      profilePic: data.profilePic,
      score: data.score
    }));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// FUNÇÃO REGISTRO
async function registrarUsuario(username, password) {
  if (!username || !password) return false;
  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, profilePic: '/assets/default-avatar.png' })
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("currentUser", JSON.stringify({
      username: data.username,
      profilePic: data.profilePic,
      score: data.score
    }));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// LOGIN
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
    
    // adiciona efeito verde
    usernameInput.classList.add("input-correct");
    passwordInput.classList.add("input-correct");

    // espera 0.5s e redireciona
    setTimeout(() => {
      window.location.href = "game.html";
    }, 500);

  } else {
    loginError.textContent = "Usuário ou senha incorretos!";
  }
});

// REGISTRO
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
