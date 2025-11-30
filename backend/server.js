const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Datos simulados de rutinas
let rutinas = [
{
id: 1,
nombre: "Pausa básica de estiramiento",
duracionMin: 5,
nivel: "Principiante",
descripcion: "Estiramientos suaves para cuello, hombros y espalda."
},
{
id: 2,
nombre: "Pausa activa de 10 minutos",
duracionMin: 10,
nivel: "Intermedio",
descripcion: "Secuencia de estiramientos y movilidad articular."
}
];

let sesiones = [];

// Obtener rutinas
app.get("/api/rutinas", (req, res) => {
res.json(rutinas);
});

// Registrar una sesión realizada
app.post("/api/sesiones", (req, res) => {
const { usuario, rutinaId, fecha } = req.body;
if (!usuario || !rutinaId || !fecha) {
return res.status(400).json({ mensaje: "Datos incompletos" });
}
const nuevaSesion = {
id: sesiones.length + 1,
usuario,
rutinaId,
fecha
};
sesiones.push(nuevaSesion);
res.status(201).json(nuevaSesion);
});

// Listar sesiones
app.get("/api/sesiones", (req, res) => {
res.json(sesiones);
});

app.listen(PORT, () => {
console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});







