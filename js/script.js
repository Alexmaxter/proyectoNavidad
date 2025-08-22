// MultipleFiles/script.js

/**
 * Experiencia Navideña Optimizada
 * @version 2.4 - Corrección de audio en intro, final y final2
 */

// Estado global de la aplicación
const estado = {
  fondoIniciado: false,
  seccionActiva: null,
  audioActual: null,
  playClickeado: false,
  seccionesVisitadas: new Set(),
  audioReproduciendo: false,
};

// Configuración de la aplicación
const config = {
  audio: {
    volumenFondoNormal: 0.3,
    volumenFondoBajo: 0.05,
    volumenFondoMudo: 0,
    volumenNarracion: 0.8,
    duracionFade: 1000,
  },
  bokeh: {
    intro: {
      color: [255, 100, 140], // Increased red, reduced green/blue for more vivid pinkish-red
      radioGrande: 300,
      radioPequeno: 12,
      opacidad: 1,
      opacidadFondo: 0.12,
      posicion: { x: "50%", y: "50%" },
      brillo: 80, // Increased from 25 (+20%)
    },
    decision: {
      color: [100, 255, 160], // Increased green, adjusted red/blue for vivid green
      radioGrande: 130,
      radioPequeno: 14,
      opacidad: 1,
      opacidadFondo: 0.15,
      posicion: { x: "60%", y: "40%" },
      brillo: 36, // Increased from 30 (+20%)
    },
    confirmacion1: {
      color: [120, 120, 255], // Increased blue, adjusted red/green for vivid blue
      radioGrande: 140,
      radioPequeno: 16,
      opacidad: 1,
      opacidadFondo: 0.18,
      posicion: { x: "45%", y: "55%" },
      brillo: 42, // Increased from 35 (+20%)
    },
    confirmacion2: {
      color: [255, 200, 100], // Increased red, adjusted green/blue for vivid orange
      radioGrande: 200,
      radioPequeno: 18,
      opacidad: 1,
      opacidadFondo: 0.2,
      posicion: { x: "55%", y: "45%" },
      brillo: 48, // Increased from 40 (+20%)
    },
    acertijo1: {
      color: [255, 100, 255], // Increased red/blue, reduced green for vivid magenta
      radioGrande: 160,
      radioPequeno: 20,
      opacidad: 1,
      opacidadFondo: 0.22,
      posicion: { x: "70%", y: "50%" },
      brillo: 54, // Increased from 45 (+20%)
    },
    explicacion1: {
      color: [255, 120, 255], // Increased red/blue, adjusted green for vivid purple
      radioGrande: 400,
      radioPequeno: 22,
      opacidad: 1,
      opacidadFondo: 0.25,
      posicion: { x: "50%", y: "60%" },
      brillo: 60, // Increased from 50 (+20%)
    },
    acertijo2: {
      color: [100, 255, 255], // Increased green/blue, reduced red for vivid cyan
      radioGrande: 180,
      radioPequeno: 24,
      opacidad: 1,
      opacidadFondo: 0.28,
      posicion: { x: "40%", y: "50%" },
      brillo: 66, // Increased from 55 (+20%)
    },
    explicacion2: {
      color: [120, 240, 255], // Increased blue, adjusted red/green for vivid sky blue
      radioGrande: 300,
      radioPequeno: 26,
      opacidad: 1,
      opacidadFondo: 0.3,
      posicion: { x: "60%", y: "55%" },
      brillo: 72, // Increased from 60 (+20%)
    },
    acertijo3: {
      color: [255, 180, 100], // Increased red, adjusted green/blue for vivid orange
      radioGrande: 200,
      radioPequeno: 28,
      opacidad: 1,
      opacidadFondo: 0.32,
      posicion: { x: "50%", y: "45%" },
      brillo: 78, // Increased from 65 (+20%)
    },
    explicacion3: {
      color: [240, 255, 120], // Increased green, adjusted red/blue for vivid lime
      radioGrande: 210,
      radioPequeno: 30,
      opacidad: 1,
      opacidadFondo: 0.35,
      posicion: { x: "55%", y: "50%" },
      brillo: 84, // Increased from 70 (+20%)
    },
    final: {
      color: [220, 100, 255], // Increased blue, adjusted red/green for vivid purple
      radioGrande: 220,
      radioPequeno: 32,
      opacidad: 1,
      opacidadFondo: 0.38,
      posicion: { x: "50%", y: "55%" },
      brillo: 90, // Increased from 75 (+20%)
    },
    final2: {
      color: [100, 255, 200], // Increased green, adjusted red/blue for vivid teal
      radioGrande: 230,
      radioPequeno: 34,
      opacidad: 1,
      opacidadFondo: 0.4,
      posicion: { x: "45%", y: "50%" },
      brillo: 96, // Increased from 80 (+20%)
    },
  },
};

// Contenido de las secciones
const contenido = {
  intro: {
    titulo: "¡Bienvenido Valentino!",
    lineas: [
      "¡Bien hecho, Valentino!",
      "<br>",
      "Acabás de empujar tu bola de nieve y ya comenzó a rodar.",
      "Es pequeña todavía, pero cada vuelta la transforma, la hace crecer.",
      "Este viaje no se trata de apurarse, sino de descubrir qué pasa cuando le das tiempo a algo pequeño.",
      "La bola ya está en movimiento…",
      "<br>",
      "Ahora, para que siga avanzando, ¡es hora de enfrentar algunos desafíos!",
    ],
    boton: "Comenzar",
  },
  decision: {
    titulo: "Una Decisión Importante",
    lineas: [
      "Valentino, tu bola de nieve sigue rodando y ya duplicó su tamaño. Su crujido resuena en la colina, juntando más nieve con",
      "cada giro. Pero ahora llega el momento clave de esta aventura: una gran decisión que definirá todo lo que vendrá. ",
      "¿Qué camino elegís?",
      "<br>",
      "Camino A: Detener la bola ahora y descubrir el tesoro que guarda.",
      "Camino B: Dejarla rodar montaña abajo para ver qué tan grande puede llegar a ser.",
      "<br>",
      "Pensalo bien, Valentino, porque una vez que elijas, no habrá vuelta atrás.",
    ],
    botones: ["Camino 'A'", "Camino 'B'"],
  },
  confirmacion1: {
    titulo: "¿Estás seguro?",
    lineas: [
      "¿Estás seguro de querer detener la bola ahora, Valentino?",
      "Si la parás, encontrarás un tesoro increíble, pero su viaje terminará aquí.",
    ],
    botones: ["Sí", "No"],
  },
  confirmacion2: {
    titulo: "¿Estás completamente seguro?",
    lineas: [
      "¿Estás completamente seguro?",
      "Esta es tu última chance para decidir el destino de tu bola de nieve.",
    ],
    botones: ["Sí", "No"],
  },
  acertijo1: {
    titulo: "Está en tus manos",
    lineas: [
      "Un caminante se detiene en un cruce al atardecer.",
      "Un sendero brilla bajo el sol, con huellas claras y un camino firme.",
      "El otro, cubierto de niebla, muestra marcas que se desvanecen.",
      "Sabe que no puede tomar ambos, porque el tiempo no espera.",
      "Cada paso que dé definirá su destino.",
      "Su corazón late fuerte, sabiendo lo que su elección significa.",
      "<br>",
      "¿Con qué carga invisible elige el caminante su rumbo?",
    ],
    respuesta: "responsabilidad",
  },
  explicacion1: {
    lineas: [
      "¡Bien, Valentino! La responsabilidad es lo que te hace elegir con cuidado.",
      "Cada decisión que tomes da forma al camino de tu bola de nieve.",
      "<br>",
      "Con cada giro se hace más fuerte, más decidida.",
      "Ya no es solo una pequeña pelota de nieve... es algo que tiene propósito.",
      "<br>",
      "Pero para seguir creciendo, necesita enfrentar el siguiente desafío.",
    ],
  },
  acertijo2: {
    titulo: "Lo que nunca vuelve",
    lineas: [
      "Un campesino siembra una semilla bajo un cielo gris.",
      "Pasan los días, y la tierra parece quieta, sin señales de cambio.",
      "El viento sopla, el sol brilla, pero nada ocurre.",
      "Sin embargo, en la oscuridad, algo crece en silencio.",
      "Un brote asoma, rompiendo la tierra con suavidad.",
      "Con los años, se convierte en un árbol tan grande que su sombra cubre el campo.",
      "<br>",
      "¿Qué transforma una semilla pequeña en un gigante que toca el cielo?",
    ],
    respuesta: "tiempo",
  },
  explicacion2: {
    lineas: [
      "¡Exacto! El tiempo hace que lo pequeño crezca si le das espacio.",
      "Tu bola de nieve también necesita tiempo para volverse imparable.",
      "<br>",
      "Ahora es enorme, rodando con una fuerza increíble.",
      "Cada vuelta suma más nieve, más velocidad, más poder.",
      "Es como si hubiera descubierto el secreto para crecer sin parar.",
      "<br>",
      "Pero hay un último desafío... el más difícil de todos.",
    ],
  },
  acertijo3: {
    titulo: "Esperar también es avanzar",
    lineas: [
      "Un navegante observa las olas desde la costa.",
      "A veces, el mar se aleja, dejando conchas rotas y un silencio pesado.",
      "El horizonte parece lejos, y la orilla queda seca bajo el sol.",
      "Pero el navegante no se rinde.",
      "Sabe que las olas siempre vuelven, trayendo algo nuevo con su fuerza.",
      "Solo debe esperar, confiado en el ritmo del océano.",
      "<br>",
      "¿Qué sostiene al navegante cuando el mar se retira y todo parece detenido?",
    ],
    respuesta: "paciencia",
  },
  explicacion3: {
    lineas: [
      "¡Lo entendiste! La paciencia es esperar con esperanza,",
      "sabiendo que lo valioso llega si no te apurás.",
      "<br>",
      "Tu bola de nieve ahora es una avalancha imparable,",
      "rodando con toda la fuerza que acumuló en su viaje.",
      "Ha llegado el momento de descubrir qué tesoro te espera.",
    ],
  },
  final: {
    titulo: "¡Increíble, Valentino!",
    lineas: [
      "Tu pequeña bola de nieve se convirtió en una avalancha imparable.",
      "Todo porque descubriste tres secretos que la hicieron crecer:",
      "<br>",
      "Responsabilidad, porque cada decisión tuya puede cambiar su destino.",
      "<br>",
      "Tiempo, porque lo pequeño se vuelve grande si lo dejás avanzar.",
      "<br>",
      "Paciencia, porque lo que vale la pena siempre se hace esperar.",
      "<br>",
      "Este regalo no suena, no se rompe, no tiene moño.",
      "Pero es tuyo, Valentino, y guarda un tesoro que crece más de lo que imaginás: $300,000.",
      "Están a tu nombre desde hoy, pero no para usar ahora,",
      "sino para que crezcan en silencio, como esa bola de nieve que rodó despacio por la colina.",
      "Si no la frenás, si no la apurás, seguirá tomando forma, sumando fuerza, construyendo su grandeza.",
      "<br>",
      "Estará esperándote cuando cumplas 18 años,",
      "listo para que decidas cómo usarlo.",
    ],
  },
  final2: {
    titulo: "Tu elección está hecha",
    lineas: [
      "Elegiste detener la bola, Valentino, y encontraste un tesoro brillante: $50,000.",
      "Este regalo está listo para que lo uses esta Navidad,",
    ],
  },
};

// Utilidades
const utilidades = {
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
  normalizar(str) {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  },
  lerp(inicio, fin, t) {
    return inicio + (fin - inicio) * t;
  },
  fadeAudio(elementoAudio, volumenInicio, volumenFin, duracion, callback) {
    if (!elementoAudio) {
      console.warn("Elemento de audio no encontrado para fade");
      if (callback) callback();
      return;
    }

    console.log(
      `Fade audio: ${volumenInicio} -> ${volumenFin} en ${duracion}ms`
    );

    const pasos = 30;
    const tiempoPaso = duracion / pasos;
    const cambioVolumenPorPaso = (volumenFin - volumenInicio) / pasos;
    let volumenActual = volumenInicio;
    let conteoPasos = 0;

    const intervaloFade = setInterval(() => {
      conteoPasos++;
      volumenActual += cambioVolumenPorPaso;

      volumenActual = Math.max(0, Math.min(1, volumenActual));

      elementoAudio.volume = volumenActual;

      if (
        conteoPasos >= pasos ||
        (cambioVolumenPorPaso > 0 && volumenActual >= volumenFin) ||
        (cambioVolumenPorPaso < 0 && volumenActual <= volumenFin)
      ) {
        elementoAudio.volume = volumenFin;
        clearInterval(intervaloFade);
        console.log(`Fade completado: volumen final = ${volumenFin}`);
        if (callback) callback();
      }
    }, tiempoPaso);
  },
};

// Referencias DOM (cache)
const referencias = (() => {
  const cache = {};
  return {
    obtener(id) {
      if (!cache[id]) cache[id] = document.getElementById(id);
      return cache[id];
    },
    obtenerTodos(selector) {
      return document.querySelectorAll(selector);
    },
  };
})();

// Manejador de audio
const manejadorAudio = {
  audioFondo: null,
  audiosNarracion: null,

  init() {
    this.audioFondo = referencias.obtener("audio-fondo");
    this.audiosNarracion = Array.from(
      referencias.obtenerTodos("audio:not(#audio-fondo)")
    );
    if (this.audioFondo) {
      this.audioFondo.volume = config.audio.volumenFondoNormal;
      console.log("Manejador de audio inicializado correctamente");
      console.log(
        `Volumen inicial de fondo: ${config.audio.volumenFondoNormal}`
      );
    } else {
      console.error("Audio de fondo no encontrado en el DOM");
    }
  },

  async reproducirFondo() {
    if (!this.audioFondo) {
      console.warn("Audio de fondo no encontrado");
      return;
    }

    if (estado.fondoIniciado) {
      console.log("Audio de fondo ya está reproduciéndose");
      return;
    }

    try {
      this.audioFondo.volume = config.audio.volumenFondoNormal;
      await this.audioFondo.play();
      estado.fondoIniciado = true;
      console.log("Audio de fondo iniciado correctamente");
    } catch (error) {
      console.warn("Error al iniciar audio de fondo:", error);
    }
  },

  detenerFondo() {
    if (this.audioFondo && estado.fondoIniciado) {
      utilidades.fadeAudio(
        this.audioFondo,
        this.audioFondo.volume,
        0,
        config.audio.duracionFade,
        () => {
          this.audioFondo.pause();
          this.audioFondo.currentTime = 0;
          estado.fondoIniciado = false;
          console.log("Audio de fondo detenido correctamente");
        }
      );
    }
  },

  fadeVolumenFondo(volumenObjetivo) {
    if (!this.audioFondo) {
      console.warn("Audio de fondo no encontrado");
      return;
    }

    if (!estado.fondoIniciado) {
      console.log("Audio de fondo no está reproduciéndose, iniciando...");
      this.reproducirFondo().then(() => {
        utilidades.fadeAudio(
          this.audioFondo,
          this.audioFondo.volume,
          volumenObjetivo,
          config.audio.duracionFade / 2
        );
      });
      return;
    }

    console.log(
      `Fade volumen de fondo: ${this.audioFondo.volume} -> ${volumenObjetivo}`
    );

    utilidades.fadeAudio(
      this.audioFondo,
      this.audioFondo.volume,
      volumenObjetivo,
      config.audio.duracionFade / 2
    );
  },

  detenerTodasNarraciones() {
    console.log("Deteniendo todas las narraciones");

    this.audiosNarracion.forEach((audio) => {
      if (!audio.paused) {
        console.log(`Deteniendo audio: ${audio.id}`);
        audio.pause();
        audio.currentTime = 0;
      }
    });

    estado.audioActual = null;
    estado.audioReproduciendo = false;

    // Restaurar volumen de fondo solo si no estamos en final o final2
    if (
      estado.fondoIniciado &&
      estado.seccionActiva?.id !== "final" &&
      estado.seccionActiva?.id !== "final2"
    ) {
      console.log(
        "Restaurando volumen de fondo después de detener narraciones"
      );
      this.fadeVolumenFondo(config.audio.volumenFondoNormal);
    }
  },

  async reproducirNarracion(id) {
    console.log(`Reproduciendo narración: ${id}`);

    this.detenerTodasNarraciones();

    // Asegurar que el fondo esté reproduciendo antes de ajustar volumen
    if (!estado.fondoIniciado) {
      await this.reproducirFondo();
    }

    // Determinar el volumen de fondo según la sección
    const volumenFondoObjetivo =
      id === "final" || id === "final2"
        ? config.audio.volumenFondoMudo
        : config.audio.volumenFondoBajo;

    if (estado.fondoIniciado) {
      console.log(`Ajustando volumen de fondo a: ${volumenFondoObjetivo}`);
      this.fadeVolumenFondo(volumenFondoObjetivo);
    }

    const audio = referencias.obtener(`audio-${id}`);

    if (!audio) {
      console.warn(`Audio no encontrado: audio-${id}`);
      manejadorSecciones.mostrarControles(id);
      return;
    }

    try {
      audio.currentTime = 0;
      audio.volume = config.audio.volumenNarracion;
      estado.audioReproduciendo = true;

      audio.onended = () => {
        console.log(`Audio terminado: ${id}`);
        estado.audioReproduciendo = false;
        // No restaurar volumen de fondo para final o final2
        if (id !== "final" && id !== "final2") {
          console.log(
            `Restaurando volumen de fondo a: ${config.audio.volumenFondoNormal}`
          );
          this.fadeVolumenFondo(config.audio.volumenFondoNormal);
        }
        manejadorSecciones.mostrarControles(id);
      };

      audio.onerror = (error) => {
        console.error(`Error en audio ${id}:`, error);
        estado.audioReproduciendo = false;
        if (id !== "final" && id !== "final2") {
          this.fadeVolumenFondo(config.audio.volumenFondoNormal);
        }
        manejadorSecciones.mostrarControles(id);
      };

      await audio.play();
      estado.audioActual = audio;
      console.log(`Audio iniciado correctamente: ${id}`);
    } catch (error) {
      console.warn(`Error al reproducir audio ${id}:`, error);
      estado.audioReproduciendo = false;
      if (id !== "final" && id !== "final2") {
        this.fadeVolumenFondo(config.audio.volumenFondoNormal);
      }
      manejadorSecciones.mostrarControles(id);
    }
  },
};

// Manejador de contenido
const manejadorContenido = {
  render(id) {
    const seccion = referencias.obtener(id);
    const datos = contenido[id];

    if (!seccion || !datos) return;

    const elementoTitulo = seccion.querySelector(".titulo h1");
    if (elementoTitulo) elementoTitulo.textContent = datos.titulo;

    const elementoNarrativa = seccion.querySelector(".narrativa");
    if (elementoNarrativa)
      elementoNarrativa.innerHTML = datos.lineas
        .map((linea) => `<p>${linea}</p>`)
        .join("");

    const elementoAcciones = seccion.querySelector(".acciones");
    if (elementoAcciones) {
      if (datos.botones || datos.boton) {
        const botones = datos.botones || [datos.boton];
        elementoAcciones.innerHTML = botones
          .map((texto) => `<button type="button">${texto}</button>`)
          .join("");
      } else {
        elementoAcciones.innerHTML = "";
      }
    }

    if (id.startsWith("explicacion") && elementoAcciones) {
      elementoAcciones.innerHTML = '<button type="button">Siguiente</button>';
    }
  },
};

// Manejador de secciones
const manejadorSecciones = {
  async mostrar(id, saltarAudio = false) {
    document.body.style.opacity = "0";
    manejadorAudio.detenerTodasNarraciones();

    await new Promise((resolve) => setTimeout(resolve, 400));

    referencias.obtenerTodos(".section").forEach((s) => {
      s.classList.remove("active");
      s.offsetHeight;
    });

    if (id !== "intro") {
      document.body.style.backgroundColor = "#1a1a1a";
      bokeh.transicion(id);
    } else {
      document.body.style.backgroundColor = "#090a0f";
      bokeh.transicion("intro");
    }

    const seccion = referencias.obtener(id);
    if (!seccion) {
      console.error(`Sección ${id} no encontrada`);
      document.body.style.opacity = "1";
      return;
    }

    manejadorContenido.render(id);
    this.ocultarControles(seccion);

    seccion.classList.add("active");
    estado.seccionActiva = seccion;

    document.body.style.opacity = "1";

    setTimeout(() => {
      if (id === "intro" && !estado.playClickeado) {
        this.mostrarBotonPlay(seccion);
        seccion.classList.remove("show-content");
      } else if (id === "intro" && estado.playClickeado) {
        seccion.classList.add("show-content");
        this.mostrarNarrativa(seccion);
        // Iniciar fondo y narración con retraso mínimo para sincronización
        manejadorAudio.reproducirFondo().then(() => {
          setTimeout(() => {
            manejadorAudio.reproducirNarracion(id);
            this.mostrarNarrativa(seccion);
          }, 100);
        });
      } else if (saltarAudio || estado.seccionesVisitadas.has(id)) {
        this.mostrarNarrativa(seccion);
        this.mostrarControles(id);
      } else {
        manejadorAudio.reproducirFondo().then(() => {
          setTimeout(() => {
            manejadorAudio.reproducirNarracion(id);
            this.mostrarNarrativa(seccion);
          }, 100);
        });
        estado.seccionesVisitadas.add(id);
      }

      if (id === "final" || id === "final2") {
        manejadorAudio.detenerFondo();
      }
    }, 100);
  },

  mostrarNarrativa(seccion) {
    const narrativa = seccion.querySelector(".narrativa");
    if (narrativa) narrativa.classList.add("visible");
  },

  mostrarBotonPlay(seccion) {
    const playCentro = seccion.querySelector(".play-center");
    if (playCentro) {
      playCentro.classList.add("visible");
      playCentro.style.display = "flex";
    }
  },

  ocultarControles(seccion) {
    [".play-center", ".acciones", ".input-group", ".replay-button"].forEach(
      (selector) => {
        const elemento = seccion.querySelector(selector);
        if (elemento) {
          elemento.classList.remove("visible");
          if (selector === ".play-center") elemento.style.display = "none";
        }
      }
    );

    const narrativa = seccion.querySelector(".narrativa");
    if (narrativa) narrativa.classList.remove("visible");

    if (seccion.id === "intro" && !estado.playClickeado) {
      seccion.classList.remove("show-content");
    }
  },

  mostrarControles(id) {
    const seccion = estado.seccionActiva;
    if (!seccion || seccion.id !== id) return;

    setTimeout(() => {
      const botonRepetir = seccion.querySelector(".replay-button");
      const acciones = seccion.querySelector(".acciones");
      const grupoInput = seccion.querySelector(".input-group");

      if (botonRepetir) {
        botonRepetir.innerHTML = '<button type="button">Repetir</button>';
        botonRepetir.classList.add("visible");
      }
      if (acciones) acciones.classList.add("visible");
      if (grupoInput) grupoInput.classList.add("visible");
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
      "responsable",
    ],
    tiempo: ["tiempo", "el tiempo", "tiempos"],
    paciencia: ["paciencia", "la paciencia", "paciencias"],
  },

  validar(numero) {
    const input = referencias.obtener(`respuesta${numero}`);
    const error = referencias.obtener(`error${numero}`);
    const datos = contenido[`acertijo${numero}`];

    if (!input || !error || !datos) return;

    const respuesta = utilidades.normalizar(input.value);
    const estaVacio = !respuesta;
    const esCorrecta =
      !estaVacio &&
      this.respuestasValidas[datos.respuesta]?.includes(respuesta);

    error.classList.remove("show");
    input.classList.remove("input-correct", "input-incorrect", "shake");

    if (estaVacio || !esCorrecta) {
      const mensajes = [
        "Por favor, escribe una respuesta.",
        "Intenta pensar más profundamente...",
        "No es la respuesta correcta, reflexiona...",
      ];
      error.textContent = estaVacio
        ? mensajes[0]
        : mensajes[Math.floor(Math.random() * (mensajes.length - 1)) + 1];
      error.classList.add("show");
      input.classList.add("input-incorrect", "shake");

      setTimeout(() => {
        input.value = "";
        input.classList.remove("input-incorrect", "shake");
        error.classList.remove("show");
      }, 3000);
      return;
    }

    input.classList.add("input-correct");
    setTimeout(() => {
      const siguienteSeccion = `explicacion${numero}`;
      manejadorSecciones.mostrar(siguienteSeccion);
    }, 800);
  },
};

// Navegación
const navegacion = {
  irADecision() {
    manejadorSecciones.mostrar("decision");
  },

  elegirOpcion(opcion) {
    const siguienteSeccion =
      opcion === "inmediata" ? "confirmacion1" : "acertijo1";
    manejadorSecciones.mostrar(siguienteSeccion);
  },

  confirmarOpcion(numero, respuesta) {
    const acciones = {
      1: { sí: "confirmacion2", no: "decision" },
      2: { sí: "final2", no: "decision" },
    };
    const siguienteSeccion = acciones[numero]?.[respuesta.toLowerCase()];
    if (siguienteSeccion) {
      const saltarAudio = siguienteSeccion === "decision";
      manejadorSecciones.mostrar(siguienteSeccion, saltarAudio);
    }
  },

  continuarDesdeExplicacion(numeroExplicacion) {
    const siguientesSecciones = {
      1: "acertijo2",
      2: "acertijo3",
      3: "final",
    };
    const siguienteSeccion = siguientesSecciones[numeroExplicacion];
    if (siguienteSeccion) manejadorSecciones.mostrar(siguienteSeccion);
  },
};

// Efecto Bokeh Mejorado
const bokeh = {
  canvas: null,
  ctx: null,
  ancho: 0,
  alto: 0,
  burbujas: [],
  destellos: [],
  colorActual: [255, 120, 120],
  colorObjetivo: [255, 120, 120],
  opacidadFondo: 0,
  opacidadFondoObjetivo: 0,
  brilloActual: 15,
  brilloObjetivo: 15,
  tiempo: 0,
  enTransicion: false,

  init() {
    this.canvas = referencias.obtener("bokehCanvas");
    if (!this.canvas) {
      console.error("Canvas bokeh no encontrado");
      return;
    }

    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.redimensionar();
    window.addEventListener(
      "resize",
      utilidades.debounce(this.redimensionar.bind(this), 100)
    );

    const esMovil = window.innerWidth <= 768;
    const esBajoRendimiento = esMovil && window.devicePixelRatio < 2;
    this.crearBurbujas(esMovil ? 2 : 3, "large");
    this.crearBurbujas(esMovil ? 6 : 12, "small");
    if (!esBajoRendimiento) this.crearDestellos(esMovil ? 10 : 20);
    this.transicion("intro");
    this.animar();
  },

  redimensionar() {
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;
    this.canvas.width = this.ancho * window.devicePixelRatio;
    this.canvas.height = this.alto * window.devicePixelRatio;
    this.canvas.style.width = `${this.ancho}px`;
    this.canvas.style.height = `${this.alto}px`;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  },

  crearBurbujas(cantidad, tipo) {
    const cfg = config.bokeh.intro;
    const radioBase = tipo === "large" ? cfg.radioGrande : cfg.radioPequeno;

    for (let i = 0; i < cantidad; i++) {
      let x, y;

      if (tipo === "large") {
        const posiciones = [
          { x: this.ancho * 0.3, y: -radioBase * 0.2 },
          { x: this.ancho * 0.7, y: -radioBase * 0.2 },
          { x: this.ancho * 0.5, y: -radioBase * 0.3 },
          { x: -radioBase * 0.2, y: this.alto * 0.7 },
          { x: this.ancho * 0.2, y: this.alto * 0.8 },
          { x: this.ancho + radioBase * 0.2, y: this.alto * 0.3 },
          { x: this.ancho + radioBase * 0.2, y: this.alto * 0.7 },
          { x: -radioBase * 0.1, y: -radioBase * 0.1 },
          { x: this.ancho + radioBase * 0.1, y: -radioBase * 0.1 },
        ];

        const pos = posiciones[i % posiciones.length];
        x = pos.x + (Math.random() - 0.5) * radioBase * 0.6;
        y = pos.y + (Math.random() - 0.5) * radioBase * 0.6;
      } else {
        const zonas = [
          { x: 0.05, y: 0.05, w: 0.25, h: 0.25 },
          { x: 0.7, y: 0.05, w: 0.25, h: 0.25 },
          { x: 0.05, y: 0.7, w: 0.25, h: 0.25 },
          { x: 0.7, y: 0.7, w: 0.25, h: 0.25 },
          { x: 0.02, y: 0.3, w: 0.15, h: 0.4 },
          { x: 0.83, y: 0.3, w: 0.15, h: 0.4 },
          { x: 0.3, y: 0.02, w: 0.4, h: 0.15 },
          { x: 0.3, y: 0.83, w: 0.4, h: 0.15 },
        ];

        const zona = zonas[Math.floor(Math.random() * zonas.length)];
        x = (zona.x + Math.random() * zona.w) * this.ancho;
        y = (zona.y + Math.random() * zona.h) * this.alto;
      }

      const variacionTamano = 0.5 + Math.random() * 1.0;
      const radio = radioBase * variacionTamano;
      const variacionOpacidad = 0.7 + Math.random() * 0.6;

      this.burbujas.push({
        x: x,
        y: y,
        radio: radio,
        velocidadBaseX: (Math.random() - 0.5) * 0.4,
        velocidadBaseY: (Math.random() - 0.5) * 0.4,
        velocidadX: (Math.random() - 0.5) * 0.4,
        velocidadY: (Math.random() - 0.5) * 0.4,
        opacidad: cfg.opacidad * variacionOpacidad,
        desenfoque: tipo === "large" ? 20 + Math.random() * 15 : 0,
        tipo,
        radioObjetivo: radio,
        opacidadObjetivo: cfg.opacidad * variacionOpacidad,
        fase: Math.random() * Math.PI * 2,
        velocidadOscilacion: 0.003 + Math.random() * 0.012,
        amplitudOscilacion: 8 + Math.random() * 12,
        xObjetivo: x,
        yObjetivo: y,
        velocidadPulso: 0.008 + Math.random() * 0.012,
        fasePulso: Math.random() * Math.PI * 2,
      });
    }
  },

  crearDestellos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const zonas = [
        { x: 0.05, y: 0.05, w: 0.25, h: 0.25 },
        { x: 0.7, y: 0.05, w: 0.25, h: 0.25 },
        { x: 0.05, y: 0.7, w: 0.25, h: 0.25 },
        { x: 0.7, y: 0.7, w: 0.25, h: 0.25 },
        { x: 0.02, y: 0.3, w: 0.15, h: 0.4 },
        { x: 0.83, y: 0.3, w: 0.15, h: 0.4 },
        { x: 0.3, y: 0.02, w: 0.4, h: 0.15 },
        { x: 0.3, y: 0.83, w: 0.4, h: 0.15 },
        { x: 0.15, y: 0.15, w: 0.2, h: 0.2 },
        { x: 0.65, y: 0.15, w: 0.2, h: 0.2 },
        { x: 0.15, y: 0.65, w: 0.2, h: 0.2 },
        { x: 0.65, y: 0.65, w: 0.2, h: 0.2 },
      ];

      const zona = zonas[Math.floor(Math.random() * zonas.length)];
      const x = (zona.x + Math.random() * zona.w) * this.ancho;
      const y = (zona.y + Math.random() * zona.h) * this.alto;

      this.destellos.push({
        x: x,
        y: y,
        tamano: Math.random() * 4 + 0.5,
        opacidad: 0,
        opacidadMaxima: Math.random() * 0.8 + 0.3,
        fase: Math.random() * Math.PI * 2,
        velocidad: Math.random() * 0.025 + 0.015,
        tiempoVida: 0,
        tiempoVidaMaximo: Math.random() * 400 + 300,
        velocidadParpadeo: Math.random() * 0.04 + 0.015,
        faseParpadeo: Math.random() * Math.PI * 2,
        derivaX: (Math.random() - 0.5) * 0.4,
        derivaY: (Math.random() - 0.5) * 0.4,
        velocidadPulso: Math.random() * 0.02 + 0.01,
        fasePulso: Math.random() * Math.PI * 2,
      });
    }
  },

  actualizar() {
    this.tiempo += 0.016;

    const sinTiempo = Math.sin(this.tiempo);
    const cosTiempo = Math.cos(this.tiempo * 0.7);

    this.burbujas.forEach((burbuja) => {
      burbuja.x += burbuja.velocidadBaseX;
      burbuja.y += burbuja.velocidadBaseY;

      burbuja.fase += burbuja.velocidadOscilacion;
      const oscilacionX = sinTiempo * burbuja.amplitudOscilacion * 0.01;
      const oscilacionY = cosTiempo * burbuja.amplitudOscilacion * 0.01;
      burbuja.x += oscilacionX;
      burbuja.y += oscilacionY;

      burbuja.fasePulso += burbuja.velocidadPulso;
      const factorPulso = 1 + Math.sin(burbuja.fasePulso) * 0.1;

      burbuja.radio = utilidades.lerp(
        burbuja.radio,
        burbuja.radioObjetivo * factorPulso,
        0.1
      );
      burbuja.opacidad = utilidades.lerp(
        burbuja.opacidad,
        burbuja.opacidadObjetivo,
        0.1
      );

      if (this.enTransicion) {
        const factorLerp = 0.02 + Math.random() * 0.03;
        burbuja.x = utilidades.lerp(burbuja.x, burbuja.xObjetivo, factorLerp);
        burbuja.y = utilidades.lerp(burbuja.y, burbuja.yObjetivo, factorLerp);
      }

      if (!this.enTransicion && this.tiempo % 60 < 0.016) {
        burbuja.velocidadBaseX += (Math.random() - 0.5) * 0.1;
        burbuja.velocidadBaseY += (Math.random() - 0.5) * 0.1;

        burbuja.velocidadBaseX = Math.max(
          -0.5,
          Math.min(0.5, burbuja.velocidadBaseX)
        );
        burbuja.velocidadBaseY = Math.max(
          -0.5,
          Math.min(0.5, burbuja.velocidadBaseY)
        );
      }

      if (burbuja.tipo === "large") {
        const distanciaMax = burbuja.radio * 2;
        if (burbuja.x < -distanciaMax) {
          burbuja.x = this.ancho + distanciaMax;
        }
        if (burbuja.x > this.ancho + distanciaMax) {
          burbuja.x = -distanciaMax;
        }
        if (burbuja.y < -distanciaMax) {
          burbuja.y = this.alto + distanciaMax;
        }
        if (burbuja.y > this.alto + distanciaMax) {
          burbuja.y = -distanciaMax;
        }
      } else {
        const margen = burbuja.radio + 10;
        if (burbuja.x - margen < 0) {
          burbuja.x = margen;
          burbuja.velocidadBaseX = Math.abs(burbuja.velocidadBaseX) * 0.8;
        }
        if (burbuja.x + margen > this.ancho) {
          burbuja.x = this.ancho - margen;
          burbuja.velocidadBaseX = -Math.abs(burbuja.velocidadBaseX) * 0.8;
        }
        if (burbuja.y - margen < 0) {
          burbuja.y = margen;
          burbuja.velocidadBaseY = Math.abs(burbuja.velocidadBaseY) * 0.8;
        }
        if (burbuja.y + margen > this.alto) {
          burbuja.y = this.alto - margen;
          burbuja.velocidadBaseY = -Math.abs(burbuja.velocidadBaseY) * 0.8;
        }
      }
    });

    this.destellos.forEach((destello) => {
      if (
        destello.opacidad === 0 &&
        destello.tiempoVida >= destello.tiempoVidaMaximo
      )
        return;

      destello.tiempoVida++;
      destello.fase += destello.velocidad;

      destello.x += destello.derivaX;
      destello.y += destello.derivaY;

      destello.faseParpadeo += destello.velocidadParpadeo;
      const factorParpadeo = 0.7 + 0.3 * Math.sin(destello.faseParpadeo);

      destello.fasePulso += destello.velocidadPulso;
      const factorPulso = 1 + Math.sin(destello.fasePulso) * 0.2;

      const cicloVida = destello.tiempoVida / destello.tiempoVidaMaximo;
      if (cicloVida < 0.3) {
        destello.opacidad = utilidades.lerp(
          0,
          destello.opacidadMaxima,
          cicloVida / 0.3
        );
      } else if (cicloVida > 0.7) {
        destello.opacidad = utilidades.lerp(
          destello.opacidadMaxima,
          0,
          (cicloVida - 0.7) / 0.3
        );
      } else {
        destello.opacidad =
          destello.opacidadMaxima * factorParpadeo * factorPulso;
      }

      const margen = destello.tamano + 5;
      if (destello.x < margen) {
        destello.x = margen;
        destello.derivaX = Math.abs(destello.derivaX) * 0.8;
      }
      if (destello.x > this.ancho - margen) {
        destello.x = this.ancho - margen;
        destello.derivaX = -Math.abs(destello.derivaX) * 0.8;
      }
      if (destello.y < margen) {
        destello.y = margen;
        destello.derivaY = Math.abs(destello.derivaY) * 0.8;
      }
      if (destello.y > this.alto - margen) {
        destello.y = this.alto - margen;
        destello.derivaY = -Math.abs(destello.derivaY) * 0.8;
      }

      if (destello.tiempoVida >= destello.tiempoVidaMaximo) {
        const zonas = [
          { x: 0.05, y: 0.05, w: 0.25, h: 0.25 },
          { x: 0.7, y: 0.05, w: 0.25, h: 0.25 },
          { x: 0.05, y: 0.7, w: 0.25, h: 0.25 },
          { x: 0.7, y: 0.7, w: 0.25, h: 0.25 },
          { x: 0.02, y: 0.3, w: 0.15, h: 0.4 },
          { x: 0.83, y: 0.3, w: 0.15, h: 0.4 },
          { x: 0.3, y: 0.02, w: 0.4, h: 0.15 },
          { x: 0.3, y: 0.83, w: 0.4, h: 0.15 },
          { x: 0.15, y: 0.15, w: 0.2, h: 0.2 },
          { x: 0.65, y: 0.15, w: 0.2, h: 0.2 },
          { x: 0.15, y: 0.65, w: 0.2, h: 0.2 },
          { x: 0.65, y: 0.65, w: 0.2, h: 0.2 },
        ];

        const zona = zonas[Math.floor(Math.random() * zonas.length)];
        destello.x = (zona.x + Math.random() * zona.w) * this.ancho;
        destello.y = (zona.y + Math.random() * zona.h) * this.alto;

        destello.tiempoVida = 0;
        destello.tiempoVidaMaximo = Math.random() * 400 + 300;
        destello.fase = Math.random() * Math.PI * 2;
        destello.faseParpadeo = Math.random() * Math.PI * 2;
        destello.fasePulso = Math.random() * Math.PI * 2;
        destello.derivaX = (Math.random() - 0.5) * 0.4;
        destello.derivaY = (Math.random() - 0.5) * 0.4;
        destello.tamano = Math.random() * 4 + 0.5;
      }
    });

    this.colorActual = this.colorActual.map((c, i) =>
      utilidades.lerp(c, this.colorObjetivo[i], 0.1)
    );
    this.opacidadFondo = utilidades.lerp(
      this.opacidadFondo,
      this.opacidadFondoObjetivo,
      0.08
    );
    this.brilloActual = utilidades.lerp(
      this.brilloActual,
      this.brilloObjetivo,
      0.1
    );

    const diferenciaColor = this.colorActual.reduce(
      (suma, c, i) => suma + Math.abs(c - this.colorObjetivo[i]),
      0
    );
    const diferenciaOpacidad = Math.abs(
      this.opacidadFondo - this.opacidadFondoObjetivo
    );
    const diferenciaBrillo = Math.abs(this.brilloActual - this.brilloObjetivo);

    if (
      this.enTransicion &&
      diferenciaColor < 5 &&
      diferenciaOpacidad < 0.01 &&
      diferenciaBrillo < 1
    ) {
      this.enTransicion = false;
    }
  },

  dibujar() {
    this.ctx.clearRect(0, 0, this.ancho, this.alto);

    if (this.opacidadFondo > 0) {
      const [r, g, b] = this.colorActual.map(Math.round);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacidadFondo})`;
      this.ctx.fillRect(0, 0, this.ancho, this.alto);
    }

    this.ctx.globalCompositeOperation = "screen";

    const esMovil = window.innerWidth <= 768;
    const desenfoqueHabilitado = !esMovil;

    this.burbujas.forEach((burbuja) => {
      const [r, g, b] = this.colorActual.map(Math.round);

      if (burbuja.tipo === "large") {
        const gradiente = this.ctx.createRadialGradient(
          burbuja.x,
          burbuja.y,
          0,
          burbuja.x,
          burbuja.y,
          burbuja.radio + this.brilloActual * 0.3
        );

        gradiente.addColorStop(
          0,
          `rgba(${r}, ${g}, ${b}, ${burbuja.opacidad * 0.9})`
        );
        gradiente.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        this.ctx.filter = desenfoqueHabilitado
          ? `blur(${burbuja.desenfoque}px)`
          : "none";
        this.ctx.beginPath();
        this.ctx.arc(burbuja.x, burbuja.y, burbuja.radio, 0, Math.PI * 2);
        this.ctx.fillStyle = gradiente;
        this.ctx.fill();

        const gradienteBrillo = this.ctx.createRadialGradient(
          burbuja.x,
          burbuja.y,
          0,
          burbuja.x,
          burbuja.y,
          burbuja.radio * 0.4
        );
        gradienteBrillo.addColorStop(
          0,
          `rgba(255, 255, 255, ${burbuja.opacidad * 0.2})`
        );
        gradienteBrillo.addColorStop(1, `rgba(255, 255, 255, 0)`);

        this.ctx.beginPath();
        this.ctx.arc(burbuja.x, burbuja.y, burbuja.radio * 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = gradienteBrillo;
        this.ctx.fill();
      } else {
        this.ctx.filter = "none";
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${
          burbuja.opacidad * 0.3
        })`;
        this.ctx.beginPath();
        this.ctx.arc(burbuja.x, burbuja.y, burbuja.radio, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    this.ctx.filter = "blur(0.5px)";
    this.destellos.forEach((destello) => {
      if (destello.opacidad > 0) {
        const [r, g, b] = this.colorActual.map(Math.round);

        const variacionColor = 20 + Math.random() * 40;
        const destelloR = Math.min(255, r + variacionColor);
        const destelloG = Math.min(255, g + variacionColor);
        const destelloB = Math.min(255, b + variacionColor);

        const tamanoPulso =
          destello.tamano * (0.8 + Math.sin(destello.fasePulso) * 0.3);

        this.ctx.fillStyle = `rgba(${destelloR}, ${destelloG}, ${destelloB}, ${destello.opacidad})`;
        this.ctx.beginPath();
        this.ctx.arc(destello.x, destello.y, tamanoPulso, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    this.ctx.filter = "none";
    this.ctx.globalCompositeOperation = "source-over";
  },

  transicion(idSeccion) {
    const cfg = config.bokeh[idSeccion];
    if (!cfg) {
      console.warn(`Configuración bokeh no encontrada para: ${idSeccion}`);
      return;
    }

    console.log(`Transición bokeh a: ${idSeccion}`);

    this.colorObjetivo = [...cfg.color];
    this.opacidadFondoObjetivo = cfg.opacidadFondo;
    this.brilloObjetivo = cfg.brillo;
    this.enTransicion = true;

    this.burbujas.forEach((burbuja, indice) => {
      const radioBase =
        burbuja.tipo === "large" ? cfg.radioGrande : cfg.radioPequeno;
      const variacionTamano = 0.6 + Math.random() * 0.8;
      burbuja.radioObjetivo = radioBase * variacionTamano;
      burbuja.opacidadObjetivo = cfg.opacidad * (0.8 + Math.random() * 0.4);

      if (burbuja.tipo === "large") {
        const todasPosiciones = [
          { x: this.ancho * 0.3, y: -radioBase * 0.2 },
          { x: this.ancho * 0.7, y: -radioBase * 0.2 },
          { x: this.ancho * 0.5, y: -radioBase * 0.3 },
          { x: -radioBase * 0.2, y: this.alto * 0.7 },
          { x: this.ancho * 0.2, y: this.alto * 0.8 },
          { x: this.ancho + radioBase * 0.2, y: this.alto * 0.3 },
          { x: this.ancho + radioBase * 0.2, y: this.alto * 0.7 },
          { x: -radioBase * 0.1, y: -radioBase * 0.1 },
          { x: this.ancho + radioBase * 0.1, y: -radioBase * 0.1 },
          { x: this.ancho * 0.1, y: -radioBase * 0.1 },
          { x: this.ancho * 0.9, y: -radioBase * 0.1 },
          { x: -radioBase * 0.1, y: this.alto * 0.1 },
          { x: this.ancho + radioBase * 0.1, y: this.alto * 0.9 },
        ];

        const posicionesMezcladas = [...todasPosiciones].sort(
          () => Math.random() - 0.5
        );
        const pos = posicionesMezcladas[indice % posicionesMezcladas.length];

        burbuja.xObjetivo = pos.x + (Math.random() - 0.5) * radioBase * 0.8;
        burbuja.yObjetivo = pos.y + (Math.random() - 0.5) * radioBase * 0.8;
      } else {
        const zonas = [
          { x: 0.05, y: 0.05, w: 0.25, h: 0.25 },
          { x: 0.7, y: 0.05, w: 0.25, h: 0.25 },
          { x: 0.05, y: 0.7, w: 0.25, h: 0.25 },
          { x: 0.7, y: 0.7, w: 0.25, h: 0.25 },
          { x: 0.02, y: 0.3, w: 0.15, h: 0.4 },
          { x: 0.83, y: 0.3, w: 0.15, h: 0.4 },
          { x: 0.3, y: 0.02, w: 0.4, h: 0.15 },
          { x: 0.3, y: 0.83, w: 0.4, h: 0.15 },
          { x: 0.15, y: 0.15, w: 0.2, h: 0.2 },
          { x: 0.65, y: 0.15, w: 0.2, h: 0.2 },
          { x: 0.15, y: 0.65, w: 0.2, h: 0.2 },
          { x: 0.65, y: 0.65, w: 0.2, h: 0.2 },
        ];

        const zona = zonas[Math.floor(Math.random() * zonas.length)];
        burbuja.xObjetivo = (zona.x + Math.random() * zona.w) * this.ancho;
        burbuja.yObjetivo = (zona.y + Math.random() * zona.h) * this.alto;
      }

      burbuja.velocidadBaseX = (Math.random() - 0.5) * 0.5;
      burbuja.velocidadBaseY = (Math.random() - 0.5) * 0.5;
      burbuja.velocidadOscilacion = 0.003 + Math.random() * 0.015;
      burbuja.amplitudOscilacion = 5 + Math.random() * 15;
      burbuja.velocidadPulso = 0.008 + Math.random() * 0.015;
    });
  },

  animar() {
    const esMovil = window.innerWidth <= 768;
    const saltarCuadros = esMovil ? 2 : 1;
    let conteoCuadros = 0;

    const bucle = () => {
      conteoCuadros++;
      if (conteoCuadros % saltarCuadros === 0) {
        this.actualizar();
        this.dibujar();
      }
      requestAnimationFrame(bucle);
    };
    requestAnimationFrame(bucle);
  },
};

// Manejador de eventos
const manejadorEventos = {
  init() {
    document.addEventListener(
      "click",
      utilidades.debounce(this.manejarClic.bind(this), 300)
    );
    document.addEventListener(
      "keydown",
      utilidades.debounce(this.manejarTecla.bind(this), 300)
    );
  },

  manejarClic(e) {
    const { target } = e;
    const seccion = estado.seccionActiva;
    if (!seccion) return;

    if (target.closest(".play-center button")) {
      const playCentro = seccion.querySelector(".play-center");
      playCentro.style.display = "none";
      playCentro.classList.remove("visible");
      estado.playClickeado = true;

      seccion.classList.add("show-content");

      manejadorAudio.reproducirFondo().then(() => {
        manejadorAudio.reproducirNarracion(seccion.id);
        manejadorSecciones.mostrarNarrativa(seccion);
      });
      return;
    }

    if (target.closest(".replay-button button")) {
      manejadorAudio.reproducirNarracion(seccion.id);
      return;
    }

    if (target.closest(".send-button")) {
      const coincidencia = seccion.id.match(/^acertijo(\d+)$/);
      if (coincidencia)
        validadorRespuestas.validar(parseInt(coincidencia[1], 10));
      return;
    }

    if (target.closest(".acciones button")) {
      const accion = target.textContent.toLowerCase().trim();

      if (accion.includes("comenzar")) navegacion.irADecision();
      else if (accion.includes("'a'")) navegacion.elegirOpcion("inmediata");
      else if (accion.includes("'b'")) navegacion.elegirOpcion("esperar");
      else if (accion === "sí" || accion === "no") {
        const numero =
          seccion.id === "confirmacion1"
            ? 1
            : seccion.id === "confirmacion2"
            ? 2
            : 0;
        if (numero) navegacion.confirmarOpcion(numero, accion);
      } else if (accion === "siguiente") {
        const coincidencia = seccion.id.match(/^explicacion(\d+)$/);
        if (coincidencia)
          navegacion.continuarDesdeExplicacion(parseInt(coincidencia[1], 10));
      }
    }
  },

  manejarTecla(e) {
    if (e.key !== "Enter" || !estado.seccionActiva) return;
    const coincidencia = estado.seccionActiva.id.match(/^acertijo(\d+)$/);
    if (coincidencia)
      validadorRespuestas.validar(parseInt(coincidencia[1], 10));
  },
};

// Inicialización de la aplicación
const app = {
  init() {
    console.log("Iniciando experiencia navideña...");

    const seccionIntro = referencias.obtener("intro");
    const canvas = referencias.obtener("bokehCanvas");

    if (!seccionIntro) {
      console.error("Sección intro no encontrada.");
      return;
    }

    if (!canvas) {
      console.error("Canvas bokeh no encontrado.");
      return;
    }

    manejadorAudio.init();
    bokeh.init();
    manejadorEventos.init();

    estado.seccionActiva = seccionIntro;
    estado.playClickeado = false;

    for (const idSeccion in contenido) {
      manejadorContenido.render(idSeccion);
    }

    manejadorSecciones.mostrar("intro");

    setTimeout(() => {
      document.body.classList.add("loaded");
    }, 100);

    window.testAudio = () => {
      console.log("=== PRUEBA DE AUDIO ===");
      console.log("Estado actual:", estado);
      console.log("Audio de fondo:", manejadorAudio.audioFondo);
      console.log("Volumen de fondo:", manejadorAudio.audioFondo?.volume);
      console.log("Reproduciendo fondo:", estado.fondoIniciado);
      manejadorAudio.reproducirFondo().then(() => {
        manejadorAudio.reproducirNarracion("intro");
      });
    };

    console.log("Función de prueba disponible: testAudio()");
  },
};

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => app.init());
