(function () {
 
  const loginForm = document.getElementById("loginForm");
  const errorLoginMsg = document.getElementById("errorLoginUserMsg");

  if (loginForm) {
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
        const res = await fetch("http://localhost:4000/api/v1/usuarios/login", {
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
  }

  const registerForm = document.querySelector(".sign-up-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

     
      const nombre = registerForm
        .querySelector('input[placeholder="Nombre"]')
        .value.trim();
      const apellido = registerForm
        .querySelector('input[placeholder="Apellido"]')
        .value.trim();
      const rol = registerForm.querySelector("select").value;
      const email = registerForm
        .querySelector('input[type="email"]')
        .value.trim();
      const password = registerForm
        .querySelector('input[type="password"]')
        .value.trim();

     
      let msg = registerForm.querySelector(".form-msg");
      if (!msg) {
        msg = document.createElement("p");
        msg.classList.add("form-msg");
        msg.style.marginTop = "10px";
        msg.style.fontWeight = "bold";
        registerForm.appendChild(msg);
      }

      
      msg.style.display = "none";
      msg.textContent = "";

      
      if (!nombre || !apellido || !rol || !email || !password) {
        msg.textContent = "Por favor completa todos los campos.";
        msg.style.color = "red";
        msg.style.display = "block";
        return;
      }

      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        msg.textContent = "Por favor ingresa un correo válido.";
        msg.style.color = "red";
        msg.style.display = "block";
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/v1/usuarios/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, apellido, rol, email, password }),
        });

        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("Respuesta del servidor no válida.");
        }

        if (res.ok && data.success) {
          msg.textContent = "Registro exitoso. Ahora puedes iniciar sesión.";
          msg.style.color = "green";
          msg.style.display = "block";

          
          registerForm.reset();
          setTimeout(() => {
            document
              .querySelector(".container")
              .classList.remove("sign-up-mode");
            msg.style.display = "none";
          }, 2000);
        } else {
          msg.textContent = data.message || "No se pudo registrar el usuario.";
          msg.style.color = "red";
          msg.style.display = "block";
        }
      } catch (err) {
        console.error(err);
        msg.textContent =
          "No se pudo conectar con el servidor. Intenta más tarde.";
        msg.style.color = "red";
        msg.style.display = "block";
      }
    });
  }

  
  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");

  if (sign_up_btn && sign_in_btn && container) {
    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });

    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }
})();
