(function () {
  const loginForm = document.getElementById("loginForm");
  const errorLoginMsg = document.getElementById("errorLoginUserMsg");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorLoginMsg.style.display = "none";

      const correo = document.getElementById("usernameUser").value.trim();
      const contrasenia = document.getElementById("passwordUser").value.trim();

      if (!correo || !contrasenia) {
        errorLoginMsg.textContent = "Por favor completa todos los campos.";
        errorLoginMsg.style.display = "block";
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/v1/usuarios/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contrasenia }),
        });

        const data = await res.json();
        console.log("🟢 Respuesta del backend:", data);

        if (res.ok) {
          // ✅ Guardar token y rol en localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("rol", data.rol);
          console.log("✅ Token guardado en localStorage:", data.token);

          // Redirección según rol
          if (data.rol === "admin") {
            window.location.href = "./admin.html";
          } else if (data.rol === "usuario") {
            window.location.href = "./usuario.html";
          } else {
            window.location.href = "./index.html";
          }
        } else {
          errorLoginMsg.textContent =
            data.message || "Usuario o contraseña incorrectos.";
          errorLoginMsg.style.display = "block";
        }
      } catch (err) {
        console.error("❌ Error en login:", err);
        errorLoginMsg.textContent =
          "No se pudo conectar con el servidor. Intenta más tarde.";
        errorLoginMsg.style.display = "block";
      }
    });
  }

  // =========================
  // REGISTRO DE USUARIO
  // =========================
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
      const correo = registerForm
        .querySelector('input[type="email"]')
        .value.trim();
      const contrasenia = registerForm
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

      if (!nombre || !apellido || !rol || !correo || !contrasenia) {
        msg.textContent = "Por favor completa todos los campos.";
        msg.style.color = "red";
        msg.style.display = "block";
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        msg.textContent = "Por favor ingresa un correo válido.";
        msg.style.color = "red";
        msg.style.display = "block";
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:4000/api/v1/usuarios/registro",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              apellido,
              rol,
              correo,
              contrasenia,
            }),
          }
        );

        const data = await res.json();

        if (res.ok) {
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
          msg.textContent =
            data.message?.errors?.[0]?.msg ||
            data.message ||
            "No se pudo registrar el usuario.";
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

  // =========================
  // ANIMACIONES DE LOGIN/REGISTRO
  // =========================
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
