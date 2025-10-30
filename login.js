(function () {
  const loginForm = document.getElementById("loginForm");
  const errorLoginMsg = document.getElementById("errorLoginUserMsg");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorLoginMsg.style.display = "none";

    const username = document.getElementById("usernameUser").value.trim();
    const password = document.getElementById("passwordUser").value.trim();

    if (!username || !password) {
      errorLoginMsg.textContent = "Por favor completa todos los campos.";
      errorLoginMsg.style.display = "block";
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data;
      try {
        data = await res.json(); 
      } catch {
        throw new Error("Respuesta del servidor no válida.");
      }

      if (res.ok && data.success) {
        
        window.location.href = "./index.html";
      } else {
        errorLoginMsg.textContent =
          data.message || "Usuario o contraseña incorrectos.";
        errorLoginMsg.style.display = "block";
      }
    } catch (err) {
      console.error(err);
      errorLoginMsg.textContent =
        "No se pudo conectar con el servidor. Intenta más tarde.";
      errorLoginMsg.style.display = "block";
    }
  });
})();

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
