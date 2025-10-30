const API = "https://restaurante-tiana-s-backend.onrender.com";

(function () {
  const API = `${API}/resenias`;

  let btn =
    document.querySelector("#btnEscribirResena") ||
    Array.from(document.querySelectorAll("button")).find(
      (b) =>
        b.textContent &&
        b.textContent.trim().toLowerCase().includes("escribir reseña")
    );

  if (!btn) {
    console.warn('No se encontró el botón "Escribir reseña".');
    return;
  }

  let contenedorResenas = document.querySelector("#reseñas .reviews-section");
  if (!contenedorResenas) {
    console.warn(
      'No se encontró la sección ".reviews-section" dentro de #reseñas.'
    );
    return;
  }

  let modal = document.querySelector(".modal-resena");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal-resena";
    modal.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true">
        <span class="close-x" title="Cerrar">&times;</span>
        <h2>Escribir reseña</h2>
        <form id="formResenaDin">
          <label for="nombreRes">Tu nombre</label>
          <input id="nombreRes" name="nombre" type="text" required placeholder="Tu nombre">

         <label>Calificación</label>
<div id="ratingStars" class="rating-stars">
  <i class="fas fa-star" data-value="1"></i>
  <i class="fas fa-star" data-value="2"></i>
  <i class="fas fa-star" data-value="3"></i>
  <i class="fas fa-star" data-value="4"></i>
  <i class="fas fa-star" data-value="5"></i>
</div>
<input type="hidden" id="calificacionRes" name="calificacion" value="0" required>


          <label for="comentarioRes">Reseña</label>
          <textarea id="comentarioRes" name="comentario" rows="4" required placeholder="Escribe tu opinión..."></textarea>

          <p id="errorModalMsg" class="error-modal-msg" style="display:none;"></p>

          <button type="submit">Enviar reseña</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const starContainer = modal.querySelector("#ratingStars");
  const hiddenInput = modal.querySelector("#calificacionRes");

  if (starContainer) {
    const stars = Array.from(starContainer.querySelectorAll("i"));

    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const value = parseInt(star.dataset.value, 10);
        hiddenInput.value = value;

        stars.forEach((s) => {
          s.style.color =
            parseInt(s.dataset.value, 10) <= value ? "#f5c518" : "#ccc";
        });
      });

      star.addEventListener("mouseover", () => {
        const hoverValue = parseInt(star.dataset.value, 10);
        stars.forEach((s) => {
          s.style.color =
            parseInt(s.dataset.value, 10) <= hoverValue ? "#f5c518" : "#ccc";
        });
      });

      star.addEventListener("mouseout", () => {
        const currentValue = parseInt(hiddenInput.value, 10);
        stars.forEach((s) => {
          s.style.color =
            parseInt(s.dataset.value, 10) <= currentValue ? "#f5c518" : "#ccc";
        });
      });
    });
  }

  if (!document.getElementById("estilos-modal-resenas")) {
    const style = document.createElement("style");
    style.id = "estilos-modal-resenas";
    style.textContent = `
      .modal-resena {
        display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%;
        background:rgba(165,155,160,0.63); align-items:center; justify-content:center;
      }
      .modal-card {
        background:rgba(241,125,187,0.95); border-radius:10px; max-width:420px; width:90%;
        padding:20px; box-shadow:0 6px 30px rgba(0,0,0,0.3);
      }
      .close-x { float:right; font-size:22px; cursor:pointer; }
      .modal-card h2 { margin-top:0; }
      .modal-resena input, .modal-resena textarea {
        width:100%; margin-top:6px; border-radius:6px; border:1px solid #ccc; padding:8px;
      }
      .modal-resena button[type="submit"] {
        margin-top:12px; background:#764ba2; color:white; border:none;
        border-radius:6px; padding:10px 16px; cursor:pointer;
      }
      .error-modal-msg {
        color:#b30000; font-weight:600; margin:10px 0 0; text-align:center;
      }
      .resena { background:#fff; border-radius:8px; padding:12px; margin-bottom:10px;
        box-shadow:0 2px 8px rgba(0,0,0,0.05);
      }
      .estrellas { color:#f5c518; margin-bottom:6px; }
      .mensaje-resenas { text-align:center; font-weight:500; margin:12px 0; }
      .mensaje-error { color:red; }
    `;
    document.head.appendChild(style);
  }

  const form = document.getElementById("formResenaDin");
  const closeX = modal.querySelector(".close-x");
  const errorModalMsg = modal.querySelector("#errorModalMsg");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    document.getElementById("nombreRes").focus();
    errorModalMsg.style.display = "none";
  });

  closeX.addEventListener("click", () => (modal.style.display = "none"));
  modal.addEventListener("click", (ev) => {
    if (ev.target === modal) modal.style.display = "none";
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") modal.style.display = "none";
  });

  async function cargarResenas() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Error en la solicitud: " + res.status);
      const data = await res.json();
      renderResenas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando reseñas:", err);
      mostrarMensajeResenas(
        "No se pudieron cargar las reseñas. Verifica el servidor.",
        true
      );
    }
  }

 

  function inicializarVotos() {
    document.querySelectorAll(".review-card").forEach((card, index) => {
     
      if (card.querySelector(".vote-buttons")) return;

  
      const voteContainer = document.createElement("div");
      voteContainer.classList.add("vote-buttons");
      voteContainer.style.display = "flex";
      voteContainer.style.gap = "10px";
      voteContainer.style.marginTop = "10px";

      const btnLike = document.createElement("button");
      btnLike.innerHTML = '<i class="fas fa-thumbs-up"></i> Me gusta';
      btnLike.classList.add("btn-like");

      const btnDislike = document.createElement("button");
      btnDislike.innerHTML = '<i class="fas fa-thumbs-down"></i> No me gusta';
      btnDislike.classList.add("btn-dislike");

      
      voteContainer.appendChild(btnLike);
      voteContainer.appendChild(btnDislike);
      card.appendChild(voteContainer);

     
      const reviewId = `review_${index}`;

      
      //const votoPrevio = localStorage.getItem(reviewId);
      //if (votoPrevio) {
       // bloquearVoto(btnLike, btnDislike, votoPrevio);
        //card.dataset.voted = "true";
      //}

      
      btnLike.addEventListener("click", () => {
        manejarVoto(reviewId, "like", btnLike, btnDislike, card);
      });

      btnDislike.addEventListener("click", () => {
        manejarVoto(reviewId, "dislike", btnLike, btnDislike, card);
      });
    });
  }

  function manejarVoto(reviewId, tipo, btnLike, btnDislike, card) {
    if (card.dataset.voted === "true") return;

    if (tipo === "like") {
      btnLike.classList.add("active");
      btnDislike.classList.add("disabled");
    } else {
      btnDislike.classList.add("active");
      btnLike.classList.add("disabled");
    }

    
    localStorage.setItem(reviewId, tipo);
    card.dataset.voted = "true";
  }

 
  function bloquearVoto(btnLike, btnDislike, tipo) {
    if (tipo === "like") {
      btnLike.classList.add("active");
      btnDislike.classList.add("disabled");
    } else {
      btnDislike.classList.add("active");
      btnLike.classList.add("disabled");
    }
  }

  
  document.addEventListener("DOMContentLoaded", inicializarVotos);

  function mostrarMensajeResenas(texto, esError = false) {
    const msg = document.createElement("p");
    msg.className = `mensaje-resenas ${esError ? "mensaje-error" : ""}`;
    msg.textContent = texto;
    contenedorResenas.appendChild(msg);
  }

  function escapeHtml(s) {
    return s.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorModalMsg.style.display = "none";
    const nombre = document.getElementById("nombreRes").value.trim();
    const calificacion = parseInt(
      document.getElementById("calificacionRes").value || "0",
      10
    );
    const comentario = document.getElementById("comentarioRes").value.trim();

    if (!nombre || !comentario || calificacion < 1 || calificacion > 5) {
      errorModalMsg.textContent =
        "Por favor completa todos los campos y usa una calificación válida (1–5).";
      errorModalMsg.style.display = "block";
      return;
    }

    const payload = { nombre, calificacion, comentario };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      modal.style.display = "none";
      form.reset();
      await cargarResenas();
      alert("Reseña enviada con éxito.");
    } catch (err) {
      console.error("Error enviando reseña:", err);
      errorModalMsg.textContent =
        "No se pudo enviar la reseña. Verifica tu conexión o el servidor.";
      errorModalMsg.style.display = "block";
    }
  });

  cargarResenas();
})();



const REST_API = `${API}/restaurantes`;
const searchInput = document.getElementById("searchInput");
const resultadosContainer = document.getElementById("resultadosRestaurantes");
const searchMessage = document.getElementById("searchMessage");

let restaurantesBackend = [];
let cardsLocales = [];

window.addEventListener("DOMContentLoaded", async () => {
  cardsLocales = Array.from(document.querySelectorAll(".restaurant-card"));
  await cargarRestaurantesBackend();
});


async function cargarRestaurantesBackend() {
  try {
    const res = await fetch(REST_API);
    if (!res.ok) throw new Error("Error al obtener restaurantes");
    const data = await res.json();
    restaurantesBackend = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error cargando restaurantes del backend:", err);
    mostrarMensaje("No se pudieron cargar los restaurantes del servidor.", true);
  }
}


if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    buscarRestaurantes(query);
  });
}


function buscarRestaurantes(query) {
  limpiarResultadosBackend();
  mostrarMensaje("");

  if (!query) {
    cardsLocales.forEach(card => (card.style.display = ""));
    mostrarMensaje("");
    return;
  }


  let coincidenciasLocales = 0;
  cardsLocales.forEach(card => {
    const nombre = card.querySelector(".card-title")?.textContent?.toLowerCase() || "";
    const categoria = card.querySelector(".card-category")?.textContent?.toLowerCase() || "";
    const descripcion = card.querySelector(".card-description")?.textContent?.toLowerCase() || "";
    const coincide = nombre.includes(query) || categoria.includes(query) || descripcion.includes(query);
    card.style.display = coincide ? "" : "none";
    if (coincide) coincidenciasLocales++;
  });

  const backendFiltrados = restaurantesBackend.filter(r =>
    (r.nombre && r.nombre.toLowerCase().includes(query)) ||
    (r.categoria && r.categoria.toLowerCase().includes(query)) ||
    (r.descripcion && r.descripcion.toLowerCase().includes(query))
  );


  backendFiltrados.forEach(r => {
    const yaExiste = cardsLocales.some(card =>
      card.querySelector(".card-title")?.textContent?.trim().toLowerCase() === r.nombre?.toLowerCase()
    );
    if (!yaExiste) {
      const card = crearCardBackend(r);
      resultadosContainer.appendChild(card);
    }
  });


  const total = coincidenciasLocales + backendFiltrados.length;
  if (total === 0) {
    mostrarMensaje(`No se encontraron resultados para "${query}".`);
  }
}


function crearCardBackend(r) {
  const card = document.createElement("div");
  card.className = "restaurant-card";
  card.dataset.backend = "true";
  card.innerHTML = `
    <div class="card-image">
      <img src="${r.imagen || "./multimedia/default.png"}" alt="${r.nombre}">
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">${r.nombre}</h3>
        <div class="rating">
          <i class="fas fa-star"></i> ${r.calificacion || "-"}
        </div>
      </div>
      <p class="card-category">${r.categoria || ""}</p>
      <p class="card-description">${r.descripcion || ""}</p>
      <div class="card-footer">
        <div class="card-info">
          <span><i class="fas fa-dollar-sign"></i> $$</span>
        </div>
        <button class="btn-view">Ver Menú</button>
      </div>
    </div>
  `;
  return card;
}


function limpiarResultadosBackend() {
  const cardsExtras = resultadosContainer.querySelectorAll(".restaurant-card[data-backend='true']");
  cardsExtras.forEach(c => c.remove());
}


function mostrarMensaje(texto, esError = false) {
  searchMessage.textContent = texto;
  if (esError) {
    searchMessage.classList.add("error");
  } else {
    searchMessage.classList.remove("error");
  }
}

const btnAdmin = document.querySelector("#btnAdmin");
const modalAdmin = document.getElementById("modalAdminLogin");
const closeAdmin = modalAdmin.querySelector(".close-x");
const formAdmin = document.getElementById("formAdminLogin");
const errorAdminMsg = document.getElementById("errorAdminMsg");

(function () {
  
  let modalLogin = document.querySelector(".modal-login");
  if (!modalLogin) {
    modalLogin = document.createElement("div");
    modalLogin.className = "modal-login";
    modalLogin.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true">
        <span class="close-x" title="Cerrar">&times;</span>
        <h2>Inicio de sesión</h2>
        <form id="formLogin">
          <label for="username">Usuario</label>
          <input id="username" name="username" type="text" required placeholder="Usuario">
          
          <label for="password">Contraseña</label>
          <input id="password" name="password" type="password" required placeholder="Contraseña">

          <p id="errorLoginMsg" class="error-modal-msg" style="display:none;"></p>

          <button type="submit">Ingresar</button>
        </form>
      </div>
    `;
    document.body.appendChild(modalLogin);
  }

  
  if (!document.getElementById("estilos-modal-login")) {
    const style = document.createElement("style");
    style.id = "estilos-modal-login";
    style.textContent = `
      .modal-login {
        display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%;
        background:rgba(0,0,0,0.5); align-items:center; justify-content:center;
      }
      .modal-login .modal-card {
        background:pink; border-radius:10px; max-width:360px; width:90%;
        padding:20px; box-shadow:0 6px 30px rgba(0,0,0,0.3);
      }
      .modal-login .close-x { float:right; font-size:22px; cursor:pointer; }
      .modal-login h2 { margin-top:0; text-align:center; }
      .modal-login input { width:100%; margin-top:6px; border-radius:6px; border:1px solid #ccc; padding:8px; }
      .modal-login button[type="submit"] {
        margin-top:12px; background:#764ba2; color:white; border:none;
        border-radius:6px; padding:10px 16px; cursor:pointer; width:100%;
      }
      .error-modal-msg { color:#b30000; font-weight:600; margin:10px 0 0; text-align:center; }
    `;
    document.head.appendChild(style);
  }

 
  const btnLogin =
    document.querySelector("#btnLogin") || document.querySelector(".btn-admin");
  const formLogin = document.getElementById("formLogin");
  const closeX = modalLogin.querySelector(".close-x");
  const errorLoginMsg = modalLogin.querySelector("#errorLoginMsg");

  
  if (btnLogin) {
    btnLogin.addEventListener("click", (e) => {
      e.preventDefault();
      modalLogin.style.display = "flex";
      document.getElementById("username").focus();
      errorLoginMsg.style.display = "none";
    });
  }

  
  closeX.addEventListener("click", () => (modalLogin.style.display = "none"));
  modalLogin.addEventListener("click", (ev) => {
    if (ev.target === modalLogin) modalLogin.style.display = "none";
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") modalLogin.style.display = "none";
  });

 
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorLoginMsg.style.display = "none";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      errorLoginMsg.textContent = "Por favor completa todos los campos.";
      errorLoginMsg.style.display = "block";
      return;
    }

    try {
      const res = await fetch(`${API}/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Credenciales incorrectas");
      }

      
      window.location.href = "./admin.html";
    } catch (err) {
      console.error(err);
      errorLoginMsg.textContent =
        "No se pudo iniciar sesión. Verifica tus credenciales o el servidor.";
      errorLoginMsg.style.display = "block";
    }
  });
})();




