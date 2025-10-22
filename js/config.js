// =============================
// CONFIGURACIÓN DE CONTENIDO
// =============================
const CONFIG = {
  textos: {
    intro: {
      titulo: "¡Bienvenido Valentino!",
      narrativa:
        "Lo hiciste.<br>Empujaste la bola de nieve.<br>Ahí va, rodando montaña abajo, girando sobre sí misma.<br>Todavía es pequeña, pero cada vuelta la alimenta.<br>Cada segundo la fortalece.<br>Es como si tuviera hambre... hambre de tiempo.<br><br>Esta no es una aventura de correr como loco, Valentino. No no no...<br>Esta es una aventura de espera, de descubrir qué sucede cuando dejás que el tiempo haga su magia.<br><br>Prepárate para lo que viene.",
      boton: "Comenzar",
    },
    decision: {
      titulo: "La Gran Decisión",
      narrativa:
        "Y aquí, en este preciso momento, el destino se bifurca.<br><br>A tu izquierda, el primer camino brilla como el oro.<br>'¡Detén la bola ahora!' grita.<br>'Tu regalo ya es tuyo. ¿Para qué esperar?'<br>Es tentador. Muy tentador.<br><br>A tu derecha, el segundo camino se pierde en la niebla.<br>Solo una voz suave susurra:<br>'Déjala rodar... Si confías, crecerá más de lo que imaginas.'<br><br>Uno te ofrece la gratificación inmediata.<br>El otro, algo mucho más grande.<br><br>¿Qué camino vas a elegir, Valentino?<br><br>Recuerda: una vez que des un paso, no habrá retorno",
      botones: ["Camino Rápido", "Camino Paciente"],
    },
    confirmacion1: {
      titulo: "",
      narrativa:
        "La bola se detiene a tus pies.<br>Brilla en la nieve,<br>lista para ser tomada.<br>Pero si escuchás con atención...<br>podés oír el eco de lo que pudo haber sido.<br>¿Estás seguro?",
      botones: ["Sí, quiero mi regalo ahora", "No, quiero seguir la aventura"],
    },
    confirmacion2: {
      titulo: "",
      narrativa:
        "Última oportunidad, Valentino.<br>Si la detenés ahora, la aventura termina aquí.<br>Lo que viene después... nunca lo sabrás.<br><br>¿De verdad querés que termine acá?",
      botones: ["Sí, estoy seguro", "No, quiero volver"],
    },
    acertijo1: {
      titulo: "Insistir es construir",
      narrativa:
        "En un taller lleno de chispas trabaja un hombre extraño.<br><br>Todos los días levanta su martillo y lo deja caer sobre el mismo pedazo de metal.<br><br>Martillo arriba, martillo abajo.<br>Una y otra vez.<br><br>Los vecinos le preguntan: '¿Por qué seguís?<br>Ese pedazo de hierro nunca va a cambiar.'<br><br>Pero él sonríe y continúa.<br><br>Sabe algo que otros no ven.<br><br>¿Qué convierte sus golpes, aparentemente iguales, en algo extraordinario?",
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
        "En un campo completamente seco hay un hombre que riega todos los días.<br><br>No hay ni una sola planta.<br><br>La tierra parece muerta.<br>Pero él viene cada mañana con su regadera llena, y riega como si algo fuera a crecer.<br><br>Los que pasan le dicen:<br>'Estás perdiendo el tiempo. Ahí nunca va a crecer nada.'<br><br>Pero él no se detiene.<br>Hay algo dentro de él que lo mantiene regando.<br><br>¿Qué es lo que lo sostiene cuando no ve ningún resultado?",
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
        "En medio del océano navega un capitán solitario.<br><br>Las tormentas lo golpean, las olas tratan de hundirlo, el viento quiere desviarlo.<br><br>Pero él sigue mirando su brújula, mantiene el mismo rumbo.<br><br>Una isla hermosa aparece a su derecha:<br>'Aquí podés descansar, hay comida y agua fresca.<br>¿Para qué seguir remando hacia lo desconocido?'<br><br>Pero él ni la mira.<br>Tiene los ojos fijos en su destino.<br><br>¿Qué es lo que lo mantiene firme cuando todo trata de detenerlo?",
      respuestaCorrecta: "disciplina",
    },
    explicacion3: {
      narrativa:
        "¡Perfecto!<br><br>La disciplina: seguir el rumbo elegido aunque aparezcan desvíos y tentaciones.",
      boton: "Siguiente",
    },
    final: {
      fechaCuentaRegresiva: new Date(2027, 11, 15),
      boton: "Mostrar regalo",
      tiempoMostrarBoton: 125000,
    },
    countdown: {
      fechaCuentaRegresiva: new Date(2027, 11, 15),
    },
    final2: {
      titulo: "Final",
      narrativa:
        "La bola de nieve se quedó pequeña.<br><br>Cincuenta mil pesos son tuyos.<br><br>Un regalo real.<br>Algo concreto en tus manos.<br>Pero la montaña sigue ahí arriba, y la avalancha que pudo haber sido... solo existirá en tu imaginación.<br><br>La aventura terminó antes de empezar.",
    },
  },

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

  respuestasValidas: {
    constancia: ["constancia", "la constancia", "mi constancia", "constante"],
    paciencia: ["paciencia", "la paciencia", "paciencias"],
    disciplina: ["disciplina", "la disciplina"],
  },

  audio: {
    volumenFondoNormal: 0.3,
    volumenFondoBajo: 0.08,
    volumenFondoMudo: 0,
    volumenFondoFinalNormal: 0.25,
    volumenFondoFinalBajo: 0.05,
    volumenNarracion: 0.8,
    duracionFade: 1500,
    duracionFadeIn: 2000,
    duracionFadeOut: 1200,
    duracionFadeRapido: 800,
  },

  navegacion: {
    intro: { 0: "decision" },
    decision: { 0: "confirmacion1", 1: "acertijo1" },
    confirmacion1: { 0: "confirmacion2", 1: "decision" },
    confirmacion2: { 0: "final2", 1: "decision" },
    explicacion1: { 0: "acertijo2" },
    explicacion2: { 0: "acertijo3" },
    explicacion3: { 0: "final" },
    final: { 0: "countdown" },
  },
};

// =============================
// ESTADO GLOBAL
// =============================
const AppState = {
  fondoIniciado: false,
  fondoFinalIniciado: false,
  seccionActiva: null,
  audioActual: null,
  playClickeado: false,
  seccionesVisitadas: new Set(),
  audioReproduciendo: false,
  temporizadorBotonFinal: null,
  seccionAnterior: null,
};
