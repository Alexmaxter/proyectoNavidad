// =============================
// ROUTER UNIFICADO Y OPTIMIZADO
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
    this.transitionLock = null;
  }

  /**
   * Inicializa el router
   */
  init() {
    if (this.initialized) {
      console.warn("Router ya inicializado");
      return;
    }

    console.log("Inicializando Router...");

    // Event listeners
    window.addEventListener("hashchange", (e) => this._handleHashChange(e), {
      passive: true,
    });
    window.addEventListener("popstate", (e) => this._handlePopState(e), {
      passive: true,
    });

    // Establecer ruta inicial
    this.state.current = this._getCurrentSectionFromURL();

    // Procesar ruta inicial después de que el DOM esté listo
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this._handleInitialRoute()
      );
    } else {
      setTimeout(() => this._handleInitialRoute(), 0);
    }

    this.initialized = true;
    console.log("✓ Router inicializado");
  }

  /**
   * Maneja la ruta inicial
   */
  async _handleInitialRoute() {
    const section = this.state.current || "intro";

    if (!this._isValidSection(section)) {
      console.warn(
        `Sección inicial "${section}" no válida, redirigiendo a intro`
      );
      await this.navigateTo("intro", { replace: true });
      return;
    }

    console.log(`Procesando ruta inicial: ${section}`);
    await this._transition(section, { isInitial: true });
  }

  /**
   * Maneja cambios en el hash
   */
  _handleHashChange(event) {
    event.preventDefault();
    const newSection = this._getCurrentSectionFromURL();

    // Evitar procesar la misma ruta múltiples veces
    if (newSection === this.state.current && !this.state.isTransitioning) {
      console.log("Misma sección, ignorando cambio");
      return;
    }

    this._processRoute(newSection);
  }

  /**
   * Maneja popstate (botón atrás/adelante)
   */
  _handlePopState(event) {
    console.log("PopState detectado");
    const section = this._getCurrentSectionFromURL();
    this._processRoute(section);
  }

  /**
   * Procesa una ruta (con cola de espera)
   */
  async _processRoute(sectionId) {
    if (!this._isValidSection(sectionId)) {
      console.error(`Sección "${sectionId}" no válida`);
      await this.navigateTo("intro", { replace: true });
      return;
    }

    // Si estamos en transición, encolar
    if (this.state.isTransitioning) {
      console.log(`Encolando ruta: ${sectionId}`);
      this.state.queue.push(sectionId);
      return;
    }

    // Procesar transición
    await this._transition(sectionId);
  }

  /**
   * Ejecuta la transición a una nueva sección
   */
  async _transition(sectionId, options = {}) {
    const { isInitial = false } = options;

    // Lock de transición
    if (this.state.isTransitioning) {
      console.warn("Transición ya en progreso, esperando...");
      return;
    }

    try {
      this.state.isTransitioning = true;
      this.transitionLock = Date.now();

      console.log(
        `🔄 Transición: ${this.state.current || "ninguna"} → ${sectionId}`
      );

      // Guardar estado anterior
      this.state.previous = this.state.current;

      // Determinar si saltar audio
      const shouldSkipAudio = this._shouldSkipAudio(sectionId, isInitial);

      // CRÍTICO: Precargar recursos de la sección ANTES de mostrarla
      if (sectionId === "final") {
        await this._prepareVideoSection();
      } else {
        await Preloader.preloadSectionAssets(sectionId);
      }

      // Actualizar estado actual
      this.state.current = sectionId;

      // Ejecutar transición visual
      await SectionManager.mostrar(sectionId, shouldSkipAudio);

      // Manejar transición de audio
      if (this.state.previous && this.state.previous !== sectionId) {
        AudioManager.manejarTransicionSeccion(this.state.previous, sectionId);
      }

      console.log(`✓ Transición completada: ${sectionId}`);
    } catch (error) {
      console.error(`Error en transición a ${sectionId}:`, error);

      // Recuperación: intentar ir a intro
      if (sectionId !== "intro") {
        console.log("Recuperación: navegando a intro");
        this.state.current = this.state.previous; // Restaurar estado
        await this.navigateTo("intro", { replace: true });
      }
    } finally {
      this.state.isTransitioning = false;
      this.transitionLock = null;

      // Procesar cola
      this._processQueue();
    }
  }

  /**
   * Preparación especial para la sección de video
   */
  async _prepareVideoSection() {
    console.log("🎬 Preparando sección de video...");

    try {
      // Intentar precargar el video
      const video = await Preloader.preloadVideo("Final");

      if (!video) {
        throw new Error("Video no disponible");
      }

      console.log("✓ Video listo para reproducir");
    } catch (error) {
      console.warn("⚠️ Video no disponible, saltando a countdown:", error);

      // Si el video falla, ir directo a countdown
      await this.navigateTo("countdown", { replace: true });
      throw error; // Cancelar transición a 'final'
    }
  }

  /**
   * Procesa la cola de rutas pendientes
   */
  _processQueue() {
    if (this.state.queue.length > 0) {
      const nextRoute = this.state.queue.shift();
      console.log(`Procesando siguiente en cola: ${nextRoute}`);

      // Pequeño delay para evitar transiciones muy rápidas
      setTimeout(() => this._processRoute(nextRoute), 100);
    }
  }

  /**
   * Navega a una sección específica
   * @param {string} sectionId - ID de la sección
   * @param {Object} options - Opciones de navegación
   * @returns {Promise<void>}
   */
  async navigateTo(sectionId, options = {}) {
    const { replace = false, force = false } = options;

    // Validaciones
    if (!sectionId || typeof sectionId !== "string") {
      console.error("navigateTo: sectionId inválido");
      return Promise.reject(new Error("Invalid sectionId"));
    }

    if (!this._isValidSection(sectionId)) {
      console.error(`navigateTo: Sección "${sectionId}" no existe`);
      return Promise.reject(new Error(`Section ${sectionId} does not exist`));
    }

    // Evitar navegación redundante
    if (
      !force &&
      sectionId === this.state.current &&
      !this.state.isTransitioning
    ) {
      console.log(`Ya estamos en ${sectionId}`);
      return Promise.resolve();
    }

    console.log(
      `🧭 navigateTo: ${sectionId} (replace: ${replace}, force: ${force})`
    );

    // Limpiar cola si es navegación forzada
    if (force) {
      this.state.queue = [];
    }

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
            // Hash no cambió pero necesitamos navegar
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

  /**
   * Navega basándose en la configuración de rutas
   */
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

  /**
   * Maneja clicks en botones de acción
   */
  manejarClickBoton(boton, seccion) {
    const botones = [...seccion.querySelectorAll(".acciones button")];
    const indice = botones.indexOf(boton);

    if (indice === -1) {
      console.warn("No se pudo determinar el índice del botón");
      return false;
    }

    return this.navegarPorPosicion(seccion.id, indice);
  }

  /**
   * Maneja botones especiales (play, replay, etc.)
   */
  manejarBotonEspecial(target, seccion) {
    try {
      // Botón de play
      if (target.closest(".play-center button")) {
        this._manejarBotonPlay(seccion);
        return true;
      }

      // Botón de replay
      if (target.closest(".replay-button button")) {
        AudioManager.reproducirNarracion(seccion.id);
        return true;
      }

      // Botón de enviar (acertijos)
      if (target.closest(".send-button")) {
        const numero = seccion.id.match(/^acertijo(\d+)$/)?.[1];
        if (numero) {
          Validation.validarRespuesta(+numero);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error manejando botón especial:", error);
      return false;
    }
  }

  /**
   * Maneja el botón de play en intro
   */
  _manejarBotonPlay(seccion) {
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
        SectionManager._mostrarNarrativa(seccion);
      })
      .catch((error) => {
        console.error("Error iniciando audio:", error);
      });
  }

  /**
   * Continúa desde una explicación
   */
  continuarDesdeExplicacion(numeroExplicacion) {
    console.log(`Continuando desde explicacion${numeroExplicacion}`);

    const destinos = { 1: "acertijo2", 2: "acertijo3", 3: "final" };
    const destino = destinos[numeroExplicacion];

    if (!destino) {
      console.error(`No hay destino para explicacion${numeroExplicacion}`);
      return false;
    }

    return this.navigateTo(destino);
  }

  /**
   * Determina si debe saltar el audio
   */
  _shouldSkipAudio(sectionId, isInitial = false) {
    // Navegación inicial desde URL (excepto intro)
    if (isInitial && sectionId !== "intro") {
      return true;
    }

    // Intro sin play clickeado
    if (sectionId === "intro" && !AppState.playClickeado) {
      return true;
    }

    // Sección ya visitada
    if (AppState.seccionesVisitadas.has(sectionId)) {
      return true;
    }

    // Navegación directa sin contexto
    if (!AppState.playClickeado && sectionId !== "intro") {
      return true;
    }

    return false;
  }

  /**
   * Valida si una sección existe
   */
  _isValidSection(sectionId) {
    return (
      sectionId &&
      typeof sectionId === "string" &&
      CONFIG.textos.hasOwnProperty(sectionId) &&
      document.getElementById(sectionId) !== null
    );
  }

  /**
   * Obtiene la sección actual desde la URL
   */
  _getCurrentSectionFromURL() {
    const hash = window.location.hash.slice(1);
    return hash || "intro";
  }

  /**
   * Obtiene el estado actual del router
   */
  getState() {
    return {
      current: this.state.current,
      previous: this.state.previous,
      isTransitioning: this.state.isTransitioning,
      queueLength: this.state.queue.length,
      initialized: this.initialized,
    };
  }

  /**
   * Resetea el router (útil para testing)
   */
  reset() {
    this.state.isTransitioning = false;
    this.state.queue = [];
    this.transitionLock = null;
  }

  /**
   * Destruye el router
   */
  destroy() {
    window.removeEventListener("hashchange", this._handleHashChange);
    window.removeEventListener("popstate", this._handlePopState);
    this.reset();
    this.initialized = false;
    console.log("Router destruido");
  }
}

// Instancia única del router
const router = new Router();

// Export compatible con código existente
const Navigation = {
  init: () => router.init(),
  navigateTo: (...args) => router.navigateTo(...args),
  navegarPorPosicion: (...args) => router.navegarPorPosicion(...args),
  manejarClickBoton: (...args) => router.manejarClickBoton(...args),
  manejarBotonEspecial: (...args) => router.manejarBotonEspecial(...args),
  continuarDesdeExplicacion: (...args) =>
    router.continuarDesdeExplicacion(...args),
  getState: () => router.getState(),
  isValidSection: (id) => router._isValidSection(id),

  // Referencia directa al router
  router: router,
};
