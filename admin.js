const API = "http://localhost:4000/api/v1/restaurantes";

let restaurants = [
  {
    name: "Burger House",
    category: "comida rapida",
    rating: 4.5,
    price: "Moderado",
    location: "Centro",
    delivery: 25,
    description: "Hamburguesas rápidas y deliciosas",
    _id: "1",
  },
  {
    name: "Sushi King",
    category: "sushi",
    rating: 4.8,
    price: "Caro",
    location: "Zona Norte",
    delivery: 40,
    description: "Sushi fresco y premium",
    _id: "2",
  },
  {
    name: "Veggie Delight",
    category: "vegetariano",
    rating: 4.6,
    price: "Moderado",
    location: "Zona Sur",
    delivery: 30,
    description: "Opciones saludables y vegetarianas",
    _id: "3",
  },
];

let currentId = null;

async function loadTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("No hay respuesta del backend");
    const backendData = await res.json();
    if (backendData.length) restaurants = backendData;
  } catch (err) {
    console.warn("Backend no disponible, usando datos locales.", err);
  }

  if (restaurants.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fas fa-utensils"></i><p>No hay restaurantes registrados</p></td></tr>`;
    return;
  }

  restaurants.forEach((r) => {
    const categoryClass = r.category.toLowerCase().replace(" ", "-");
    const stars =
      "★".repeat(Math.floor(r.rating)) + "☆".repeat(5 - Math.floor(r.rating));

    tbody.innerHTML += `
        <tr>
            <td><strong>${r.name}</strong></td>
            <td><span class="badge badge-${categoryClass}">${r.category}</span></td>
            <td><div class="rating-display">${stars} ${r.rating}</div></td>
            <td>${r.price}</td>
            <td>${r.location}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-view" onclick="viewRestaurant('${r._id}')" title="Ver detalles"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon btn-edit" onclick="editRestaurant('${r._id}')" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="deleteRestaurant('${r._id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
  });
}

function openModal(restaurant = null) {
  const modal = document.getElementById("restaurantModal");
  const form = document.getElementById("restaurantForm");

  if (restaurant) {
    document.getElementById("modalTitle").textContent = "Editar Restaurante";
    document.getElementById("name").value = restaurant.name;
    document.getElementById("category").value = restaurant.category;
    document.getElementById("description").value = restaurant.description || "";
    document.getElementById("rating").value = restaurant.rating;
    document.getElementById("price").value = restaurant.price;
    document.getElementById("location").value = restaurant.location || "";
    document.getElementById("delivery").value = restaurant.delivery || "";
    currentId = restaurant._id;
  } else {
    document.getElementById("modalTitle").textContent = "Agregar Restaurante";
    form.reset();
    currentId = null;
  }

  modal.classList.add("active");
}

function closeModal() {
  document.getElementById("restaurantModal").classList.remove("active");
  document.getElementById("restaurantForm").reset();
  currentId = null;
}

document
  .getElementById("restaurantForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById("name").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      rating: parseFloat(document.getElementById("rating").value),
      price: document.getElementById("price").value,
      location: document.getElementById("location").value,
      delivery: parseInt(document.getElementById("delivery").value) || 30,
    };

    try {
      if (currentId) {
        await fetch(`${API}/${currentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        restaurants = restaurants.map((r) =>
          r._id === currentId ? { ...formData, _id: currentId } : r
        );
        showNotification(`✓ "${formData.name}" actualizado`, "success");
      } else {
        const newId = Date.now().toString();
        formData._id = newId;

        try {
          const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          const created = await res.json();
          formData._id = created._id || newId;
        } catch {
          console.warn("No se pudo guardar en backend, se guarda localmente.");
        }

        restaurants.push(formData);
        showNotification(`✓ "${formData.name}" agregado`, "success");
      }

      closeModal();
      loadTable();
    } catch (err) {
      console.error(err);
      showNotification("Error al guardar restaurante", "error");
    }
  });

async function editRestaurant(id) {
  let restaurant = restaurants.find((r) => r._id === id);
  if (!restaurant) {
    try {
      const res = await fetch(`${API}/${id}`);
      restaurant = await res.json();
    } catch {
      showNotification("No se encontró restaurante", "error");
      return;
    }
  }
  openModal(restaurant);
}

async function deleteRestaurant(id) {
  if (!confirm("¿Seguro de eliminar este restaurante?")) return;

  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
  } catch {
    console.warn("No se pudo eliminar en backend, se elimina localmente.");
  }

  restaurants = restaurants.filter((r) => r._id !== id);
  showNotification("✓ Restaurante eliminado", "success");
  loadTable();
}

async function viewRestaurant(id) {
  let r = restaurants.find((r) => r._id === id);
  if (!r) {
    try {
      const res = await fetch(`${API}/${id}`);
      r = await res.json();
    } catch {
      showNotification(" Error al cargar detalles", "error");
      return;
    }
  }
  alert(
    `Detalles del Restaurante:\n\nNombre: ${r.name}\nCategoría: ${
      r.category
    }\nCalificación: ${r.rating} \nPrecio: ${r.price}\nUbicación: ${
      r.location
    }\nEntrega: ${r.delivery} min\nDescripción: ${
      r.description || "Sin descripción"
    }`
  );
}

function filterTable() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const cat = document.getElementById("categoryFilter").value;
  const rate = parseFloat(document.getElementById("ratingFilter").value) || 0;

  document.querySelectorAll("#tableBody tr").forEach((r) => {
    const name = r.cells[0]?.textContent.toLowerCase() || "";
    const category = r.querySelector(".badge")?.textContent.toLowerCase() || "";
    const rating =
      parseFloat(r.cells[2]?.textContent.match(/[\d.]+/)?.[0]) || 0;
    r.style.display =
      name.includes(search) &&
      (!cat || category === cat) &&
      (!rate || rating >= rate)
        ? ""
        : "none";
  });
}

function showNotification(msg, type = "success") {
  const n = document.createElement("div");
  n.style.cssText = `position:fixed;top:100px;right:20px;background:${
    type === "success" ? "#4caf50" : "#f44336"
  };color:white;padding:1rem 1.5rem;border-radius:10px;box-shadow:0 4px 15px rgba(0,0,0,0.3);z-index:10000;font-weight:600;animation:slideIn 0.3s ease;`;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation = "slideOut 0.3s ease";
    setTimeout(() => n.remove(), 300);
  }, 3000);
}

window.onclick = function (e) {
  if (e.target === document.getElementById("restaurantModal")) closeModal();
};

loadTable();
