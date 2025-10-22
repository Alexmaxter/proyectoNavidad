// =============================
// INICIALIZADOR PRINCIPAL
// =============================
const App = {
  async init() {
    try {
      console.log("=== INICIANDO APLICACIÓN ===");

      this._showLoadingScreen();
      await this._waitForDOM();
      this._validateDOM();
      this._validateConfig();
      this._initState();
      await this._preloadCriticalAssets();
      await this._initModules();
      this._renderInitialContent();
      this._initNavigation();
      this._hideLoadingScreen();
      this._initDevTools();

      console.log("=== ✓ APLICACIÓN INICIALIZADA ===");
    } catch (error) {
      console.error("=== ✗ ERROR FATAL ===", error);
      this._showFatalError(error);
    }
  },

  _showLoadingScreen() {
    const loadingHTML = `
      <div class="loading-content">
        <div class="spinner"></div>
        <p id="loading-text">Cargando experiencia...</p>
        <div class="loading-progress">
          <div id="loading-bar" class="loading-bar"></div>
        </div>
        <p id="loading-percent">0%</p>
      </div>`;

    const styles = `
      .loading-content { text-align: center; }
      .spinner {
        width: 60px; height: 60px;
        border: 4px solid rgba(213, 75, 17, 0.2);
        border-top-color: #d54b11;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 20px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      #loading-text { margin: 10px 0; font-size: 14px; opacity: 0.8; }
      .loading-progress {
        width: 250px; height: 6px;
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
      #loading-percent { margin: 5px 0 0 0; font-size: 16px; font-weight: bold; color: #d54b11; }`;

    const screen = document.createElement("div");
    screen.id = "app-loading-screen";
    screen.innerHTML = loadingHTML;
    screen.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:9999;color:#fff;font-family:Arial,sans-serif";

    const style = document.createElement("style");
    style.textContent = styles;

    document.head.appendChild(style);
    document.body.appendChild(screen);
  },

  _updateLoadingProgress(percent, text) {
    const bar = DOM.get("loading-bar");
    const txt = DOM.get("loading-text");
    const pct = DOM.get("loading-percent");

    if (bar) bar.style.width = `${percent}%`;
    if (txt && text) txt.textContent = text;
    if (pct) pct.textContent = `${Math.round(percent)}%`;
  },

  _hideLoadingScreen() {
    const screen = DOM.get("app-loading-screen");
    if (screen) {
      screen.style.opacity = "0";
      screen.style.transition = "opacity 0.5s ease-out";
      setTimeout(() => screen.remove(), 500);
    }
    setTimeout(() => document.body.classList.add("loaded"), 600);
  },

  async _waitForDOM() {
    if (document.readyState === "loading") {
      await new Promise((resolve) =>
        document.addEventListener("DOMContentLoaded", resolve, { once: true })
      );
    }
    console.log("✓ DOM listo");
  },

  _validateDOM() {
    const critical = [
      "intro",
      "decision",
      "final",
      "countdown",
      "audio-fondo",
      "fadeOverlay",
    ];
    const missing = critical.filter((id) => !document.getElementById(id));

    if (missing.length > 0) {
      throw new Error(`Elementos críticos faltantes: ${missing.join(", ")}`);
    }
    console.log("✓ Validación DOM exitosa");
  },

  _validateConfig() {
    if (typeof CONFIG === "undefined")
      throw new Error("CONFIG no está definido");
    if (!CONFIG.textos || !CONFIG.navegacion || !CONFIG.audio) {
      throw new Error("CONFIG incompleto");
    }
    console.log("✓ Configuración válida");
  },

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

  async _preloadCriticalAssets() {
    console.log("Precargando recursos críticos...");

    const criticalImages = [
      "./assets/img/intro-bg.png",
      "./assets/img/decision-bg.png",
    ];
    const criticalAudios = ["audio-fondo", "audio-intro"];
    const total = criticalImages.length + criticalAudios.length;
    let completed = 0;

    const updateProgress = () => {
      completed++;
      const percent = (completed / total) * 100;
      this._updateLoadingProgress(
        percent,
        `Cargando recursos... ${completed}/${total}`
      );
    };

    const imagePromises = criticalImages.map((src) =>
      Preloader.preloadImage(src)
        .then(updateProgress)
        .catch(() => updateProgress())
    );

    const audioPromises = criticalAudios.map((id) =>
      Preloader.preloadAudio(id)
        .then(updateProgress)
        .catch(() => updateProgress())
    );

    await Promise.allSettled([...imagePromises, ...audioPromises]);
    this._updateLoadingProgress(100, "¡Listo!");

    console.log("✓ Recursos críticos precargados");
  },

  async _initModules() {
    console.log("Inicializando módulos...");

    if (typeof AudioManager !== "undefined") {
      AudioManager.init();
      console.log("  ✓ AudioManager");
    }

    if (typeof EventManager !== "undefined") {
      EventManager.init();
      console.log("  ✓ EventManager");
    }

    console.log("✓ Módulos inicializados");
  },

  _renderInitialContent() {
    console.log("Renderizando contenido inicial...");
    let rendered = 0;

    Object.keys(CONFIG.textos).forEach((id) => {
      if (id === "final" || id === "countdown") return;
      try {
        ContentManager.render(id);
        rendered++;
      } catch (error) {
        console.warn(`Error renderizando ${id}:`, error);
      }
    });

    console.log(`✓ Contenido renderizado: ${rendered} secciones`);
  },

  _initNavigation() {
    console.log("Inicializando navegación...");
    if (typeof Navigation === "undefined") {
      throw new Error("Navigation no está disponible");
    }
    Navigation.init();
    console.log("✓ Navegación inicializada");
  },

  _initDevTools() {
    if (
      !(
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.search.includes("debug=true")
      )
    )
      return;

    window.appDebug = {
      goTo: (section) => Navigation.navigateTo(section),
      getState: () => ({
        seccionActiva: AppState.seccionActiva?.id,
        playClickeado: AppState.playClickeado,
        seccionesVisitadas: [...AppState.seccionesVisitadas],
        router: Navigation.getState(),
        preloader: Preloader.getStats(),
      }),
      playAudio: (id) => AudioManager.reproducirNarracion(id),
      stopAudio: () => AudioManager.detenerTodosLosAudios(),
      reload: () => window.location.reload(),
    };

    console.log("🔧 Debug disponible en window.appDebug");
  },

  _showFatalError(error) {
    document.body.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);color:#fff;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;z-index:10000">
        <div style="background:#ff4444;padding:40px;border-radius:15px;text-align:center;max-width:500px;box-shadow:0 0 30px rgba(255,68,68,0.5)">
          <h2 style="margin:0 0 20px 0;font-size:28px">⚠️ Error de Carga</h2>
          <p style="margin:0 0 15px 0;font-size:16px">No se pudo inicializar la aplicación.</p>
          <p style="font-size:14px;opacity:0.9;margin:0 0 25px 0;font-family:monospace">${error.message}</p>
          <button onclick="window.location.reload()" style="background:#fff;color:#ff4444;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:14px">🔄 Recargar</button>
        </div>
      </div>`;
  },
};

// =============================
// MANEJADOR DE EVENTOS
// =============================
const EventManager = {
  init() {
    console.log("Configurando eventos...");
    document.addEventListener("click", (e) => this._handleClick(e), {
      passive: false,
    });
    document.addEventListener("keydown", (e) => this._handleKeydown(e), {
      passive: false,
    });
    window.addEventListener("error", (e) =>
      console.error("Error global:", e.error)
    );
    window.addEventListener("unhandledrejection", (e) => {
      console.error("Promise rechazada:", e.reason);
      e.preventDefault();
    });
  },

  _handleClick(e) {
    const { target } = e;
    const seccion = AppState.seccionActiva;
    if (!seccion) return;

    try {
      if (Navigation.manejarBotonEspecial(target, seccion)) return;

      if (target.closest(".acciones button")) {
        const boton = target.closest(".acciones button");

        if (boton.classList.contains("siguiente")) {
          const numero = seccion.id.match(/^explicacion(\d+)$/)?.[1];
          if (numero) Navigation.continuarDesdeExplicacion(+numero);
          return;
        }

        Navigation.manejarClickBoton(boton, seccion);
      }
    } catch (error) {
      console.error("Error manejando click:", error);
    }
  },

  _handleKeydown(e) {
    try {
      if (e.key === "Enter" && AppState.seccionActiva) {
        const numero = AppState.seccionActiva.id.match(/^acertijo(\d+)$/)?.[1];
        if (numero) Validation.validarRespuesta(+numero);
      }

      if (e.key === " " || e.key === "Space") {
        AudioManager.saltarSeccion();
        e.preventDefault();
      }
    } catch (error) {
      console.error("Error manejando tecla:", error);
    }
  },
};
