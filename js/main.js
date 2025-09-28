// =============================
// MANEJADOR DE EVENTOS PRINCIPAL
// =============================
const EventManager = {
  init() {
    this._configurarEventos();
  },

  _configurarEventos() {
    document.addEventListener("click", (e) => this._manejarClic(e));
    document.addEventListener("keydown", (e) => this._manejarTecla(e));
  },

  /**
   * Maneja todos los eventos de click de la aplicación
   * @param {Event} e - Evento de click
   */
  _manejarClic(e) {
    const { target } = e;
    const { seccionActiva: seccion } = AppState;
    if (!seccion) return;

    // Intentar manejar botones especiales primero
    if (Navigation.manejarBotonEspecial(target, seccion)) {
      return;
    }

    // Manejar botones de acción (navegación)
    if (target.closest(".acciones button")) {
      const boton = target.closest(".acciones button");

      // Caso especial para botones "Siguiente" en explicaciones
      if (boton.classList.contains("siguiente")) {
        const numero = seccion.id.match(/^explicacion(\d+)$/)?.[1];
        if (numero) {
          Navigation.continuarDesdeExplicacion(+numero);
        }
        return;
      }

      // Navegación normal por posición de botón
      Navigation.manejarClickBoton(boton, seccion);
    }
  },

  /**
   * Maneja eventos de teclado
   * @param {KeyboardEvent} e - Evento de teclado
   */
  _manejarTecla({ key }) {
    // Enter para validar respuestas en acertijos
    if (key === "Enter" && AppState.seccionActiva) {
      const numero = AppState.seccionActiva.id.match(/^acertijo(\d+)$/)?.[1];
      if (numero) {
        Validation.validarRespuesta(+numero);
      }
    }

    // Espacio para saltar narración
    if (key === " " || key === "Space") {
      AudioManager.saltarSeccion();
    }
  },
};

// =============================
// APLICACIÓN PRINCIPAL
// =============================
const App = {
  /**
   * Inicializa toda la aplicación
   */
  init() {
    const seccionIntro = DOM.get("intro");
    const canvas = DOM.get("bokehCanvas");

    if (!seccionIntro || !canvas) {
      console.error("Elementos esenciales no encontrados");
      return;
    }

    // ORDEN CORRECTO DE INICIALIZACIÓN
    this._inicializarComponentes();
    this._configurarEstadoInicial();
    this._renderizarContenidoInicial();
    HashRouter.init(); // Inicializar routing antes de mostrar sección
    this._mostrarSeccionInicial();

    setTimeout(() => document.body.classList.add("loaded"), 100);

    // Función de prueba para desarrollo - SOLO PARA TESTING
    if (typeof window !== "undefined") {
      window.testAudio = () => {
        console.log("Testing audio - iniciando manualmente");
        AudioManager.reproducirFondo().then(() =>
          AudioManager.reproducirNarracion("intro")
        );
      };
    }
  },

  /**
   * Inicializa todos los componentes necesarios
   */
  _inicializarComponentes() {
    AudioManager.init(); // IMPORTANTE: init() NO debe iniciar audio automáticamente
    Bokeh.init();
    EventManager.init();
  },

  /**
   * Configura el estado inicial de la aplicación
   */
  _configurarEstadoInicial() {
    AppState.seccionActiva = DOM.get("intro");
    AppState.playClickeado = false; // IMPORTANTE: false al inicio
    AppState.fondoIniciado = false; // IMPORTANTE: false al inicio
    AppState.fondoFinalIniciado = false;
  },

  /**
   * Renderiza el contenido inicial de todas las secciones (menos la final)
   */
  _renderizarContenidoInicial() {
    Object.keys(CONFIG.textos).forEach((id) => {
      // Evitamos renderizar las secciones especiales que no tienen estructura normal
      if (id === "final" || id === "countdown") return;
      ContentManager.render(id);
    });
  },

  /**
   * Muestra la sección inicial basada en hash o intro por defecto
   */
  _mostrarSeccionInicial() {
    // Si hay hash en la URL, HashRouter.handleRoute() se encargará
    // Si no hay hash, mostrar intro SIN AUDIO
    if (!window.location.hash) {
      SectionManager.mostrar("intro", true); // true = saltar audio
    }
  },
};

// =============================
// HASH ROUTER (VERSIÓN FINAL)
// =============================
class HashRouter {
  /**
   * Inicializa el sistema de routing por hash
   */
  static init() {
    window.addEventListener("hashchange", () => this.handleRoute());
    window.addEventListener("load", () => this.handleRoute());

    // Si ya hay contenido cargado, manejar ruta inmediatamente
    if (document.readyState === "complete") {
      setTimeout(() => this.handleRoute(), 0);
    }
  }

  /**
   * Maneja cambios en la URL hash
   */
  static handleRoute() {
    const section = window.location.hash.slice(1) || "intro";

    // Verificar que la sección existe
    if (CONFIG.textos[section]) {
      const saltarAudio = this._shouldSkipAudio(section);
      SectionManager.mostrar(section, saltarAudio);
    } else {
      console.warn(`Sección ${section} no encontrada, redirigiendo a intro`);
      this.navigateTo("intro");
    }
  }

  /**
   * Navega a una sección específica
   * @param {string} sectionId - ID de la sección destino
   */
  static navigateTo(sectionId) {
    if (!CONFIG.textos[sectionId]) {
      console.warn(`Sección ${sectionId} no existe`);
      return;
    }

    // Evitar loops infinitos
    if (window.location.hash.slice(1) === sectionId) {
      return;
    }

    window.location.hash = sectionId;
  }

  /**
   * Determina si debe saltar el audio basado en el contexto
   * @param {string} section - ID de la sección
   * @returns {boolean}
   */
  static _shouldSkipAudio(section) {
    // Para intro: solo reproducir audio si ya se presionó play
    if (section === "intro" && !AppState.playClickeado) {
      return true; // Saltar audio hasta que se presione play
    }

    // Saltar audio si regresamos a una sección ya visitada
    if (AppState.seccionesVisitadas.has(section)) {
      return true;
    }

    // Saltar audio si es navegación directa a sección avanzada sin contexto
    if (!AppState.playClickeado && section !== "intro") {
      return true;
    }

    return false;
  }

  /**
   * Obtiene la sección actual desde la URL
   * @returns {string}
   */
  static getCurrentSection() {
    return window.location.hash.slice(1) || "intro";
  }
}
