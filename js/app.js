// =============================
// INICIALIZADOR PRINCIPAL DE LA APLICACIÓN
// =============================
const App = {
  /**
   * Inicializa toda la aplicación en orden estricto
   */
  async init() {
    try {
      console.log("=== INICIANDO APLICACIÓN ===");

      // Mostrar pantalla de carga
      this._showLoadingScreen();

      // 1. Validar DOM
      await this._waitForDOM();
      this._validateDOM();

      // 2. Validar configuración
      this._validateConfig();

      // 3. Inicializar estado
      this._initState();

      // 4. Precarga crítica de recursos
      await this._preloadCriticalAssets();

      // 5. Inicializar módulos en orden
      await this._initModules();

      // 6. Renderizar contenido inicial
      this._renderInitialContent();

      // 7. Inicializar navegación (ÚLTIMO)
      this._initNavigation();

      // 8. Ocultar pantalla de carga
      this._hideLoadingScreen();

      // 9. Herramientas de desarrollo (si aplica)
      this._initDevTools();

      console.log("=== ✓ APLICACIÓN INICIALIZADA CORRECTAMENTE ===");
    } catch (error) {
      console.error("=== ✗ ERROR FATAL ===", error);
      this._showFatalError(error);
    }
  },

  /**
   * Muestra pantalla de carga
   */
  _showLoadingScreen() {
    const loadingScreen = document.createElement("div");
    loadingScreen.id = "app-loading-screen";
    loadingScreen.innerHTML = `
      <div class="loading-content">
        <div class="spinner"></div>
        <p id="loading-text">Cargando experiencia...</p>
        <div class="loading-progress">
          <div id="loading-bar" class="loading-bar"></div>
        </div>
        <p id="loading-percent">0%</p>
      </div>
    `;
    loadingScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: #fff;
      font-family: Arial, sans-serif;
    `;

    // Estilos adicionales
    const style = document.createElement("style");
    style.textContent = `
      .loading-content {
        text-align: center;
      }
      .spinner {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(213, 75, 17, 0.2);
        border-top-color: #d54b11;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 20px;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      #loading-text {
        margin: 10px 0;
        font-size: 14px;
        opacity: 0.8;
        color: rgba(255, 255, 255, 0.9);
      }
      .loading-progress {
        width: 250px;
        height: 6px;
        background: rgba(213, 75, 17, 0.2);
        border-radius: 3px;
        margin: 20px auto 10px;
        overflow: hidden;
      }
      .loading-bar {
        height: 100%;
        background: linear-gradient(90deg, #d54b11 0%, #ff8c42 100%);
        width: 0%;
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(213, 75, 17, 0.5);
      }
      #loading-percent {
        margin: 5px 0 0 0;
        font-size: 16px;
        font-weight: bold;
        color: #d54b11;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(loadingScreen);
  },

  /**
   * Actualiza progreso de carga con porcentaje real
   */
  _updateLoadingProgress(percent, text) {
    const loadingBar = document.getElementById("loading-bar");
    const loadingText = document.getElementById("loading-text");
    const loadingPercent = document.getElementById("loading-percent");

    if (loadingBar) {
      loadingBar.style.width = `${percent}%`;
    }
    if (loadingText && text) {
      loadingText.textContent = text;
    }
    if (loadingPercent) {
      loadingPercent.textContent = `${Math.round(percent)}%`;
    }
  },

  /**
   * Oculta pantalla de carga
   */
  _hideLoadingScreen() {
    const loadingScreen = document.getElementById("app-loading-screen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      loadingScreen.style.transition = "opacity 0.5s ease-out";
      setTimeout(() => loadingScreen.remove(), 500);
    }

    // Marcar aplicación como cargada
    setTimeout(() => {
      document.body.classList.add("loaded");
    }, 600);
  },

  /**
   * Espera a que el DOM esté completamente listo
   */
  async _waitForDOM() {
    if (document.readyState === "loading") {
      await new Promise((resolve) => {
        document.addEventListener("DOMContentLoaded", resolve, { once: true });
      });
    }
    console.log("✓ DOM listo");
  },

  /**
   * Valida elementos críticos del DOM
   */
  _validateDOM() {
    const criticalElements = [
      "intro",
      "decision",
      "final",
      "countdown",
      "audio-fondo",
      "fadeOverlay",
    ];

    const missing = criticalElements.filter(
      (id) => !document.getElementById(id)
    );

    if (missing.length > 0) {
      throw new Error(`Elementos críticos faltantes: ${missing.join(", ")}`);
    }

    console.log("✓ Validación DOM exitosa");
  },

  /**
   * Valida la configuración
   */
  _validateConfig() {
    if (typeof CONFIG === "undefined") {
      throw new Error("CONFIG no está definido");
    }

    if (!CONFIG.textos || !CONFIG.navegacion || !CONFIG.audio) {
      throw new Error("CONFIG incompleto");
    }

    console.log("✓ Configuración válida");
  },

  /**
   * Inicializa el estado global
   */
  _initState() {
    AppState.seccionActiva = DOM.get("intro");
    AppState.playClickeado = false;
    AppState.fondoIniciado = false;
    AppState.fondoFinalIniciado = false;
    AppState.seccionesVisitadas = new Set();
    AppState.audioReproduciendo = false;
    AppState.audioActual = null;
    AppState.temporizadorBotonFinal = null;
    AppState.seccionAnterior = null;

    console.log("✓ Estado inicializado");
  },

  /**
   * Precarga recursos críticos
   */
  async _preloadCriticalAssets() {
    console.log("Precargando recursos críticos...");

    try {
      // Definir recursos críticos
      const criticalImages = [
        "./assets/img/intro-bg.png",
        "./assets/img/decision-bg.png",
      ];

      const criticalAudios = ["audio-fondo", "audio-intro"];

      const totalRecursos = criticalImages.length + criticalAudios.length;
      let recursosCompletados = 0;

      // Función para actualizar progreso
      const actualizarProgreso = () => {
        recursosCompletados++;
        const porcentaje = (recursosCompletados / totalRecursos) * 100;
        this._updateLoadingProgress(
          porcentaje,
          `Cargando recursos... ${recursosCompletados}/${totalRecursos}`
        );
      };

      // Cargar imágenes con reporte de progreso
      const imagePromises = criticalImages.map((src) =>
        Preloader.preloadImage(src)
          .then(() => actualizarProgreso())
          .catch((err) => {
            actualizarProgreso(); // Contar incluso si falla
            console.warn(`Imagen no cargada: ${src}`);
          })
      );

      // Cargar audios con reporte de progreso
      const audioPromises = criticalAudios.map((id) =>
        Preloader.preloadAudio(id)
          .then(() => actualizarProgreso())
          .catch((err) => {
            actualizarProgreso(); // Contar incluso si falla
            console.warn(`Audio no cargado: ${id}`);
          })
      );

      // Esperar a que todos terminen
      await Promise.allSettled([...imagePromises, ...audioPromises]);

      // Asegurar 100% al final
      this._updateLoadingProgress(100, "¡Listo!");

      console.log("✓ Recursos críticos precargados");
      console.log("Estadísticas:", Preloader.getStats());
    } catch (error) {
      console.warn("Advertencia: Error en precarga, continuando:", error);
      // No bloquear la app por errores de precarga
      this._updateLoadingProgress(100, "Continuando...");
    }
  },

  /**
   * Inicializa módulos en orden estricto
   */
  async _initModules() {
    console.log("Inicializando módulos...");

    // 1. Audio Manager
    if (typeof AudioManager !== "undefined") {
      AudioManager.init();
      console.log("  ✓ AudioManager");
    }

    // 2. Event Manager
    if (typeof EventManager !== "undefined") {
      EventManager.init();
      console.log("  ✓ EventManager");
    }

    console.log("✓ Módulos inicializados");
  },

  /**
   * Renderiza contenido inicial de todas las secciones
   */
  _renderInitialContent() {
    console.log("Renderizando contenido inicial...");

    let rendered = 0;
    let errors = 0;

    Object.keys(CONFIG.textos).forEach((id) => {
      // Saltar secciones especiales
      if (id === "final" || id === "countdown") return;

      try {
        ContentManager.render(id);
        rendered++;
      } catch (error) {
        console.warn(`Error renderizando ${id}:`, error);
        errors++;
      }
    });

    console.log(
      `✓ Contenido renderizado: ${rendered} secciones${
        errors > 0 ? `, ${errors} errores` : ""
      }`
    );
  },

  /**
   * Inicializa el sistema de navegación
   */
  _initNavigation() {
    console.log("Inicializando navegación...");

    if (typeof Navigation === "undefined") {
      throw new Error("Navigation no está disponible");
    }

    Navigation.init();
    console.log("✓ Navegación inicializada");
  },

  /**
   * Inicializa herramientas de desarrollo
   */
  _initDevTools() {
    if (!this._isDevelopment()) return;

    console.log("Modo desarrollo detectado");

    // Exponer funciones de debug
    window.appDebug = {
      // Navegación
      goTo: (section) => Navigation.navigateTo(section),
      getCurrentSection: () => Navigation.router.state.current,

      // Estado
      getState: () => ({
        app: {
          seccionActiva: AppState.seccionActiva?.id,
          playClickeado: AppState.playClickeado,
          fondoIniciado: AppState.fondoIniciado,
          seccionesVisitadas: [...AppState.seccionesVisitadas],
        },
        router: Navigation.getState(),
        preloader: Preloader.getStats(),
      }),

      // Audio
      playAudio: (id) => AudioManager.reproducirNarracion(id),
      stopAudio: () => AudioManager.detenerTodosLosAudios(),

      // Recursos
      preloadVideo: () => Preloader.preloadVideo("Final"),
      preloadSection: (id) => Preloader.preloadSectionAssets(id),

      // Utilidades
      reload: () => window.location.reload(),
      clearCache: () => Preloader.clearCache(),
    };

    console.log("🔧 Herramientas de desarrollo disponibles en window.appDebug");
    console.log("Comandos: goTo(section), getState(), playAudio(id), etc.");
  },

  /**
   * Verifica si estamos en desarrollo
   */
  _isDevelopment() {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.search.includes("debug=true")
    );
  },

  /**
   * Muestra error fatal
   */
  _showFatalError(error) {
    document.body.innerHTML = `
      <div style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-family: Arial, sans-serif; z-index: 10000;
      ">
        <div style="
          background: #ff4444; padding: 40px; border-radius: 15px;
          text-align: center; max-width: 500px;
          box-shadow: 0 0 30px rgba(255,68,68,0.5);
        ">
          <h2 style="margin: 0 0 20px 0; font-size: 28px;">⚠️ Error de Carga</h2>
          <p style="margin: 0 0 15px 0; font-size: 16px;">
            No se pudo inicializar la aplicación correctamente.
          </p>
          <p style="font-size: 14px; opacity: 0.9; margin: 0 0 25px 0; font-family: monospace;">
            ${error.message}
          </p>
          <p style="font-size: 12px; opacity: 0.7; margin: 0 0 30px 0;">
            Esto puede deberse a problemas de conexión o archivos faltantes.
          </p>
          <div>
            <button onclick="window.location.reload()" style="
              background: #fff; color: #ff4444; border: none;
              padding: 12px 24px; border-radius: 8px; cursor: pointer;
              font-weight: bold; margin: 0 10px 0 0; font-size: 14px;
            ">
              🔄 Recargar Página
            </button>
            <button onclick="window.location.href = window.location.origin + window.location.pathname" style="
              background: rgba(255,255,255,0.2); color: #fff;
              border: 1px solid rgba(255,255,255,0.5);
              padding: 12px 24px; border-radius: 8px; cursor: pointer;
              margin: 0; font-size: 14px;
            ">
              🏠 Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    `;
  },
};

// =============================
// MANEJADOR DE EVENTOS
// =============================
const EventManager = {
  init() {
    console.log("Configurando eventos...");
    this._setupEventListeners();
  },

  _setupEventListeners() {
    // Event delegation para clicks
    document.addEventListener("click", (e) => this._handleClick(e), {
      passive: false,
    });

    // Teclado
    document.addEventListener("keydown", (e) => this._handleKeydown(e), {
      passive: false,
    });

    // Errores globales
    window.addEventListener("error", (e) => this._handleError(e));
    window.addEventListener("unhandledrejection", (e) =>
      this._handleRejection(e)
    );
  },

  _handleClick(e) {
    const { target } = e;
    const { seccionActiva: seccion } = AppState;

    if (!seccion) return;

    try {
      // Botones especiales primero
      if (Navigation.manejarBotonEspecial(target, seccion)) {
        return;
      }

      // Botones de acción
      if (target.closest(".acciones button")) {
        const boton = target.closest(".acciones button");

        // Botón "Siguiente" en explicaciones
        if (boton.classList.contains("siguiente")) {
          const numero = seccion.id.match(/^explicacion(\d+)$/)?.[1];
          if (numero) {
            Navigation.continuarDesdeExplicacion(+numero);
          }
          return;
        }

        // Navegación normal
        Navigation.manejarClickBoton(boton, seccion);
      }
    } catch (error) {
      console.error("Error manejando click:", error);
    }
  },

  _handleKeydown(e) {
    const { key } = e;

    try {
      // Enter para acertijos
      if (key === "Enter" && AppState.seccionActiva) {
        const numero = AppState.seccionActiva.id.match(/^acertijo(\d+)$/)?.[1];
        if (numero) {
          Validation.validarRespuesta(+numero);
        }
      }

      // Espacio para saltar narración
      if (key === " " || key === "Space") {
        AudioManager.saltarSeccion();
        e.preventDefault();
      }
    } catch (error) {
      console.error("Error manejando tecla:", error);
    }
  },

  _handleError(event) {
    console.error("Error global:", event.error);
  },

  _handleRejection(event) {
    console.error("Promise rechazada:", event.reason);
    event.preventDefault();
  },
};
