const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rutinas de pausas activas más completas
let rutinas = [
  // Rutinas de cuerpo completo
  {
    id: 1,
    nombre: "Pausa básica cuerpo completo",
    duracionMin: 5,
    nivel: "Principiante",
    zona: "Cuerpo completo",
    tipoDuracion: "Corta (5 min)",
    imagen: "img/cuerpo-completo.jpg",
    descripcion: "Secuencia sencilla de movilidad de cuello, hombros, espalda y piernas para romper el sedentarismo.",
    instrucciones: [
      "De pie, separa ligeramente los pies y relaja los hombros.",
      "Realiza respiraciones profundas durante 30 segundos.",
      "Haz círculos suaves con los hombros hacia adelante y hacia atrás.",
      "Inclina el tronco ligeramente hacia los lados, sin rebotes.",
      "Finaliza con estiramientos suaves de piernas, sin forzar."
    ]
  },
  {
    id: 2,
    nombre: "Pausa activa de 10 minutos",
    duracionMin: 10,
    nivel: "Intermedio",
    zona: "Cuerpo completo",
    tipoDuracion: "Media (10 min)",
    imagen: "img/cuerpo-completo.jpg",
    descripcion: "Rutina más completa que combina movilidad articular y estiramientos suaves.",
    instrucciones: [
      "Inicia con 1 minuto de respiración profunda y movimientos suaves de cuello.",
      "Realiza 2 minutos de movilidad de hombros y brazos en todas las direcciones.",
      "Incluye 3 minutos de estiramientos de espalda y tronco, manteniendo 15–20 segundos cada posición.",
      "Termina con 3–4 minutos de estiramientos de piernas y tobillos."
    ]
  },

  // Cuello y hombros
  {
    id: 3,
    nombre: "Pausa de cuello y hombros",
    duracionMin: 5,
    nivel: "Principiante",
    zona: "Cuello y hombros",
    tipoDuracion: "Corta (5 min)",
    imagen: "img/cuello-hombros.jpg",
    descripcion: "Ejercicios suaves para aliviar tensión en cuello y trapecios por uso prolongado de pantalla.",
    instrucciones: [
      "Sentado o de pie, mantén la espalda recta.",
      "Inclina la cabeza hacia un lado y mantén 15 segundos, cambia al otro lado.",
      "Lleva la barbilla hacia el pecho y mantén 15 segundos.",
      "Haz círculos suaves con los hombros hacia adelante y hacia atrás."
    ]
  },
  {
    id: 4,
    nombre: "Pausa de hombros y brazos",
    duracionMin: 8,
    nivel: "Intermedio",
    zona: "Hombros y brazos",
    imagen: "img/cuerpo-completo.jpg",
    tipoDuracion: "Media (8 min)",
    descripcion: "Movilidad y estiramientos para hombros, bíceps y tríceps.",
    instrucciones: [
      "Realiza círculos amplios con los brazos hacia adelante y hacia atrás.",
      "Estira un brazo frente al cuerpo y presiona suavemente con el otro brazo.",
      "Lleva una mano detrás de la cabeza y empuja suavemente el codo.",
      "Repite del otro lado y termina con respiraciones profundas."
    ]
  },

  // Espalda
  {
    id: 5,
    nombre: "Pausa para espalda baja",
    duracionMin: 5,
    nivel: "Principiante",
    zona: "Espalda",
    tipoDuracion: "Corta (5 min)",
    imagen: "img/espalda.jpg",
    descripcion: "Enfocada en aliviar tensión en la zona lumbar por estar mucho tiempo sentado.",
    instrucciones: [
      "Sentado al borde de la silla, apoya los pies firmes en el piso.",
      "Inclina el tronco hacia adelante dejando caer los brazos y relaja la espalda.",
      "Mantén 15–20 segundos y sube lentamente vértebra por vértebra.",
      "Repite 3–4 veces sin rebotes ni movimientos bruscos."
    ]
  },
  {
    id: 6,
    nombre: "Pausa de movilidad de columna",
    duracionMin: 10,
    nivel: "Intermedio",
    zona: "Espalda",
    tipoDuracion: "Media (10 min)",
    imagen: "img/espalda.jpg",
    descripcion: "Movilidad de columna torácica y lumbar para mejorar postura.",
    instrucciones: [
      "De pie, con pies separados al ancho de hombros, lleva las manos a la cintura.",
      "Realiza inclinaciones suaves hacia adelante, atrás y a los lados.",
      "Haz rotaciones suaves del tronco mirando a un lado y al otro.",
      "Evita rebotes y mantén control en todo el movimiento."
    ]
  },

  // Muñecas y manos
  {
    id: 7,
    nombre: "Pausa para muñecas y manos",
    duracionMin: 3,
    nivel: "Principiante",
    zona: "Muñecas y manos",
    tipoDuracion: "Corta (3 min)",
    imagen: "img/muñecas-manos.jpg",
    descripcion: "Ideal para quienes usan teclado y mouse durante muchas horas.",
    instrucciones: [
      "Extiende un brazo al frente con la palma hacia arriba.",
      "Con la otra mano, lleva suavemente los dedos hacia abajo, estirando antebrazo.",
      "Cambia la posición de la palma hacia abajo y repite.",
      "Realiza círculos con las muñecas en ambas direcciones."
    ]
  },

  // Ojos
  {
    id: 8,
    nombre: "Pausa visual",
    duracionMin: 3,
    nivel: "Principiante",
    zona: "Ojos",
    tipoDuracion: "Corta (3 min)",
    imagen: "img/ojos.jpg",
    descripcion: "Ejercicios para descansar la vista luego de mirar la pantalla por mucho tiempo.",
    instrucciones: [
      "Mira a un punto lejano durante 20 segundos, evitando la pantalla.",
      "Cierra los ojos suavemente durante 20–30 segundos.",
      "Abre los ojos y dirige la mirada arriba, abajo, izquierda y derecha sin mover la cabeza.",
      "Repite el ciclo 2–3 veces."
    ]
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




