// =============================
// CONFIGURACIÓN DE CONTENIDO - ACTUALIZADA
// =============================
const CONFIG = {
  // Textos de la experiencia
  textos: {
    intro: {
      titulo: "¡Bienvenido Valentino!",
      narrativa:
        "Ahhhh, lo hiciste. Empujaste la bola de nieve. Y ahora ya está rodando.<br><br>¡Mírala! Tan pequeña… Pero las apariencias engañan, ¿no es cierto? Cada vuelta la alimenta, cada segundo la fortalece. Es como si tuviera hambre… hambre de tiempo.<br><br>Esta no es una aventura de correr como loco, Valentino. No. Esta es una aventura de paciencia, de descubrir qué sucede cuando dejás que el tiempo haga su magia.<br><br>La bola de nieve rueda montaña abajo y ya duplicó su tamaño. Prepárate para lo que viene.",
      boton: "Comenzar",
    },
    decision: {
      titulo: "La Gran Decisión",
      narrativa:
        "Y aquí, en este preciso momento, el destino se bifurca como las ramas de un árbol retorcido.<br><br>El aire cambia. El viento trae dos voces distintas.<br><br>A tu izquierda, el primer sendero brilla como el oro bajo el sol. '¡Tómalo ahora!', grita. 'Tu regalo ya es tuyo. ¿Para qué esperar? El futuro es incierto. Disfruta hoy.' Podés ver, incluso, un cofre abierto que deja escapar destellos de luz. Es tentador. Muy tentador.<br><br>A tu derecha, el segundo sendero se pierde en la niebla. No hay cofres, ni promesas fáciles. Solo una voz más suave que susurra: 'Sigue rodando… Si confiás, tu bola de nieve crecerá más de lo que imaginas.'<br><br>Uno de los caminos te ofrece la gratificación inmediata. El otro, la paciencia de los sabios.<br><br>Y vos, Valentino… ¿qué tipo de viajero querés ser?<br><br>Recuerda: una vez que des un paso, no habrá retorno.",
      botones: ["Camino Rápido", "Camino Paciente"],
    },
    confirmacion1: {
      titulo: "Primera Confirmación",
      narrativa:
        "La bola de nieve se detiene. Brilla como una joya en la nieve, pequeña pero hermosa.<br><br>'¿Por qué esperar?', pregunta una vocecita en tu cabeza. 'A veces lo valioso está justo enfrente.'<br><br>Es tu decisión, Valentino. Si avanzás, la bola crecerá. Si la tomás ahora, el viaje será más corto, pero también tendrá su magia.",
      botones: ["Sí, quiero mi regalo ahora", "No, quiero seguir la aventura"],
    },
    confirmacion2: {
      titulo: "Segunda Confirmación",
      narrativa:
        "Esta es tu última chance, Valentino. Si cerrás los ojos y escuchás, podés sentir que hay algo más grande esperándote, una aventura que se extiende más allá de lo que podés imaginar.<br><br>El aire mismo te susurra que hay secretos por descubrir, lecciones por aprender, magia por experimentar.<br><br>¿Estás completamente seguro de que querés que termine acá?",
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
        "¡Exacto! La constancia no es repetir por costumbre, sino mantener el esfuerzo hasta que lo invisible se vuelve visible. Cada golpe suma, aunque al principio no se note.<br><br>La bola de nieve toma esta primera lección y crece más grande.",
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
        "¡Sí! La paciencia: saber esperar con confianza, incluso cuando todavía no ves frutos.<br><br>Como el campesino, vos también aprendiste que lo valioso a veces necesita tiempo y calma, no prisa.<br><br>La bola de nieve crece con esta nueva lección.",
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
        "¡Perfecto! La disciplina: seguir el rumbo elegido aunque aparezcan desvíos y tentaciones.<br><br>Como él, vos también diste pasos hacia lo desconocido manteniendo tu rumbo.<br><br>La bola de nieve ahora es una avalancha, porque tuviste la disciplina para llegar hasta aquí.",
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
        "Y así, la pequeña bola de nieve abrió sus secretos antes de tiempo. Cincuenta mil pesos brillan en tus manos como monedas de hada.<br><br>Es tuyo, Valentino. Una elección válida, un tesoro inmediato. La aventura pudo ser más larga, sí, pero no todos los caminos llevan a la misma montaña. Algunos terminan pronto, y aun así dejan luz en las manos.",
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

    // NUEVO: Volúmenes del audio navideño (durante el video)
    volumenbackground_videoBajo: 0.08, // Volumen bajo durante el video

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
  background_videoIniciado: false, // NUEVO: Estado del audio navideño
  seccionActiva: null,
  audioActual: null, // Puede ser un audio de narración o el video final
  playClickeado: false,
  seccionesVisitadas: new Set(),
  audioReproduciendo: false, // Indica si hay una narración o video reproduciéndose
  temporizadorBotonFinal: null,
  seccionAnterior: null, // Para tracking de transiciones
};
