(function () {
  const API = "http://localhost:4000/resenias";

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

  
  window.addEventListener("DOMContentLoaded", () => {
    const reseñasLocales = document.querySelectorAll(
      ".review-card:not([data-id])"
    );

    reseñasLocales.forEach((card, index) => {
      const id = `local_${index}`;
      card.dataset.id = id;

     
      if (!card.querySelector(".review-actions")) {
        const actions = document.createElement("div");
        actions.className = "review-actions";
        actions.innerHTML = `
        <button class="btn-like" data-id="${id}" title="Me gusta">👍 <span>0</span></button>
        <button class="btn-dislike" data-id="${id}" title="No me gusta">👎 <span>0</span></button>
      `;
        card.appendChild(actions);
      }
    });

    
    if (typeof activarBotonesReaccion === "function") {
      activarBotonesReaccion();
    }
  });

  function renderResenas(items) {
    contenedorResenas.innerHTML =
      '<h2 class="section-title">💬 Reseñas de Clientes</h2>';

    if (!items.length) {
      mostrarMensajeResenas("No hay reseñas todavía.");
      return;
    }

    items.forEach((r) => {
      const id = r.id || r._id || crypto.randomUUID(); 
      const likes = r.likes || 0;
      const dislikes = r.dislikes || 0;

      const card = document.createElement("div");
      card.className = "review-card";
      card.dataset.id = id;

      card.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <div class="reviewer-avatar">${
            r.nombre?.[0]?.toUpperCase() || "U"
          }</div>
          <div>
            <div class="reviewer-name">${escapeHtml(
              r.nombre || "Anónimo"
            )}</div>
            <div class="review-date">Reciente</div>
          </div>
        </div>
        <div class="review-rating">${"⭐".repeat(r.calificacion || 0)}</div>
      </div>
      <p class="review-text">${escapeHtml(r.comentario || "")}</p>
      <div class="review-actions">
        <button class="btn-like" data-id="${id}" title="Me gusta">👍 <span>${likes}</span></button>
        <button class="btn-dislike" data-id="${id}" title="No me gusta">👎 <span>${dislikes}</span></button>
      </div>
    `;

      contenedorResenas.appendChild(card);
    });

    activarBotonesReaccion();
  }
  function activarBotonesReaccion() {
    const likeBtns = contenedorResenas.querySelectorAll(".btn-like");
    const dislikeBtns = contenedorResenas.querySelectorAll(".btn-dislike");

    likeBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const key = `reseña_voto_${id}`;
        if (localStorage.getItem(key))
          return alert("Ya votaste esta reseña 👍");

        const countEl = btn.querySelector("span");
        let likes = parseInt(countEl.textContent) + 1;
        countEl.textContent = likes;
        localStorage.setItem(key, "like");

        try {
          await fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ likes }),
          });
        } catch (err) {
          console.error("Error actualizando like:", err);
        }
      });
    });

    dislikeBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const key = `reseña_voto_${id}`;
        if (localStorage.getItem(key))
          return alert("Ya votaste esta reseña 👎");

        const countEl = btn.querySelector("span");
        let dislikes = parseInt(countEl.textContent) + 1;
        countEl.textContent = dislikes;
        localStorage.setItem(key, "dislike");

        try {
          await fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dislikes }),
          });
        } catch (err) {
          console.error("Error actualizando dislike:", err);
        }
      });
    });
  }

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



const REST_API = "http://localhost:4000/restaurantes";
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