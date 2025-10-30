(function () {
  const API = "http://localhost:4000/api/v1/resenias";

  let btn =
    document.querySelector("#btnEscribirResena") ||
    Array.from(document.querySelectorAll("button")).find(
      (b) =>
        b.textContent &&
        b.textContent.trim().toLowerCase().includes("escribir reseña")
    );

  if (!btn) {
    console.warn('No se encontró el botón "Escribir reseña".');
  }

  let contenedorResenas = document.querySelector("#reseñas .reviews-section");
  if (!contenedorResenas) {
    console.warn(
      'No se encontró la sección ".reviews-section" dentro de #reseñas.'
    );
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
      .error-modal-msg { color:#b30000; font-weight:600; margin:10px 0 0; text-align:center; }
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

  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
      const nombreField = document.getElementById("nombreRes");
      if (nombreField) nombreField.focus();
      if (errorModalMsg) errorModalMsg.style.display = "none";
    });
  }

  if (closeX)
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
      if (typeof renderResenas === "function") {
        renderResenas(Array.isArray(data) ? data : []);
      } else if (contenedorResenas) {
        renderResenasLocalFallback(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error cargando reseñas:", err);
      mostrarMensajeResenas(
        "No se pudieron cargar las reseñas. Verifica el servidor.",
        true
      );
    }
  }

  function renderResenasLocalFallback(list) {
    if (!contenedorResenas) return;
    contenedorResenas.innerHTML = "";
    if (!list.length) {
      contenedorResenas.innerHTML =
        '<p class="mensaje-resenas">No hay reseñas aún.</p>';
      return;
    }
    list.forEach((r) => {
      const div = document.createElement("div");
      div.className = "resena";
      div.innerHTML = `
        <div class="estrellas">${"★".repeat(r.calificacion || 0)}</div>
        <strong>${escapeHtml(r.nombre || "Anónimo")}</strong>
        <p>${escapeHtml(r.comentario || "")}</p>
      `;
      contenedorResenas.appendChild(div);
    });
    inicializarVotos();
  }

  function inicializarVotos() {
    document
      .querySelectorAll(".review-card, .resena")
      .forEach((card, index) => {
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

  document.addEventListener("DOMContentLoaded", inicializarVotos);

  function mostrarMensajeResenas(texto, esError = false) {
    if (!contenedorResenas) return;
    const msg = document.createElement("p");
    msg.className = `mensaje-resenas ${esError ? "mensaje-error" : ""}`;
    msg.textContent = texto;
    contenedorResenas.appendChild(msg);
  }

  function escapeHtml(s) {
    if (!s && s !== 0) return "";
    return String(s).replace(
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

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (errorModalMsg) errorModalMsg.style.display = "none";

      const nombre = (document.getElementById("nombreRes")?.value || "").trim();
      const calificacion = parseInt(
        document.getElementById("calificacionRes")?.value || "0",
        10
      );
      const comentario = (
        document.getElementById("comentarioRes")?.value || ""
      ).trim();

      if (!nombre || !comentario || calificacion < 1 || calificacion > 5) {
        if (errorModalMsg) {
          errorModalMsg.textContent =
            "Por favor completa todos los campos y usa una calificación válida (1–5).";
          errorModalMsg.style.display = "block";
        }
        return;
      }

      const payload = { nombre, calificacion, comentario };

      try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(API, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);

        modal.style.display = "none";
        form.reset();
        await cargarResenas();
        alert("Reseña enviada con éxito.");
      } catch (err) {
        console.error("Error enviando reseña:", err);
        if (errorModalMsg) {
          errorModalMsg.textContent =
            "No se pudo enviar la reseña. Verifica tu conexión o el servidor.";
          errorModalMsg.style.display = "block";
        }
      }
    });
  }

  cargarResenas();
})();
