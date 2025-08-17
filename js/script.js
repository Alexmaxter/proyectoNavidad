/**
 * EXPERIENCIA INTERACTIVA NAVIDEÑA OPTIMIZADA
 */

// Estado de la aplicación
let estadoApp = {
  fondoIniciado: false,
  seccionActiva: null,
  audioActual: null,
  eventListenersRegistrados: false,
  seccionCount: 0, // Contador para oscurecer fondo
  playClicked: false, // Estado para controlar el botón play
};

// Configuración de audio
const configAudio = {
  volumenFondo: 0.1,
  volumenNarracion: 0.8,
};

// Referencias DOM
let referencias = {};

// Obtener referencias DOM
const obtenerReferencias = () => {
  if (Object.keys(referencias).length === 0) {
    referencias.audios = {
      fondo: document.getElementById("audio-fondo"),
      intro: document.getElementById("audio-intro"),
      decision: document.getElementById("audio-decision"),
      confirmacion1: document.getElementById("audio-confirmacion1"),
      confirmacion2: document.getElementById("audio-confirmacion2"),
      acertijo1: document.getElementById("audio-acertijo1"),
      acertijo2: document.getElementById("audio-acertijo2"),
      acertijo3: document.getElementById("audio-acertijo3"),
      final: document.getElementById("audio-final"),
      final2: document.getElementById("audio-final2"),
    };

    referencias.secciones = {
      intro: document.getElementById("intro"),
      decision: document.getElementById("decision"),
      confirmacion1: document.getElementById("confirmacion1"),
      confirmacion2: document.getElementById("confirmacion2"),
      acertijo1: document.getElementById("acertijo1"),
      acertijo2: document.getElementById("acertijo2"),
      acertijo3: document.getElementById("acertijo3"),
      final: document.getElementById("final"),
      final2: document.getElementById("final2"),
    };

    referencias.container = document.querySelector(".container");
  }
  return referencias;
};

// Contenido de texto
const contenidoTexto = {
  intro: {
    titulo: "¡Bienvenido Valentino!",
    lineas: [
      "Ya diste el primer impulso, lo que parecía pequeño empieza a moverse.",
      "Las cosas importantes casi nunca hacen ruido al comenzar.",
      "A veces crecen en silencio, sin que nadie lo note.",
      "Como una bola de nieve que empieza a rodar, pequeña, blanca y tranquila,",
      "pero que con cada vuelta se hace más grande, más fuerte, más poderosa.",
      "Valentino, este es uno de esos momentos épicos.",
      "Lo que hoy parece chico guarda dentro un crecimiento inmenso.",
      "Todo está listo para empezar a tomar forma.",
      "Solo falta que des el próximo paso...",
    ],
    boton: "Comenzar",
  },

  decision: {
    titulo: "Una Decisión Importante",
    lineas: [
      "Valentino, la bola de nieve que empujaste ya comenzó a rodar.",
      "Ahora espera tu decisión.",
      "Puedes tomar un regalo hoy: pequeño, inmediato, seguro.",
      "O puedes confiar, darle tiempo y dejar que crezca,",
      "hasta transformarse en algo mucho más grande.",
      "La elección es tuya, y marcará el destino de este regalo.",
      "¿Qué camino decides?",
    ],
    botones: ["¡Quiero un regalo ahora!", "Esperaré"],
  },

  confirmacion1: {
    titulo: "¿Estás seguro?",
    lineas: [
      "¿Estás seguro de querer el regalo ahora, Valentino?",
      "Lo que elijas hoy decidirá si esa pequeña bola de nieve sigue creciendo… o se detiene aquí.",
    ],
    botones: ["Sí", "No"],
  },

  confirmacion2: {
    titulo: "¿Estás realmente seguro?",
    lineas: [
      "¿Estás realmente seguro? Una vez que elijas, no habrá marcha atrás.",
      "Tu decisión trazará el destino de este regalo.",
    ],
    botones: ["Sí", "No"],
  },

  acertijo1: {
    titulo: "Está en tus manos",
    lineas: [
      "La bola de nieve que empujaste empieza a rodar, pequeña y silenciosa, y con cada vuelta crece junto con tus decisiones.",
      "No todos se dan cuenta de que la llevan consigo, pero tú sí: ya es tuya.",
      "No llama la atención, pasa desapercibida,",
      "y aun así, todo lo que vendrá dependerá de cómo la cuides y la hagas crecer.",
      "Es invisible, pero real.",
      "Es algo que cargas cada vez que eliges.",
    ],
    respuestaCorrecta: "responsabilidad",
  },

  acertijo2: {
    titulo: "Lo que nunca vuelve",
    lineas: [
      "Está rodando, pequeña al principio, y con cada vuelta crece sin que lo notes.",
      "No depende de tu fuerza ni de tu prisa: cada giro la transforma, sumando poco a poco.",
      "Esa fuerza invisible avanza sin detenerse para nadie,",
      "y todo lo que toca empieza a cambiar, aunque no lo percibas de inmediato.",
      "Al principio parece insignificante, casi imperceptible,",
      "pero con cada momento que pasa, su efecto se hace más grande,",
      "multiplicando lo que comenzó pequeño y silencioso.",
      "Nada puede detenerla, ni apresurarla, ni guardarla.",
      "Todo lo que eres, todo lo que serás, depende de ella.",
      "¿Qué es?",
    ],
    respuestaCorrecta: "tiempo",
  },

  acertijo3: {
    titulo: "Esperar también es avanzar",
    lineas: [
      "La bola de nieve que empujas puede romperse si la apresuras,",
      "pero si la dejas rodar con calma, crece lentamente y sin dañarse.",
      "Algunos quieren que todo suceda de inmediato,",
      "otros confían y dejan que cada vuelta siga su curso.",
      "Saben que lo que crece bien no necesita correr,",
      "y que la fuerza verdadera está en acompañar el camino, paso a paso.",
      "Al final, lo que diferencia a los que logran que su bola crezca de los que la rompen",
      "es algo que llevas dentro cada vez que decides no apurarte.",
    ],
    respuestaCorrecta: "paciencia",
  },

  final: {
    titulo: "¡Felicitaciones!",
    lineas: [
      "Este regalo no suena. No se rompe. No tiene moño.",
      "Pero es tuyo, Valentino,",
      "y guarda algo capaz de crecer… más de lo que ahora podés imaginar.",
      "$200.000 solo tuyo. Desde hoy, está a tu nombre.",
      "No para usar ahora, sino para dejar que se transforme con el tiempo.",
      "¿Cómo crecerá?",
      "Con responsabilidad, porque cada decisión que tomás puede cambiar su destino.",
      "Con paciencia, porque lo verdaderamente valioso se hace esperar.",
      "Y con tiempo, porque incluso lo pequeño puede volverse imparable si lo dejás avanzar,",
      "como esa bola de nieve que empezó rodando en silencio…",
      "y ahora va ganando fuerza con cada vuelta.",
      "Si no la frenás… Si no la apurás…",
      "Va tomando forma, va sumando sentido, va construyendo su propia grandeza.",
      "Este regalo va a estar guardado, creciendo sin que lo veas,",
      "hasta que cumplas 18 años.",
      "Y cuando llegue ese día, Valentino…",
      "va a estará listo para que vos decidas qué hacer con él.",
    ],
  },

  final2: {
    titulo: "Tu elección está hecha",
    lineas: [
      "Has elegido detener la bola, Valentino, y recibiste $50,000 en efectivo como tu regalo inmediato.",
      "Este dinero está a tu nombre desde hoy, listo para usar en esta Navidad.",
      "Es tu decisión, un valor presente que marca tu historia.",
    ],
  },
};

// Utilidades
const utilidades = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  limpiarAudio: (audio) => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  },
};

// Gestor de audio
const gestorAudio = {
  iniciarAudioFondo: async () => {
    const refs = obtenerReferencias();
    if (!estadoApp.fondoIniciado && refs.audios.fondo) {
      try {
        refs.audios.fondo.volume = configAudio.volumenFondo;
        await refs.audios.fondo.play();
        estadoApp.fondoIniciado = true;
      } catch (error) {
        console.warn("Error al iniciar audio de fondo:", error);
        document.addEventListener(
          "click",
          () => refs.audios.fondo.play().catch(console.error),
          { once: true }
        );
      }
    }
  },

  detenerAudiosSeccion: () => {
    const refs = obtenerReferencias();
    Object.keys(refs.audios).forEach((key) => {
      if (key !== "fondo" && refs.audios[key]) {
        utilidades.limpiarAudio(refs.audios[key]);
      }
    });
    estadoApp.audioActual = null;
  },

  reproducirAudio: async (sectionId) => {
    const refs = obtenerReferencias();
    gestorAudio.detenerAudiosSeccion();

    const audio = refs.audios[sectionId];
    if (!audio) return false;

    try {
      audio.currentTime = 0;
      audio.volume =
        sectionId === "fondo"
          ? configAudio.volumenFondo
          : configAudio.volumenNarracion;
      audio.onended = () => {
        gestorSecciones.mostrarControlesdespuesDelAudio(sectionId);
      };
      await audio.play();
      estadoApp.audioActual = audio;
      return true;
    } catch (error) {
      console.error(`Error al reproducir audio ${sectionId}:`, error);
      gestorSecciones.mostrarControlesdespuesDelAudio(sectionId);
      return false;
    }
  },
};

// Generador de contenido
const generadorContenido = {
  actualizarTitulo: (seccionId) => {
    const refs = obtenerReferencias();
    const seccion = refs.secciones[seccionId];
    const contenido = contenidoTexto[seccionId];

    if (seccion && contenido) {
      const titulo = seccion.querySelector(".titulo h1");
      if (titulo && estadoApp.playClicked) {
        titulo.textContent = contenido.titulo;
      }
    }
  },

  actualizarNarrativa: (seccionId) => {
    const refs = obtenerReferencias();
    const seccion = refs.secciones[seccionId];
    const contenido = contenidoTexto[seccionId];

    if (seccion && contenido) {
      const narrativa = seccion.querySelector(".narrativa");
      if (narrativa) {
        narrativa.innerHTML = "";
        contenido.lineas.forEach((linea) => {
          const p = document.createElement("p");
          p.textContent = linea;
          narrativa.appendChild(p);
        });
      }
    }
  },

  actualizarBotones: (seccionId) => {
    const refs = obtenerReferencias();
    const seccion = refs.secciones[seccionId];
    const contenido = contenidoTexto[seccionId];

    if (seccion && contenido) {
      const acciones = seccion.querySelector(".acciones");
      if (acciones && contenido.botones) {
        acciones.innerHTML = "";
        contenido.botones.forEach((texto) => {
          const button = document.createElement("button");
          button.textContent = texto;
          button.type = "button";
          acciones.appendChild(button);
        });
      } else if (acciones && contenido.boton) {
        acciones.innerHTML = "";
        const button = document.createElement("button");
        button.textContent = contenido.boton;
        button.type = "button";
        acciones.appendChild(button);
      }
    }
  },
};

// Gestor de secciones
const gestorSecciones = {
  mostrarNarrativa: (seccion) => {
    const narrativa = seccion.querySelector(".narrativa");
    if (narrativa) {
      narrativa.classList.add("visible");
    }
  },

  mostrarSeccion: (id) => {
    const refs = obtenerReferencias();
    gestorAudio.detenerAudiosSeccion();

    // Incrementar contador para oscurecer fondo (máximo 0.5 para evitar oscuridad excesiva)
    if (id !== "intro") {
      estadoApp.seccionCount = Math.min(estadoApp.seccionCount + 1, 5);
      document.body.style.setProperty(
        "--bg-opacity",
        estadoApp.seccionCount * 0.1
      );
    }

    // Ocultar todas las secciones
    Object.values(refs.secciones).forEach((seccion) =>
      seccion.classList.remove("active")
    );

    // Mostrar la nueva sección
    const nuevaSeccion = refs.secciones[id];
    if (!nuevaSeccion) return;

    nuevaSeccion.classList.add("active");
    nuevaSeccion.id = id; // Asegurar que el ID esté correctamente asignado
    estadoApp.seccionActiva = nuevaSeccion;

    // Actualizar contenido
    generadorContenido.actualizarTitulo(id);
    generadorContenido.actualizarNarrativa(id);
    generadorContenido.actualizarBotones(id);

    // Ocultar todos los controles inicialmente
    gestorSecciones.ocultarControles(nuevaSeccion);

    // Para intro, mostrar el botón de play si no se ha clicado
    if (id === "intro" && !estadoApp.playClicked) {
      const playCenter = nuevaSeccion.querySelector(".play-center");
      if (playCenter) {
        playCenter.classList.add("visible");
        playCenter.style.display = "block";
      }
    } else {
      // Para otras secciones, reproducir audio automáticamente
      setTimeout(() => {
        gestorAudio.reproducirAudio(id);
        gestorSecciones.mostrarNarrativa(nuevaSeccion);
      }, 300);
    }
  },

  ocultarControles: (seccion) => {
    const elementos = [
      ".play-center",
      ".acciones",
      ".input-group",
      ".replay-button",
    ];

    elementos.forEach((selector) => {
      const elemento = seccion.querySelector(selector);
      if (elemento) {
        elemento.classList.remove("visible");
        if (selector === ".replay-button") {
          // Limpiar contenido del botón repetir para evitar duplicados
          elemento.innerHTML = "";
        }
        if (selector !== ".play-center") {
          elemento.style.display = "block";
        }
      }
    });

    // Ocultar narrativa también
    const narrativa = seccion.querySelector(".narrativa");
    if (narrativa) {
      narrativa.classList.remove("visible");
    }
  },

  mostrarControlesdespuesDelAudio: (sectionId) => {
    const seccion = estadoApp.seccionActiva;
    if (!seccion || seccion.id !== sectionId) return;

    setTimeout(() => {
      const acciones = seccion.querySelector(".acciones");
      const inputGroup = seccion.querySelector(".input-group");
      const replayButton = seccion.querySelector(".replay-button");

      // Recrear completamente el botón de repetir sin CSS ::before
      if (replayButton) {
        replayButton.innerHTML = '<button class="replay-btn">Repetir</button>';
        replayButton.classList.add("visible");
      }

      if (acciones) {
        acciones.classList.add("visible");
      }
      if (inputGroup) {
        inputGroup.classList.add("visible");
      }
    }, 500);
  },
};

// Validador de respuestas
const validadorRespuestas = {
  respuestasValidas: {
    responsabilidad: [
      "responsabilidad",
      "la responsabilidad",
      "mi responsabilidad",
    ],
    tiempo: ["tiempo", "el tiempo"],
    paciencia: ["paciencia", "la paciencia"],
  },

  obtenerMensajeError: () => {
    const mensajes = [
      "Intenta pensar más profundamente...",
      "No es la respuesta correcta, reflexiona...",
      "Piensa en lo que representa la historia...",
    ];
    return mensajes[Math.floor(Math.random() * mensajes.length)];
  },

  validarAcertijo: (numero) => {
    const input = document.getElementById(`respuesta${numero}`);
    const error = document.getElementById(`error${numero}`);
    const contenido = contenidoTexto[`acertijo${numero}`];

    if (!input || !error || !contenido) return;

    const respuesta = input.value.toLowerCase().trim().replace(/\s+/g, " ");
    const { respuestaCorrecta } = contenido;
    const respuestasAceptadas =
      validadorRespuestas.respuestasValidas[respuestaCorrecta] || [];

    const esCorrecta =
      respuesta === respuestaCorrecta ||
      respuestasAceptadas.includes(respuesta);

    if (esCorrecta) {
      error.classList.remove("show");
      input.classList.remove("input-incorrect");
      input.classList.add("input-correct");

      setTimeout(() => {
        const siguienteSeccion = numero < 3 ? `acertijo${numero + 1}` : "final";
        gestorSecciones.mostrarSeccion(siguienteSeccion);
      }, 800);
    } else {
      error.textContent = validadorRespuestas.obtenerMensajeError();
      error.classList.add("show");
      input.classList.remove("input-correct");
      input.classList.add("input-incorrect");

      setTimeout(() => {
        input.value = "";
        input.classList.remove("input-correct", "input-incorrect");
        error.classList.remove("show");
      }, 2000);
    }
  },
};

// Navegación
const navegacion = {
  mostrarDecision: () => {
    gestorSecciones.mostrarSeccion("decision");
  },

  elegirOpcion: (opcion) => {
    const destinos = {
      inmediata: "confirmacion1",
      esperar: "acertijo1",
    };
    const destino = destinos[opcion];
    if (destino) gestorSecciones.mostrarSeccion(destino);
  },

  confirmarOpcion: (numero, respuesta) => {
    const acciones = {
      1: { si: "confirmacion2", no: "decision" },
      2: { si: "final2", no: "decision" },
    };
    const accion = acciones[numero]?.[respuesta];
    if (accion) gestorSecciones.mostrarSeccion(accion);
  },
};

// Gestor de eventos
const gestorEventos = {
  manejarClick: utilidades.debounce((e) => {
    const { target } = e;
    const playButton = target.closest(".play-center button");
    const replayButton = target.closest(
      ".replay-button button, .replay-button .replay-btn"
    );
    const actionButton = target.closest(".acciones button");
    const sendButton = target.closest(".send-button");

    if (playButton && estadoApp.seccionActiva) {
      const sectionId = estadoApp.seccionActiva.id;

      // Ocultar botón de play permanentemente
      const playCenter = estadoApp.seccionActiva.querySelector(".play-center");
      if (playCenter) {
        playCenter.style.display = "none";
        playCenter.classList.remove("visible");
        estadoApp.playClicked = true;
      }

      // Iniciar audio de fondo AQUÍ cuando se da play
      gestorAudio.iniciarAudioFondo();

      // Reproducir audio de la sección y mostrar título
      gestorAudio.reproducirAudio(sectionId);
      generadorContenido.actualizarTitulo(sectionId);
      gestorSecciones.mostrarNarrativa(estadoApp.seccionActiva);
      return;
    }

    if (replayButton && estadoApp.seccionActiva) {
      const sectionId = estadoApp.seccionActiva.id;
      gestorAudio.reproducirAudio(sectionId);
      return;
    }

    if (sendButton) {
      const seccionActual = estadoApp.seccionActiva?.id;
      const acertijoNum = parseInt(seccionActual?.replace("acertijo", ""));
      if (!isNaN(acertijoNum)) validadorRespuestas.validarAcertijo(acertijoNum);
      return;
    }

    if (actionButton) {
      gestorEventos.procesarAccion(actionButton);
    }
  }, 300),

  procesarAccion: (button) => {
    const action = button.textContent.toLowerCase().trim();
    const seccionActual = estadoApp.seccionActiva?.id;

    if (action.includes("comenzar")) {
      navegacion.mostrarDecision();
    } else if (action.includes("regalo ahora") || action.includes("quiero")) {
      navegacion.elegirOpcion("inmediata");
    } else if (action.includes("esperaré") || action.includes("esperar")) {
      navegacion.elegirOpcion("esperar");
    } else if (action === "sí") {
      if (seccionActual === "confirmacion1") {
        navegacion.confirmarOpcion(1, "si");
      } else if (seccionActual === "confirmacion2") {
        navegacion.confirmarOpcion(2, "si");
      }
    } else if (action === "no") {
      if (seccionActual === "confirmacion1") {
        navegacion.confirmarOpcion(1, "no");
      } else if (seccionActual === "confirmacion2") {
        navegacion.confirmarOpcion(2, "no");
      }
    }
  },

  manejarTeclado: (e) => {
    if (e.key === "Enter" && estadoApp.seccionActiva) {
      const seccionId = estadoApp.seccionActiva.id;
      const acertijoNum = parseInt(seccionId.replace("acertijo", ""));
      if (!isNaN(acertijoNum)) validadorRespuestas.validarAcertijo(acertijoNum);
    }
  },

  registrarEventListeners: () => {
    if (estadoApp.eventListenersRegistrados) return;

    const refs = obtenerReferencias();
    refs.container.addEventListener("click", gestorEventos.manejarClick);
    document.addEventListener("keydown", gestorEventos.manejarTeclado);

    estadoApp.eventListenersRegistrados = true;
  },
};

// Inicializador
const inicializador = {
  iniciar: () => {
    try {
      gestorEventos.registrarEventListeners();
      const refs = obtenerReferencias();
      estadoApp.seccionActiva = refs.secciones.intro;
      gestorSecciones.mostrarSeccion("intro");
      // Forzar visibilidad del botón de play al inicio
      const playCenter = refs.secciones.intro.querySelector(".play-center");
      if (playCenter) {
        playCenter.classList.add("visible");
        playCenter.style.display = "block";
      }
    } catch (error) {
      console.error("Error durante la inicialización:", error);
    }
  },
};

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializador.iniciar);
} else {
  inicializador.iniciar();
}
