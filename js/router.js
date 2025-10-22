// =============================
// ROUTER OPTIMIZADO
// =============================
class Router {
  constructor() {
    this.state = {
      current: null,
      previous: null,
      isTransitioning: false,
      queue: [],
    };
    this.initialized = false;
  }

  init() {
    if (this.initialized) {
      console.warn("Router ya inicializado");
      return;
    }

    console.log("Inicializando Router...");

    window.addEventListener("hashchange", (e) => this._onHashChange(e), {
      passive: true,
    });
    window.addEventListener("popstate", (e) => this._onPopState(e), {
      passive: true,
    });

    this.state.current = this._getSectionFromURL();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this._handleInitial()
      );
    } else {
      setTimeout(() => this._handleInitial(), 0);
    }

    this.initialized = true;
    console.log("✓ Router inicializado");
  }

  async _handleInitial() {
    const section = this.state.current || "intro";

    if (!this._isValid(section)) {
      console.warn(`Sección inicial "${section}" no válida`);
      await this.navigateTo("intro", { replace: true });
      return;
    }

    console.log(`Ruta inicial: ${section}`);
    await this._transition(section, { isInitial: true });
  }

  _onHashChange(event) {
    event.preventDefault();
    const section = this._getSectionFromURL();

    if (section === this.state.current && !this.state.isTransitioning) {
      console.log("Misma sección, ignorando");
      return;
    }

    this._processRoute(section);
  }

  _onPopState(event) {
    console.log("PopState detectado");
    const section = this._getSectionFromURL();
    this._processRoute(section);
  }

  async _processRoute(sectionId) {
    if (!this._isValid(sectionId)) {
      console.error(`Sección "${sectionId}" no válida`);
      await this.navigateTo("intro", { replace: true });
      return;
    }

    if (this.state.isTransitioning) {
      console.log(`Encolando: ${sectionId}`);
      this.state.queue.push(sectionId);
      return;
    }

    await this._transition(sectionId);
  }

  async _transition(sectionId, options = {}) {
    const { isInitial = false } = options;

    if (this.state.isTransitioning) {
      console.warn("⚠️ Transición ya en progreso, ignorando");
      return;
    }

    // CRÍTICO: Si ya estamos en esta sección, NO hacer nada
    if (this.state.current === sectionId && !isInitial) {
      console.log(`✓ Ya estamos en ${sectionId}, ignorando transición`);
      return;
    }

    try {
      this.state.isTransitioning = true;
      console.log(
        `🔄 Transición: ${this.state.current || "ninguna"} → ${sectionId}`
      );

      this.state.previous = this.state.current;
      const skipAudio = this._shouldSkipAudio(sectionId, isInitial);

      // Precargar recursos
      if (sectionId === "final") {
        await this._prepareVideo();
      } else {
        await Preloader.preloadSectionAssets(sectionId);
      }

      this.state.current = sectionId;
      await SectionManager.mostrar(sectionId, skipAudio);

      if (this.state.previous && this.state.previous !== sectionId) {
        AudioManager.manejarTransicionSeccion(this.state.previous, sectionId);
      }

      console.log(`✓ Transición completada: ${sectionId}`);
    } catch (error) {
      console.error(`Error en transición a ${sectionId}:`, error);

      if (sectionId !== "intro") {
        console.log("Recuperación: navegando a intro");
        this.state.current = this.state.previous;
        await this.navigateTo("intro", { replace: true });
      }
    } finally {
      this.state.isTransitioning = false;
      this._processQueue();
    }
  }

  async _prepareVideo() {
    console.log("🎬 Preparando video...");

    try {
      const video = await Preloader.preloadVideo("Final");
      if (!video) throw new Error("Video no disponible");
      console.log("✓ Video listo");
    } catch (error) {
      console.warn("⚠️ Video no disponible:", error);
      await this.navigateTo("countdown", { replace: true });
      throw error;
    }
  }

  _processQueue() {
    if (this.state.queue.length > 0) {
      const next = this.state.queue.shift();
      console.log(`Procesando cola: ${next}`);
      setTimeout(() => this._processRoute(next), 100);
    }
  }

  async navigateTo(sectionId, options = {}) {
    const { replace = false, force = false } = options;

    if (!sectionId || typeof sectionId !== "string") {
      console.error("navigateTo: sectionId inválido");
      return Promise.reject(new Error("Invalid sectionId"));
    }

    if (!this._isValid(sectionId)) {
      console.error(`navigateTo: Sección "${sectionId}" no existe`);
      return Promise.reject(new Error(`Section ${sectionId} does not exist`));
    }

    if (
      !force &&
      sectionId === this.state.current &&
      !this.state.isTransitioning
    ) {
      console.log(`Ya estamos en ${sectionId}`);
      return Promise.resolve();
    }

    console.log(`🧭 navigateTo: ${sectionId} (replace: ${replace})`);

    if (force) this.state.queue = [];

    return new Promise((resolve, reject) => {
      try {
        const newHash = `#${sectionId}`;

        if (replace) {
          history.replaceState({ section: sectionId }, "", newHash);
          setTimeout(
            () => this._processRoute(sectionId).then(resolve).catch(reject),
            0
          );
        } else {
          if (window.location.hash !== newHash) {
            window.location.hash = sectionId;
            resolve();
          } else {
            setTimeout(
              () => this._processRoute(sectionId).then(resolve).catch(reject),
              0
            );
          }
        }
      } catch (error) {
        console.error(`Error en navigateTo(${sectionId}):`, error);
        reject(error);
      }
    });
  }

  navegarPorPosicion(seccionId, botonIndex) {
    const destino = CONFIG.navegacion[seccionId]?.[botonIndex];

    if (!destino) {
      console.warn(`No hay destino para ${seccionId}[${botonIndex}]`);
      return false;
    }

    console.log(
      `Navegando desde ${seccionId} índice ${botonIndex} → ${destino}`
    );
    return this.navigateTo(destino);
  }

  manejarClickBoton(boton, seccion) {
    const botones = [...seccion.querySelectorAll(".acciones button")];
    const indice = botones.indexOf(boton);

    if (indice === -1) {
      console.warn("No se pudo determinar el índice del botón");
      return false;
    }

    return this.navegarPorPosicion(seccion.id, indice);
  }

  manejarBotonEspecial(target, seccion) {
    try {
      if (target.closest(".play-center button")) {
        this._handlePlay(seccion);
        return true;
      }

      if (target.closest(".replay-button button")) {
        AudioManager.reproducirNarracion(seccion.id);
        return true;
      }

      if (target.closest(".send-button")) {
        const numero = seccion.id.match(/^acertijo(\d+)$/)?.[1];
        if (numero) Validation.validarRespuesta(+numero);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error manejando botón especial:", error);
      return false;
    }
  }

  _handlePlay(seccion) {
    const playCentro = seccion.querySelector(".play-center");
    if (playCentro) {
      playCentro.style.display = "none";
      playCentro.classList.remove("visible");
    }

    AppState.playClickeado = true;
    seccion.classList.add("show-content");

    AudioManager.reproducirFondo()
      .then(() => {
        AudioManager.reproducirNarracion(seccion.id);
        SectionManager._showNarrativa(seccion);
      })
      .catch((error) => console.error("Error iniciando audio:", error));
  }

  continuarDesdeExplicacion(num) {
    console.log(`Continuando desde explicacion${num}`);
    const destinos = { 1: "acertijo2", 2: "acertijo3", 3: "final" };
    const destino = destinos[num];

    if (!destino) {
      console.error(`No hay destino para explicacion${num}`);
      return false;
    }

    return this.navigateTo(destino);
  }

  _shouldSkipAudio(sectionId, isInitial = false) {
    if (isInitial && sectionId !== "intro") return true;
    if (sectionId === "intro" && !AppState.playClickeado) return true;
    if (AppState.seccionesVisitadas.has(sectionId)) return true;
    if (!AppState.playClickeado && sectionId !== "intro") return true;
    return false;
  }

  _isValid(sectionId) {
    return (
      sectionId &&
      typeof sectionId === "string" &&
      CONFIG.textos.hasOwnProperty(sectionId) &&
      document.getElementById(sectionId) !== null
    );
  }

  _getSectionFromURL() {
    return window.location.hash.slice(1) || "intro";
  }

  getState() {
    return {
      current: this.state.current,
      previous: this.state.previous,
      isTransitioning: this.state.isTransitioning,
      queueLength: this.state.queue.length,
    };
  }

  reset() {
    this.state.isTransitioning = false;
    this.state.queue = [];
  }
}

// Instancia única
const router = new Router();

// Export compatible
const Navigation = {
  init: () => router.init(),
  navigateTo: (...args) => router.navigateTo(...args),
  navegarPorPosicion: (...args) => router.navegarPorPosicion(...args),
  manejarClickBoton: (...args) => router.manejarClickBoton(...args),
  manejarBotonEspecial: (...args) => router.manejarBotonEspecial(...args),
  continuarDesdeExplicacion: (...args) =>
    router.continuarDesdeExplicacion(...args),
  getState: () => router.getState(),
  router: router,
};
