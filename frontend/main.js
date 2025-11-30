const API_URL = "http://localhost:3000/api";

async function cargarRutinas() {
try {
const res = await fetch(`${API_URL}/rutinas`);
const rutinas = await res.json();
const contenedor = document.getElementById("lista-rutinas");
const select = document.getElementById("rutinaSelect");

contenedor.innerHTML = "";
select.innerHTML = "<option value=''>Selecciona una rutina</option>";

rutinas.forEach(r => {
  const div = document.createElement("div");
  div.className = "rutina";
  div.innerHTML = `
    <h3>${r.nombre}</h3>
    <p>Duración: ${r.duracionMin} minutos</p>
    <p>Nivel: ${r.nivel}</p>
    <p>${r.descripcion}</p>
  `;
  contenedor.appendChild(div);

  const option = document.createElement("option");
  option.value = r.id;
  option.textContent = `${r.nombre} (${r.duracionMin} min)`;
  select.appendChild(option);
});

} catch (error) {
console.error("Error cargando rutinas", error);
}
}

async function cargarSesiones() {
try {
const res = await fetch(`${API_URL}/sesiones`);
const sesiones = await res.json();

const lista = document.getElementById("lista-sesiones");
lista.innerHTML = "";

sesiones.forEach(s => {
  const li = document.createElement("li");
  li.textContent = `${s.fecha} - ${s.usuario} realizó la rutina #${s.rutinaId}`;
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

document.addEventListener("DOMContentLoaded", () => {
cargarRutinas();
cargarSesiones();
manejarFormulario();
});




