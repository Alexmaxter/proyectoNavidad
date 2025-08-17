/**
 * EXPERIENCIA INTERACTIVA OPTIMIZADA - LOADER CORREGIDO
 */

// Variables globales
let estadoApp = {
  fondoIniciado: false,
  seccionActiva: null,
  audioActual: null,
  transicionEnProceso: false,
  eventListenersRegistrados: false,
};

const configAudio = {
  volumenFondo: 0.1,
  volumenNarracion: 0.8,
  intentosReproduccion: 3,
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
    referencias.loadingIndicator = document.getElementById("loading-indicator");
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
    botones: ["¡Quiero un regalo ahora!🎁", "Esperaré❄️"],
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
      "hasta que cumplas 18.",
      "Y cuando llegue ese día, Valentino…",
      "va a estar listo para que vos decidas qué hacer con él.",
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
        console.log("Audio de fondo iniciado correctamente");
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

  reproducirAudio: async (sectionId, intentos = 0) => {
    const refs = obtenerReferencias();
    gestorAudio.detenerAudiosSeccion();

    const audio = refs.audios[sectionId];
    if (!audio) {
      console.error(`Audio no encontrado para la sección: ${sectionId}`);
      return false;
    }

    try {
      audio.currentTime = 0;
      audio.volume =
        sectionId === "fondo"
          ? configAudio.volumenFondo
          : configAudio.volumenNarracion;
      await audio.play();
      estadoApp.audioActual = audio;
      console.log(`Audio ${sectionId} reproducido correctamente`);
      return true;
    } catch (error) {
      if (intentos < configAudio.intentosReproduccion) {
        console.warn(
          `Reintentando reproducción de audio ${sectionId}, intento ${
            intentos + 1
          }`
        );
        return gestorAudio.reproducirAudio(sectionId, intentos + 1);
      } else {
        console.error(
          `Error al reproducir audio ${sectionId} después de ${configAudio.intentosReproduccion} intentos:`,
          error
        );
        return false;
      }
    }
  },
};

// Generador de contenido
const generadorContenido = {
  crearElemento: (tag, className = "", textContent = "", attributes = {}) => {
    const elemento = document.createElement(tag);
    if (className) elemento.className = className;
    if (textContent) elemento.textContent = textContent;
    Object.entries(attributes).forEach(([key, value]) => {
      elemento.setAttribute(key, value);
    });
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

    // Crear título
    const titulo = generadorContenido.crearElemento("div", "titulo");
    titulo.innerHTML = `<h1>${contenido.titulo}</h1>`;
    fragment.appendChild(titulo);

    // Crear botón de play
    const playCenter = generadorContenido.crearElemento("div", "play-center");
    playCenter.innerHTML = `
                    <button type="button" aria-label="Reproducir audio">
                        <i class="fas fa-play"></i>
                    </button>
                `;
    fragment.appendChild(playCenter);

    // Crear párrafos de texto
    contenido.lineas.forEach((linea) => {
      const p = generadorContenido.crearElemento("p", "", linea, {
        "data-appear": "",
      });
      fragment.appendChild(p);
    });

    // Crear sección de acciones
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
    } else if (contenido.respuestaCorrecta) {
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
        "",
        "Confirmar",
        { type: "button" }
      );
      const error = generadorContenido.crearElemento(
        "div",
        "mensaje-error",
        "",
        { id: errorId }
      );

      acciones.appendChild(input);
      acciones.appendChild(button);
      acciones.appendChild(error);
    }

    fragment.appendChild(acciones);

    // Crear botón de replay
    const replayButton = generadorContenido.crearElemento(
      "div",
      "replay-button"
    );
    replayButton.innerHTML = `
                    <button type="button" aria-label="Repetir audio">
                        <i class="fas fa-redo"></i> Repetir
                    </button>
                `;
    fragment.appendChild(replayButton);

    // Limpiar y agregar contenido
    narrativa.innerHTML = "";
    narrativa.appendChild(fragment);
  },
};

// Gestor de transiciones
const gestorTransiciones = {
  transicionarSeccion: (seccionAnterior, nuevaSeccion) => {
    return new Promise((resolve) => {
      if (!seccionAnterior || !nuevaSeccion) {
        resolve();
        return;
      }

      estadoApp.transicionEnProceso = true;
      seccionAnterior.classList.add("fade-out");

      const timeoutId = setTimeout(() => {
        gestorTransiciones.resetSeccion(seccionAnterior);
        nuevaSeccion.style.display = "block";
        nuevaSeccion.classList.add("fade-in-up");

        requestAnimationFrame(() => {
          setTimeout(() => {
            nuevaSeccion.classList.add("active");
            nuevaSeccion.classList.remove("fade-in-up");
            estadoApp.transicionEnProceso = false;
            resolve();
          }, 100);
        });
      }, 400);

      setTimeout(() => {
        if (estadoApp.transicionEnProceso) {
          clearTimeout(timeoutId);
          estadoApp.transicionEnProceso = false;
          resolve();
        }
      }, 2000);
    });
  },

  resetSeccion: (seccion) => {
    seccion.style.display = "none";
    seccion.classList.remove("active", "fade-out");

    const elementos = {
      lineas: seccion.querySelectorAll("p[data-appear]"),
      acciones: seccion.querySelector(".acciones"),
      playCenter: seccion.querySelector(".play-center"),
      replayButton: seccion.querySelector(".replay-button"),
    };

    elementos.lineas.forEach((p) => p.classList.remove("visible"));
    if (elementos.acciones) elementos.acciones.classList.remove("visible");
    if (elementos.playCenter) elementos.playCenter.classList.remove("hidden");
    if (elementos.replayButton)
      elementos.replayButton.classList.remove("visible");
  },
};

// Gestor de secciones
const gestorSecciones = {
  mostrarSeccion: async (id) => {
    if (estadoApp.transicionEnProceso) {
      console.warn("Transición en proceso, ignorando solicitud");
      return;
    }

    const refs = obtenerReferencias();
    gestorAudio.detenerAudiosSeccion();

    const seccionAnterior = estadoApp.seccionActiva;
    const nuevaSeccion = refs.secciones[id];

    if (!utilidades.validarElemento(nuevaSeccion, `sección ${id}`)) return;

    if (seccionAnterior) {
      await gestorTransiciones.transicionarSeccion(
        seccionAnterior,
        nuevaSeccion
      );
    } else {
      nuevaSeccion.style.display = "block";
      nuevaSeccion.classList.add("fade-in-up");
      setTimeout(() => {
        nuevaSeccion.classList.add("active");
        nuevaSeccion.classList.remove("fade-in-up");
      }, 600);
    }

    estadoApp.seccionActiva = nuevaSeccion;
    console.log(`Sección mostrada: ${id}`);
  },

  animarTexto: (sectionId) => {
    const seccion = estadoApp.seccionActiva;
    if (!seccion || seccion.id !== sectionId) return;

    const elementos = {
      playCenter: seccion.querySelector(".play-center"),
      acciones: seccion.querySelector(".acciones"),
      replayButton: seccion.querySelector(".replay-button"),
      lineas: Array.from(seccion.querySelectorAll("p[data-appear]")),
    };

    if (elementos.playCenter) elementos.playCenter.classList.add("hidden");
    if (elementos.acciones) elementos.acciones.classList.remove("visible");
    if (elementos.replayButton)
      elementos.replayButton.classList.remove("visible");

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

    elementos.lineas
      .reduce(
        (promise, linea, index) =>
          promise.then(() => escribirLinea(linea, contenido.lineas[index])),
        Promise.resolve()
      )
      .then(() => {
        if (elementos.acciones) {
          elementos.acciones.classList.add("visible");
          const botones = elementos.acciones.querySelectorAll("button");
          botones.forEach((boton, i) => {
            setTimeout(() => {
              boton.style.opacity = "0";
              boton.style.transform = "translateY(20px)";
              requestAnimationFrame(() => {
                setTimeout(() => {
                  boton.style.opacity = "1";
                  boton.style.transform = "translateY(0)";
                }, 50);
              });
            }, i * 100);
          });
        }

        if (elementos.replayButton) {
          setTimeout(
            () => elementos.replayButton.classList.add("visible"),
            200
          );
        }
      });
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

  validarAcertijo: async (numero) => {
    const inputId = `respuesta${numero}`;
    const errorId = `error${numero}`;
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (!input || !error) {
      console.error(`Elementos de acertijo ${numero} no encontrados`);
      return;
    }

    const respuesta = input.value.toLowerCase().trim().replace(/\s+/g, " ");
    const seccionId = `acertijo${numero}`;
    const contenido = contenidoTexto[seccionId];

    if (!contenido) {
      console.error(`Contenido para ${seccionId} no encontrado`);
      return;
    }

    const respuestaCorrecta = contenido.respuestaCorrecta;
    const respuestasAceptadas =
      validadorRespuestas.respuestasValidas[respuestaCorrecta];
    const esCorrecta =
      respuestasAceptadas?.includes(respuesta) ||
      respuesta === respuestaCorrecta;

    if (esCorrecta) {
      error.classList.remove("show");
      input.style.borderBottomColor = "#388e3c";
      input.style.background = "rgba(56, 142, 60, 0.1)";

      setTimeout(async () => {
        const siguienteSeccion = numero < 3 ? `acertijo${numero + 1}` : "final";
        await gestorSecciones.mostrarSeccion(siguienteSeccion);
      }, 500);
    } else {
      const mensajesError = [
        "Respuesta incorrecta. Piensa un poco más...",
        "Casi... pero no es esa. Inténtalo de nuevo.",
        "Mmm, no es correcto. Reflexiona sobre las pistas.",
      ];

      error.textContent =
        mensajesError[Math.floor(Math.random() * mensajesError.length)];
      error.classList.add("show");
      input.style.borderBottomColor = "#d9534f";
      input.style.background = "rgba(217, 83, 79, 0.1)";

      setTimeout(() => {
        input.value = "";
        input.style.borderBottomColor = "#555";
        input.style.background = "transparent";
        error.classList.remove("show");
      }, 2000);
    }
  },
};

// Navegación
const navegacion = {
  mostrarDecision: async () => {
    await gestorAudio.iniciarAudioFondo();
    await gestorSecciones.mostrarSeccion("decision");
  },

  elegirOpcion: async (opcion) => {
    const destinos = {
      inmediata: "confirmacion1",
      esperar: "acertijo1",
    };

    const destino = destinos[opcion];
    if (destino) {
      await gestorSecciones.mostrarSeccion(destino);
    } else {
      console.error(`Opción no válida: ${opcion}`);
    }
  },

  confirmarOpcion: async (numero, respuesta) => {
    const acciones = {
      1: { si: "confirmacion2", no: "decision" },
      2: { si: "final2", no: "decision" },
    };

    const accion = acciones[numero]?.[respuesta];
    if (accion) {
      await gestorSecciones.mostrarSeccion(accion);
    } else {
      console.error(`Confirmación no válida: ${numero}, ${respuesta}`);
    }
  },
};

// Gestor de eventos
const gestorEventos = {
  manejarClick: utilidades.debounce(async (e) => {
    if (estadoApp.transicionEnProceso) return;

    const { target } = e;
    const playButton = target.closest(".play-center button");
    const replayButton = target.closest(".replay-button button");
    const actionButton = target.closest(".acciones button");

    if (playButton && estadoApp.seccionActiva) {
      const sectionId = estadoApp.seccionActiva.id;
      await gestorAudio.reproducirAudio(sectionId);
      gestorSecciones.animarTexto(sectionId);
      return;
    }

    if (replayButton && estadoApp.seccionActiva) {
      const sectionId = estadoApp.seccionActiva.id;
      await gestorAudio.reproducirAudio(sectionId);
      gestorSecciones.animarTexto(sectionId);
      return;
    }

    if (actionButton) {
      await gestorEventos.procesarAccion(actionButton);
    }
  }, 300),

  procesarAccion: async (button) => {
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
      confirmar: () => {
        const acertijoNum = parseInt(seccionActual?.replace("acertijo", ""));
        if (!isNaN(acertijoNum))
          return validadorRespuestas.validarAcertijo(acertijoNum);
      },
    };

    const accionEncontrada = Object.keys(mapaAcciones).find(
      (key) => action.includes(key) || action === key
    );

    if (accionEncontrada && mapaAcciones[accionEncontrada]) {
      try {
        await mapaAcciones[accionEncontrada]();
      } catch (error) {
        console.error(`Error ejecutando acción ${accionEncontrada}:`, error);
      }
    } else {
      console.warn(`Acción no reconocida: ${action}`);
    }
  },

  manejarTeclado: (e) => {
    if (e.key === "Enter" && estadoApp.seccionActiva) {
      const seccionId = estadoApp.seccionActiva.id;
      const acertijoNum = parseInt(seccionId.replace("acertijo", ""));

      if (!isNaN(acertijoNum)) {
        validadorRespuestas.validarAcertijo(acertijoNum);
      }
    }
  },

  registrarEventListeners: () => {
    if (estadoApp.eventListenersRegistrados) return;

    const refs = obtenerReferencias();
    refs.wrapper.addEventListener("click", gestorEventos.manejarClick);
    document.addEventListener("keydown", gestorEventos.manejarTeclado);

    estadoApp.eventListenersRegistrados = true;
    console.log("Event listeners registrados correctamente");
  },
};

// INICIALIZADOR CORREGIDO
const inicializador = {
  manejarCarga: () => {
    console.log("🔄 Iniciando proceso de carga...");
    const refs = obtenerReferencias();

    // Mostrar loader inmediatamente
    if (refs.loadingIndicator) {
      refs.loadingIndicator.classList.remove("hidden");
      console.log("✅ Loader mostrado");
    } else {
      console.error("❌ Loading indicator no encontrado");
    }

    let recursosListos = 0;
    const totalRecursos = Object.keys(refs.audios).length;
    console.log(`📊 Total de recursos a cargar: ${totalRecursos}`);

    const verificarRecurso = (nombreRecurso) => {
      recursosListos++;
      console.log(
        `✅ Recurso cargado: ${nombreRecurso} (${recursosListos}/${totalRecursos})`
      );

      if (recursosListos >= totalRecursos) {
        console.log("🎉 Todos los recursos cargados!");
        setTimeout(() => {
          if (refs.loadingIndicator) {
            refs.loadingIndicator.classList.add("hidden");
            console.log("🫥 Loader ocultado");
          }
          refs.wrapper.classList.add("loaded");
          console.log("🚀 Aplicación lista");
        }, 1500);
      }
    };

    // Verificar carga de audios
    Object.entries(refs.audios).forEach(([key, audio]) => {
      if (!audio) {
        console.warn(`⚠️ Audio ${key} no encontrado`);
        verificarRecurso(key);
        return;
      }

      if (audio.readyState >= 2) {
        verificarRecurso(key);
      } else {
        audio.addEventListener("canplaythrough", () => verificarRecurso(key), {
          once: true,
        });
        audio.addEventListener(
          "error",
          () => {
            console.warn(`❌ Error cargando audio: ${key}`);
            verificarRecurso(key);
          },
          { once: true }
        );

        // Timeout de seguridad por audio
        setTimeout(() => {
          console.warn(`⏰ Timeout para audio: ${key}`);
          verificarRecurso(key);
        }, 5000);
      }
    });

    // Fallback final de seguridad
    setTimeout(() => {
      console.log("⏰ Fallback final activado");
      if (
        refs.loadingIndicator &&
        !refs.loadingIndicator.classList.contains("hidden")
      ) {
        refs.loadingIndicator.classList.add("hidden");
      }
      if (!refs.wrapper.classList.contains("loaded")) {
        refs.wrapper.classList.add("loaded");
      }
    }, 12000);
  },

  inicializarSecciones: () => {
    console.log("🔧 Inicializando secciones...");
    Object.keys(contenidoTexto).forEach((seccionId) => {
      generadorContenido.crearContenidoSeccion(
        seccionId,
        contenidoTexto[seccionId]
      );
    });
    console.log("✅ Secciones inicializadas correctamente");
  },

  iniciar: async () => {
    try {
      console.log("🚀 Iniciando aplicación...");

      // 1. Manejar indicador de carga
      inicializador.manejarCarga();

      // 2. Inicializar secciones
      inicializador.inicializarSecciones();

      // 3. Registrar event listeners
      gestorEventos.registrarEventListeners();

      // 4. Mostrar primera sección después de la carga
      setTimeout(async () => {
        console.log("🎬 Mostrando sección intro...");
        await gestorSecciones.mostrarSeccion("intro");
      }, 6000);

      console.log("✅ Aplicación inicializada correctamente");
    } catch (error) {
      console.error("❌ Error durante la inicialización:", error);
    }
  },
};

// Inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializador.iniciar);
} else {
  inicializador.iniciar();
}
