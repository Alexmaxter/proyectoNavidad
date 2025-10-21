// =============================
// CONFIGURACIÓN DE CONTENIDO - ACTUALIZADA
// =============================
const CONFIG = {
  // Textos de la experiencia
  textos: {
    intro: {
      titulo: "¡Bienvenido Valentino!",
      narrativa:
        "Lo hiciste. Empujaste la bola de nieve. Ahí va, rodando montaña abajo, girando sobre sí misma. Todavía es pequeña, pero cada vuelta la alimenta. Cada segundo la fortalece. Es como si tuviera hambre... hambre de tiempo. Esta no es una aventura de correr como loco, Valentino. No no no... Esta es una aventura de espera, de descubrir qué sucede cuando dejás que el tiempo haga su magia. Prepárate para lo que viene.",
      boton: "Comenzar",
    },
    decision: {
      titulo: "La Gran Decisión",
      narrativa:
        "Y aquí, en este preciso momento, el destino se bifurca. A tu izquierda, el primer camino brilla como el oro. ¡Detén la bola ahora!, grita. Tu regalo ya es tuyo. ¿Para qué esperar? Es tentador. Muy tentador. A tu derecha, el segundo camino se pierde en la niebla. Solo una voz suave susurra: Déjala rodar... Si confías, crecerá más de lo que imaginas. Uno te ofrece la gratificación inmediata. El otro, algo mucho más grande. ¿Qué camino vas a elegir, Valentino? Recuerda: una vez que des un paso, no habrá retorno",
      botones: ["Camino Rápido", "Camino Paciente"],
    },
    confirmacion1: {
      titulo: "Primera Confirmación",
      narrativa:
        "La bola se detiene a tus pies.<br>Brilla en la nieve,<br>lista para ser tomada.<br>Pero si escuchás con atención...<br>podés oír el eco de lo que pudo haber sido.<br>¿Estás seguro?",
      botones: ["Sí, quiero mi regalo ahora", "No, quiero seguir la aventura"],
    },
    confirmacion2: {
      titulo: "Segunda Confirmación",
      narrativa:
        "Última oportunidad, Valentino. Si la detenés ahora, la aventura termina aquí. Lo que viene después... nunca lo sabrás. ¿De verdad querés que termine acá?",
      botones: ["Sí, estoy seguro", "No, quiero volver"],
    },
    acertijo1: {
      titulo: "Insistir es construir",
      narrativa:
        "En un taller lleno de chispas trabaja un hombre extraño.<br><br>Todos los días levanta su martillo y lo deja caer sobre el mismo pedazo de metal. Martillo arriba, martillo abajo. Una y otra vez.<br><br>Los vecinos le preguntan: '¿Por qué seguís? Ese pedazo de hierro nunca va a cambiar.'<br><br>Pero él sonríe y continúa. Sabe algo que otros no ven.<br><br>¿Qué convierte sus golpes, aparentemente iguales, en algo extraordinario?",
      respuestaCorrecta: "constancia",
    },
    explicacion1: {
      narrativa:
        "¡Exacto!<br><br>La constancia no es repetir por costumbre, sino mantener el esfuerzo hasta que lo invisible se vuelve visible.<br>Cada golpe suma, aunque al principio no se note.",
      boton: "Siguiente",
    },
    acertijo2: {
      titulo: "Esperar también es avanzar",
      narrativa:
        "En un campo completamente seco hay un hombre que riega todos los días.<br><br>No hay ni una sola planta. La tierra parece muerta. Pero él viene cada mañana con su regadera llena, y riega como si algo fuera a crecer.<br><br>Los que pasan le dicen: 'Estás perdiendo el tiempo. Ahí nunca va a crecer nada.'<br><br>Pero él no se detiene. Hay algo dentro de él que lo mantiene regando.<br><br>¿Qué es lo que lo sostiene cuando no ve ningún resultado?",
      respuestaCorrecta: "paciencia",
    },
    explicacion2: {
      narrativa:
        "¡Sí!<br><br>La paciencia: saber esperar con confianza, incluso cuando todavía no ves frutos.",
      boton: "Siguiente",
    },
    acertijo3: {
      titulo: "Sostener es llegar",
      narrativa:
        "En medio del océano navega un capitán solitario.<br><br>Las tormentas lo golpean, las olas tratan de hundirlo, el viento quiere desviarlo.<br><br>Pero él sigue mirando su brújula, mantiene el mismo rumbo.<br><br>Una isla hermosa aparece a su derecha: 'Aquí podés descansar, hay comida y agua fresca. ¿Para qué seguir remando hacia lo desconocido?'<br><br>Pero él ni la mira. Tiene los ojos fijos en su destino.<br><br>¿Qué es lo que lo mantiene firme cuando todo trata de detenerlo?",
      respuestaCorrecta: "disciplina",
    },
    explicacion3: {
      narrativa:
        "¡Perfecto!<br><br>La disciplina: seguir el rumbo elegido aunque aparezcan desvíos y tentaciones.",
      boton: "Siguiente",
    },
    // SECCIÓN FINAL LIMPIA - SIN TÍTULO NI NARRATIVA
    final: {
      // Eliminado título y narrativa completamente
      fechaCuentaRegresiva: new Date(2027, 11, 15), // 15 de diciembre de 2027 (Mes 11 es Diciembre)
      boton: "Mostrar regalo",
      tiempoMostrarBoton: 125000, // 125 segundos = 2 minutos y 5 segundos
    },
    countdown: {
      fechaCuentaRegresiva: new Date(2027, 11, 15), // 15 de diciembre de 2027 (Mes 11 es Diciembre)
    },
    final2: {
      titulo: "Final",
      narrativa:
        "La bola de nieve se quedó pequeña. Cincuenta mil pesos son tuyos. Un regalo real. Algo concreto en tus manos. Pero la montaña sigue ahí arriba, y la avalancha que pudo haber sido... solo existirá en tu imaginación. La aventura terminó antes de empezar.",
    },
    cartaFisica: {
      texto:
        "No todos los regalos vienen con papel brillante y moños grandes. Algunos llegan despacio, sin hacer ruido. Como una bola de nieve que empieza a rodar: parece pequeña, pero está destinada a crecer.\n\nCada vuelta la hace más fuerte, cada pausa le da más poder. Este sobre, Valentino, guarda algo que nunca te han contado.\n\nDentro hay una tarjeta con un código QR. Escanéala y verás comenzar una aventura que va a sorprenderte.",
    },
  },

  // Mensajes del sistema
  mensajes: {
    placeholder: "Tu respuesta",
    enviar: "Enviar",
    repetir: "Repetir",
    errorVacio: "Por favor, escribe una respuesta.",
    erroresIncorrecto: [
      "Intenta pensar más profundamente...",
      "No es la respuesta correcta, reflexiona...",
    ],
    saltarNarracion: "Narración saltada",
    cuentaRegresiva: {
      titulo: "Tu regalo estará disponible en:",
      unidades: {
        años: "años",
        dias: "días",
        horas: "horas",
        minutos: "minutos",
        segundos: "segundos",
      },
      completado: "¡Tu regalo ya está disponible!",
    },
  },

  // Respuestas válidas para cada acertijo
  respuestasValidas: {
    constancia: ["constancia", "la constancia", "mi constancia", "constante"],
    paciencia: ["paciencia", "la paciencia", "paciencias"],
    disciplina: ["disciplina", "la disciplina"],
  },

  // CONFIGURACIÓN DE AUDIO MEJORADA - ACTUALIZADA
  audio: {
    // Volúmenes del audio de fondo principal
    volumenFondoNormal: 0.3,
    volumenFondoBajo: 0.08, // MODIFICADO: Durante narraciones normales
    volumenFondoMudo: 0,

    // Volúmenes del audio de fondo final (específico para secciones finales)
    volumenFondoFinalNormal: 0.25,
    volumenFondoFinalBajo: 0.05,

    // Volumen de narraciones
    volumenNarracion: 0.8,

    // Duraciones de fade mejoradas
    duracionFade: 1500, // Fade durante transiciones normales
    duracionFadeIn: 2000, // Fade in inicial más suave
    duracionFadeOut: 1200, // Fade out más rápido
    duracionFadeRapido: 800, // NUEVO: Para cambios rápidos durante narraciones
  },

  // Rutas de navegación (sin cambios)
  navegacion: {
    intro: {
      0: "decision",
    },
    decision: {
      0: "confirmacion1",
      1: "acertijo1",
    },
    confirmacion1: {
      0: "confirmacion2",
      1: "decision",
    },
    confirmacion2: {
      0: "final2",
      1: "decision",
    },
    explicacion1: {
      0: "acertijo2",
    },
    explicacion2: {
      0: "acertijo3",
    },
    explicacion3: {
      0: "final",
    },
    final: {
      0: "countdown",
    },
  },
};

// ESTADO GLOBAL ACTUALIZADO
const AppState = {
  fondoIniciado: false,
  fondoFinalIniciado: false, // Estado del audio de fondo final
  seccionActiva: null,
  audioActual: null, // Puede ser un audio de narración o el video final
  playClickeado: false,
  seccionesVisitadas: new Set(),
  audioReproduciendo: false, // Indica si hay una narración o video reproduciéndose
  temporizadorBotonFinal: null,
  seccionAnterior: null, // Para tracking de transiciones
};
