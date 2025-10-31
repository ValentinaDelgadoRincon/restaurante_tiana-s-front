const BASE_URL = "http://localhost:4000/api/v1";

export const api = {
  // --- USUARIOS ---
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
  },

  // --- RESTAURANTES ---
  restaurantes: {
    async buscar(query) {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const res = await fetch(`${BASE_URL}/restaurantes`, { headers });

        
        if (!res.ok) {
          console.warn("⚠️ Backend no disponible, usando datos locales");
          return filtrarLocales(query);
        }

        const data = await res.json();

        
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠️ Sin datos desde backend, usando locales");
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
        console.error("❌ Error en búsqueda:", error);
        return filtrarLocales(query);
      }
    },
  },

  // --- RESEÑAS---
  reseñas: {
    async listar() {
      const res = await fetch(`${BASE_URL}/resenias`);
      if (!res.ok) throw new Error("Error al obtener reseñas");
      return res.json();
    },

    async crear(data, token) {
      const res = await fetch(`${BASE_URL}/resenias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al crear reseña");
      return res.json();
    },

    async like(id, token) {
      const res = await fetch(`${BASE_URL}/resenias/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al dar like");
      return res.json();
    },
  },
};


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
