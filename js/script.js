/**
 * EXPERIENCIA INTERACTIVA NAVIDEÑA OPTIMIZADA
 */

// Variables globales
let estadoApp = {
  fondoIniciado: false,
  seccionActiva: null,
  audioActual: null,
  eventListenersRegistrados: false,
  seccionesYaCargadas: new Set(),
};

const configAudio = {
  volumenFondo: 0.1,
  volumenNarracion: 0.8,
};

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

    referencias.wrapper = document.querySelector(".wrapper");
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
    placeholder: "Tu respuesta...",
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
    placeholder: "Tu respuesta...",
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
    placeholder: "Tu respuesta...",
  },

  final: {
    titulo: "¡Felicitaciones!",
    lineas: [
      "Este regalo no suena.",
      "No se rompe. No tiene moño.",
      "Pero es tuyo, Valentino,",
      "y guarda algo capaz de crecer… más de lo que ahora podés imaginar.",
      "$200.000 solo tuyo.",
      "Desde hoy, está a tu nombre.",
      "No para usar ahora, sino para dejar que se transforme con el tiempo.",
      "¿Cómo crecerá?",
      "Con responsabilidad, porque cada decisión que tomás puede cambiar su destino.",
      "Con paciencia, porque lo verdaderamente valioso se hace esperar.",
      "Y con tiempo, porque incluso lo pequeño puede volverse imparable si lo dejás avanzar,",
      "como esa bola de nieve que empezó rodando en silencio…",
      "y ahora va ganando fuerza con cada vuelta.",
      "Si no la frenás…",
      "Si no la apurás…",
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

  validarElemento: (elemento, nombre) => {
    if (!elemento) {
      console.warn(`Elemento ${nombre} no encontrado en el DOM`);
      return false;
    }
    return true;
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
        gestorSecciones.mostrarAccionesDespuesDelAudio(sectionId);
      };
      await audio.play();
      estadoApp.audioActual = audio;
      return true;
    } catch (error) {
      console.error(`Error al reproducir audio ${sectionId}:`, error);
      return false;
    }
  },
};

// Generador de contenido optimizado (evita elementos vacíos)
const generadorContenido = {
  crearElemento: (tag, className = "", textContent = "", attributes = {}) => {
    const elemento = document.createElement(tag);
    if (className) elemento.className = className;
    if (textContent) elemento.textContent = textContent;
    Object.entries(attributes).forEach(([key, value]) =>
      elemento.setAttribute(key, value)
    );
    return elemento;
  },

  crearContenidoSeccion: (seccionId, contenido) => {
    const refs = obtenerReferencias();
    const seccion = refs.secciones[seccionId];
    if (!utilidades.validarElemento(seccion, `sección ${seccionId}`)) return;

    const narrativa = seccion.querySelector(".narrativa");
    if (!utilidades.validarElemento(narrativa, `narrativa de ${seccionId}`))
      return;

    const fragment = document.createDocumentFragment();

    // Título siempre presente
    const titulo = generadorContenido.crearElemento("div", "titulo");
    titulo.innerHTML = `<h1>${contenido.titulo}</h1>`;
    fragment.appendChild(titulo);

    // Botón de play solo para intro
    if (seccionId === "intro") {
      const playCenter = generadorContenido.crearElemento("div", "play-center");
      playCenter.innerHTML =
        '<button type="button" aria-label="Reproducir audio"><i class="fas fa-play"></i></button>';
      fragment.appendChild(playCenter);
    }

    // Párrafos
    contenido.lineas.forEach((linea) => {
      const p = generadorContenido.crearElemento("p", "", linea, {
        "data-appear": "",
      });
      fragment.appendChild(p);
    });

    // Controles solo para acertijos
    if (contenido.respuestaCorrecta) {
      const controles = generadorContenido.crearElemento("div", "controles");
      const inputId = `respuesta${seccionId.replace("acertijo", "")}`;
      const errorId = `error${seccionId.replace("acertijo", "")}`;

      const input = generadorContenido.crearElemento("input", "", "", {
        type: "text",
        id: inputId,
        required: "true",
        maxlength: "50",
        placeholder: contenido.placeholder,
        autocomplete: "off",
      });

      const button = generadorContenido.crearElemento(
        "button",
        "send-button",
        "",
        {
          type: "button",
          "aria-label": "Enviar respuesta",
        }
      );
      button.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';

      const error = generadorContenido.crearElemento(
        "div",
        "mensaje-error",
        "",
        { id: errorId }
      );

      controles.appendChild(input);
      controles.appendChild(button);
      controles.appendChild(error);
      fragment.appendChild(controles);
    }

    // Acciones solo si hay botones o boton único
    if (contenido.botones || contenido.boton) {
      const acciones = generadorContenido.crearElemento("div", "acciones");

      if (contenido.botones) {
        contenido.botones.forEach((texto) => {
          const className = seccionId === "decision" ? "opcion" : "";
          const button = generadorContenido.crearElemento(
            "button",
            className,
            texto,
            { type: "button" }
          );
          acciones.appendChild(button);
        });
      } else if (contenido.boton) {
        const button = generadorContenido.crearElemento(
          "button",
          "",
          contenido.boton,
          { type: "button" }
        );
        acciones.appendChild(button);
      }

      fragment.appendChild(acciones);
    }

    // Replay button para secciones con audio (excepto intro)
    if (seccionId !== "intro") {
      const replayButton = generadorContenido.crearElemento(
        "div",
        "replay-button"
      );
      replayButton.innerHTML =
        '<button type="button" aria-label="Repetir audio"><i class="fas fa-redo"></i> Repetir</button>';
      fragment.appendChild(replayButton);
    }

    narrativa.innerHTML = "";
    narrativa.appendChild(fragment);
  },
};

// Gestor de secciones
const gestorSecciones = {
  mostrarSeccion: (id) => {
    const refs = obtenerReferencias();
    gestorAudio.detenerAudiosSeccion();

    Object.values(refs.secciones).forEach((seccion) =>
      seccion.classList.remove("active")
    );

    const nuevaSeccion = refs.secciones[id];
    if (!utilidades.validarElemento(nuevaSeccion, `sección ${id}`)) return;

    nuevaSeccion.classList.add("active");
    estadoApp.seccionActiva = nuevaSeccion;

    if (id === "decision" && estadoApp.seccionesYaCargadas.has(id)) {
      gestorSecciones.mostrarTodoInmediatamente(nuevaSeccion);
    } else {
      const elementos = {
        lineas: nuevaSeccion.querySelectorAll("p[data-appear]"),
        acciones: nuevaSeccion.querySelector(".acciones"),
        playCenter: nuevaSeccion.querySelector(".play-center"),
        replayButton: nuevaSeccion.querySelector(".replay-button"),
        controles: nuevaSeccion.querySelector(".controles"),
      };

      elementos.lineas.forEach((p) => p.classList.remove("visible"));
      if (elementos.acciones) elementos.acciones.classList.remove("visible");
      if (elementos.controles) elementos.controles.classList.remove("visible");
      if (elementos.playCenter) elementos.playCenter.classList.remove("hidden");
      if (elementos.replayButton)
        elementos.replayButton.classList.remove("visible");

      if (id !== "intro") {
        setTimeout(() => {
          gestorAudio.reproducirAudio(id);
          gestorSecciones.animarTexto(id);
        }, 300);
      }
    }
  },

  mostrarTodoInmediatamente: (seccion) => {
    const elementos = {
      lineas: seccion.querySelectorAll("p[data-appear]"),
      acciones: seccion.querySelector(".acciones"),
      controles: seccion.querySelector(".controles"),
      replayButton: seccion.querySelector(".replay-button"),
    };

    elementos.lineas.forEach((linea, index) => {
      linea.classList.add("visible");
      const seccionId = seccion.id;
      const contenido = contenidoTexto[seccionId];
      if (contenido && contenido.lineas[index]) {
        linea.textContent = contenido.lineas[index];
      }
    });

    if (elementos.acciones) elementos.acciones.classList.add("visible");
    if (elementos.controles) elementos.controles.classList.add("visible");
    if (elementos.replayButton) elementos.replayButton.classList.add("visible");
  },

  mostrarAccionesDespuesDelAudio: (sectionId) => {
    const seccion = estadoApp.seccionActiva;
    if (!seccion || seccion.id !== sectionId) return;

    const elementos = {
      acciones: seccion.querySelector(".acciones"),
      controles: seccion.querySelector(".controles"),
      replayButton: seccion.querySelector(".replay-button"),
    };

    if (elementos.acciones)
      setTimeout(() => elementos.acciones.classList.add("visible"), 500);
    if (elementos.controles)
      setTimeout(() => elementos.controles.classList.add("visible"), 500);
    if (elementos.replayButton)
      setTimeout(() => elementos.replayButton.classList.add("visible"), 800);

    estadoApp.seccionesYaCargadas.add(sectionId);
  },

  animarTexto: (sectionId) => {
    const seccion = estadoApp.seccionActiva;
    if (!seccion || seccion.id !== sectionId) return;

    const elementos = {
      playCenter: seccion.querySelector(".play-center"),
      lineas: Array.from(seccion.querySelectorAll("p[data-appear]")),
    };

    if (elementos.playCenter) elementos.playCenter.classList.add("hidden");

    elementos.lineas.forEach((linea) => {
      linea.classList.remove("visible");
      linea.textContent = "";
      linea.style.opacity = "1";
    });

    const escribirLinea = (linea, texto) =>
      new Promise((resolve) => {
        linea.classList.add("visible");
        let i = 0;
        const escribir = () => {
          if (i < texto.length) {
            linea.textContent += texto[i];
            i++;
            const velocidades = { ".": 400, ",": 200, "…": 600 };
            const velocidad = velocidades[texto[i - 1]] || 50;
            setTimeout(escribir, velocidad);
          } else {
            resolve();
          }
        };
        escribir();
      });

    const contenido = contenidoTexto[sectionId];
    if (!contenido) return;

    elementos.lineas.reduce(
      (promise, linea, index) =>
        promise.then(() => escribirLinea(linea, contenido.lineas[index])),
      Promise.resolve()
    );
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

  estilos: {
    correcto: {
      border: "rgba(34, 139, 34, 0.4)",
      bg: "rgba(34, 139, 34, 0.1)",
    },
    incorrecto: {
      border: "rgba(220, 20, 60, 0.3)",
      bg: "rgba(220, 20, 60, 0.1)",
    },
    neutro: {
      border: "rgba(255, 255, 255, 0.15)",
      bg: "rgba(255, 255, 255, 0.05)",
    },
  },

  aplicarEstilo(input, estilo) {
    input.style.borderColor = estilo.border;
    input.style.background = estilo.bg;
  },

  validarAcertijo(numero) {
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
      this.aplicarEstilo(input, this.estilos.correcto);

      setTimeout(() => {
        const siguienteSeccion = numero < 3 ? `acertijo${numero + 1}` : "final";
        gestorSecciones.mostrarSeccion(siguienteSeccion);
      }, 500);
    } else {
      error.textContent = this.obtenerMensajeError();
      error.classList.add("show");
      this.aplicarEstilo(input, this.estilos.incorrecto);

      setTimeout(() => {
        input.value = "";
        this.aplicarEstilo(input, this.estilos.neutro);
        error.classList.remove("show");
      }, 2000);
    }
  },
};

// Navegación
const navegacion = {
  mostrarDecision: () => {
    gestorAudio.iniciarAudioFondo();
    gestorSecciones.mostrarSeccion("decision");
  },

  elegirOpcion: (opcion) => {
    const destinos = { inmediata: "confirmacion1", esperar: "acertijo1" };
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
    const replayButton = target.closest(".replay-button button");
    const actionButton = target.closest(".acciones button");
    const sendButton = target.closest(".send-button");

    if (playButton && estadoApp.seccionActiva) {
      const sectionId = estadoApp.seccionActiva.id;
      gestorAudio.reproducirAudio(sectionId);
      gestorSecciones.animarTexto(sectionId);
      return;
    }

    if (replayButton && estadoApp.seccionActiva) {
      const sectionId = estadoApp.seccionActiva.id;
      gestorAudio.reproducirAudio(sectionId);
      gestorSecciones.animarTexto(sectionId);
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

    const mapaAcciones = {
      comenzar: () => navegacion.mostrarDecision(),
      "regalo ahora": () => navegacion.elegirOpcion("inmediata"),
      esperar: () => navegacion.elegirOpcion("esperar"),
      sí: () => {
        if (seccionActual === "confirmacion1")
          return navegacion.confirmarOpcion(1, "si");
        if (seccionActual === "confirmacion2")
          return navegacion.confirmarOpcion(2, "si");
      },
      no: () => {
        if (seccionActual === "confirmacion1")
          return navegacion.confirmarOpcion(1, "no");
        if (seccionActual === "confirmacion2")
          return navegacion.confirmarOpcion(2, "no");
      },
    };

    const accionEncontrada = Object.keys(mapaAcciones).find(
      (key) => action.includes(key) || action === key
    );

    if (accionEncontrada && mapaAcciones[accionEncontrada]) {
      mapaAcciones[accionEncontrada]();
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
    refs.wrapper.addEventListener("click", gestorEventos.manejarClick);
    document.addEventListener("keydown", gestorEventos.manejarTeclado);

    estadoApp.eventListenersRegistrados = true;
  },
};

// Inicializador
const inicializador = {
  inicializarSecciones: () => {
    Object.keys(contenidoTexto).forEach((seccionId) => {
      generadorContenido.crearContenidoSeccion(
        seccionId,
        contenidoTexto[seccionId]
      );
    });
  },

  iniciar: () => {
    try {
      inicializador.inicializarSecciones();
      gestorEventos.registrarEventListeners();
      const refs = obtenerReferencias();
      estadoApp.seccionActiva = refs.secciones.intro;
    } catch (error) {
      console.error("Error durante la inicialización:", error);
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializador.iniciar);
} else {
  inicializador.iniciar();
}
