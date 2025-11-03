# 🍽️ Tiana’s Reseñas

![Tiana portada](./multimedia/Captura%20desde%202025-11-01%2017-28-29.png)

## 📌 Descripción del Proyecto
**Tiana’s Reseñas** es una aplicación web full stack desarrollada en **Node.js**, **Express**, **MongoDB** y **JavaScript (Frontend)**, que permite a los usuarios **explorar restaurantes, dejar reseñas y calificaciones**, mientras los administradores gestionan los datos desde un panel seguro.  

El sistema busca centralizar las experiencias gastronómicas en una sola plataforma, ofreciendo autenticación con **JWT**, control de roles (**usuario / admin**), manejo de reseñas y un ranking dinámico basado en calificaciones y popularidad.

<p align="center">
  <img src="https://img.shields.io/github/repo-size/ValentinaDelgado/Tianas-Resenas?style=flat-square&color=ff69b4" />
  <img src="https://img.shields.io/github/last-commit/ValentinaDelgado/Tianas-Resenas?style=flat-square&color=purple" />
  <img src="https://img.shields.io/github/contributors/ValentinaDelgado/Tianas-Resenas?style=flat-square&color=blueviolet" />
</p>

---

## 🌷 Instrucciones de Instalación y Uso

### 🌼 Requisitos Previos
- [Node.js](https://nodejs.org/)  
- [MongoDB](https://www.mongodb.com/) instalado  
- Navegador moderno (Chrome, Firefox, Edge)  
- npm  

---

### ⚙️ Instalación
```bash
# Clonar el repositorio
git clone https://github.com/ValentinaDelgado/Tianas-Resenas

# Ingresar al proyecto
cd Tiana-Resenas

# Instalar dependencias
npm install
```

### ▶️ Ejecución del backend
```bash
# Iniciar el servidor
npm run dev
```

### ▶️ Visualizar el frontend
Abre el archivo `index.html` o `usuario.html` desde tu navegador, o sirve la carpeta con Live Server.

---

## 📂 Estructura del Proyecto
```
Tiana-Resenias/
├── backend/
│   ├── controllers/
│   │     ├── usuarios.controllers.js
│   │     ├── restaurantes.controllers.js
│   │     ├── platos.controllers.js
│   │     └── resenias.controllers.js
│   ├── routes/
│   │     ├── usuarios.routers.js
│   │     ├── restaurantes.routers.js
│   │     ├── platos.routers.js
│   │     └── resenias.routers.js
│   ├── services/
│   ├── middlewares/
│   ├── models/
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── usuario.html
│   ├── admin.html
│   ├── login.html
│   ├── api.js
│   ├── usuario.js
│   ├── admin.js
│   ├── usuario.css
│   ├── admin.css
│   └── login.css
│
└── multimedia/
      ├── todasimagenes.png
      └── documentacion.pdf
```

---

## 🎀 Patrones de Diseño Usados
- **MVC (Model-View-Controller):** Separación clara de la lógica del negocio, controladores y vistas.  
- **Repository Pattern:** En los servicios para interactuar con MongoDB sin acoplar la lógica de negocio.  
- **Factory Pattern:** Creación de reseñas, usuarios y platos a partir de estructuras predefinidas.  
- **Observer Pattern (opcional):** Previsto para actualizaciones de ranking en tiempo real.  

---

### 📌 Ejemplo del Patrón Repository

```js

export async function registrarUsuario(data) {
  const existe = await Usuario.findOne({ correo: data.correo });
  if (existe) throw new Error("El usuario ya está registrado.");
  return await Usuario.create(data);
}
```

✅ **Explicación:**  
- Centraliza la lógica de acceso a la base de datos.  
- Facilita mantenimiento, pruebas y control de errores.  

---

### 📌 Ejemplo del Patrón Factory

```js
export function crearReseña({ usuarioId, platoId, comentario, calificacion }) {
  return {
    usuarioId,
    platoId,
    comentario,
    calificacion,
    fecha: new Date(),
    likes: 0,
    dislikes: 0,
  };
}
```

✅ **Explicación:**  
- Estandariza la creación de reseñas con atributos predefinidos.  
- Evita inconsistencias y simplifica validaciones.  

---

## ⚙️ Consideraciones Técnicas
- **Node.js + Express** para el backend.
- **MongoDB Atlas o local** como base de datos.
- **JWT (JSON Web Token)** para autenticación segura.
- **HTML, CSS y JS** modular en el frontend.
- **Fetch API** para comunicación entre cliente y servidor.
- **Diseño responsive** compatible con dispositivos móviles.

Librerías principales:
```bash
npm install express  jsonwebtoken bcrypt cors dotenv
```

---

## 📅 Planeación Scrum
- 🍓 **Scrum Master:** Laura Camila Flórez  
- 🍰 **Product Owner:** Valentina Delgado  
- ☕ **Developers:** Valentina Delgado, Laura Camila Flórez  

📖 [Ver documento de planeación](./multimedia/documentacionRestaurante.docx.pdf)

---

## 🎬 Video Explicativo
Video de máximo 7 minutos explicando el proyecto:  
🎥 [Ver video en Drive](https://drive.google.com/file/d/1Rmu_tho-KyNiDfFRrHHJGNHvqfJzI5A_/view?usp=drivesdk)

---

## 👩‍💻 Créditos
Proyecto desarrollado por:  
- **Valentina Delgado**  
- **Laura Camila Flórez**  
Proyecto Express / U1  
Año 2025  
