// =============================
// ESTADO GLOBAL
// =============================
const estado = {
  fondoIniciado: false,
  seccionActiva: null,
  audioActual: null,
  playClickeado: false,
  seccionesVisitadas: new Set(),
  audioReproduciendo: false,
};

// =============================
// CONFIGURACIÓN
// =============================
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
      color: [60, 180, 140],
      cantidadBokeh: 12,
      cantidadDefinidos: 6,
      cantidadParticulas: 20,
    },
    decision: {
      color: [100, 255, 160],
      cantidadBokeh: 10,
      cantidadDefinidos: 6,
      cantidadParticulas: 18,
    },
    confirmacion1: {
      color: [40, 160, 180],
      cantidadBokeh: 8,
      cantidadDefinidos: 5,
      cantidadParticulas: 15,
    },
    confirmacion2: {
      color: [255, 200, 100],
      cantidadBokeh: 10,
      cantidadDefinidos: 7,
      cantidadParticulas: 20,
    },
    acertijo1: {
      color: [255, 100, 255],
      cantidadBokeh: 9,
      cantidadDefinidos: 6,
      cantidadParticulas: 17,
    },
    explicacion1: {
      color: [80, 200, 160],
      cantidadBokeh: 11,
      cantidadDefinidos: 8,
      cantidadParticulas: 22,
    },
    acertijo2: {
      color: [100, 255, 255],
      cantidadBokeh: 8,
      cantidadDefinidos: 5,
      cantidadParticulas: 16,
    },
    explicacion2: {
      color: [120, 240, 255],
      cantidadBokeh: 12,
      cantidadDefinidos: 9,
      cantidadParticulas: 24,
    },
    acertijo3: {
      color: [255, 180, 100],
      cantidadBokeh: 10,
      cantidadDefinidos: 7,
      cantidadParticulas: 19,
    },
    explicJon: {
      color: [240, 255, 120],
      cantidadBokeh: 13,
      cantidadDefinidos: 10,
      cantidadParticulas: 25,
    },
    final: {
      color: [220, 100, 255],
      cantidadBokeh: 15,
      cantidadDefinidos: 12,
      cantidadParticulas: 30,
    },
    final2: {
      color: [100, 255, 200],
      cantidadBokeh: 14,
      cantidadDefinidos: 11,
      cantidadParticulas: 28,
    },
  },
};

// =============================
// CONTENIDO DE SECCIONES
// (idéntico al que enviaste)
// =============================
const contenido = {
  intro: {
    titulo: "¡Bienvenido Valentino!",
    lineas: [
      "¡Bien hecho, Valentino!<br>Acabás de empujar tu bola de nieve y ya comenzó a rodar.<br><br> Es pequeña todavía, pero cada vuelta la transforma, la hace crecer. Este viaje no se trata de apurarse, sino de descubrir qué pasa cuando le das tiempo a algo pequeño. La bola ya está en movimiento…<br><br>Ahora, para que siga avanzando, ¡es hora de enfrentar algunos desafíos!",
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

// =============================
// UTILIDADES
// =============================
const utilidades = {
  debounce(func, wait) {
    let timeout;
    return (...args) => (
      clearTimeout(timeout), (timeout = setTimeout(() => func(...args), wait))
    );
  },
  normalizar: (str) =>
    str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " "),
  lerp: (inicio, fin, t) => inicio + (fin - inicio) * t,
  fadeAudio(elementoAudio, volumenInicio, volumenFin, duracion, callback) {
    if (!elementoAudio) return callback?.();
    const pasos = 30,
      tiempoPaso = duracion / pasos,
      cambio = (volumenFin - volumenInicio) / pasos;
    let volumenActual = volumenInicio,
      conteo = 0;
    const intervalo = setInterval(() => {
      volumenActual = Math.max(0, Math.min(1, volumenActual + cambio));
      elementoAudio.volume = volumenActual;
      if (
        ++conteo >= pasos ||
        (cambio > 0 && volumenActual >= volumenFin) ||
        (cambio < 0 && volumenActual <= volumenFin)
      ) {
        elementoAudio.volume = volumenFin;
        clearInterval(intervalo);
        callback?.();
      }
    }, tiempoPaso);
  },
};

// =============================
// CACHE DE REFERENCIAS DOM
// =============================
const referencias = (() => {
  const cache = {};
  return {
    obtener: (id) => cache[id] ?? (cache[id] = document.getElementById(id)),
    obtenerTodos: (selector) => document.querySelectorAll(selector),
  };
})();

// =============================
// AUDIO
// =============================
const manejadorAudio = {
  audioFondo: null,
  audiosNarracion: null,
  init() {
    this.audioFondo = referencias.obtener("audio-fondo");
    this.audiosNarracion = [
      ...referencias.obtenerTodos("audio:not(#audio-fondo)"),
    ];
    if (this.audioFondo)
      this.audioFondo.volume = config.audio.volumenFondoNormal;
  },
  async reproducirFondo() {
    if (!this.audioFondo || estado.fondoIniciado) return;
    try {
      this.audioFondo.volume = config.audio.volumenFondoNormal;
      await this.audioFondo.play();
      estado.fondoIniciado = true;
    } catch (error) {
      console.warn("Error al iniciar audio de fondo:", error);
    }
  },
  detenerFondo() {
    if (!this.audioFondo || !estado.fondoIniciado) return;
    utilidades.fadeAudio(
      this.audioFondo,
      this.audioFondo.volume,
      0,
      config.audio.duracionFade,
      () => {
        this.audioFondo.pause();
        this.audioFondo.currentTime = 0;
        estado.fondoIniciado = false;
      }
    );
  },
  fadeVolumenFondo(volumenObjetivo) {
    if (!this.audioFondo) return;
    if (!estado.fondoIniciado)
      return this.reproducirFondo().then(() =>
        this.fadeVolumenFondo(volumenObjetivo)
      );
    utilidades.fadeAudio(
      this.audioFondo,
      this.audioFondo.volume,
      volumenObjetivo,
      config.audio.duracionFade / 2
    );
  },
  detenerNarraciones() {
    this.audiosNarracion.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    estado.audioActual = null;
    estado.audioReproduciendo = false;
    if (
      estado.fondoIniciado &&
      estado.seccionActiva?.id !== "final" &&
      estado.seccionActiva?.id !== "final2"
    ) {
      this.fadeVolumenFondo(config.audio.volumenFondoNormal);
    }
  },
  async reproducirNarracion(id) {
    this.detenerNarraciones();
    if (!estado.fondoIniciado) await this.reproducirFondo();
    const volumenFondo =
      id === "final" || id === "final2"
        ? config.audio.volumenFondoMudo
        : config.audio.volumenFondoBajo;
    if (estado.fondoIniciado) this.fadeVolumenFondo(volumenFondo);
    const audio = referencias.obtener(`audio-${id}`);
    if (!audio) return manejadorSecciones.mostrarControles(id);
    try {
      audio.currentTime = 0;
      audio.volume = config.audio.volumenNarracion;
      estado.audioReproduciendo = true;
      audio.onended = () => {
        estado.audioReproduciendo = false;
        if (id !== "final" && id !== "final2")
          this.fadeVolumenFondo(config.audio.volumenFondoNormal);
        manejadorSecciones.mostrarControles(id);
      };
      audio.onerror = () => {
        estado.audioReproduciendo = false;
        if (id !== "final" && id !== "final2")
          this.fadeVolumenFondo(config.audio.volumenFondoNormal);
        manejadorSecciones.mostrarControles(id);
      };
      await audio.play();
      estado.audioActual = audio;
    } catch (error) {
      console.warn(`Error al reproducir audio ${id}:`, error);
      estado.audioReproduciendo = false;
      if (id !== "final" && id !== "final2")
        this.fadeVolumenFondo(config.audio.volumenFondoNormal);
      manejadorSecciones.mostrarControles(id);
    }
  },
};

// =============================
// RENDER DE CONTENIDO
// =============================
const manejadorContenido = {
  render(id) {
    const seccion = referencias.obtener(id),
      datos = contenido[id];
    if (!seccion || !datos) return;
    const titulo = seccion.querySelector(".titulo h1");
    if (titulo) titulo.textContent = datos.titulo || "";
    const narrativa = seccion.querySelector(".narrativa");
    if (narrativa)
      narrativa.innerHTML = (datos.lineas || [])
        .map((l) => `<p>${l}</p>`)
        .join("");
    const acciones = seccion.querySelector(".acciones");
    if (acciones) {
      acciones.innerHTML = datos.botones
        ? datos.botones
            .map((t) => `<button type="button">${t}</button>`)
            .join("")
        : datos.boton
        ? `<button type="button">${datos.boton}</button>`
        : id.startsWith("explicacion")
        ? `<button type="button">Siguiente</button>`
        : "";
    }
  },
};

// =============================
// MANEJO DE SECCIONES + FUNDIDO
// =============================
const manejadorSecciones = {
  async mostrar(id, saltarAudio = false) {
    const fadeOverlay = referencias.obtener("fadeOverlay");
    if (fadeOverlay) fadeOverlay.style.opacity = "1"; // Iniciar fundido a negro

    manejadorAudio.detenerNarraciones();
    await new Promise((r) => setTimeout(r, 400));

    referencias
      .obtenerTodos(".section")
      .forEach((s) => s.classList.remove("active"));
    document.body.style.backgroundColor =
      id === "intro" ? "#090a0f" : "#1a1a1a";

    // Transición de Bokeh por sección
    bokeh.transicion(id);

    const seccion = referencias.obtener(id);
    if (!seccion) {
      if (fadeOverlay) fadeOverlay.style.opacity = "0";
      return;
    }

    manejadorContenido.render(id);
    this.ocultarControles(seccion);
    seccion.classList.add("active");
    estado.seccionActiva = seccion;

    setTimeout(() => {
      if (fadeOverlay) fadeOverlay.style.opacity = "0"; // Finalizar fundido

      if (id === "intro" && !estado.playClickeado) {
        this.mostrarBotonPlay(seccion);
        seccion.classList.remove("show-content");
      } else if (id === "intro" && estado.playClickeado) {
        seccion.classList.add("show-content");
        this.mostrarNarrativa(seccion);
        manejadorAudio.reproducirFondo().then(() =>
          setTimeout(() => {
            manejadorAudio.reproducirNarracion(id);
            this.mostrarNarrativa(seccion);
          }, 100)
        );
      } else if (saltarAudio || estado.seccionesVisitadas.has(id)) {
        this.mostrarNarrativa(seccion);
        this.mostrarControles(id);
      } else {
        manejadorAudio.reproducirFondo().then(() =>
          setTimeout(() => {
            manejadorAudio.reproducirNarracion(id);
            this.mostrarNarrativa(seccion);
          }, 100)
        );
        estado.seccionesVisitadas.add(id);
      }

      if (id === "final" || id === "final2") manejadorAudio.detenerFondo();
    }, 100);
  },
  mostrarNarrativa: (seccion) =>
    seccion.querySelector(".narrativa")?.classList.add("visible"),
  mostrarBotonPlay: (seccion) => {
    const playCentro = seccion.querySelector(".play-center");
    if (playCentro) {
      playCentro.classList.add("visible");
      playCentro.style.display = "flex";
    }
  },
  ocultarControles: (seccion) => {
    [".play-center", ".acciones", ".input-group", ".replay-button"].forEach(
      (selector) => {
        const elemento = seccion.querySelector(selector);
        if (elemento) {
          elemento.classList.remove("visible");
          if (selector === ".play-center") elemento.style.display = "none";
        }
      }
    );
    seccion.querySelector(".narrativa")?.classList.remove("visible");
    if (seccion.id === "intro" && !estado.playClickeado)
      seccion.classList.remove("show-content");
  },
  mostrarControles: (id) => {
    const { seccionActiva: seccion } = estado;
    if (!seccion || seccion.id !== id) return;
    setTimeout(() => {
      const controles = [
        [".replay-button", '<button type="button">Repetir</button>'],
        [".acciones"],
        [".input-group"],
      ];
      controles.forEach(([selector, html]) => {
        const elemento = seccion.querySelector(selector);
        if (elemento && html) elemento.innerHTML = html;
        if (elemento) elemento.classList.add("visible");
      });
    }, 500);
  },
};

// =============================
// VALIDACIÓN DE RESPUESTAS
// =============================
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
    const input = referencias.obtener(`respuesta${numero}`),
      error = referencias.obtener(`error${numero}`),
      datos = contenido[`acertijo${numero}`];
    if (!input || !error || !datos) return;
    const respuesta = utilidades.normalizar(input.value);
    const esVacio = !respuesta,
      esCorrecta =
        !esVacio &&
        this.respuestasValidas[datos.respuesta]?.includes(respuesta);
    error.classList.remove("show");
    input.classList.remove("input-correct", "input-incorrect", "shake");
    if (esVacio || !esCorrecta) {
      error.textContent = esVacio
        ? "Por favor, escribe una respuesta."
        : [
            "Intenta pensar más profundamente...",
            "No es la respuesta correcta, reflexiona...",
          ][Math.floor(Math.random() * 2)];
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
    setTimeout(() => manejadorSecciones.mostrar(`explicacion${numero}`), 800);
  },
};

// =============================
// NAVEGACIÓN
// =============================
const navegacion = {
  irADecision: () => manejadorSecciones.mostrar("decision"),
  elegirOpcion: (opcion) =>
    manejadorSecciones.mostrar(
      opcion === "inmediata" ? "confirmacion1" : "acertijo1"
    ),
  confirmarOpcion: (numero, respuesta) => {
    const acciones = {
      1: { sí: "confirmacion2", no: "decision" },
      2: { sí: "final2", no: "decision" },
    };
    const siguiente = acciones[numero]?.[respuesta.toLowerCase()];
    if (siguiente)
      manejadorSecciones.mostrar(siguiente, siguiente === "decision");
  },
  continuarDesdeExplicacion: (numero) => {
    const siguientes = { 1: "acertijo2", 2: "acertijo3", 3: "final" };
    if (siguientes[numero]) manejadorSecciones.mostrar(siguientes[numero]);
  },
};

// =============================
// BOKEH: FONDO ANIMADO
// =============================
const bokeh = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  bokehCircles: [],
  definedCircles: [],
  particles: [],
  colorActual: [60, 180, 140],
  colorObjetivo: [60, 180, 140],

  init() {
    this.canvas = referencias.obtener("bokehCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.redimensionar();
    window.addEventListener(
      "resize",
      utilidades.debounce(() => this.redimensionar(), 100)
    );
    this._initElementsFrom("intro"); // elementos iniciales
    this.animar();
  },

  redimensionar() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },

  // ---- creadores ----
  crearBokehCircle() {
    const isDefined = Math.random() < 0.3;
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: isDefined ? Math.random() * 300 : Math.random() * 100,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      opacity:
        Math.random() * (isDefined ? 0.5 : 0.5) + (isDefined ? 0.5 : 0.5),
      pulse: Math.random() * 0.002 + 0.001,
      pulseDirection: 1,
      isDefined,
      color: `rgba(${this.colorActual[0]}, ${this.colorActual[1]}, ${this.colorActual[2]}, `,
    };
  },
  crearDefinedCircle() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 320,
      speedX: (Math.random() - 0.5) * 0.04,
      speedY: (Math.random() - 0.5) * 0.04,
      opacity: Math.random() * 0.12 + 0.06,
      pulse: Math.random() * 0.003 + 0.001,
      pulseDirection: 1,
      color: `rgba(${Math.min(255, this.colorActual[0] + 20)}, ${Math.min(
        255,
        this.colorActual[1] + 20
      )}, ${Math.min(255, this.colorActual[2] + 20)}, `,
    };
  },
  crearParticle() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.8 + 0.3,
      twinkle: Math.random() * 0.03 + 0.015,
      twinkleDirection: 1,
      color: `rgba(${Math.min(255, this.colorActual[0] + 90)}, ${Math.min(
        255,
        this.colorActual[1] + 75
      )}, ${Math.min(255, this.colorActual[2] + 60)}, `,
    };
  },

  // ---- updates de elementos ----
  _wrap(o, pad = 50) {
    if (o.x < -pad) o.x = this.width + pad;
    if (o.x > this.width + pad) o.x = -pad;
    if (o.y < -pad) o.y = this.height + pad;
    if (o.y > this.height + pad) o.y = -pad;
  },
  updateBokehCircle(c) {
    c.x += c.speedX;
    c.y += c.speedY;
    c.size += c.pulse * c.pulseDirection * 20;
    if (c.size > (c.isDefined ? 480 : 380) || c.size < (c.isDefined ? 120 : 80))
      c.pulseDirection *= -1;
    this._wrap(c, 120);
    // actualizar color según transición
    c.color = `rgba(${Math.round(this.colorActual[0])}, ${Math.round(
      this.colorActual[1]
    )}, ${Math.round(this.colorActual[2])}, `;
  },
  updateDefinedCircle(c) {
    c.x += c.speedX;
    c.y += c.speedY;
    c.size += c.pulse * c.pulseDirection * 15;
    if (c.size > 220 || c.size < 60) c.pulseDirection *= -1;
    this._wrap(c, 80);
    c.color = `rgba(${Math.min(
      255,
      Math.round(this.colorActual[0] + 20)
    )}, ${Math.min(255, Math.round(this.colorActual[1] + 20))}, ${Math.min(
      255,
      Math.round(this.colorActual[2] + 20)
    )}, `;
  },
  updateParticle(p) {
    p.x += p.speedX;
    p.y += p.speedY;
    p.opacity += p.twinkle * p.twinkleDirection;
    if (p.opacity > 1 || p.opacity < 0.2) p.twinkleDirection *= -1;
    this._wrap(p, 10);
    p.color = `rgba(${Math.min(
      255,
      Math.round(this.colorActual[0] + 90)
    )}, ${Math.min(255, Math.round(this.colorActual[1] + 75))}, ${Math.min(
      255,
      Math.round(this.colorActual[2] + 60)
    )}, `;
  },

  // ---- draw ----
  drawBokehCircle(c) {
    this.ctx.save();
    const g = this.ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size / 2);
    const opF = c.isDefined ? 1.4 : 1.0;
    g.addColorStop(0, c.color + c.opacity * opF + ")");
    g.addColorStop(
      c.isDefined ? 0.4 : 0.3,
      c.color + c.opacity * (c.isDefined ? 0.8 : 0.6) + ")"
    );
    g.addColorStop(
      c.isDefined ? 0.7 : 0.6,
      c.color + c.opacity * (c.isDefined ? 0.3 : 0.2) + ")"
    );
    g.addColorStop(1, c.color + "0)");
    this.ctx.fillStyle = g;
    this.ctx.globalCompositeOperation = "screen";
    this.ctx.beginPath();
    this.ctx.arc(c.x, c.y, c.size / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  },
  drawDefinedCircle(c) {
    this.ctx.save();
    const g = this.ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size / 2);
    g.addColorStop(0, c.color + c.opacity * 1.4 + ")");
    g.addColorStop(0.4, c.color + c.opacity * 0.8 + ")");
    g.addColorStop(0.7, c.color + c.opacity * 0.3 + ")");
    g.addColorStop(1, c.color + "0)");
    this.ctx.fillStyle = g;
    this.ctx.globalCompositeOperation = "screen";
    this.ctx.beginPath();
    this.ctx.arc(c.x, c.y, c.size / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  },
  drawParticle(p) {
    this.ctx.save();
    this.ctx.globalCompositeOperation = "screen";
    this.ctx.fillStyle = p.color + p.opacity + ")";
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  },
  drawVignette() {
    this.ctx.save();
    const g = this.ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      0,
      this.width / 2,
      this.height / 2,
      Math.max(this.width, this.height) * 0.8
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.6, "rgba(0,0,0,0.1)");
    g.addColorStop(1, "rgba(0,0,0,0.7)");
    this.ctx.fillStyle = g;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  },

  // ---- ciclo ----
  actualizar() {
    // transición suave de color
    this.colorActual = this.colorActual.map((c, i) =>
      utilidades.lerp(c, this.colorObjetivo[i], 0.02)
    );
    this.bokehCircles.forEach((c) => this.updateBokehCircle(c));
    this.definedCircles.forEach((c) => this.updateDefinedCircle(c));
    this.particles.forEach((p) => this.updateParticle(p));
  },
  dibujar() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.bokehCircles.forEach((c) => this.drawBokehCircle(c));
    this.definedCircles.forEach((c) => this.drawDefinedCircle(c));
    this.particles.forEach((p) => this.drawParticle(p));
    this.drawVignette();
  },
  manejarInteraccionMouse() {
    if (!this.canvas) return;
    this.canvas.addEventListener(
      "mousemove",
      ({ clientX: mouseX, clientY: mouseY }) => {
        this.bokehCircles.forEach((c) => {
          const dx = mouseX - c.x,
            dy = mouseY - c.y,
            d = Math.hypot(dx, dy);
          if (d < 200) {
            const f = (200 - d) / 200;
            c.speedX += (dx / d) * f * 0.002;
            c.speedY += (dy / d) * f * 0.002;
            c.opacity = Math.min(c.opacity + f * 0.05, 0.18);
          }
        });
        this.definedCircles.forEach((c) => {
          const dx = mouseX - c.x,
            dy = mouseY - c.y,
            d = Math.hypot(dx, dy);
          if (d < 150) {
            const f = (150 - d) / 150;
            c.speedX += (dx / d) * f * 0.001;
            c.speedY += (dy / d) * f * 0.001;
            c.opacity = Math.min(c.opacity + f * 0.02, 0.12);
          }
        });
        this.particles.forEach((p) => {
          const dx = mouseX - p.x,
            dy = mouseY - p.y,
            d = Math.hypot(dx, dy);
          if (d < 100) {
            const f = (100 - d) / 100;
            p.speedX += (dx / d) * f * 0.01;
            p.speedY += (dy / d) * f * 0.01;
            p.opacity = Math.min(p.opacity + f * 0.2, 1);
          }
        });
      }
    );
  },
  _initElementsFrom(idSeccion) {
    const cfg = config.bokeh[idSeccion] ?? config.bokeh.intro;
    this.colorActual = [...cfg.color];
    this.colorObjetivo = [...cfg.color];
    this.bokehCircles = Array.from({ length: cfg.cantidadBokeh }, () =>
      this.crearBokehCircle()
    );
    this.definedCircles = Array.from({ length: cfg.cantidadDefinidos }, () =>
      this.crearDefinedCircle()
    );
    this.particles = Array.from({ length: cfg.cantidadParticulas }, () =>
      this.crearParticle()
    );
  },
  transicion(idSeccion) {
    const cfg = config.bokeh[idSeccion];
    if (!cfg) return;
    this.colorObjetivo = [...cfg.color];
    this.bokehCircles = Array.from({ length: cfg.cantidadBokeh }, () =>
      this.crearBokehCircle()
    );
    this.definedCircles = Array.from({ length: cfg.cantidadDefinidos }, () =>
      this.crearDefinedCircle()
    );
    this.particles = Array.from({ length: cfg.cantidadParticulas }, () =>
      this.crearParticle()
    );
  },
  animar() {
    this.actualizar();
    this.dibujar();
    requestAnimationFrame(() => this.animar());
  },
};

// =============================
// EVENTOS
// =============================
const manejadorEventos = {
  init() {
    document.addEventListener(
      "click",
      utilidades.debounce((e) => this.manejarClic(e), 300)
    );
    document.addEventListener(
      "keydown",
      utilidades.debounce((e) => this.manejarTecla(e), 300)
    );
    bokeh.manejarInteraccionMouse();
  },
  manejarClic({ target }) {
    const { seccionActiva: seccion } = estado;
    if (!seccion) return;

    if (target.closest(".play-center button")) {
      const playCentro = seccion.querySelector(".play-center");
      if (playCentro) {
        playCentro.style.display = "none";
        playCentro.classList.remove("visible");
      }
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
      const [, numero] = seccion.id.match(/^acertijo(\d+)$/) || [];
      if (numero) validadorRespuestas.validar(+numero);
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
        const [, numero] = seccion.id.match(/^explicacion(\d+)$/) || [];
        if (numero) navegacion.continuarDesdeExplicacion(+numero);
      }
    }
  },
  manejarTecla({ key }) {
    if (key !== "Enter" || !estado.seccionActiva) return;
    const [, numero] = estado.seccionActiva.id.match(/^acertijo(\d+)$/) || [];
    if (numero) validadorRespuestas.validar(+numero);
  },
};

// =============================
// APP
// =============================
const app = {
  init() {
    const seccionIntro = referencias.obtener("intro"),
      canvas = referencias.obtener("bokehCanvas");
    if (!seccionIntro || !canvas) return;
    manejadorAudio.init();
    bokeh.init();
    manejadorEventos.init();
    estado.seccionActiva = seccionIntro;
    estado.playClickeado = false;
    Object.keys(contenido).forEach((id) => manejadorContenido.render(id));
    manejadorSecciones.mostrar("intro");
    setTimeout(() => document.body.classList.add("loaded"), 100);

    // helper opcional para probar audio desde consola
    window.testAudio = () => {
      manejadorAudio
        .reproducirFondo()
        .then(() => manejadorAudio.reproducirNarracion("intro"));
    };
  },
};

document.addEventListener("DOMContentLoaded", () => app.init());
