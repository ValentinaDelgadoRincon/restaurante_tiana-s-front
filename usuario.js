import { api } from "./api.js";

console.log(" Script usuario.js cargado correctamente");

const btnAdmin = document.getElementById("btnAdmin");
const modal = document.getElementById("modalAdminLogin");
const closeX = modal?.querySelector(".close-x");
const formAdmin = document.getElementById("formAdminLogin");
const errorMsg = document.getElementById("errorAdminMsg");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultados = document.getElementById("resultadosRestaurantes");
const msg = document.getElementById("searchMessage");
const reseniasContenedor = document.querySelector(".reviews-section");
const btnReview = document.querySelector(".btn-review");
const logoutBtn = document.getElementById("logoutBtn");
const filterBtns = document.querySelectorAll(".filter-btn");
const sortSelect = document.querySelector(".sort-select");

let token = localStorage.getItem("token");
console.log("🔑 Token inicial cargado del localStorage:", token);

let restaurantesLocales = [];
let reseniasLocales = [];

const restaurantesEstaticos = [
  { _id: "static-1", nombre: "La Bella Italia", descripcion: "Auténtica cocina italiana con recetas tradicionales y los mejores ingredientes importados.", categoria: "Italiana", promedioCalificacion: 4.8, totalLikes: 234, ranking: 8, popularidad: 234, platos: ["Spaghetti Carbonara", "Pizza Margherita", "Lasagna Bolognesa", "Risotto ai Funghi", "Tiramisu Casero"] },
  { _id: "static-2", nombre: "Sakura Sushi", descripcion: "Sushi fresco preparado por maestros sushimen con más de 20 años de experiencia.", categoria: "Japonesa", promedioCalificacion: 4.9, totalLikes: 189, ranking: 9, popularidad: 189, platos: ["Sushi variado", "Sashimi", "Ramen"] },
  { _id: "static-3", nombre: "Tacos El Güero", descripcion: "Los mejores tacos de la ciudad con tortillas hechas a mano y salsas caseras.", categoria: "Mexicana", promedioCalificacion: 4.7, totalLikes: 456, ranking: 7, popularidad: 456, platos: ["Tacos al pastor", "Quesadillas", "Burritos"] },
  { _id: "static-4", nombre: "Green Garden", descripcion: "Opciones saludables y deliciosas 100% vegetarianas con ingredientes orgánicos.", categoria: "Vegetariana", promedioCalificacion: 4.6, totalLikes: 167, ranking: 6, popularidad: 167, platos: ["Ensalada César vegana", "Bowl de quinoa", "Wrap de falafel"] },
  { _id: "static-5", nombre: "Burger Master", descripcion: "Hamburguesas gourmet con carne premium y combinaciones únicas de sabores.", categoria: "Comida rápida", promedioCalificacion: 4.5, totalLikes: 312, ranking: 5, popularidad: 312, platos: ["Burger clásica", "Burger BBQ", "Papas fritas", "Aros de cebolla"] },
  { _id: "static-6", nombre: "Sweet Dreams", descripcion: "Pasteles artesanales, cupcakes y postres únicos para endulzar tu día.", categoria: "Postres", promedioCalificacion: 4.9, totalLikes: 145, ranking: 9, popularidad: 145, platos: ["Cupcakes", "Pasteles", "Brownies", "Cheesecake"] }
];


if (btnAdmin) {
  btnAdmin.addEventListener("click", () => (modal.style.display = "flex"));
}

if (closeX) {
  closeX.addEventListener("click", () => (modal.style.display = "none"));
}

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

if (formAdmin) {
  formAdmin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const correo = document.getElementById("adminUser").value.trim();
    const contrasenia = document.getElementById("adminPass").value.trim();
    errorMsg.style.display = "none";

    try {
      const data = await api.usuarios.login({ correo, contrasenia });
      if (!data.token) throw new Error("Token no recibido del servidor");
      localStorage.setItem("token", data.token);
      console.log(" Token guardado en localStorage:", data.token);
      alert("Bienvenido, administrador");
      modal.style.display = "none";
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.warn(" Error en login, usando datos locales", err);
      if (correo === "admin@test.com" && contrasenia === "1234") {
        localStorage.setItem("token", "token-local-demo");
        alert("Bienvenido, administrador (modo local)");
        modal.style.display = "none";
        setTimeout(() => window.location.reload(), 500);
      } else {
        errorMsg.textContent = "Credenciales incorrectas";
        errorMsg.style.display = "block";
      }
    }
  });
}


async function cargarRestaurantesInicial() {
  try {
    const data = await api.restaurantes.listar();
    restaurantesLocales = [...data, ...restaurantesEstaticos];
    mostrarRestaurantes(restaurantesLocales);
  } catch (err) {
    console.warn("Error backend restaurantes, usando datos locales", err);
    restaurantesLocales = [
      { _id: "1", nombre: "La Pizzería", descripcion: "Pizza al horno de leña", categoria: "Italiano", promedioCalificacion: 4.5, totalLikes: 10, ranking: 5, popularidad: 100, platos: [] },
      { _id: "2", nombre: "Sushi House", descripcion: "Sushi fresco", categoria: "Japonesa", promedioCalificacion: 4.8, totalLikes: 15, ranking: 4, popularidad: 120, platos: [] },
      ...restaurantesEstaticos
    ];
    mostrarRestaurantes(restaurantesLocales);
  }
}

function mostrarRestaurantes(data) {
  if (!data || data.length === 0) {
    msg.textContent = "No se encontraron resultados 😢";
    resultados.innerHTML = "";
    return;
  }
  msg.textContent = `Se encontraron ${data.length} resultados 🍽️`;
  resultados.innerHTML = data
    .map(
      (r) => `
      <div class="restaurant-card">
        <div class="card-content">
          <h3>${r.nombre}</h3>
          <p>${r.descripcion || "Sin descripción disponible"}</p>
          <p><strong>Categoría:</strong> ${r.categoria}</p>
          <div class="rating">⭐ ${r.promedioCalificacion?.toFixed(1) ?? "N/A"}</div>
          <p>👍 ${r.totalLikes ?? 0} likes</p>
          <button class="btn-view" data-id="${r._id}">Ver Detalles</button>
        </div>
      </div>`
    )
    .join("");
  agregarEventosVerDetalles();
}


function agregarEventosVerDetalles() {
  const botonesDetalles = document.querySelectorAll(".restaurant-card .btn-view, .restaurant-item .btn-view");
  botonesDetalles.forEach((btn) => {
    const nuevoBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(nuevoBtn, btn);
    
    nuevoBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const id = nuevoBtn.dataset.id;
      
      let restaurante;
      if (!id) {
        const card = nuevoBtn.closest(".restaurant-card, .restaurant-item");
        const nombre = card.querySelector(".card-title, .item-title, h3")?.textContent.trim();
        restaurante = restaurantesLocales.find(r => r.nombre === nombre) || restaurantesEstaticos.find(r => r.nombre === nombre);
      } else {
        restaurante = restaurantesLocales.find((r) => r._id === id);
      }
      
      if (restaurante) {
        mostrarDetalleRestaurante(restaurante);
        return;
      }
      
      try {
        const res = await api.restaurantes.detalle(id);
        console.log(" Detalle restaurante:", res);
        mostrarDetalleRestaurante(res);
      } catch (err) {
        console.warn(" Error backend, mostrando detalle local", err);
        alert("No se encontró el restaurante");
      }
    });
  });
}

function mostrarDetalleRestaurante(restaurante) {
  const platosTexto = restaurante.platos && restaurante.platos.length > 0 
    ? restaurante.platos.join(", ") 
    : "No hay platos disponibles";
    
  alert(`🍽️ ${restaurante.nombre}\n\n📝 ${restaurante.descripcion}\n\n🏷️ Categoría: ${restaurante.categoria}\n\n⭐ Calificación: ${restaurante.promedioCalificacion?.toFixed(1) ?? "N/A"}\n\n👍 Likes: ${restaurante.totalLikes ?? 0}\n\n🍴 Platos destacados:\n${platosTexto}`);
}


if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", buscarRestaurantes);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarRestaurantes();
  });
}

async function buscarRestaurantes() {
  const query = searchInput.value.trim().toLowerCase();
  msg.textContent = "Buscando...";
  resultados.innerHTML = "";

  try {
    const data = await api.restaurantes.buscar(query);
    const estaticosEncontrados = restaurantesEstaticos.filter(
      (r) =>
        r.nombre.toLowerCase().includes(query) ||
        r.categoria.toLowerCase().includes(query) ||
        (r.descripcion ?? "").toLowerCase().includes(query)
    );
    const todosResultados = [...data, ...estaticosEncontrados];
    
    if (!todosResultados || todosResultados.length === 0) {
      msg.textContent = "No se encontraron resultados 😢";
      return;
    }
    mostrarRestaurantes(todosResultados);
  } catch (err) {
    console.warn(" Error backend, buscando localmente", err);
    const resultadosLocales = restaurantesLocales.filter(
      (r) =>
        r.nombre.toLowerCase().includes(query) ||
        r.categoria.toLowerCase().includes(query) ||
        (r.descripcion ?? "").toLowerCase().includes(query)
    );
    if (resultadosLocales.length === 0) {
      msg.textContent = "No se encontraron resultados 😢";
      return;
    }
    mostrarRestaurantes(resultadosLocales);
  }
}


filterBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const categoria = btn.textContent.trim();

    try {
      let data;
      if (categoria === "Todos") {
        data = await api.restaurantes.listar();
        data = [...data, ...restaurantesEstaticos];
      } else {
        data = await api.restaurantes.filtrarPorCategoria(categoria);
        const estaticosCategoria = restaurantesEstaticos.filter(
          r => r.categoria.toLowerCase() === categoria.toLowerCase()
        );
        data = [...data, ...estaticosCategoria];
      }
      restaurantesLocales = data;
      mostrarRestaurantes(data);
    } catch (err) {
      console.warn(" Error backend filtros, usando locales", err);
      const dataFiltrada =
        categoria === "Todos"
          ? restaurantesLocales
          : restaurantesLocales.filter(
              (r) => r.categoria.toLowerCase() === categoria.toLowerCase()
            );
      mostrarRestaurantes(dataFiltrada);
    }
  });
});

if (sortSelect) {
  sortSelect.addEventListener("change", async () => {
    const option = sortSelect.value;
    try {
      let data;
      if (option === "Ranking") {
        data = await api.restaurantes.ordenarPor("ranking");
 
        const estaticosOrdenados = [...restaurantesEstaticos].sort((a, b) => (b.ranking ?? 0) - (a.ranking ?? 0));
        data = [...data, ...estaticosOrdenados];
      } else if (option === "Popularidad") {
        data = await api.restaurantes.ordenarPor("popularidad");
        const estaticosOrdenados = [...restaurantesEstaticos].sort((a, b) => (b.popularidad ?? 0) - (a.popularidad ?? 0));
        data = [...data, ...estaticosOrdenados];
      } else {
        data = await api.restaurantes.listar();
        data = [...data, ...restaurantesEstaticos];
      }
      restaurantesLocales = data;
      mostrarRestaurantes(data);
    } catch (err) {
      console.warn(" Error backend ordenar, usando locales", err);
      let dataOrdenada = [...restaurantesLocales];
      if (option === "Ranking") dataOrdenada.sort((a, b) => (b.ranking ?? 0) - (a.ranking ?? 0));
      if (option === "Popularidad") dataOrdenada.sort((a, b) => (b.popularidad ?? 0) - (a.popularidad ?? 0));
      mostrarRestaurantes(dataOrdenada);
    }
  });
}

async function cargarResenias() {
  reseniasContenedor.innerHTML = "<p>Cargando reseñas...</p>";
  const tokenActual = localStorage.getItem("token");
  console.log("🔑 Token actual antes de listar reseñas:", tokenActual);

  try {
    const data = await api.resenias.listar();
    reseniasLocales = data;
  } catch (err) {
    console.warn(" Error backend reseñas, usando locales", err);
    reseniasLocales = [
      { _id: "r1", usuario: "Juan", comentario: "Excelente!", calificacion: 5, fecha: new Date(), likes: 3 },
      { _id: "r2", usuario: "Ana", comentario: "Muy bueno", calificacion: 4, fecha: new Date(), likes: 1 },
    ];
  }

  reseniasContenedor.innerHTML = "";
  reseniasLocales.forEach((r) => {
    const div = document.createElement("div");
    div.classList.add("review-card");
    div.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <div class="reviewer-avatar">${r.usuario?.charAt(0).toUpperCase() ?? "?"}</div>
          <div>
            <div class="reviewer-name">${r.usuario}</div>
            <div class="review-date">${new Date(r.fecha).toLocaleDateString()}</div>
          </div>
        </div>
        <div class="review-rating">⭐ ${r.calificacion}</div>
      </div>
      <p class="review-text">${r.comentario}</p>
      <div class="review-actions">
        <button class="btn-like" data-id="${r._id}">👍 ${r.likes || 0}</button>
      </div>`;
    reseniasContenedor.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarRestaurantesInicial();
  cargarResenias();
});


document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-like")) {
    const id = e.target.dataset.id;
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para dar like 👍");
      return;
    }

    try {
      const res = await api.resenias.like(id, token);
      console.log(" Like registrado:", res);
      cargarResenias();
    } catch (err) {
      console.warn(" Error backend like, usando locales", err);

      const rLocal = reseniasLocales.find((r) => r._id === id);
      if (rLocal) rLocal.likes = (rLocal.likes || 0) + 1;
      cargarResenias();
    }
  }
});

const modalReview = document.getElementById("modalReview");
const closeReview = document.getElementById("closeReview");
const formReview = document.getElementById("formReview");
const ratingStars = document.querySelectorAll("#ratingStars i");

let selectedRating = 0;

if (btnReview) {
  btnReview.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para escribir una reseña");
      return;
    }
    modalReview.style.display = "flex";
  });
}

if (closeReview) closeReview.addEventListener("click", () => (modalReview.style.display = "none"));
window.addEventListener("click", (e) => { if (e.target === modalReview) modalReview.style.display = "none"; });

ratingStars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.dataset.value);
    ratingStars.forEach((s) =>
      s.classList.toggle("active", parseInt(s.dataset.value) <= selectedRating)
    );
  });
});

if (formReview) {
  formReview.addEventListener("submit", async (e) => {
    e.preventDefault();
    const comentario = document.getElementById("reviewComentario").value.trim();
    const calificacion = selectedRating;
    const token = localStorage.getItem("token");
    const restauranteId = "1"; 

    if (!token) return alert("Debes iniciar sesión para enviar reseñas");
    if (!comentario || calificacion === 0) return alert("Completa todos los campos antes de enviar");

    try {
      const res = await api.resenias.crear({ comentario, calificacion, restauranteId }, token);
      console.log("✅ Reseña creada correctamente:", res);
      modalReview.style.display = "none";
      formReview.reset();
      selectedRating = 0;
      ratingStars.forEach((s) => s.classList.remove("active"));
      cargarResenias();
    } catch (err) {
      console.warn("❌ Error backend crear reseña, usando locales", err);
      reseniasLocales.push({
        _id: `r${Date.now()}`,
        usuario: "Usuario Local",
        comentario,
        calificacion,
        fecha: new Date(),
        likes: 0,
      });
      modalReview.style.display = "none";
      formReview.reset();
      selectedRating = 0;
      ratingStars.forEach((s) => s.classList.remove("active"));
      cargarResenias();
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("Sesión cerrada correctamente");
    location.href = "./login.html";
  });
}