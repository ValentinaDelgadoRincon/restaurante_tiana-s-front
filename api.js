const BASE_URL = "http://localhost:4000/api/v1";

export const api = {
  // ====== USUARIOS ======
  usuarios: {
    async login({ correo, contrasenia }) {
      const res = await fetch(`${BASE_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasenia }),
      });
      if (!res.ok) throw new Error("Error en login");
      return res.json();
    },

    async registro(datos) {
      const res = await fetch(`${BASE_URL}/usuarios/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error("Error en registro");
      return res.json();
    },
  },

  // ====== RESTAURANTES ======
  restaurantes: {
    async listar() {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      try {
        const res = await fetch(`${BASE_URL}/restaurantes`, { headers });
        if (!res.ok) throw new Error("Error al listar restaurantes");
        return res.json();
      } catch (error) {
        console.error("Error en listar restaurantes:", error);
        return filtrarLocales("");
      }
    },

    async buscar(query) {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const res = await fetch(`${BASE_URL}/restaurantes`, { headers });
        if (!res.ok) {
          console.warn("Backend no disponible, usando datos locales");
          return filtrarLocales(query);
        }

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("Sin datos desde backend, usando locales");
          return filtrarLocales(query);
        }

        if (!query) return data;

        const q = query.toLowerCase();
        const filtrados = data.filter(
          (r) =>
            r.nombre?.toLowerCase().includes(q) ||
            r.categoria?.toLowerCase().includes(q) ||
            r.descripcion?.toLowerCase().includes(q)
        );

        return filtrados.length > 0 ? filtrados : filtrarLocales(query);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        return filtrarLocales(query);
      }
    },

    async obtenerPorId(id) {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${BASE_URL}/restaurantes/${id}`, { headers });
      if (!res.ok) throw new Error("Error al obtener restaurante");
      return res.json();
    },

    // Ordenar restaurantes
    async ordenarPor(tipo) {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${BASE_URL}/restaurantes/orden?tipo=${tipo}`, { headers });
      if (!res.ok) throw new Error("Error al ordenar restaurantes");
      return res.json();
    },

    // Filtrar por categoría
    async filtrarPorCategoria(categoria) {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${BASE_URL}/restaurantes/categoria?categoria=${encodeURIComponent(categoria)}`, { headers });
      if (!res.ok) throw new Error("Error al filtrar por categoría");
      return res.json();
    },

    async crear(datos, token) {
      const res = await fetch(`${BASE_URL}/restaurantes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error("Error al crear restaurante");
      return res.json();
    },

    async actualizar(id, datos, token) {
      const res = await fetch(`${BASE_URL}/restaurantes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error("Error al actualizar restaurante");
      return res.json();
    },

    async eliminar(id, token) {
      const res = await fetch(`${BASE_URL}/restaurantes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar restaurante");
      return res.json();
    },

        // 🔹 Detalle de restaurante
    async detalle(id) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    const res = await fetch(`${BASE_URL}/detallesRestaurante/${id}/detalle`, { headers });
    if (!res.ok) throw new Error("Error al obtener detalle del restaurante");
    return res.json();
  } catch (error) {
    console.error("❌ Error al obtener detalle:", error);
    throw error;
  }
}


  },

  // ====== RESEÑAS ======
  resenias: {
    async listar(restauranteId) {
      // 🔥 LISTAR es público, NO requiere token
      const endpoint = restauranteId 
        ? `/resenias?restauranteId=${restauranteId}`
        : "/resenias";
      
      try {
        const res = await fetch(`${BASE_URL}${endpoint}`);
        if (!res.ok) throw new Error("Error al obtener reseñas");
        const data = await res.json();
        console.log("📊 Reseñas recibidas del servidor:", data);
        return data;
      } catch (error) {
        console.error("Error al listar reseñas:", error);
        throw error;
      }
    },

    async crear(datos, token) {
      try {
        const res = await fetch(`${BASE_URL}/resenias`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datos),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error del servidor:", errorData);
          throw new Error(errorData.message || "Error al crear reseña");
        }
        
        return res.json();
      } catch (error) {
        console.error("Error en crear reseña:", error);
        throw error;
      }
    },

    async like(id, token) {
      try {
        const res = await fetch(`${BASE_URL}/resenias/${id}/like`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error al dar like");
        }
        
        return res.json();
      } catch (error) {
        console.error("Error en like:", error);
        throw error;
      }
    },

    async eliminar(id, token) {
      const res = await fetch(`${BASE_URL}/resenias/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar reseña");
      return res.json();
    },
  },
};

// Datos locales de fallback
function filtrarLocales(query) {
  const locales = [
    {
      nombre: "La Bella Italia",
      categoria: "Italiana",
      descripcion: "Cocina tradicional italiana con pasta y vino.",
      calificacion: 4.8,
    },
    {
      nombre: "Sakura Sushi",
      categoria: "Japonesa",
      descripcion: "Sushi fresco y ramen artesanal.",
      calificacion: 4.9,
    },
    {
      nombre: "Green Garden",
      categoria: "Vegetariana",
      descripcion: "Opciones saludables con ingredientes orgánicos.",
      calificacion: 4.6,
    },
    {
      nombre: "Burger Master",
      categoria: "Comida Rápida",
      descripcion: "Hamburguesas gourmet con carne premium.",
      calificacion: 4.5,
    },
    {
      nombre: "Sweet Dreams",
      categoria: "Postres",
      descripcion: "Pasteles artesanales y cupcakes para endulzar tu día.",
      calificacion: 4.9,
    },
  ];

  if (!query) return locales;

  const q = query.toLowerCase();
  return locales.filter(
    (r) =>
      r.nombre.toLowerCase().includes(q) ||
      r.categoria.toLowerCase().includes(q) ||
      r.descripcion.toLowerCase().includes(q)
  );
}

console.log("✅ API configurada correctamente");