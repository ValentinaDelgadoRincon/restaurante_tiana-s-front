import { api } from "./api.js";

const btnAdmin = document.getElementById("btnAdmin");
const modal = document.getElementById("modalAdminLogin");
const closeX = modal.querySelector(".close-x");
const formAdmin = document.getElementById("formAdminLogin");
const errorMsg = document.getElementById("errorAdminMsg");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultados = document.getElementById("resultadosRestaurantes");
const msg = document.getElementById("searchMessage");
const reseñasContenedor = document.querySelector(".reviews-section");
const btnReview = document.querySelector(".btn-review");

let token = localStorage.getItem("token");


btnAdmin.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeX.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});


formAdmin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const correo = document.getElementById("adminUser").value.trim();
  const contrasenia = document.getElementById("adminPass").value.trim();
  errorMsg.style.display = "none";

  try {
    const data = await api.usuarios.login({ correo, contrasenia });
    localStorage.setItem("token", data.token);
    modal.style.display = "none";
    alert("Bienvenido, administrador");
    window.location.href = "admin.html";
  } catch (err) {
    errorMsg.textContent = "Credenciales incorrectas";
    errorMsg.style.display = "block";
  }
});


searchBtn.addEventListener("click", buscarRestaurantes);
searchInput.addEventListener(
  "keypress",
  (e) => e.key === "Enter" && buscarRestaurantes()
);

async function buscarRestaurantes() {
  console.log("hola");
  const query = searchInput.value.trim();
  msg.textContent = "Buscando...";
  resultados.innerHTML = "";

  try {
    const data = await api.restaurantes.buscar(query);
    if (!data || data.length === 0) {
      msg.textContent = "No se encontraron resultados ";
      return;
    }

    msg.textContent = `Se encontraron ${data.length} resultados 🍽️`;
    data.forEach((r) => {
      const card = document.createElement("div");
      card.classList.add("restaurant-card");
      card.innerHTML = `
        <div class="card-content">
          <h3>${r.nombre}</h3>
          <p>${r.descripcion || "Sin descripción disponible"}</p>
          <p><strong>Categoría:</strong> ${r.categoria}</p>
          <div class="rating"><i class="fas fa-star"></i> ${
            r.calificacion ?? "N/A"
          }</div>
        </div>`;
      resultados.appendChild(card);
    });
  } catch {
    msg.textContent = "Error al conectar con el servidor ";
  }
}


async function cargarReseñas() {
  reseñasContenedor.innerHTML = "<p>Cargando reseñas...</p>";
  try {
    const data = await api.reseñas.listar();
    reseñasContenedor.innerHTML = "";
    data.forEach((r) => {
      const div = document.createElement("div");
      div.classList.add("review-card");
      div.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">${
              r.usuario?.charAt(0).toUpperCase() ?? "?"
            }</div>
            <div>
              <div class="reviewer-name">${r.usuario}</div>
              <div class="review-date">${new Date(
                r.fecha
              ).toLocaleDateString()}</div>
            </div>
          </div>
          <div class="review-rating">⭐ ${r.calificacion}</div>
        </div>
        <p class="review-text">${r.comentario}</p>
        <div class="review-actions">
          <button class="btn-like" data-id="${r._id}">👍 ${
        r.likes || 0
      }</button>
        </div>`;
      reseñasContenedor.appendChild(div);
    });
  } catch {
    reseñasContenedor.innerHTML = "<p>No se pudieron cargar reseñas 😢</p>";
  }
}


document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-like")) {
    const id = e.target.dataset.id;
    try {
      await api.reseñas.like(id, token);
      cargarReseñas();
    } catch {
      alert("Debes iniciar sesión para dar like 👍");
    }
  }
});



document.addEventListener("DOMContentLoaded", () => {
  cargarReseñas();
});


const modalReview = document.getElementById("modalReview");
const closeReview = document.getElementById("closeReview");
const formReview = document.getElementById("formReview");
const ratingStars = document.getElementById("ratingStars").querySelectorAll("i");
let selectedRating = 0;

btnReview.addEventListener("click", () => {
  modalReview.style.display = "flex";
});

closeReview.addEventListener("click", () => {
  modalReview.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modalReview) modalReview.style.display = "none";
});

ratingStars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.dataset.value);
    ratingStars.forEach((s) =>
      s.classList.toggle("active", parseInt(s.dataset.value) <= selectedRating)
    );
  });
});

formReview.addEventListener("submit", async (e) => {
  e.preventDefault();
  const comentario = document.getElementById("reviewComentario").value.trim();
  const calificacion = selectedRating;
  if (!comentario || calificacion === 0) {
    alert("Por favor completa todos los campos ⭐");
    return;
  }

  try {
    await api.reseñas.crear({ comentario, calificacion }, token);
    alert("Reseña enviada correctamente");
    modalReview.style.display = "none";
    formReview.reset();
    selectedRating = 0;
    ratingStars.forEach((s) => s.classList.remove("active"));
    cargarReseñas();
  } catch {
    alert("Debes iniciar sesión para escribir reseñas");
  }
});
