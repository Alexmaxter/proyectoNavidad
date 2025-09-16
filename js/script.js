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
};

// =============================
// CONTENIDO DE SECCIONES
// =============================
const contenido = {
  intro: {
    titulo: "¡Bienvenido Valentino!",
    lineas: [
      "¡Bien hecho, Valentino! Empujaste la bola y ya está rodando.<br>Parece chica, pero con cada vuelta se vuelve más grande.<br><br>Esta aventura no es de correr, sino de descubrir qué puede pasar cuando dejás que algo tenga tiempo.<br><br>La bola ya empezó a rodar por la montaña, prepárate para lo que viene.",
    ],
    boton: "Comenzar",
  },
  decision: {
    titulo: "Una Decisión Importante",
    lineas: [
      "Tu bola de nieve sigue rodando y ya duplicó su tamaño.<br><br>Su sonido resuena en la montaña, juntando más nieve con cada vuelta.<br>Pero ahora se abren dos caminos frente a ti. Uno es fácil y conocido, el otro está cubierto de niebla.<br><br>Uno te muestra todo desde el principio, el otro guarda secretos.<br>Solo vos podés decidir:<br>¿Qué camino elegís para tu aventura?<br>¿El rápido o el que requiere paciencia?<br><br>Opciones:<br>Camino Rápido: Detener la bola y descubrir su tesoro<br>Camino Paciente: Dejarla rodar y ver qué tan grande puede ser.<br><br>Pensalo bien, Valentino, porque una vez que elijas, no hay vuelta atrás.",
    ],
    botones: ["Camino Rápido", "Camino Paciente"],
  },
  confirmacion1: {
    lineas: [
      "El viento para, la bola de nieve brilla, como si quisiera decirte algo. ¿Realmente querés que la magia termine acá?<br><br>¿O sentís que hay algo que te dice que sigas, que descubras más secretos?",
    ],
    botones: ["Sí, quiero mi regalo ahora", "No, quiero seguir la aventura"],
  },
  confirmacion2: {
    lineas: [
      "Esta es tu última chance.<br>Si cerrás los ojos y escuchás, podés sentir que hay algo más grande esperándote, una aventura que se extiende más allá.<br><br>¿Estás completamente seguro de que querés que termine acá?",
    ],
    botones: ["Sí, estoy seguro.", "No, quiero volver."],
  },
  acertijo1: {
    titulo: "Seguir es llegar",
    lineas: [
      "La bola de nieve rueda y se encuentra con un hombre que trabaja madera todos los días.<br><br>Cada día trabaja la misma pieza, sin apurarse, con calma.<br><br>La gente que pasa le grita:<br>'¿Por qué no hacés algo más fácil?'<br>Pero él sigue trabajando sin parar, sabiendo que algo hermoso necesita tiempo.<br><br>Con cada golpe, algo lindo nace. Con tiempo, la madera se convierte en arte.<br><br>Tu bola se detiene, esperando una respuesta.<br>El artesano sonríe: 'Para seguir, tenés que entender qué hace que mi trabajo crezca.'<br><br>¿Qué convierte el trabajo diario en algo increíble, haciendo que lo simple se vuelva especial?",
    ],
    respuesta: "constancia",
  },
  explicacion1: {
    lineas: [
      "¡Exacto! La constancia es poder. No es solo trabajar sin parar.<br><br>Es confiar que cada pequeño paso construye algo grande y valioso.<br><br>La bola de nieve toma esta primera lección y crece más grande. El artesano asiente y desaparece, mientras tu aventura continúa.",
    ],
  },
  acertijo2: {
    titulo: "Esperar también es avanzar",
    lineas: [
      "La bola de nieve más grande se encuentra con un granjero que observa su campo.<br>La tierra se ve vacía y sin vida bajo el frío.<br><br>Mucha gente pasa corriendo, convencida de que nada crecerá allí. Pero él se queda, riega sin ver resultados y cuida su tierra con esmero.<br><br>Sabe que las estaciones tienen su ritmo y que lo que sembró volverá a la vida.<br><br>El granjero te mira y dice:<br>“La segunda lección está en confiar en el tiempo.”<br><br>¿Qué sostiene al que siembra cuando todo parece vacío y sin esperanza?",
    ],
    respuesta: "paciencia",
  },
  explicacion2: {
    lineas: [
      "¡Perfecto! La paciencia es saber esperar.<br><br>No es quedarse sin hacer nada.<br>Es esperar con esperanza que lo que plantaste va a crecer.<br><br>Como el granjero, vos también aprendiste que lo valioso a veces necesita tiempo y calma, no prisa.<br><br>La bola de nieve crece con esta nueva lección.",
    ],
  },
  acertijo3: {
    titulo: "Creer también es fuerza",
    lineas: [
      "La bola de nieve gigante encuentra a un viajero con un mapa completamente en blanco.<br><br>Solo tiene una nota que dice:<br>'Seguí caminando, amigo.<br>'Seguí avanzando, el camino va a aparecer',<br>muchos se van para atrás cuando leen esto.<br><br>Pero él camina paso a paso, sin saber qué va a encontrar.<br>Y algo increíble pasa: con cada paso, el mapa se va dibujando solo. Aparecen lugares que nunca imaginó.<br><br>El viajero te mira:<br>'La última lección está dentro mío, en lo que me empuja hacia adelante.'<br>¿Qué lo impulsa a seguir sin saber qué va a pasar, cuando no hay garantías?",
    ],
    respuesta: "confianza",
  },
  explicacion3: {
    lineas: [
      "¡Genial, Valentino! La confianza es seguir adelante sin mapa.<br>Es creer que algo bueno va a pasar aunque no lo veas todavía.<br>Como él, vos también diste pasos hacia lo desconocido.<br><br>La bola de nieve ahora es una avalancha, porque confiaste en lo que no podías ver.",
    ],
  },
  final: {
    titulo: "¡Increíble, Valentino!",
    lineas: [
      "Valentino, lo que acabás de vivir no es solo un cuento.<br><br>Es algo que mucha gente descubre demasiado tarde, cuando ya no tienen tiempo.<br><br>La bola de nieve ya no es más una bola pequeña, es una avalancha que baja por la montaña.<br><br>Creció vuelta por vuelta porque supiste esperar, y en el camino aprendiste cosas que mucha gente nunca descubre.<br><br>El artesano trabajando cada día sin prisa.<br>El granjero esperando que su tierra despierte.<br>El viajero caminando sin saber qué va a encontrar.<br><br>Cada uno llevando algo valioso: constancia, paciencia, confianza.<br><br>Trescientos mil pesos están guardados para vos, creciendo en silencio, como tu bola de nieve que nunca para de rodar.<br><br>Mientras vos crecés y aprendés cada día, ese dinero también crece.<br><br>En tus manos va a quedar un artefacto especial que deberás cuidar.<br><br>No es solo un adorno para tu pieza, es el testigo de tu decisión.<br>Como quien camina sin mapa, confiando en que su camino es el correcto, vos también elegiste confiar en algo incierto, en un futuro que todavía no llegó.<br><br>Este artefacto estará ahí, recordándote cada día lo que elegiste.<br><br>Y cuando llegue el 15 de diciembre del 2027, cuando cumplas dieciocho años...<br>algo pasará con el artefacto.<br>Algo que solo el tiempo puede revelar.<br><br>¿Tendrás paciencia para esperar?<br>¿Serás constante en cuidarlo?<br>¿Confiaras en lo desconocido?<br><br>La aventura empieza ahora, Valentino.<br><br>Y mientras otros corran buscando lo fácil, vos conocerás la importancia de esperar.",
    ],
  },
  final2: {
    lineas: [
      "Valentino, tu decisión está tomada. Detuviste la bola antes de tiempo. Al tocarla con curiosidad, se abre y revela lo que esconde.<br>Dentro hay un tesoro: cincuenta mil pesos. Porque elegiste no esperar, este regalo es tuyo ahora mismo.<br>Alguien te lo va a dar. Un sueño puede empezar con una decisión, pero si cerrás los ojos y prestás atención...Todavía podés sentir en el aire el eco de la aventura que dejaste atrás.",
    ],
  },
};

// =============================
// CUENTA REGRESIVA
// =============================
const cuentaRegresiva = {
  fechaObjetivo: new Date(2027, 11, 15), // 15 de diciembre de 2027
  intervalo: null,

  init() {
    this.actualizar();
    this.intervalo = setInterval(() => this.actualizar(), 1000);
  },

  actualizar() {
    const ahora = new Date();
    const diferencia = this.fechaObjetivo - ahora;

    if (diferencia <= 0) {
      this.mostrarCompletado();
      return;
    }

    const años = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365));
    const días = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24)
    );
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    this.actualizarDisplay(años, días, horas, minutos, segundos);
  },

  actualizarDisplay(años, días, horas, minutos, segundos) {
    const elementos = ["years", "days", "hours", "minutes", "seconds"];
    const valores = [años, días, horas, minutos, segundos];

    elementos.forEach((id, index) => {
      const elemento = referencias.obtener(id);
      if (elemento)
        elemento.textContent = valores[index].toString().padStart(2, "0");
    });
  },

  mostrarCompletado() {
    const countdown = referencias.obtener("countdown");
    if (countdown) {
      countdown.innerHTML =
        '<div class="countdown-completed">¡Tu regalo ya está disponible!</div>';
    }
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  },

  destruir() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  },
};

// =============================
// UTILIDADES CORREGIDAS
// =============================
const utilidades = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
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
    const pasos = 30;
    const tiempoPaso = duracion / pasos;
    const cambio = (volumenFin - volumenInicio) / pasos;
    let volumenActual = volumenInicio;
    let conteo = 0;
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
// AUDIO CORREGIDO
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
  saltarSeccion() {
    console.log("Estado actual:", {
      seccionActiva: estado.seccionActiva?.id,
      audioReproduciendo: estado.audioReproduciendo,
    });

    if (!estado.seccionActiva || !estado.audioReproduciendo) {
      console.log(
        "No se puede saltar: no hay sección activa o audio reproduciéndose"
      );
      return;
    }

    console.log("Saltando sección:", estado.seccionActiva.id);

    this.detenerNarraciones();

    manejadorSecciones.mostrarControles(estado.seccionActiva.id);

    const skipFeedback = document.createElement("div");
    skipFeedback.textContent = "Narración saltada";
    skipFeedback.style.cssText = `
      position: fixed; top: 20px; right: 20px; 
      background: rgba(0, 0, 0, 0.8); color: white; 
      padding: 10px 15px; border-radius: 5px; 
      font-size: 14px; z-index: 1000;
      pointer-events: none; opacity: 0;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(skipFeedback);
    setTimeout(() => (skipFeedback.style.opacity = "1"), 10);
    setTimeout(() => {
      skipFeedback.style.opacity = "0";
      setTimeout(() => skipFeedback.remove(), 300);
    }, 2000);
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
    const seccion = referencias.obtener(id);
    const datos = contenido[id];
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
        ? `<button type="button" class="siguiente">Siguiente</button>` // CAMBIO: Agregada clase "siguiente"
        : "";
    }
  },
};

// =============================
// BOKEH: FONDO ANIMADO MEJORADO CON GRADIENTES LINEALES Y VIÑETA
// =============================
const bokeh = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  items: [],

  configuracionColores: {
    intro: {
      fondo: ["#242b3aff", "#60b48c"],
      colores: [
        ["#3cb488", "#60b48c"],
        ["#4cc498", "#70c49c"],
        ["#2ca478", "#50a47c"],
      ],
      cantidad: 15,
      cantidadDefinidos: 6,
    },
    decision: {
      fondo: ["#0f1a0a", "#54ff90"],
      colores: [
        ["#64ffa0", "#88ffb4"],
        ["#74ffb0", "#98ffc4"],
        ["#54ff90", "#78ffa4"],
      ],
      cantidad: 14,
      cantidadDefinidos: 6,
    },
    confirmacion1: {
      fondo: ["#0a1a1f", "#1890a4"],
      colores: [
        ["#28a0b4", "#4cb4c8"],
        ["#38b0c4", "#5cc4d8"],
        ["#1890a4", "#3ca4b8"],
      ],
      cantidad: 12,
      cantidadDefinidos: 4,
    },
    confirmacion2: {
      fondo: ["#1f1a0a", "#ffb854"],
      colores: [
        ["#ffc864", "#ffdc88"],
        ["#ffd874", "#ffec98"],
        ["#ffb854", "#ffcc78"],
      ],
      cantidad: 14,
      cantidadDefinidos: 6,
    },
    acertijo1: {
      fondo: ["#1a0a1f", "#3a005cff"],
      colores: [
        ["#ff64ff", "#ff88ff"],
        ["#ff74ff", "#ff98ff"],
        ["#ff54ff", "#ff78ff"],
      ],
      cantidad: 13,
      cantidadDefinidos: 5,
    },
    explicacion1: {
      fondo: ["#0a1f16", "#005a30ff"],
      colores: [
        ["#50c8a0", "#74dcb4"],
        ["#60d8b0", "#84ecc4"],
        ["#40b890", "#64cca4"],
      ],
      cantidad: 15,
      cantidadDefinidos: 8,
    },
    acertijo2: {
      fondo: ["#0a1f1f", "#005a5aff"],
      colores: [
        ["#64ffff", "#88ffff"],
        ["#74ffff", "#98ffff"],
        ["#54ffff", "#78ffff"],
      ],
      cantidad: 12,
      cantidadDefinidos: 4,
    },
    explicacion2: {
      fondo: ["#0a1f16", "#005a30ff"],
      colores: [
        ["#78f0ff", "#9cf4ff"],
        ["#88f4ff", "#acf8ff"],
        ["#68ecff", "#8cf0ff"],
      ],
      cantidad: 17,
      cantidadDefinidos: 8,
    },
    acertijo3: {
      fondo: ["#1f160a", "#5f3300ff"],
      colores: [
        ["#ffb464", "#ffc888"],
        ["#ffc474", "#ffd898"],
        ["#ffa454", "#ffb878"],
      ],
      cantidad: 13,
      cantidadDefinidos: 5,
    },
    explicacion3: {
      fondo: ["#1f1f0a", "#3a3a0f"],
      colores: [
        ["#f0ff78", "#f4ff9c"],
        ["#f4ff88", "#f8ffac"],
        ["#ecff68", "#f0ff8c"],
      ],
      cantidad: 18,
      cantidadDefinidos: 9,
    },
    final: {
      fondo: ["#1a0a1f", "#3a0f4a"],
      colores: [
        ["#dc64ff", "#f088ff"],
        ["#ec74ff", "#f498ff"],
        ["#cc54ff", "#e078ff"],
      ],
      cantidad: 20,
      cantidadDefinidos: 10,
    },
    final2: {
      fondo: ["#0a1f14", "#0f4a28"],
      colores: [
        ["#64ffc8", "#88ffdc"],
        ["#74ffd8", "#98ffec"],
        ["#54ffb8", "#78ffcc"],
      ],
      cantidad: 19,
      cantidadDefinidos: 9,
    },
  },

  colorFondoActual: ["#0a0f1a", "#1a0f2a"],
  colorFondoObjetivo: ["#0a0f1a", "#1a0f2a"],
  coloresActuales: [
    ["#3cb488", "#60b48c"],
    ["#4cc498", "#70c49c"],
    ["#2ca478", "#50a47c"],
  ],
  coloresObjetivo: [
    ["#3cb488", "#60b48c"],
    ["#4cc498", "#70c49c"],
    ["#2ca478", "#50a47c"],
  ],

  rand(min, max) {
    return Math.random() * (max - min) + min;
  },

  init() {
    this.canvas = referencias.obtener("bokehCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.redimensionar();

    window.addEventListener(
      "resize",
      utilidades.debounce(() => {
        this.redimensionar();
        this.ctx.globalCompositeOperation = "lighter";
      }, 100)
    );

    this._crearElementos("intro");
    this.manejarInteraccionMouse();
    this.animar();
  },

  redimensionar() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },

  _crearElementos(idSeccion) {
    const config =
      this.configuracionColores[idSeccion] || this.configuracionColores.intro;
    this.items = [];

    this.colorFondoObjetivo = [...config.fondo];
    this.coloresObjetivo = config.colores.map((color) => [...color]);

    let count = config.cantidad;
    const blur = [8, 20];
    const radius = [15, 200];

    while (count--) {
      const thisRadius = this.rand(radius[0], radius[1]);
      const thisBlur = this.rand(blur[0], blur[1]);
      const x = this.rand(-100, this.width + 100);
      const y = this.rand(-100, this.height + 100);

      const colorIndex = Math.floor(this.rand(0, 299) / 100);
      const colorSet = config.colores[colorIndex] || config.colores[0];

      const directionX = Math.round(this.rand(-99, 99) / 100);
      const directionY = Math.round(this.rand(-99, 99) / 100);

      this.items.push({
        x: x,
        y: y,
        blur: thisBlur,
        radius: thisRadius,
        initialXDirection: directionX,
        initialYDirection: directionY,
        initialBlurDirection: directionX,
        colorOne: colorSet[0],
        colorTwo: colorSet[1],
        targetColorOne: colorSet[0],
        targetColorTwo: colorSet[1],
        gradient: [
          x - thisRadius / 2,
          y - thisRadius / 2,
          x + thisRadius,
          y + thisRadius,
        ],
        pulsePhase: Math.random() * Math.PI * 2,
        originalRadius: thisRadius,
        type: "blur",
        opacity: 0.5,
      });
    }

    let countDefinidos = config.cantidadDefinidos || 0;
    const radiusDefinidos = [8, 75];

    while (countDefinidos--) {
      const thisRadius = this.rand(radiusDefinidos[0], radiusDefinidos[1]);
      const x = this.rand(0, this.width);
      const y = this.rand(0, this.height);

      const colorIndex = Math.floor(this.rand(0, 299) / 100);
      const colorSet = config.colores[colorIndex] || config.colores[0];

      const directionX = Math.round(this.rand(-99, 99) / 100);
      const directionY = Math.round(this.rand(-99, 99) / 100);

      this.items.push({
        x: x,
        y: y,
        blur: 0,
        radius: thisRadius,
        initialXDirection: directionX,
        initialYDirection: directionY,
        initialBlurDirection: 0,
        colorOne: colorSet[0],
        colorTwo: colorSet[1],
        targetColorOne: colorSet[0],
        targetColorTwo: colorSet[1],
        gradient: [
          x - thisRadius / 2,
          y - thisRadius / 2,
          x + thisRadius,
          y + thisRadius,
        ],
        pulsePhase: Math.random() * Math.PI * 2,
        originalRadius: thisRadius,
        type: "defined",
        opacity: this.rand(0.15, 0.3),
        targetOpacity: this.rand(0.15, 0.4),
      });
    }
  },

  transicion(idSeccion) {
    const config = this.configuracionColores[idSeccion];
    if (!config) return;

    this.colorFondoObjetivo = [...config.fondo];
    this.coloresObjetivo = config.colores.map((color) => [...color]);

    const elementosBlur = this.items.filter((item) => item.type === "blur");
    const elementosDefinidos = this.items.filter(
      (item) => item.type === "defined"
    );

    const cantidadBlurObjetivo = config.cantidad;
    const cantidadDefinidosObjetivo = config.cantidadDefinidos || 0;

    const diferenciaBlur = cantidadBlurObjetivo - elementosBlur.length;
    if (diferenciaBlur > 0) {
      const blur = [8, 45];
      const radius = [15, 85];

      for (let i = 0; i < diferenciaBlur; i++) {
        const thisRadius = this.rand(radius[0], radius[1]);
        const thisBlur = this.rand(blur[0], blur[1]);
        const x = this.rand(-100, this.width + 100);
        const y = this.rand(-100, this.height + 100);

        const colorIndex = Math.floor(this.rand(0, 299) / 100);
        const colorSet = config.colores[colorIndex] || config.colores[0];

        const directionX = Math.round(this.rand(-99, 99) / 100);
        const directionY = Math.round(this.rand(-99, 99) / 100);

        this.items.push({
          x: x,
          y: y,
          blur: thisBlur,
          radius: thisRadius,
          initialXDirection: directionX,
          initialYDirection: directionY,
          initialBlurDirection: directionX,
          colorOne: colorSet[0],
          colorTwo: colorSet[1],
          targetColorOne: colorSet[0],
          targetColorTwo: colorSet[1],
          gradient: [
            x - thisRadius / 2,
            y - thisRadius / 2,
            x + thisRadius,
            y + thisRadius,
          ],
          pulsePhase: Math.random() * Math.PI * 2,
          originalRadius: thisRadius,
          type: "blur",
          opacity: 0.5,
        });
      }
    } else if (diferenciaBlur < 0) {
      this.items = this.items.filter(
        (item) =>
          item.type !== "blur" ||
          elementosBlur.indexOf(item) < cantidadBlurObjetivo
      );
    }

    const diferenciaDefinidos =
      cantidadDefinidosObjetivo - elementosDefinidos.length;
    if (diferenciaDefinidos > 0) {
      const radiusDefinidos = [8, 25];

      for (let i = 0; i < diferenciaDefinidos; i++) {
        const thisRadius = this.rand(radiusDefinidos[0], radiusDefinidos[1]);
        const x = this.rand(0, this.width);
        const y = this.rand(0, this.height);

        const colorIndex = Math.floor(this.rand(0, 299) / 100);
        const colorSet = config.colores[colorIndex] || config.colores[0];

        const directionX = Math.round(this.rand(-99, 99) / 100);
        const directionY = Math.round(this.rand(-99, 99) / 100);

        this.items.push({
          x: x,
          y: y,
          blur: 0,
          radius: thisRadius,
          initialXDirection: directionX,
          initialYDirection: directionY,
          initialBlurDirection: 0,
          colorOne: colorSet[0],
          colorTwo: colorSet[1],
          targetColorOne: colorSet[0],
          targetColorTwo: colorSet[1],
          gradient: [
            x - thisRadius / 2,
            y - thisRadius / 2,
            x + thisRadius,
            y + thisRadius,
          ],
          pulsePhase: Math.random() * Math.PI * 2,
          originalRadius: thisRadius,
          type: "defined",
          opacity: this.rand(0.15, 0.4),
          targetOpacity: this.rand(0.15, 0.4),
        });
      }
    } else if (diferenciaDefinidos < 0) {
      this.items = this.items.filter(
        (item) =>
          item.type !== "defined" ||
          elementosDefinidos.indexOf(item) < cantidadDefinidosObjetivo
      );
    }

    this.items.forEach((item) => {
      const colorIndex = Math.floor(Math.random() * config.colores.length);
      const colorSet = config.colores[colorIndex];
      item.targetColorOne = colorSet[0];
      item.targetColorTwo = colorSet[1];

      if (item.type === "defined") {
        item.targetOpacity = this.rand(0.15, 0.4);
      }
    });
  },

  _lerpColor(color1, color2, t) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  },

  actualizar(timestamp) {
    const adjX = 0.2;
    const adjY = 0.2;
    const adjBlur = 0.8;
    const transitionSpeed = 0.02;

    this.colorFondoActual = this.colorFondoActual.map((color, index) =>
      this._lerpColor(color, this.colorFondoObjetivo[index], transitionSpeed)
    );

    this.items.forEach((item, index) => {
      item.colorOne = this._lerpColor(
        item.colorOne,
        item.targetColorOne,
        transitionSpeed
      );
      item.colorTwo = this._lerpColor(
        item.colorTwo,
        item.targetColorTwo,
        transitionSpeed
      );

      if (item.type === "defined" && item.targetOpacity !== undefined) {
        item.opacity = utilidades.lerp(
          item.opacity || 0.3,
          item.targetOpacity,
          transitionSpeed
        );
      }

      const moveSpeedX = adjX;
      const moveSpeedY = adjY;

      if (
        (item.x + item.initialXDirection * moveSpeedX >= this.width &&
          item.initialXDirection !== 0) ||
        (item.x + item.initialXDirection * moveSpeedX <= 0 &&
          item.initialXDirection !== 0)
      ) {
        item.initialXDirection *= -1;
      }
      if (
        (item.y + item.initialYDirection * moveSpeedY >= this.height &&
          item.initialYDirection !== 0) ||
        (item.y + item.initialYDirection * moveSpeedY <= 0 &&
          item.initialYDirection !== 0)
      ) {
        item.initialYDirection *= -1;
      }

      if (item.type === "blur") {
        if (
          (item.blur + item.initialBlurDirection * adjBlur >= 60 &&
            item.initialBlurDirection !== 0) ||
          (item.blur + item.initialBlurDirection * adjBlur <= 8 &&
            item.initialBlurDirection !== 0)
        ) {
          item.initialBlurDirection *= -1;
        }
        item.blur += item.initialBlurDirection * adjBlur;
      }

      item.x += item.initialXDirection * moveSpeedX;
      item.y += item.initialYDirection * moveSpeedY;

      const pulseSpeed = item.type === "defined" ? 0.01 : 0.02;
      const pulseIntensity = item.type === "defined" ? 0.05 : 0.01;

      item.pulsePhase += pulseSpeed;
      const pulseMultiplier = 1 + Math.sin(item.pulsePhase) * pulseIntensity;
      item.radius = item.originalRadius * pulseMultiplier;

      item.gradient = [
        item.x - item.radius / 2,
        item.y - item.radius / 2,
        item.x + item.radius,
        item.y + item.radius,
      ];
    });
  },

  dibujar() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const grd = this.ctx.createLinearGradient(0, this.height, this.width, 0);
    grd.addColorStop(0, this.colorFondoActual[0]);
    grd.addColorStop(1, this.colorFondoActual[1]);
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const elementosBlur = this.items.filter((item) => item.type === "blur");
    const elementosDefinidos = this.items.filter(
      (item) => item.type === "defined"
    );

    this.ctx.globalCompositeOperation = "lighter";
    elementosBlur.forEach((item) => {
      this.ctx.beginPath();
      this.ctx.filter = `blur(${item.blur}px)`;

      const grd = this.ctx.createLinearGradient(
        item.gradient[0],
        item.gradient[1],
        item.gradient[2],
        item.gradient[3]
      );
      grd.addColorStop(0, item.colorOne);
      grd.addColorStop(1, item.colorTwo);

      this.ctx.fillStyle = grd;
      this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.closePath();
    });

    this.ctx.filter = "none";
    this.ctx.globalCompositeOperation = "normal";
    elementosDefinidos.forEach((item) => {
      this.ctx.beginPath();

      const grd = this.ctx.createLinearGradient(
        item.gradient[0],
        item.gradient[1],
        item.gradient[2],
        item.gradient[3]
      );

      const opacity = item.opacity || 0.3;
      const color1 = this._addOpacityToHex(item.colorOne, opacity);
      const color2 = this._addOpacityToHex(item.colorTwo, opacity);

      grd.addColorStop(0, color1);
      grd.addColorStop(1, color2);

      this.ctx.fillStyle = grd;
      this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.closePath();
    });
  },

  _addOpacityToHex(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  drawVignette() {
    if (!this.ctx || !this.width || !this.height) return;

    this.ctx.save();
    this.ctx.filter = "none";

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const maxRadius = Math.max(this.width, this.height) * 0.8;

    this.ctx.globalCompositeOperation = "multiply";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = "rgba(255,255,255,0.05)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.restore();
  },

  manejarInteraccionMouse() {
    if (!this.canvas) return;

    this.canvas.addEventListener(
      "mousemove",
      ({ clientX: mouseX, clientY: mouseY }) => {
        this.items.forEach((item) => {
          const dx = mouseX - item.x;
          const dy = mouseY - item.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 150) {
            const force = (150 - distance) / 150;

            const repulsionStrength = 0.8;

            item.initialXDirection +=
              (dx / distance) * force * repulsionStrength;
            item.initialYDirection +=
              (dy / distance) * force * repulsionStrength;

            const maxSpeed = 0.05;
            item.initialXDirection = Math.max(
              -maxSpeed,
              Math.min(maxSpeed, item.initialXDirection)
            );
            item.initialYDirection = Math.max(
              -maxSpeed,
              Math.min(maxSpeed, item.initialYDirection)
            );

            if (item.type === "blur") {
              item.blur = Math.min(item.blur + force * 7, 40);
            }

            const radiusEffect =
              item.type === "defined" ? force * 3 : force * 10;
            const maxRadius = item.type === "defined" ? 35 : 100;
            item.originalRadius = Math.min(
              item.originalRadius + radiusEffect,
              maxRadius
            );

            if (item.type === "defined") {
              item.opacity = Math.min((item.opacity || 0.3) + force * 0.1, 0.7);
            }
          }
        });
      }
    );
  },

  animar(timestamp) {
    this.actualizar(timestamp);
    this.dibujar();
    requestAnimationFrame((ts) => this.animar(ts));
  },
};

// =============================
// MANEJO DE SECCIONES + FUNDIDO
// =============================
const manejadorSecciones = {
  async mostrar(id, saltarAudio = false) {
    const fadeOverlay = referencias.obtener("fadeOverlay");
    if (fadeOverlay) fadeOverlay.style.opacity = "1";

    manejadorAudio.detenerNarraciones();
    await new Promise((r) => setTimeout(r, 400));

    referencias
      .obtenerTodos(".section")
      .forEach((s) => s.classList.remove("active"));
    document.body.style.backgroundColor =
      id === "intro" ? "#090a0f" : "#1a1a1a";

    bokeh.transicion(id);

    const seccion = referencias.obtener(id);
    if (!seccion) {
      if (fadeOverlay) fadeOverlay.style.opacity = "0";
      return;
    }

    manejadorContenido.render(id);
    this.ocultarControles(seccion);
    seccion.classList.add("active");
    estado.seccionActiva = seccion; // CAMBIO: Asegurar que seccionActiva se actualice

    if (id === "final") {
      cuentaRegresiva.init();
    } else {
      cuentaRegresiva.destruir();
    }

    setTimeout(() => {
      if (fadeOverlay) fadeOverlay.style.opacity = "0";

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
    constancia: ["constancia", "la constancia", "mi constancia", "constante"],
    paciencia: ["paciencia", "la paciencia", "paciencias"],
    confianza: ["confianza", "la confianza"],
  },
  validar(numero) {
    const input = referencias.obtener(`respuesta${numero}`);
    const error = referencias.obtener(`error${numero}`);
    const datos = contenido[`acertijo${numero}`];
    if (!input || !error || !datos) return;
    const respuesta = utilidades.normalizar(input.value);
    const esVacio = !respuesta;
    const esCorrecta =
      !esVacio && this.respuestasValidas[datos.respuesta]?.includes(respuesta);
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
      opcion === "Camino Rápido" ? "confirmacion1" : "acertijo1"
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
// EVENTOS CORREGIDOS
// =============================
const manejadorEventos = {
  init() {
    document.addEventListener("click", (e) => this.manejarClic(e));
    document.addEventListener(
      "keydown",
      utilidades.debounce((e) => this.manejarTecla(e), 300)
    );
  },

  manejarClic({ target }) {
    const { seccionActiva: seccion } = estado;
    if (!seccion) return;

    console.log("Sección activa:", seccion.id);
    console.log("Botón clicado:", target.textContent, target.classList);

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

      // Manejo específico para el botón "Siguiente"
      if (target.classList.contains("siguiente")) {
        const match = seccion.id.match(/^explicacion(\d+)$/);
        if (match) {
          const numero = +match[1];
          console.log(`Clic en Siguiente en explicacion${numero}`); // Mensaje genérico para evitar referencia a 'siguientes'
          navegacion.continuarDesdeExplicacion(numero);
        }
        return;
      }

      // Otras acciones (sin cambios respecto al código original)
      if (accion.includes("comenzar")) {
        navegacion.irADecision();
      } else if (accion.includes("rápido") || accion === "camino rápido") {
        navegacion.elegirOpcion("Camino Rápido");
      } else if (accion.includes("paciente") || accion === "camino paciente") {
        navegacion.elegirOpcion("Camino Paciente");
      } else if (
        accion.includes("sí") ||
        accion.includes("si") ||
        accion === "sí, quiero mi regalo ahora" ||
        accion === "sí, estoy seguro."
      ) {
        const numero =
          seccion.id === "confirmacion1"
            ? 1
            : seccion.id === "confirmacion2"
            ? 2
            : 0;
        if (numero) navegacion.confirmarOpcion(numero, "sí");
      } else if (
        accion.includes("no") ||
        accion === "no, quiero seguir la aventura" ||
        accion === "no, quiero volver."
      ) {
        const numero =
          seccion.id === "confirmacion1"
            ? 1
            : seccion.id === "confirmacion2"
            ? 2
            : 0;
        if (numero) navegacion.confirmarOpcion(numero, "no");
      }
    }
  },

  manejarTecla({ key }) {
    if (key === "Enter" && estado.seccionActiva) {
      const [, numero] = estado.seccionActiva.id.match(/^acertijo(\d+)$/) || [];
      if (numero) validadorRespuestas.validar(+numero);
    }

    if (key === " " || key === "Space") {
      manejadorAudio.saltarSeccion();
    }
  },
};

// =============================
// APP
// =============================
const app = {
  init() {
    const seccionIntro = referencias.obtener("intro");
    const canvas = referencias.obtener("bokehCanvas");
    if (!seccionIntro || !canvas) return;
    manejadorAudio.init();
    bokeh.init();
    manejadorEventos.init();
    estado.seccionActiva = seccionIntro;
    estado.playClickeado = false;
    Object.keys(contenido).forEach((id) => manejadorContenido.render(id));
    manejadorSecciones.mostrar("intro");
    setTimeout(() => document.body.classList.add("loaded"), 100);

    window.testAudio = () => {
      manejadorAudio
        .reproducirFondo()
        .then(() => manejadorAudio.reproducirNarracion("intro"));
    };
  },
};

document.addEventListener("DOMContentLoaded", () => app.init());
