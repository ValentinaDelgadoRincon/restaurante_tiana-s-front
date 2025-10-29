(function () {
  const API = "http://localhost:4000/resenias";
  let btn = document.querySelector('#btnEscribirResena') ||
            Array.from(document.querySelectorAll('button')).find(b =>
              b.textContent && b.textContent.trim().toLowerCase().includes('escribir reseña')
            );

  if (!btn) {
    console.warn('No se encontró un botón con el texto "Escribir reseña". Añade uno o verifica su texto.');
    return;
  }

  
  let contenedorResenas = document.getElementById('resenas');
  if (!contenedorResenas) {
    
    const section = document.createElement('section');
    section.id = 'listaResenas';
    section.className = 'resenas-container';
    section.innerHTML = `<h3>Reseñas de nuestros clientes</h3><div id="resenas"></div>`;
    btn.insertAdjacentElement('afterend', section);
    contenedorResenas = document.getElementById('resenas');
  }

  
  if (!document.getElementById('estilos-modal-resenas')) {
    const style = document.createElement('style');
    style.id = 'estilos-modal-resenas';
    style.textContent = `
     
      .modal-resena {
        display: none; position: fixed; z-index: 9999; left:0; top:0; width:100%; height:100%;
        background: rgba(165, 155, 160, 0.63); align-items: center; justify-content: center;
      }
      .modal-resena .modal-card {
        background: rgba(241, 125, 187, 0.63); border-radius:10px; max-width:420px; width:90%; padding:18px; box-shadow:0 6px 30px rgba(0,0,0,0.3);
      }
      .modal-resena .close-x { float:right; font-size:20px; cursor:pointer; margin-top:-6px; }
      .modal-resena label { display:block; margin:10px 0 6px; font-weight:600; }
      .modal-resena input[type="text"], .modal-resena input[type="number"], .modal-resena textarea {
        width:100%; padding:8px; border-radius:6px; border:1px solid #ccc; box-sizing:border-box;
      }
      .modal-resena button[type="submit"] {
        margin-top:12px; padding:10px 14px; border:none; border-radius:8px; cursor:pointer; background:#764ba2; color:white;
      }
      .resenas-container { margin-top:18px; padding:12px; background:#ffffffcc; border-radius:8px; }
      .resena { background:#f8f8f8; padding:12px; border-radius:6px; margin-bottom:10px; box-shadow:0 2px 6px rgba(0,0,0,0.06); }
      .estrellas { color:#f5c518; font-size:16px; margin-bottom:6px; }
    `;
    document.head.appendChild(style);
  }

  
  let modal = document.querySelector('.modal-resena');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-resena';
    modal.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true">
        <span class="close-x" title="Cerrar">&times;</span>
        <h2>Escribir reseña</h2>
        <form id="formResenaDin">
          <label for="nombreRes">Tu nombre</label>
          <input id="nombreRes" name="nombre" type="text" required placeholder="Tu nombre">

          <label for="calificacionRes">Calificación (1-5)</label>
          <input id="calificacionRes" name="calificacion" type="number" min="1" max="5" required value="5">

          <label for="comentarioRes">Reseña</label>
          <textarea id="comentarioRes" name="comentario" rows="4" required placeholder="Escribe tu opinión..."></textarea>

          <button type="submit">Enviar reseña</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const form = document.getElementById('formResenaDin');
  const closeX = modal.querySelector('.close-x');

  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
    document.getElementById('nombreRes').focus();
  });

  
  closeX.addEventListener('click', () => modal.style.display = 'none');
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) modal.style.display = 'none';
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') modal.style.display = 'none';
  });

  
  async function cargarResenas() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('GET no OK: ' + res.status);
      const data = await res.json();
      renderResenas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando reseñas:', err);
      contenedorResenas.innerHTML = '<p>No se pudieron cargar las reseñas. Asegúrate que el backend esté corriendo en http://localhost:4000</p>';
    }
  }

  function renderResenas(items) {
    contenedorResenas.innerHTML = '';
    if (!items.length) {
      contenedorResenas.innerHTML = '<p>No hay reseñas todavía.</p>';
      return;
    }
    items.forEach(r => {
      const d = document.createElement('div');
      d.className = 'resena';
      const estrellas = (Number.isInteger(r.calificacion) && r.calificacion > 0) ? '⭐'.repeat(Math.min(5, r.calificacion)) : '';
      d.innerHTML = `
        <h4>${escapeHtml(String(r.nombre || 'Anónimo'))}</h4>
        <div class="estrellas">${estrellas}</div>
        <p>${escapeHtml(String(r.comentario || ''))}</p>
      `;
      contenedorResenas.appendChild(d);
    });
  }

  
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
  }

 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombreRes').value.trim();
    const calificacion = parseInt(document.getElementById('calificacionRes').value || '0', 10);
    const comentario = document.getElementById('comentarioRes').value.trim();

    if (!nombre || !comentario || !calificacion || calificacion < 1 || calificacion > 5) {
      alert('Por favor completa todos los campos y usa una calificación entre 1 y 5.');
      return;
    }

    const payload = { nombre, calificacion, comentario };

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        
        let msg = `Error ${res.status}`;
        try { const j = await res.json(); if (j && j.message) msg = j.message; } catch(_) {}
        throw new Error(msg);
      }

      
      modal.style.display = 'none';
      form.reset();
      await cargarResenas();
      
      alert('Reseña enviada con éxito');
    } catch (err) {
      console.error('Error enviando reseña:', err);
      alert('No se pudo enviar la reseña. Verifica que el backend esté corriendo y acepte POST a ' + API);
    }
  });

 
  cargarResenas();

})();
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