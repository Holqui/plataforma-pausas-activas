const API_URL = "http://localhost:3000/api";

let rutinasGlobal = [];

async function cargarRutinas() {
  try {
    const res = await fetch(`${API_URL}/rutinas`);
    const rutinas = await res.json();
    rutinasGlobal = rutinas;

    renderizarRutinas(rutinasGlobal);
    llenarSelectRutinas(rutinasGlobal);
  } catch (error) {
    console.error("Error cargando rutinas", error);
  }
}

function renderizarRutinas(rutinas) {
  const contenedor = document.getElementById("lista-rutinas");
  contenedor.innerHTML = "";

  if (rutinas.length === 0) {
    contenedor.innerHTML = "<p>No hay rutinas que coincidan con los filtros seleccionados.</p>";
    return;
  }

  rutinas.forEach(r => {
    const div = document.createElement("div");
    div.className = "rutina";
div.innerHTML = `
  <h3>${r.nombre}</h3>
  ${r.imagen ? `<img src="${r.imagen}" alt="${r.nombre}" class="img-rutina">` : ""}
  <p><strong>Duración:</strong> ${r.duracionMin} minutos (${r.tipoDuracion || "N/A"})</p>
  <p><strong>Nivel:</strong> ${r.nivel}</p>
  <p><strong>Zona:</strong> ${r.zona}</p>
  <p>${r.descripcion}</p>
  <button class="btn-iniciar" data-id="${r.id}">Iniciar rutina</button>
`;
    contenedor.appendChild(div);
  });

  // Asignar eventos a botones "Iniciar rutina"
  const botones = document.querySelectorAll(".btn-iniciar");
  botones.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      mostrarDetalleRutina(id);
    });
  });
}

function mostrarDetalleRutina(idRutina) {
  const rutina = rutinasGlobal.find(r => r.id === idRutina);
  const contenedor = document.getElementById("contenido-detalle");

  if (!rutina) {
    contenedor.innerHTML = "<p>No se encontró la rutina seleccionada.</p>";
    return;
  }

  const pasos = rutina.instrucciones || [];
  const listaPasos = pasos.map(p => `<li>${p}</li>`).join("");

  contenedor.innerHTML = `
    <h3>${rutina.nombre}</h3>
    <p><strong>Duración:</strong> ${rutina.duracionMin} minutos (${rutina.tipoDuracion || "N/A"})</p>
    <p><strong>Nivel:</strong> ${rutina.nivel}</p>
    <p><strong>Zona:</strong> ${rutina.zona}</p>
    <p>${rutina.descripcion}</p>
    <h4>Paso a paso sugerido</h4>
    <ol>
      ${listaPasos}
    </ol>
  `;
}

function llenarSelectRutinas(rutinas) {
  const select = document.getElementById("rutinaSelect");
  select.innerHTML = "<option value=''>Selecciona una rutina</option>";

  rutinas.forEach(r => {
    const option = document.createElement("option");
    option.value = r.id;
    option.textContent = `${r.nombre} (${r.duracionMin} min)`;
    select.appendChild(option);
  });
}

async function cargarSesiones() {
  try {
    const res = await fetch(`${API_URL}/sesiones`);
    const sesiones = await res.json();

    const lista = document.getElementById("lista-sesiones");
    lista.innerHTML = "";

    sesiones.forEach(s => {
      const rutina = rutinasGlobal.find(r => r.id === s.rutinaId);
      const nombreRutina = rutina ? rutina.nombre : `Rutina #${s.rutinaId}`;
      const li = document.createElement("li");
      li.textContent = `${s.fecha} - ${s.usuario} realizó "${nombreRutina}"`;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error("Error cargando sesiones", error);
  }
}

function manejarFormulario() {
  const form = document.getElementById("form-sesion");
  const mensaje = document.getElementById("mensaje-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const rutinaId = document.getElementById("rutinaSelect").value;
    const fecha = document.getElementById("fecha").value;

    if (!usuario || !rutinaId || !fecha) {
      mensaje.textContent = "Por favor completa todos los campos.";
      mensaje.style.color = "red";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/sesiones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario,
          rutinaId: Number(rutinaId),
          fecha
        })
      });

      if (!res.ok) {
        mensaje.textContent = "Error al registrar la pausa.";
        mensaje.style.color = "red";
        return;
      }

      form.reset();
      mensaje.textContent = "Pausa registrada correctamente.";
      mensaje.style.color = "green";
      cargarSesiones();
    } catch (error) {
      console.error("Error registrando sesión", error);
      mensaje.textContent = "Error de conexión con el servidor.";
      mensaje.style.color = "red";
    }
  });
}

function manejarFiltros() {
  const filtroZona = document.getElementById("filtroZona");
  const filtroDuracion = document.getElementById("filtroDuracion");

  function aplicarFiltros() {
    const zonaSeleccionada = filtroZona.value;
    const duracionSeleccionada = filtroDuracion.value;

    const filtradas = rutinasGlobal.filter(r => {
      const coincideZona =
        zonaSeleccionada === "todas" || r.zona === zonaSeleccionada;
      const coincideDuracion =
        duracionSeleccionada === "todas" ||
        (r.tipoDuracion && r.tipoDuracion === duracionSeleccionada);
      return coincideZona && coincideDuracion;
    });

    renderizarRutinas(filtradas);
  }

  filtroZona.addEventListener("change", aplicarFiltros);
  filtroDuracion.addEventListener("change", aplicarFiltros);
}

function manejarTips() {
  const btn = document.getElementById("btnMostrarTips");
  const contenedor = document.getElementById("contenido-tips");

  btn.addEventListener("click", () => {
    const oculto = contenedor.classList.contains("oculto");
    if (oculto) {
      contenedor.classList.remove("oculto");
      btn.textContent = "Ocultar recomendaciones";
    } else {
      contenedor.classList.add("oculto");
      btn.textContent = "Ver recomendaciones";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarRutinas();
  cargarSesiones();
  manejarFormulario();
  manejarFiltros();
  manejarTips();
});
