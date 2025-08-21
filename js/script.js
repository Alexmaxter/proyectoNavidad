/**
 * Experiencia Navideña Optimizada
 * Código modularizado con bokeh optimizado, degradé radial, y transiciones suaves
 * @version 2.0
 */

const AppState = {
  state: {
    fondoIniciado: false,
    seccionActiva: null,
    audioActual: null,
    eventListenersRegistrados: false,
    playClicked: false,
  },

  get(key) {
    return this.state[key];
  },
  set(key, value) {
    this.state[key] = value;
  },
};

const Config = {
  audio: { volumenFondo: 0.3, volumenNarracion: 0.8, fadeDuration: 2000 },
  bokeh: {
    intro: {
      color: [255, 80, 80],
      largeRadius: 80,
      smallRadius: 6,
      opacity: 0.4,
      backgroundOpacity: 0.15,
    },
    decision: {
      color: [80, 255, 80],
      largeRadius: 90,
      smallRadius: 7,
      opacity: 0.35,
      backgroundOpacity: 0.18,
    },
    confirmacion1: {
      color: [80, 80, 255],
      largeRadius: 100,
      smallRadius: 8,
      opacity: 0.32,
      backgroundOpacity: 0.2,
    },
    confirmacion2: {
      color: [255, 200, 80],
      largeRadius: 110,
      smallRadius: 9,
      opacity: 0.3,
      backgroundOpacity: 0.22,
    },
    acertijo1: {
      color: [255, 80, 200],
      largeRadius: 120,
      smallRadius: 10,
      opacity: 0.28,
      backgroundOpacity: 0.24,
    },
    acertijo2: {
      color: [80, 255, 255],
      largeRadius: 130,
      smallRadius: 11,
      opacity: 0.25,
      backgroundOpacity: 0.26,
    },
    acertijo3: {
      color: [255, 150, 80],
      largeRadius: 140,
      smallRadius: 12,
      opacity: 0.22,
      backgroundOpacity: 0.28,
    },
    final: {
      color: [180, 80, 255],
      largeRadius: 150,
      smallRadius: 13,
      opacity: 0.18,
      backgroundOpacity: 0.3,
    },
    final2: {
      color: [80, 220, 180],
      largeRadius: 160,
      smallRadius: 14,
      opacity: 0.15,
      backgroundOpacity: 0.32,
    },
  },
};

const Content = {
  intro: {
    titulo: "¡Bienvenido Valentino!",
    lineas: [
      "¡Perfecto, Valentino! Acabás de dar el primer empujón a esta aventura.",
      "Imaginá... la bola de nieve ya empezó a rodar colina abajo.",
      "Es pequeñita todavía, apenas del tamaño de una pelota de tenis, pero se mueve con determinación.",
      "Con cada vuelta que da, va recogiendo un poquito más de nieve... y se va haciendo un poquito más grande.",
      "Podés sentir cómo suena mientras rueda, juntando fuerza con cada giro.",
      "La montaña es larga y misteriosa, Valentino, y esta pequeña bola recién está empezando su gran viaje.",
      "Pero... algo muy importante está por pasar.",
    ],
    boton: "Comenzar",
  },
  decision: {
    titulo: "Una Decisión Importante",
    lineas: [
      "¡Imaginá eso! La bola de nieve siguió rodando y ya duplicó su tamaño.",
      "¿La ves? ¿Escuchás cómo suena ahora mientras recoge más y más nieve con cada vuelta?",
      "Pero acá, querido Valentino, llega el momento más importante de toda la aventura.",
      "Es la primera gran decisión, y de ella depende todo lo que va a pasar después.",
      "¿Qué elegís?",
      "Camino A: Detenerla ahora mismo y descubrir qué tesoro juntó hasta acá.",
      "Camino B: Dejar que siga su aventura montaña abajo, para ver qué tan gigante puede llegar a ser.",
      "Pensalo bien, Valentino... porque una vez que elijas el camino, ya no podrás cambiar de opinión.",
    ],
    botones: ["Camino 'A'", "Camino 'B'"],
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
      "La bola sigue rodando, Valentino. Ya es del tamaño de una pelota gigante y cada vez va más rápido.",
      "Pero no todas las bolas de nieve crecen igual.",
      "Algunas se hacen enormes, otras se rompen en el camino, y otras se derriten antes de llegar abajo.",
      "¿Qué necesita la bola de nieve para crecer fuerte y no romperse?",
      "La bola necesita que vos tomes buenas decisiones sobre su camino.",
      "Si la guiás por lugares peligrosos, se puede romper.",
      "Si elegís el terreno correcto, va a crecer sana y fuerte.",
      "¿Cómo se llama eso que hace que cuides bien el camino de la bola?",
    ],
    respuestaCorrecta: "responsabilidad",
  },
  acertijo2: {
    titulo: "Lo que nunca vuelve",
    lineas: [
      "La bola de nieve ya es enorme, como si fuera del tamaño de un auto rodando montaña abajo.",
      "Pero hay algo mágico que está pasando... algo que no se ve pero que sentís en cada vuelta.",
      "Imaginá: al principio era apenas una pelotita que cabía en las manos.",
      "Después de rodar un ratito, ya no podías abrazarla completa.",
      "Pero acá viene lo increíble... después de rodar más, no creció solo un poquito más...",
      "¡Creció el doble de lo que ya tenía!",
      "Y después no sumó de a poquito... ¡volvió a duplicarse!",
      "¿Ves lo que está pasando? Cada vuelta no solo agrega nieve nueva...",
      "hace que toda la nieve que ya tenía se multiplique también.",
      "¿Qué es esa fuerza invisible que hace que la bola no solo crezca... sino que se potencie a sí misma con cada giro?",
      "La pista está en que nunca para, nunca descansa.",
      "Mientras más rápido pasa, más rápido todo se multiplica.",
      "Es una fuerza que está ahí desde siempre, haciendo que las cosas pequeñas se vuelvan gigantes.",
    ],
    respuestaCorrecta: "tiempo",
  },
  acertijo3: {
    titulo: "Esperar también es avanzar",
    lineas: [
      "La bola de nieve es ya una avalancha gigante, arrasando con todo a su paso.",
      "Pero acá viene el momento más difícil...",
      "De repente, la bola se encuentra con una zona de piedras y se rompe un pedacito.",
      "¡No! Se hizo un poco más chica.",
      "Después encuentra más nieve y vuelve a crecer.",
      "Luego otra zona difícil, se achica otra vez.",
      "Después más nieve, crece otra vez.",
      "Algunos ven que la bola se achicó y gritan: '¡Se está rompiendo! ¡Hay que pararla ya!'",
      "Otros dicen: 'Es normal, todas las bolas de nieve pasan por zonas difíciles. Si espero, va a volver a crecer.'",
      "¿Qué cualidad especial necesitás para dejar que la bola siga rodando, aunque a veces se haga más chica?",
      "Es esa fuerza interior que te permite quedarte tranquilo cuando las cosas no van perfectas.",
      "Que te ayuda a no asustarte cuando algo baja para después subir.",
      "Que te da la serenidad de esperar el momento correcto.",
      "¿Cómo se llama esa virtud que te permite esperar sin desesperarte?",
    ],
    respuestaCorrecta: "paciencia",
  },
  final: {
    titulo: "¡Felicitaciones!",
    lineas: [
      "¡Increíble!",
      "La pequeña bola de nieve se convirtió en una avalancha imparable.",
      "Y todo porque entendiste los tres secretos que la hicieron crecer:",
      "Responsabilidad, porque cada decisión que tomes puede cambiar su destino.",
      "Tiempo, porque incluso lo pequeño puede volverse imparable si lo dejás avanzar.",
      "Paciencia, porque lo verdaderamente valioso se hace esperar.",
      "Este regalo no suena. No se rompe. No tiene moño.",
      "Pero es tuyo Valentino,",
      "y guarda algo capaz de crecer… más de lo que ahora podés imaginar.",
      "300.000 pesos",
      "Desde hoy, están a nombre tuyo.",
      "No para usar ahora, sino para dejar que se transforme con el tiempo",
      "Como esa pequeña bola de nieve que empezó rodando despacio por la colina.",
      "Si no la frenás… Si no la apurás…",
      "Va tomando forma, va sumando sentido, va construyendo su propia grandeza.",
      "Este regalo va a estar guardado, creciendo en silencio,",
      "hasta que cumplas 18 años...",
      "Y cuando llegue ese día Valentino… estará esperándote",
      "listo para que vos decidas qué hacer con él.",
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

const Utils = {
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  normalizeString(str) {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  },

  lerp(start, end, t) {
    return start + (end - start) * t;
  },
};

const References = (() => {
  let refs = null;
  return {
    get() {
      if (!refs) {
        refs = {
          audios: {
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
          },
          secciones: {
            intro: document.getElementById("intro"),
            decision: document.getElementById("decision"),
            confirmacion1: document.getElementById("confirmacion1"),
            confirmacion2: document.getElementById("confirmacion2"),
            acertijo1: document.getElementById("acertijo1"),
            acertijo2: document.getElementById("acertijo2"),
            acertijo3: document.getElementById("acertijo3"),
            final: document.getElementById("final"),
            final2: document.getElementById("final2"),
          },
        };
      }
      return refs;
    },
  };
})();

const AudioManager = {
  async playBackground() {
    const { audios } = References.get();
    if (!audios.fondo) return console.error("Audio de fondo no encontrado.");
    if (AppState.get("fondoIniciado")) return true;

    try {
      audios.fondo.volume = Config.audio.volumenFondo;
      audios.fondo.loop = true;
      await audios.fondo.play();
      AppState.set("fondoIniciado", true);
      return true;
    } catch (error) {
      console.warn("Error al iniciar audio de fondo:", error);
      document.addEventListener(
        "click",
        async () => {
          try {
            await audios.fondo.play();
            AppState.set("fondoIniciado", true);
          } catch (err) {
            console.error("Error al reproducir audio de fondo tras clic:", err);
          }
        },
        { once: true }
      );
      return false;
    }
  },

  stopAll() {
    const { audios } = References.get();
    Object.values(audios).forEach((audio) => {
      if (audio && audio !== audios.fondo && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    AppState.set("audioActual", null);
  },

  async fadeOut(audio, duration = Config.audio.fadeDuration) {
    if (!audio || audio.paused) return;
    const step = audio.volume / (duration / 50);
    return new Promise((resolve) => {
      const fade = setInterval(() => {
        if (audio.volume > step) {
          audio.volume = Math.max(0, audio.volume - step);
        } else {
          audio.pause();
          audio.currentTime = 0;
          clearInterval(fade);
          resolve();
        }
      }, 50);
    });
  },

  async playSection(id) {
    const { audios } = References.get();
    this.stopAll();

    if (id === "final" && audios.fondo) {
      await this.fadeOut(audios.fondo);
      if (AppState.get("seccionActiva")?.id === "final") {
        setTimeout(() => this.playBackground(), Config.audio.fadeDuration);
      }
    }

    const audio = audios[id];
    if (!audio) {
      SectionManager.showControls(id);
      return false;
    }

    try {
      audio.currentTime = 0;
      audio.volume =
        id === "fondo"
          ? Config.audio.volumenFondo
          : Config.audio.volumenNarracion;
      audio.onended = () => SectionManager.showControls(id);
      await audio.play();
      AppState.set("audioActual", audio);
      return true;
    } catch (error) {
      console.warn(`Error al reproducir audio ${id}:`, error);
      SectionManager.showControls(id);
      return false;
    }
  },
};

const ContentManager = {
  updateSection(id) {
    const { secciones } = References.get();
    const content = Content[id];
    const section = secciones[id];

    if (!section || !content) {
      console.error(`No se pudo actualizar sección ${id}:`, {
        section: !section ? "No encontrada" : "OK",
        content: !content ? "No encontrado" : "OK",
      });
      return;
    }

    const title = section.querySelector(".titulo h1");
    if (title && AppState.get("playClicked"))
      title.textContent = content.titulo;

    const narrative = section.querySelector(".narrativa");
    if (narrative)
      narrative.innerHTML = content.lineas
        .map((linea) => `<p>${linea}</p>`)
        .join("");

    const actions = section.querySelector(".acciones");
    if (actions && (content.botones || content.boton)) {
      actions.innerHTML = (content.botones || [content.boton])
        .map((text) => `<button type="button">${text}</button>`)
        .join("");
    }
  },
};

const SectionManager = {
  showNarrative(section) {
    const narrative = section.querySelector(".narrativa");
    if (narrative) narrative.classList.add("visible");
    else console.warn(`Narrativa no encontrada en sección: ${section.id}`);
  },

  showPlayButton(section) {
    const playCenter = section.querySelector(".play-center");
    if (playCenter) {
      playCenter.classList.add("visible");
      playCenter.style.display = "flex";
    } else {
      console.error(`Elemento .play-center no encontrado en ${section.id}.`);
    }
  },

  hideControls(section) {
    const selectors = [
      ".play-center",
      ".acciones",
      ".input-group",
      ".replay-button",
    ];
    selectors.forEach((selector) => {
      const element = section.querySelector(selector);
      if (element) {
        element.classList.remove("visible");
        if (selector === ".replay-button") element.innerHTML = "";
        element.style.display = selector === ".play-center" ? "none" : "block";
      }
    });
    const narrative = section.querySelector(".narrativa");
    if (narrative) narrative.classList.remove("visible");
  },

  showControls(id) {
    const section = AppState.get("seccionActiva");
    if (!section || section.id !== id) return;

    setTimeout(() => {
      const [actions, inputGroup, replayButton] = [
        section.querySelector(".acciones"),
        section.querySelector(".input-group"),
        section.querySelector(".replay-button"),
      ];
      if (replayButton) {
        replayButton.innerHTML =
          '<button type="button" class="replay-btn">Repetir</button>';
        replayButton.classList.add("visible");
      }
      if (actions) actions.classList.add("visible");
      if (inputGroup) inputGroup.classList.add("visible");
    }, 500);
  },

  showSection(id) {
    const { secciones } = References.get();
    const section = secciones[id];
    if (!section) {
      console.error(`Sección ${id} no encontrada.`);
      return;
    }

    AudioManager.stopAll();
    if (id !== "intro") {
      document.body.style.backgroundColor = "#1a1a1a";
      Bokeh.transition(id);
    }

    Object.values(secciones).forEach((s) => s.classList.remove("active"));
    section.classList.add("active");
    AppState.set("seccionActiva", section);

    ContentManager.updateSection(id);
    this.hideControls(section);

    if (id === "intro" && !AppState.get("playClicked")) {
      this.showPlayButton(section);
    } else {
      setTimeout(() => {
        AudioManager.playSection(id);
        this.showNarrative(section);
      }, 300);
    }
  },
};

const AnswerValidator = {
  validAnswers: {
    responsabilidad: [
      "responsabilidad",
      "la responsabilidad",
      "mi responsabilidad",
      "responsable",
      "responsabilidades",
      "resposabilidad",
      "responsavilidad",
    ],
    tiempo: ["tiempo", "el tiempo", "tiempos", "teimpo", "tienpo"],
    paciencia: [
      "paciencia",
      "la paciencia",
      "paciencias",
      "pasiencia",
      "pacencia",
    ],
  },

  getErrorMessage(isEmpty) {
    if (isEmpty) return "Por favor, escribe una respuesta.";
    const messages = [
      "Intenta pensar más profundamente...",
      "No es la respuesta correcta, reflexiona...",
      "Piensa en lo que representa la historia...",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  validate(numero) {
    if (!Number.isInteger(numero) || numero < 1 || numero > 3) {
      console.error(`Número de acertijo inválido: ${numero}.`);
      return;
    }

    const input = document.getElementById(`respuesta${numero}`);
    const error = document.getElementById(`error${numero}`);
    const content = Content[`acertijo${numero}`];

    if (!input || !error || !content) {
      console.error(`Error en validación de acertijo ${numero}:`, {
        input: !input ? "No encontrado" : "OK",
        error: !error ? "No encontrado" : "OK",
        content: !content ? "No encontrado" : "OK",
      });
      return;
    }

    const respuesta = Utils.normalizeString(input.value);
    const isEmpty = !respuesta;
    const isCorrect =
      !isEmpty &&
      this.validAnswers[content.respuestaCorrecta]?.includes(respuesta);

    error.classList.remove("show");
    input.classList.remove("input-correct", "input-incorrect", "shake");

    if (isEmpty || !isCorrect) {
      error.textContent = this.getErrorMessage(isEmpty);
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
    setTimeout(
      () =>
        SectionManager.showSection(
          numero < 3 ? `acertijo${numero + 1}` : "final"
        ),
      800
    );
  },
};

const Navigation = {
  goToDecision() {
    SectionManager.showSection("decision");
  },
  chooseOption(option) {
    SectionManager.showSection(
      { inmediata: "confirmacion1", esperar: "acertijo1" }[option]
    );
  },
  confirmOption(numero, respuesta) {
    const actions = {
      1: { sí: "confirmacion2", no: "decision" },
      2: { sí: "final2", no: "decision" },
    };
    const action = actions[numero]?.[respuesta.toLowerCase()];
    if (action) SectionManager.showSection(action);
  },
};

const EventHandler = {
  register() {
    if (AppState.get("eventListenersRegistrados")) return;
    document.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKey);
    AppState.set("eventListenersRegistrados", true);
  },

  handleClick: Utils.debounce((e) => {
    const { target } = e;
    const section = AppState.get("seccionActiva");
    if (!section) return;

    const playButton = target.closest(".play-center button");
    const replayButton = target.closest(
      ".replay-button button, .replay-button .replay-btn"
    );
    const actionButton = target.closest(".acciones button");
    const sendButton = target.closest(".send-button");

    if (playButton) {
      const playCenter = section.querySelector(".play-center");
      if (playCenter) {
        playCenter.style.display = "none";
        playCenter.classList.remove("visible");
        AppState.set("playClicked", true);
        AudioManager.playBackground();
        AudioManager.playSection(section.id);
        ContentManager.updateSection(section.id);
        SectionManager.showNarrative(section);
      }
      return;
    }

    if (replayButton) {
      AudioManager.playSection(section.id);
      return;
    }

    if (sendButton) {
      const match = section.id.match(/^acertijo(\d+)$/);
      if (match) AnswerValidator.validate(parseInt(match[1], 10));
      return;
    }

    if (actionButton) {
      const action = actionButton.textContent.toLowerCase().trim();
      if (action.includes("comenzar")) Navigation.goToDecision();
      else if (action.includes("'a'")) Navigation.chooseOption("inmediata");
      else if (action.includes("'b'")) Navigation.chooseOption("esperar");
      else if (action === "sí" || action === "no") {
        const numero =
          section.id === "confirmacion1"
            ? 1
            : section.id === "confirmacion2"
            ? 2
            : 0;
        if (numero) Navigation.confirmOption(numero, action);
      }
    }
  }, 300),

  handleKey: Utils.debounce((e) => {
    if (e.key !== "Enter" || !AppState.get("seccionActiva")) return;
    const match = AppState.get("seccionActiva").id.match(/^acertijo(\d+)$/);
    if (match) AnswerValidator.validate(parseInt(match[1], 10));
  }, 300),
};

const Bokeh = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  bubbles: [],
  currentColor: [255, 120, 120],
  targetColor: [255, 120, 120],
  backgroundOpacity: 0,
  targetBackgroundOpacity: 0,
  lastFrameTime: 0,
  frameInterval: 1000 / 60,

  init() {
    this.canvas = document.getElementById("bokehCanvas");
    if (!this.canvas) return console.error("Canvas bokeh no encontrado.");

    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.resize();
    window.addEventListener(
      "resize",
      Utils.debounce(this.resize.bind(this), 100)
    );

    const isMobile = window.innerWidth <= 768;
    this.createBubbles(isMobile ? 2 : 3, "large");
    this.createBubbles(isMobile ? 5 : 7, "small");
    this.transition("intro");
    this.animate();
  },

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.bubbles.forEach((bubble) => {
      bubble.x = Math.min(bubble.x, this.width - bubble.radius);
      bubble.y = Math.min(bubble.y, this.height - bubble.radius);
    });
  },

  createBubbles(count, type) {
    const config = Config.bokeh.intro;
    const radius = type === "large" ? config.largeRadius : config.smallRadius;
    for (let i = 0; i < count; i++) {
      this.bubbles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: config.opacity,
        blur: type === "large" ? Math.random() * 10 + 5 : Math.random() * 3 + 1,
        type,
        targetRadius: radius,
        targetOpacity: config.opacity,
      });
    }
  },

  update(deltaTime) {
    const speedFactor = deltaTime / this.frameInterval;
    this.bubbles.forEach((bubble) => {
      bubble.x += bubble.speedX * speedFactor;
      bubble.y += bubble.speedY * speedFactor;
      bubble.radius = Utils.lerp(bubble.radius, bubble.targetRadius, 0.05);
      bubble.opacity = Utils.lerp(bubble.opacity, bubble.targetOpacity, 0.05);

      if (bubble.x - bubble.radius > this.width) bubble.x = -bubble.radius;
      if (bubble.x + bubble.radius < 0) bubble.x = this.width + bubble.radius;
      if (bubble.y - bubble.radius > this.height) bubble.y = -bubble.radius;
      if (bubble.y + bubble.radius < 0) bubble.y = this.height + bubble.radius;
    });

    this.currentColor = this.currentColor.map((c, i) =>
      Utils.lerp(c, this.targetColor[i], 0.12)
    );
    this.backgroundOpacity = Utils.lerp(
      this.backgroundOpacity,
      this.targetBackgroundOpacity,
      0.03
    );
  },

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.backgroundOpacity > 0) {
      this.ctx.fillStyle = `rgba(${Math.round(
        this.currentColor[0]
      )}, ${Math.round(this.currentColor[1])}, ${Math.round(
        this.currentColor[2]
      )}, ${this.backgroundOpacity})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    this.ctx.globalCompositeOperation = "screen";
    this.bubbles.forEach((bubble) => {
      const gradient = this.ctx.createRadialGradient(
        bubble.x,
        bubble.y,
        0,
        bubble.x,
        bubble.y,
        bubble.radius
      );
      const [r, g, b] = this.currentColor;
      gradient.addColorStop(
        0,
        `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${
          bubble.opacity * 1.2
        })`
      );
      gradient.addColorStop(
        0.4,
        `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${
          bubble.opacity * 0.8
        })`
      );
      gradient.addColorStop(
        0.8,
        `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${
          bubble.opacity * 0.3
        })`
      );
      gradient.addColorStop(
        1,
        `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0)`
      );

      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.filter = `blur(${bubble.blur}px)`;
      this.ctx.fill();

      if (bubble.type === "large") {
        const haloGradient = this.ctx.createRadialGradient(
          bubble.x,
          bubble.y,
          0,
          bubble.x,
          bubble.y,
          bubble.radius * 1.3
        );
        haloGradient.addColorStop(
          0,
          `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${
            bubble.opacity * 0.08
          })`
        );
        haloGradient.addColorStop(
          1,
          `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0)`
        );

        this.ctx.beginPath();
        this.ctx.arc(bubble.x, bubble.y, bubble.radius * 1.3, 0, Math.PI * 2);
        this.ctx.fillStyle = haloGradient;
        this.ctx.filter = `blur(${bubble.blur * 1.5}px)`;
        this.ctx.fill();
      }
    });

    this.ctx.filter = "none";
    this.ctx.globalCompositeOperation = "source-over";
  },

  transition(sectionId) {
    const config = Config.bokeh[sectionId];
    if (!config)
      return console.warn(
        `Configuración bokeh no encontrada para: ${sectionId}`
      );

    this.targetColor = [...config.color];
    this.targetBackgroundOpacity = config.backgroundOpacity;
    this.bubbles.forEach((bubble) => {
      bubble.targetRadius =
        bubble.type === "large" ? config.largeRadius : config.smallRadius;
      bubble.targetOpacity = config.opacity;
    });
  },

  animate(time = 0) {
    const deltaTime = time - this.lastFrameTime;
    if (deltaTime >= this.frameInterval) {
      this.update(deltaTime);
      this.draw();
      this.lastFrameTime = time - (deltaTime % this.frameInterval);
    }
    requestAnimationFrame(this.animate.bind(this));
  },
};

const App = {
  init() {
    console.log("Iniciando experiencia navideña...");
    Bokeh.init();
    EventHandler.register();
    const { secciones } = References.get();
    if (!secciones.intro) {
      console.error("Sección intro no encontrada.");
      return;
    }
    AppState.set("seccionActiva", secciones.intro);
    AppState.set("playClicked", false);
    SectionManager.showSection("intro");
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
