/**
 * config.js: Configuración Central del Proyecto Navidad.
 * (Actualizado con "step" para la lógica de progreso)
 */
const config = {
  global: {
    audioBGM: "./assets/audio/background.mp3",
    audioBGMFinal: "./assets/audio/background-final.mp3",
    countdownDate: "2027-12-15T00:00:00",
  },
  audio: {
    // ... (sin cambios) ...
    volumenFondoNormal: 0.3,
    volumenFondoBajo: 0.08,
    volumenFondoFinal: 0.25,
    volumenNarracion: 0.8,
    duracionFadeIn: 2000,
    duracionFadeOut: 1200,
  },
  validation: {
    // ... (sin cambios) ...
    constancia: ["constancia", "la constancia", "mi constancia", "constante"],
    paciencia: ["paciencia", "la paciencia", "paciencias"],
    disciplina: ["disciplina", "la disciplina"],
  },
  sections: {
    // --- Flujo Principal (Paciente) ---
    intro: {
      type: "intro",
      step: 0, // <-- NUEVO
      title: "¡Bienvenido Valentino!",
      narrative: "Lo hiciste.<br>Empujaste la bola de nieve... (etc.)",
      background: "./assets/img/intro-bg.png",
      audio: "./assets/audio/intro.mp3",
      buttonText: "Comenzar",
      onNavigate: "decision",
    },
    decision: {
      type: "decision",
      step: 1, // <-- NUEVO
      title: "La Gran Decisión",
      narrative: "Y aquí, en este preciso momento... (etc.)",
      background: "./assets/img/decision-bg.png",
      audio: "./assets/audio/decision.mp3",
      buttons: [
        { text: "Camino Rápido", target: "confirmacion1" },
        { text: "Camino Paciente", target: "acertijo1" },
      ],
    },
    acertijo1: {
      type: "riddle",
      step: 2, // <-- NUEVO (Camino B)
      title: "Insistir es construir",
      narrative: "En un taller lleno de chispas... (etc.)",
      background: "./assets/img/acertijo1-bg.png",
      audio: "./assets/audio/acertijo1.mp3",
      validationKey: "constancia",
      onSuccess: "explicacion1",
    },
    explicacion1: {
      type: "explanation",
      step: 3, // <-- NUEVO (Camino B)
      narrative: "¡Exacto!<br><br>La constancia no es repetir...",
      background: "./assets/img/explicacion1-bg.png",
      audio: "./assets/audio/explicacion1.mp3",
      buttonText: "Siguiente",
      onNavigate: "acertijo2",
    },
    acertijo2: {
      type: "riddle",
      step: 4, // <-- NUEVO (Camino B)
      title: "Esperar también es avanzar",
      narrative: "En un campo completamente seco... (etc.)",
      background: "./assets/img/acertijo2-bg.png",
      audio: "./assets/audio/acertijo2.mp3",
      validationKey: "paciencia",
      onSuccess: "explicacion2",
    },
    explicacion2: {
      type: "explanation",
      step: 5, // <-- NUEVO (Camino B)
      narrative: "¡Sí!<br><br>La paciencia: saber esperar...",
      background: "./assets/img/explicacion2-bg.png",
      audio: "./assets/audio/explicacion2.mp3",
      buttonText: "Siguiente",
      onNavigate: "acertijo3",
    },
    acertijo3: {
      type: "riddle",
      step: 6, // <-- NUEVO (Camino B)
      title: "Sostener es llegar",
      narrative: "En medio del océano navega un capitán... (etc.)",
      background: "./assets/img/acertijo3-bg.png",
      audio: "./assets/audio/acertijo3.mp3",
      validationKey: "disciplina",
      onSuccess: "explicacion3",
    },
    explicacion3: {
      type: "explanation",
      step: 7, // <-- NUEVO (Camino B)
      narrative: "¡Perfecto!<br><br>La disciplina: seguir el rumbo...",
      background: "./assets/img/explicacion3-bg.png",
      audio: "./assets/audio/explicacion3.mp3",
      buttonText: "Siguiente",
      onNavigate: "final",
    },

    // --- Finales ---
    final: {
      type: "video",
      step: 8, // <-- NUEVO (Camino B)
      background: null,
      audio: null,
      video: "./assets/video/Final.mp4",
      onNavigate: "countdown",
    },
    countdown: {
      type: "countdown",
      step: 9, // <-- NUEVO (Camino B - Fin)
      title: null,
      background: null,
      audio: null,
    },

    // --- Flujo Alternativo (Rápido) ---
    confirmacion1: {
      type: "decision",
      step: 2, // <-- NUEVO (Camino A)
      title: "",
      narrative: "La bola se detiene a tus pies... (etc.)",
      background: "./assets/img/confirmacion1-bg.jpg",
      audio: "./assets/audio/confirmacion1.mp3",
      buttons: [
        { text: "Sí, quiero mi regalo ahora", target: "confirmacion2" },
        {
          text: "No, quiero seguir la aventura",
          target: "decision",
          skipNarration: true,
        },
      ],
    },
    confirmacion2: {
      type: "decision",
      step: 3, // <-- NUEVO (Camino A)
      title: "",
      narrative: "Última oportunidad, Valentino... (etc.)",
      background: "./assets/img/confirmacion2-bg.jpg",
      audio: "./assets/audio/confirmacion2.mp3",
      buttons: [
        { text: "Sí, estoy seguro", target: "final2" },
        { text: "No, quiero volver", target: "decision", skipNarration: true },
      ],
    },
    final2: {
      type: "explanation",
      step: 4, // <-- NUEVO (Camino A - Fin)
      title: "Final",
      narrative: "La bola de nieve se quedó pequeña... (etc.)",
      background: "./assets/img/final2-bg.jpg",
      audio: "./assets/audio/final2.mp3",
      buttonText: null,
      onNavigate: null,
    },
  },

  // --- NUEVA SECCIÓN: Mapa de Pasos ---
  // Un mapa inverso para saber a qué sección ir
  // basado en el "maxStep" guardado en Firebase.
  stepToSectionMap: {
    0: "intro",
    1: "decision",
    2: "acertijo1", // Damos prioridad al camino B si los pasos son iguales
    3: "explicacion1",
    4: "acertijo2",
    5: "explicacion2",
    6: "acertijo3",
    7: "explicacion3",
    8: "final",
    9: "countdown",
    // Nota: No incluimos el "Camino A" aquí. Si el maxStep del usuario
    // es 4 (final2), lo cargaremos, pero si intenta ir "atrás" a
    // un step < 4, lo forzaremos al "Camino B" (acertijo2).
    // Esto simplifica la lógica de "no retorno".
  },
};

export default config;
