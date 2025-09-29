// =============================
// HASH ROUTER OPTIMIZADO Y ROBUSTO
// =============================
class HashRouter {
  constructor() {
    this.isNavigating = false;
    this.pendingRoute = null;
    this.currentSection = null;
    this.routeQueue = [];
    this.initialized = false;
  }

  /**
   * Inicializa el sistema de routing por hash
   */
  init() {
    if (this.initialized) return;

    console.log("Inicializando HashRouter...");

    // Establecer sección inicial
    this.currentSection = this.getCurrentSection();

    // Configurar event listeners con opciones
    window.addEventListener("hashchange", (e) => this.handleHashChange(e), {
      passive: true,
    });
    window.addEventListener("popstate", (e) => this.handlePopState(e), {
      passive: true,
    });

    // Manejar carga inicial
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.handleInitialRoute()
      );
    } else {
      // DOM ya está listo
      setTimeout(() => this.handleInitialRoute(), 0);
    }

    this.initialized = true;
    console.log("HashRouter inicializado correctamente");
  }

  /**
   * Maneja la ruta inicial al cargar la página
   */
  handleInitialRoute() {
    const section = this.getCurrentSection();
    console.log(`Manejando ruta inicial: ${section}`);

    // Validar que la sección existe
    if (!this.isValidSection(section)) {
      console.warn(
        `Sección inicial ${section} no válida, redirigiendo a intro`
      );
      this.navigateTo("intro", { replace: true });
      return;
    }

    // Procesar ruta inicial
    this.processRoute(section, true);
  }

  /**
   * Maneja cambios en el hash
   */
  handleHashChange(event) {
    event.preventDefault();
    const newSection = this.getCurrentSection();

    console.log(`Hash cambió a: ${newSection}`);

    // Evitar procesar la misma ruta múltiples veces
    if (newSection === this.currentSection && !this.pendingRoute) {
      console.log("Misma sección, ignorando cambio");
      return;
    }

    this.processRoute(newSection);
  }

  /**
   * Maneja eventos de popstate (botón atrás/adelante)
   */
  handlePopState(event) {
    console.log("PopState detectado");
    const section = this.getCurrentSection();
    this.processRoute(section);
  }

  /**
   * Procesa una ruta de manera robusta
   */
  async processRoute(section, isInitial = false) {
    // Validar sección
    if (!this.isValidSection(section)) {
      console.error(`Sección ${section} no válida`);
      if (!isInitial) {
        this.navigateTo("intro", { replace: true });
      }
      return;
    }

    // Si ya estamos navegando, encolar la ruta
    if (this.isNavigating) {
      console.log(`Encolando ruta: ${section}`);
      this.routeQueue.push(section);
      return;
    }

    try {
      this.isNavigating = true;
      this.pendingRoute = section;

      console.log(`Procesando ruta: ${section}`);

      // Determinar si saltar audio
      const shouldSkipAudio = this.shouldSkipAudio(section, isInitial);

      // Actualizar sección actual antes de la navegación
      const previousSection = this.currentSection;
      this.currentSection = section;

      // Mostrar la sección
      await SectionManager.mostrar(section, shouldSkipAudio);

      console.log(
        `Ruta procesada exitosamente: ${previousSection} -> ${section}`
      );
    } catch (error) {
      console.error(`Error procesando ruta ${section}:`, error);

      // Intentar recuperación
      if (section !== "intro") {
        console.log("Intentando recuperación navegando a intro");
        this.navigateTo("intro", { replace: true });
      }
    } finally {
      this.isNavigating = false;
      this.pendingRoute = null;

      // Procesar siguiente ruta en cola si existe
      this.processNextInQueue();
    }
  }

  /**
   * Procesa la siguiente ruta en la cola
   */
  processNextInQueue() {
    if (this.routeQueue.length > 0) {
      const nextRoute = this.routeQueue.shift();
      console.log(`Procesando siguiente ruta en cola: ${nextRoute}`);
      setTimeout(() => this.processRoute(nextRoute), 50);
    }
  }

  /**
   * Navega a una sección específica de manera robusta
   */
  navigateTo(sectionId, options = {}) {
    const { replace = false, force = false } = options;

    console.log(
      `NavigateTo: ${sectionId} (replace: ${replace}, force: ${force})`
    );

    // Validaciones
    if (!sectionId || typeof sectionId !== "string") {
      console.error("NavigateTo: sectionId debe ser un string válido");
      return Promise.reject(new Error("Invalid sectionId"));
    }

    if (!this.isValidSection(sectionId)) {
      console.error(`NavigateTo: Sección ${sectionId} no existe`);
      return Promise.reject(new Error(`Section ${sectionId} does not exist`));
    }

    // Evitar navegación redundante a menos que sea forzada
    if (!force && sectionId === this.currentSection && !this.pendingRoute) {
      console.log(`Ya estamos en ${sectionId}, evitando navegación redundante`);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        // Limpiar cola de rutas si es navegación forzada
        if (force) {
          this.routeQueue = [];
        }

        // Actualizar URL
        const newHash = `#${sectionId}`;

        if (replace) {
          history.replaceState({ section: sectionId }, "", newHash);
          // Disparar manualmente el cambio si es replace
          setTimeout(() => this.processRoute(sectionId), 0);
        } else {
          // Verificar si el hash realmente va a cambiar
          if (window.location.hash !== newHash) {
            window.location.hash = sectionId;
          } else {
            // Forzar procesamiento si el hash no cambió pero necesitamos navegar
            setTimeout(() => this.processRoute(sectionId), 0);
          }
        }

        resolve();
      } catch (error) {
        console.error(`Error en navigateTo(${sectionId}):`, error);
        reject(error);
      }
    });
  }

  /**
   * Determina si debe saltar el audio basado en el contexto
   */
  shouldSkipAudio(section, isInitial = false) {
    // Para navegación inicial desde URL
    if (isInitial && section !== "intro") {
      return true;
    }

    // Para intro: solo reproducir audio si ya se presionó play
    if (section === "intro" && !AppState.playClickeado) {
      return true;
    }

    // Saltar audio si regresamos a una sección ya visitada
    if (AppState.seccionesVisitadas.has(section)) {
      return true;
    }

    // Saltar audio si es navegación directa sin contexto previo
    if (!AppState.playClickeado && section !== "intro") {
      return true;
    }

    return false;
  }

  /**
   * Verifica si una sección es válida
   */
  isValidSection(sectionId) {
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
  getCurrentSection() {
    const hash = window.location.hash.slice(1);
    return hash || "intro";
  }

  /**
   * Obtiene el estado actual del router
   */
  getState() {
    return {
      currentSection: this.currentSection,
      isNavigating: this.isNavigating,
      pendingRoute: this.pendingRoute,
      queueLength: this.routeQueue.length,
      initialized: this.initialized,
    };
  }

  /**
   * Limpia el estado del router (útil para testing)
   */
  reset() {
    this.isNavigating = false;
    this.pendingRoute = null;
    this.routeQueue = [];
    this.currentSection = null;
  }

  /**
   * Destructor para limpiar event listeners
   */
  destroy() {
    window.removeEventListener("hashchange", this.handleHashChange);
    window.removeEventListener("popstate", this.handlePopState);
    this.reset();
    this.initialized = false;
  }
}

// Crear instancia única del router
const hashRouter = new HashRouter();

// =============================
// NAVEGACIÓN OPTIMIZADA
// =============================
const Navigation = {
  // Referencia al router
  router: hashRouter,

  /**
   * Inicializa el sistema de navegación
   */
  init() {
    this.router.init();
  },

  /**
   * Navega a una sección específica con validaciones mejoradas
   */
  async navigateTo(sectionId, options = {}) {
    try {
      await this.router.navigateTo(sectionId, options);
      return true;
    } catch (error) {
      console.error(`Error en Navigation.navigateTo(${sectionId}):`, error);

      // Intentar navegación de fallback a intro
      if (sectionId !== "intro") {
        console.log("Intentando fallback a intro");
        try {
          await this.router.navigateTo("intro", { replace: true });
          return false;
        } catch (fallbackError) {
          console.error("Error en navegación de fallback:", fallbackError);
        }
      }
      return false;
    }
  },

  /**
   * Navega basándose en la configuración de rutas
   */
  navegarPorPosicion(seccionId, botonIndex) {
    const destino = CONFIG.navegacion[seccionId]?.[botonIndex];

    if (!destino) {
      console.warn(`No hay destino definido para ${seccionId}[${botonIndex}]`);
      return false;
    }

    console.log(
      `Navegando desde ${seccionId} índice ${botonIndex} hacia ${destino}`
    );
    return this.navigateTo(destino);
  },

  /**
   * Maneja el click en botones de acción
   */
  manejarClickBoton(boton, seccion) {
    const botones = [...seccion.querySelectorAll(".acciones button")];
    const indice = botones.indexOf(boton);

    if (indice === -1) {
      console.warn("No se pudo determinar el índice del botón");
      return false;
    }

    console.log(`Click en botón índice ${indice} de sección ${seccion.id}`);
    return this.navegarPorPosicion(seccion.id, indice);
  },

  /**
   * Maneja botones especiales con mejor control de errores
   */
  manejarBotonEspecial(target, seccion) {
    try {
      if (target.closest(".play-center button")) {
        this._manejarBotonPlay(seccion);
        return true;
      }

      if (target.closest(".replay-button button")) {
        AudioManager.reproducirNarracion(seccion.id);
        return true;
      }

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
  },

  /**
   * Maneja el botón de play en la sección intro
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
        console.error("Error iniciando audio después de play:", error);
      });
  },

  /**
   * Navegación desde explicaciones con validaciones mejoradas
   */
  continuarDesdeExplicacion(numeroExplicacion) {
    console.log(`Continuando desde explicacion${numeroExplicacion}`);

    const destinos = { 1: "acertijo2", 2: "acertijo3", 3: "final" };
    const destino = destinos[numeroExplicacion];

    if (!destino) {
      console.error(
        `No hay destino definido para explicacion${numeroExplicacion}`
      );
      return false;
    }

    // Validaciones especiales para sección final
    if (numeroExplicacion === 3 && destino === "final") {
      const seccionFinal = DOM.get("final");
      const video = DOM.get("final-video");

      if (!seccionFinal) {
        console.error(
          "Sección final no encontrada en DOM, navegando a countdown"
        );
        return this.navigateTo("countdown");
      }

      if (!video) {
        console.warn("Video no encontrado, navegando directamente a countdown");
        return this.navigateTo("countdown");
      }
    }

    console.log(`Navegando de explicacion${numeroExplicacion} a ${destino}`);
    return this.navigateTo(destino);
  },

  /**
   * Obtiene el estado actual de la navegación
   */
  getState() {
    return this.router.getState();
  },

  /**
   * Verifica si una sección es válida
   */
  isValidSection(sectionId) {
    return this.router.isValidSection(sectionId);
  },
};

// =============================
// MANEJADOR DE EVENTOS ACTUALIZADO
// =============================
const EventManager = {
  init() {
    this._configurarEventos();
  },

  _configurarEventos() {
    // Usar event delegation para mejor rendimiento
    document.addEventListener("click", (e) => this._manejarClic(e), {
      passive: false,
    });
    document.addEventListener("keydown", (e) => this._manejarTecla(e), {
      passive: false,
    });

    // Manejar errores globales de navegación
    window.addEventListener("error", this._manejarErrorGlobal.bind(this));
    window.addEventListener(
      "unhandledrejection",
      this._manejarPromiseRechazada.bind(this)
    );
  },

  _manejarClic(e) {
    const { target } = e;
    const { seccionActiva: seccion } = AppState;
    if (!seccion) return;

    try {
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
    } catch (error) {
      console.error("Error manejando click:", error);
    }
  },

  _manejarTecla({ key }) {
    try {
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
    } catch (error) {
      console.error("Error manejando tecla:", error);
    }
  },

  _manejarErrorGlobal(event) {
    console.error("Error global detectado:", event.error);
    // Podrías implementar telemetría aquí
  },

  _manejarPromiseRechazada(event) {
    console.error("Promise rechazada no manejada:", event.reason);
    event.preventDefault(); // Evita que aparezca en la consola del navegador
  },
};

// =============================
// APLICACIÓN PRINCIPAL ACTUALIZADA
// =============================
const App = {
  init() {
    try {
      const seccionIntro = DOM.get("intro");
      const canvas = DOM.get("bokehCanvas");

      if (!seccionIntro || !canvas) {
        throw new Error("Elementos esenciales no encontrados en el DOM");
      }

      console.log("Iniciando aplicación...");

      // Inicializar componentes en el orden correcto
      this._inicializarComponentes();
      this._configurarEstadoInicial();
      this._renderizarContenidoInicial();

      // IMPORTANTE: Inicializar navegación DESPUÉS de todo lo demás
      Navigation.init();

      // Marcar como cargado
      setTimeout(() => {
        document.body.classList.add("loaded");
        console.log("Aplicación completamente cargada");
      }, 100);

      // Función de depuración para desarrollo
      if (this._esEntornoDesarrollo()) {
        this._configurarHerramientasDesarrollo();
      }

      console.log("Aplicación inicializada correctamente");
    } catch (error) {
      console.error("Error fatal inicializando aplicación:", error);
      this._mostrarErrorFatal(error);
    }
  },

  _inicializarComponentes() {
    console.log("Inicializando componentes...");
    AudioManager.init();
    Bokeh.init();
    EventManager.init();
  },

  _configurarEstadoInicial() {
    console.log("Configurando estado inicial...");
    AppState.seccionActiva = DOM.get("intro");
    AppState.playClickeado = false;
    AppState.fondoIniciado = false;
    AppState.fondoFinalIniciado = false;
  },

  _renderizarContenidoInicial() {
    console.log("Renderizando contenido inicial...");
    Object.keys(CONFIG.textos).forEach((id) => {
      if (id === "final" || id === "countdown") return;
      try {
        ContentManager.render(id);
      } catch (error) {
        console.warn(`Error renderizando sección ${id}:`, error);
      }
    });
  },

  _esEntornoDesarrollo() {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.search.includes("debug=true")
    );
  },

  _configurarHerramientasDesarrollo() {
    // Funciones de depuración disponibles globalmente
    window.appDebug = {
      navegarA: (seccion) => Navigation.navigateTo(seccion),
      estadoRouter: () => Navigation.getState(),
      estadoApp: () => ({
        seccionActiva: AppState.seccionActiva?.id,
        playClickeado: AppState.playClickeado,
        fondoIniciado: AppState.fondoIniciado,
        seccionesVisitadas: [...AppState.seccionesVisitadas],
      }),
      reiniciarRouter: () => {
        Navigation.router.reset();
        Navigation.init();
      },
    };

    console.log("Herramientas de desarrollo disponibles en window.appDebug");
  },

  _mostrarErrorFatal(error) {
    // Mostrar error básico en la página si la aplicación no puede iniciarse
    document.body.innerHTML = `
      <div style="
        position: fixed; top: 50%; left: 50%; 
        transform: translate(-50%, -50%);
        background: #000; color: #fff; 
        padding: 20px; border-radius: 10px;
        font-family: Arial, sans-serif;
        text-align: center; max-width: 400px;
      ">
        <h2>Error de Carga</h2>
        <p>No se pudo inicializar la aplicación correctamente.</p>
        <p style="font-size: 12px; opacity: 0.7;">${error.message}</p>
        <button onclick="window.location.reload()" 
                style="margin-top: 15px; padding: 10px 20px; 
                       background: #333; color: #fff; border: none; 
                       border-radius: 5px; cursor: pointer;">
          Recargar Página
        </button>
      </div>
    `;
  },
};
