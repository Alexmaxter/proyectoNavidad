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
        ? `<button type="button">Siguiente</button>`
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

  // Colores por sección con gradientes - CANTIDADES REDUCIDAS A LA MITAD
  configuracionColores: {
    intro: {
      fondo: ["#242b3aff", "#60b48c"],
      colores: [
        ["#3cb488", "#60b48c"],
        ["#4cc498", "#70c49c"],
        ["#2ca478", "#50a47c"],
      ],
      cantidad: 15, // Reducido de 30 a 15
      cantidadDefinidos: 6, // Reducido de 10 a 5
    },
    decision: {
      fondo: ["#0f1a0a", "#54ff90"],
      colores: [
        ["#64ffa0", "#88ffb4"],
        ["#74ffb0", "#98ffc4"],
        ["#54ff90", "#78ffa4"],
      ],
      cantidad: 14, // Reducido de 28 a 14
      cantidadDefinidos: 6, // Reducido de 12 a 6
    },
    confirmacion1: {
      fondo: ["#0a1a1f", "#1890a4"],
      colores: [
        ["#28a0b4", "#4cb4c8"],
        ["#38b0c4", "#5cc4d8"],
        ["#1890a4", "#3ca4b8"],
      ],
      cantidad: 12, // Reducido de 23 a 12 (redondeado)
      cantidadDefinidos: 4, // Reducido de 8 a 4
    },
    confirmacion2: {
      fondo: ["#1f1a0a", "#ffb854"],
      colores: [
        ["#ffc864", "#ffdc88"],
        ["#ffd874", "#ffec98"],
        ["#ffb854", "#ffcc78"],
      ],
      cantidad: 14, // Reducido de 28 a 14
      cantidadDefinidos: 6, // Reducido de 12 a 6
    },
    acertijo1: {
      fondo: ["#1a0a1f", "#3a005cff"],
      colores: [
        ["#ff64ff", "#ff88ff"],
        ["#ff74ff", "#ff98ff"],
        ["#ff54ff", "#ff78ff"],
      ],
      cantidad: 13, // Reducido de 25 a 13 (redondeado)
      cantidadDefinidos: 5, // Reducido de 10 a 5
    },
    explicacion1: {
      fondo: ["#0a1f16", "#005a30ff"],
      colores: [
        ["#50c8a0", "#74dcb4"],
        ["#60d8b0", "#84ecc4"],
        ["#40b890", "#64cca4"],
      ],
      cantidad: 15, // Reducido de 30 a 15
      cantidadDefinidos: 8, // Reducido de 15 a 8 (redondeado)
    },
    acertijo2: {
      fondo: ["#0a1f1f", "#005a5aff"],
      colores: [
        ["#64ffff", "#88ffff"],
        ["#74ffff", "#98ffff"],
        ["#54ffff", "#78ffff"],
      ],
      cantidad: 12, // Reducido de 23 a 12 (redondeado)
      cantidadDefinidos: 4, // Reducido de 8 a 4
    },
    explicacion2: {
      fondo: ["#0a16f0", "#0f26ff"],
      colores: [
        ["#78f0ff", "#9cf4ff"],
        ["#88f4ff", "#acf8ff"],
        ["#68ecff", "#8cf0ff"],
      ],
      cantidad: 17, // Reducido de 33 a 17 (redondeado)
      cantidadDefinidos: 8, // Reducido de 15 a 8 (redondeado)
    },
    acertijo3: {
      fondo: ["#1f160a", "#5f3300ff"],
      colores: [
        ["#ffb464", "#ffc888"],
        ["#ffc474", "#ffd898"],
        ["#ffa454", "#ffb878"],
      ],
      cantidad: 13, // Reducido de 25 a 13 (redondeado)
      cantidadDefinidos: 5, // Reducido de 10 a 5
    },
    explicacion3: {
      fondo: ["#1f1f0a", "#3a3a0f"],
      colores: [
        ["#f0ff78", "#f4ff9c"],
        ["#f4ff88", "#f8ffac"],
        ["#ecff68", "#f0ff8c"],
      ],
      cantidad: 18, // Reducido de 35 a 18 (redondeado)
      cantidadDefinidos: 9, // Reducido de 18 a 9
    },
    final: {
      fondo: ["#1a0a1f", "#3a0f4a"],
      colores: [
        ["#dc64ff", "#f088ff"],
        ["#ec74ff", "#f498ff"],
        ["#cc54ff", "#e078ff"],
      ],
      cantidad: 20, // Reducido de 40 a 20
      cantidadDefinidos: 10, // Reducido de 20 a 10
    },
    final2: {
      fondo: ["#0a1f14", "#0f4a28"],
      colores: [
        ["#64ffc8", "#88ffdc"],
        ["#74ffd8", "#98ffec"],
        ["#54ffb8", "#78ffcc"],
      ],
      cantidad: 19, // Reducido de 38 a 19
      cantidadDefinidos: 9, // Reducido de 18 a 9
    },
  },

  // Estado actual de colores para transiciones suaves
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

    // Establecer colores objetivo
    this.colorFondoObjetivo = [...config.fondo];
    this.coloresObjetivo = config.colores.map((color) => [...color]);

    // Crear elementos desenfocados (bokeh)
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
        type: "blur", // Tipo de elemento
        opacity: 0.5,
      });
    }

    // Crear elementos definidos (círculos claros) - AHORA SE MUEVEN
    let countDefinidos = config.cantidadDefinidos || 0;
    const radiusDefinidos = [8, 75];

    while (countDefinidos--) {
      const thisRadius = this.rand(radiusDefinidos[0], radiusDefinidos[1]);
      const x = this.rand(0, this.width);
      const y = this.rand(0, this.height);

      const colorIndex = Math.floor(this.rand(0, 299) / 100);
      const colorSet = config.colores[colorIndex] || config.colores[0];

      // CAMBIO IMPORTANTE: Ahora los elementos definidos también se mueven
      const directionX = Math.round(this.rand(-99, 99) / 100); // Velocidad normal
      const directionY = Math.round(this.rand(-99, 99) / 100); // Velocidad normal

      this.items.push({
        x: x,
        y: y,
        blur: 0, // Sin desenfoque
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
        type: "defined", // Tipo de elemento
        opacity: this.rand(0.15, 0.3), // Transparencia para efecto de profundidad
        targetOpacity: this.rand(0.15, 0.4),
      });
    }
  },

  transicion(idSeccion) {
    const config = this.configuracionColores[idSeccion];
    if (!config) return;

    // Actualizar colores objetivo para transición suave
    this.colorFondoObjetivo = [...config.fondo];
    this.coloresObjetivo = config.colores.map((color) => [...color]);

    // Separar elementos por tipo
    const elementosBlur = this.items.filter((item) => item.type === "blur");
    const elementosDefinidos = this.items.filter(
      (item) => item.type === "defined"
    );

    const cantidadBlurObjetivo = config.cantidad;
    const cantidadDefinidosObjetivo = config.cantidadDefinidos || 0;

    // Ajustar elementos desenfocados
    const diferenciaBlur = cantidadBlurObjetivo - elementosBlur.length;
    if (diferenciaBlur > 0) {
      // Agregar más elementos desenfocados
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
      // Remover elementos desenfocados
      this.items = this.items.filter(
        (item) =>
          item.type !== "blur" ||
          elementosBlur.indexOf(item) < cantidadBlurObjetivo
      );
    }

    // Ajustar elementos definidos
    const diferenciaDefinidos =
      cantidadDefinidosObjetivo - elementosDefinidos.length;
    if (diferenciaDefinidos > 0) {
      // Agregar más elementos definidos
      const radiusDefinidos = [8, 25];

      for (let i = 0; i < diferenciaDefinidos; i++) {
        const thisRadius = this.rand(radiusDefinidos[0], radiusDefinidos[1]);
        const x = this.rand(0, this.width);
        const y = this.rand(0, this.height);

        const colorIndex = Math.floor(this.rand(0, 299) / 100);
        const colorSet = config.colores[colorIndex] || config.colores[0];

        // Los elementos definidos ahora también se mueven
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
      // Remover elementos definidos
      this.items = this.items.filter(
        (item) =>
          item.type !== "defined" ||
          elementosDefinidos.indexOf(item) < cantidadDefinidosObjetivo
      );
    }

    // Actualizar colores objetivo de elementos existentes
    this.items.forEach((item) => {
      const colorIndex = Math.floor(Math.random() * config.colores.length);
      const colorSet = config.colores[colorIndex];
      item.targetColorOne = colorSet[0];
      item.targetColorTwo = colorSet[1];

      // Actualizar opacidad objetivo para elementos definidos
      if (item.type === "defined") {
        item.targetOpacity = this.rand(0.15, 0.4);
      }
    });
  },

  // Función para interpolar colores hex
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

    // Transición suave de colores de fondo
    this.colorFondoActual = this.colorFondoActual.map((color, index) =>
      this._lerpColor(color, this.colorFondoObjetivo[index], transitionSpeed)
    );

    this.items.forEach((item, index) => {
      // Transición suave de colores de elementos
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

      // Transición suave de opacidad para elementos definidos
      if (item.type === "defined" && item.targetOpacity !== undefined) {
        item.opacity = utilidades.lerp(
          item.opacity || 0.3,
          item.targetOpacity,
          transitionSpeed
        );
      }

      // CAMBIO IMPORTANTE: Movimiento igual para ambos tipos
      // Ya no hay diferenciación de velocidad entre tipos
      const moveSpeedX = adjX;
      const moveSpeedY = adjY;

      // Movimiento con rebote
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

      // Solo aplicar blur a elementos desenfocados
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

      // Actualizar posición
      item.x += item.initialXDirection * moveSpeedX;
      item.y += item.initialYDirection * moveSpeedY;

      // Efecto de pulsación sutil (más sutil para elementos definidos)
      const pulseSpeed = item.type === "defined" ? 0.01 : 0.02;
      const pulseIntensity = item.type === "defined" ? 0.05 : 0.01;

      item.pulsePhase += pulseSpeed;
      const pulseMultiplier = 1 + Math.sin(item.pulsePhase) * pulseIntensity;
      item.radius = item.originalRadius * pulseMultiplier;

      // Actualizar gradiente
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

    // Dibujar fondo con gradiente
    const grd = this.ctx.createLinearGradient(0, this.height, this.width, 0);
    grd.addColorStop(0, this.colorFondoActual[0]);
    grd.addColorStop(1, this.colorFondoActual[1]);
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Separar elementos por tipo para dibujar en capas
    const elementosBlur = this.items.filter((item) => item.type === "blur");
    const elementosDefinidos = this.items.filter(
      (item) => item.type === "defined"
    );

    // Primero dibujar elementos desenfocados (fondo)
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

    // Luego dibujar elementos definidos (primer plano)
    this.ctx.filter = "none"; // Sin filtro para elementos definidos
    this.ctx.globalCompositeOperation = "normal";
    elementosDefinidos.forEach((item) => {
      this.ctx.beginPath();

      const grd = this.ctx.createLinearGradient(
        item.gradient[0],
        item.gradient[1],
        item.gradient[2],
        item.gradient[3]
      );

      // Aplicar opacidad a los colores
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

  // Función para agregar opacidad a colores hexadecimales
  _addOpacityToHex(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // NUEVA FUNCIÓN: Viñeta negra mejorada
  drawVignette() {
    if (!this.ctx || !this.width || !this.height) return;

    this.ctx.save();
    this.ctx.filter = "none";

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const maxRadius = Math.max(this.width, this.height) * 0.8;

    this.ctx.globalCompositeOperation = "multiply";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Capa tenue segura
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

            // Repulsión igual para ambos tipos
            const repulsionStrength = 0.8;

            item.initialXDirection +=
              (dx / distance) * force * repulsionStrength;
            item.initialYDirection +=
              (dy / distance) * force * repulsionStrength;

            // Limitar velocidad igual para ambos tipos
            const maxSpeed = 0.05;
            item.initialXDirection = Math.max(
              -maxSpeed,
              Math.min(maxSpeed, item.initialXDirection)
            );
            item.initialYDirection = Math.max(
              -maxSpeed,
              Math.min(maxSpeed, item.initialYDirection)
            );

            // Efecto en el blur solo para elementos desenfocados
            if (item.type === "blur") {
              item.blur = Math.min(item.blur + force * 7, 40);
            }

            // Efecto en el radio (más sutil para elementos definidos)
            const radiusEffect =
              item.type === "defined" ? force * 3 : force * 10;
            const maxRadius = item.type === "defined" ? 35 : 100;
            item.originalRadius = Math.min(
              item.originalRadius + radiusEffect,
              maxRadius
            );

            // Efecto en opacidad para elementos definidos
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

    // helper opcional para probar audio desde consola
    window.testAudio = () => {
      manejadorAudio
        .reproducirFondo()
        .then(() => manejadorAudio.reproducirNarracion("intro"));
    };
  },
};

document.addEventListener("DOMContentLoaded", () => app.init());
