// =============================
// MANEJADOR DE EVENTOS PRINCIPAL
// =============================
const EventManager = {
  init() {
    document.addEventListener("click", (e) => this._manejarClic(e));
    document.addEventListener(
      "keydown",
      Utils.debounce((e) => this._manejarTecla(e), 300)
    );
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

    this._inicializarComponentes();
    this._configurarEstadoInicial();
    this._renderizarContenidoInicial();
    this._mostrarSeccionInicial();

    setTimeout(() => document.body.classList.add("loaded"), 100);

    // Función de prueba para desarrollo
    if (typeof window !== "undefined") {
      window.testAudio = () => {
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
    AudioManager.init();
    Bokeh.init();
    EventManager.init();
  },

  /**
   * Configura el estado inicial de la aplicación
   */
  _configurarEstadoInicial() {
    AppState.seccionActiva = DOM.get("intro");
    AppState.playClickeado = false;
  },

  /**
   * Renderiza el contenido inicial de todas las secciones
   */
  _renderizarContenidoInicial() {
    Object.keys(CONFIG.textos).forEach((id) => {
      ContentManager.render(id);
    });
  },

  /**
   * Muestra la sección inicial (intro)
   */
  _mostrarSeccionInicial() {
    SectionManager.mostrar("intro");
  },
};

// =============================
// INICIALIZACIÓN AUTOMÁTICA
// =============================
document.addEventListener("DOMContentLoaded", () => {
  try {
    App.init();
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
  }
});
