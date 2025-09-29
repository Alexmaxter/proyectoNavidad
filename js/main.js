// =============================
// MANEJADOR DE EVENTOS PRINCIPAL - ACTUALIZADO
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

  /**
   * Maneja todos los eventos de click de la aplicación
   * @param {Event} e - Evento de click
   */
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

  /**
   * Maneja eventos de teclado
   * @param {KeyboardEvent} e - Evento de teclado
   */
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

  /**
   * Maneja errores globales de JavaScript
   */
  _manejarErrorGlobal(event) {
    console.error("Error global detectado:", event.error);

    // Si es un error crítico de navegación, activar fallback
    if (
      event.error?.message?.includes("Navigation") ||
      event.error?.message?.includes("router")
    ) {
      console.warn("Error de navegación detectado, usando fallback");
      this._activarNavegacionSegura();
    }
  },

  /**
   * Maneja promesas rechazadas no capturadas
   */
  _manejarPromiseRechazada(event) {
    console.error("Promise rechazada no manejada:", event.reason);
    event.preventDefault(); // Evita que aparezca en la consola del navegador

    // Si es un error de audio, continuar sin audio
    if (
      event.reason?.toString()?.includes("audio") ||
      event.reason?.toString()?.includes("play")
    ) {
      console.warn("Error de audio detectado, continuando sin audio");
    }
  },

  /**
   * Activa un sistema de navegación básico en caso de errores
   */
  _activarNavegacionSegura() {
    if (window.Navigation?.navegacionSeguraActiva) return;

    console.log("Activando navegación segura...");

    // Crear navegación básica de emergencia
    const navegacionSegura = {
      navegacionSeguraActiva: true,

      navigateTo: (seccionId) => {
        console.log(`Navegación segura a: ${seccionId}`);

        // Ocultar todas las secciones
        document.querySelectorAll(".section").forEach((s) => {
          s.classList.remove("active");
        });

        // Mostrar la sección objetivo
        const seccion = document.getElementById(seccionId);
        if (seccion) {
          seccion.classList.add("active");
          AppState.seccionActiva = seccion;
          return Promise.resolve();
        } else {
          console.error(
            `Sección ${seccionId} no encontrada en navegación segura`
          );
          return Promise.reject(new Error(`Section not found: ${seccionId}`));
        }
      },

      manejarClickBoton: (boton, seccion) => {
        const botones = [...seccion.querySelectorAll(".acciones button")];
        const indice = botones.indexOf(boton);

        const rutas = CONFIG.navegacion[seccion.id];
        const destino = rutas?.[indice];

        if (destino) {
          this.navigateTo(destino);
        }
      },

      manejarBotonEspecial: () => false,
      continuarDesdeExplicacion: (num) => {
        const destinos = { 1: "acertijo2", 2: "acertijo3", 3: "countdown" };
        const destino = destinos[num];
        if (destino) this.navigateTo(destino);
      },
    };

    // Reemplazar Navigation con la versión segura
    Object.assign(window.Navigation, navegacionSegura);
    console.log("Navegación segura activada");
  },
};

// =============================
// APLICACIÓN PRINCIPAL - COMPLETA Y ACTUALIZADA
// =============================
const App = {
  /**
   * Inicializa toda la aplicación
   */
  init() {
    try {
      console.log("=== INICIANDO APLICACIÓN ===");

      // Verificar elementos esenciales
      const seccionIntro = DOM.get("intro");
      const canvas = DOM.get("bokehCanvas");

      if (!seccionIntro || !canvas) {
        throw new Error("Elementos esenciales no encontrados en el DOM");
      }

      console.log("Elementos esenciales verificados");

      // Inicializar componentes en el orden correcto
      this._inicializarComponentes();
      this._configurarEstadoInicial();
      this._renderizarContenidoInicial();

      // IMPORTANTE: Inicializar navegación DESPUÉS de todo lo demás
      this._inicializarNavegacion();

      // Marcar como cargado
      this._finalizarInicializacion();

      console.log("=== APLICACIÓN INICIALIZADA CORRECTAMENTE ===");
    } catch (error) {
      console.error("=== ERROR FATAL INICIALIZANDO APLICACIÓN ===", error);
      this._mostrarErrorFatal(error);
    }
  },

  /**
   * Inicializa todos los componentes necesarios
   */
  _inicializarComponentes() {
    console.log("Inicializando componentes...");

    try {
      // AudioManager - con manejo de errores
      if (window.AudioManager) {
        AudioManager.init();
        console.log("✓ AudioManager inicializado");
      } else {
        console.warn("AudioManager no disponible");
      }

      // Bokeh - con manejo de errores
      if (window.Bokeh) {
        Bokeh.init();
        console.log("✓ Bokeh inicializado");
      } else {
        console.warn("Bokeh no disponible");
      }

      // EventManager
      EventManager.init();
      console.log("✓ EventManager inicializado");
    } catch (error) {
      console.error("Error inicializando componentes:", error);
      // Continuar sin el componente que falló
    }
  },

  /**
   * Configura el estado inicial de la aplicación
   */
  _configurarEstadoInicial() {
    console.log("Configurando estado inicial...");

    AppState.seccionActiva = DOM.get("intro");
    AppState.playClickeado = false;
    AppState.fondoIniciado = false;
    AppState.fondoFinalIniciado = false;
    AppState.background_videoIniciado = false;
    AppState.seccionesVisitadas = new Set();
    AppState.audioReproduciendo = false;
    AppState.audioActual = null;
    AppState.temporizadorBotonFinal = null;
    AppState.seccionAnterior = null;

    console.log("✓ Estado inicial configurado");
  },

  /**
   * Renderiza el contenido inicial de todas las secciones
   */
  _renderizarContenidoInicial() {
    console.log("Renderizando contenido inicial...");

    let seccionesRenderizadas = 0;
    let erroresRenderizado = 0;

    Object.keys(CONFIG.textos).forEach((id) => {
      // Evitamos renderizar las secciones especiales que no tienen estructura normal
      if (id === "final" || id === "countdown") return;

      try {
        ContentManager.render(id);
        seccionesRenderizadas++;
      } catch (error) {
        console.warn(`Error renderizando sección ${id}:`, error);
        erroresRenderizado++;
      }
    });

    console.log(
      `✓ Contenido renderizado: ${seccionesRenderizadas} secciones, ${erroresRenderizado} errores`
    );
  },

  /**
   * Inicializa el sistema de navegación
   */
  _inicializarNavegacion() {
    console.log("Inicializando sistema de navegación...");

    try {
      if (window.Navigation && typeof Navigation.init === "function") {
        Navigation.init();
        console.log("✓ Sistema de navegación inicializado");
      } else {
        throw new Error("Navigation no está disponible");
      }
    } catch (error) {
      console.error("Error inicializando navegación:", error);
      this._configurarNavegacionBasica();
    }
  },

  /**
   * Configurar navegación básica como fallback
   */
  _configurarNavegacionBasica() {
    console.log("Configurando navegación básica de fallback...");

    window.Navigation = {
      init: () => {
        // Manejar hash inicial
        const seccionInicial = window.location.hash.slice(1) || "intro";
        this._mostrarSeccionBasica(seccionInicial);

        // Escuchar cambios de hash
        window.addEventListener("hashchange", () => {
          const seccion = window.location.hash.slice(1) || "intro";
          this._mostrarSeccionBasica(seccion);
        });
      },

      navigateTo: (seccionId) => {
        if (CONFIG.textos[seccionId] && document.getElementById(seccionId)) {
          window.location.hash = seccionId;
          return Promise.resolve();
        } else {
          console.error(`Sección ${seccionId} no válida`);
          return Promise.reject(new Error(`Invalid section: ${seccionId}`));
        }
      },

      manejarClickBoton: (boton, seccion) => {
        const botones = [...seccion.querySelectorAll(".acciones button")];
        const indice = botones.indexOf(boton);
        const destino = CONFIG.navegacion[seccion.id]?.[indice];

        if (destino) {
          this.navigateTo(destino);
        }
      },

      manejarBotonEspecial: (target, seccion) => {
        if (target.closest(".play-center button")) {
          this._manejarBotonPlay(seccion);
          return true;
        }
        return false;
      },

      continuarDesdeExplicacion: (num) => {
        const destinos = { 1: "acertijo2", 2: "acertijo3", 3: "final" };
        const destino = destinos[num];
        if (destino) this.navigateTo(destino);
      },

      _manejarBotonPlay: (seccion) => {
        const playCentro = seccion.querySelector(".play-center");
        if (playCentro) {
          playCentro.style.display = "none";
        }
        AppState.playClickeado = true;
        seccion.classList.add("show-content");

        if (window.AudioManager) {
          AudioManager.reproducirFondo()
            .then(() => {
              AudioManager.reproducirNarracion(seccion.id);
            })
            .catch(() => {
              console.log("Audio no disponible, continuando sin audio");
            });
        }
      },
    };

    // Función auxiliar para mostrar secciones
    this._mostrarSeccionBasica = (seccionId) => {
      document
        .querySelectorAll(".section")
        .forEach((s) => s.classList.remove("active"));
      const seccion = document.getElementById(seccionId);
      if (seccion) {
        seccion.classList.add("active");
        AppState.seccionActiva = seccion;
      }
    };

    console.log("✓ Navegación básica configurada");
  },

  /**
   * Finaliza la inicialización de la aplicación
   */
  _finalizarInicializacion() {
    // Marcar como cargado visualmente
    setTimeout(() => {
      document.body.classList.add("loaded");
      console.log("✓ Aplicación marcada como cargada");
    }, 100);

    // Configurar herramientas de desarrollo si es necesario
    if (this._esEntornoDesarrollo()) {
      this._configurarHerramientasDesarrollo();
    }

    // Mostrar información de estado
    this._mostrarEstadoInicial();
  },

  /**
   * Verifica si estamos en entorno de desarrollo
   */
  _esEntornoDesarrollo() {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.search.includes("debug=true")
    );
  },

  /**
   * Configura herramientas de desarrollo
   */
  _configurarHerramientasDesarrollo() {
    // Funciones de depuración disponibles globalmente
    window.appDebug = {
      // Navegación
      navegarA: (seccion) => Navigation.navigateTo(seccion),
      seccionActual: () => AppState.seccionActiva?.id,

      // Estados
      estadoApp: () => ({
        seccionActiva: AppState.seccionActiva?.id,
        playClickeado: AppState.playClickeado,
        fondoIniciado: AppState.fondoIniciado,
        seccionesVisitadas: [...AppState.seccionesVisitadas],
        audioReproduciendo: AppState.audioReproduciendo,
      }),

      // Audio
      probarAudio: () => {
        if (window.AudioManager) {
          AudioManager.reproducirFondo().then(() => {
            AudioManager.reproducirNarracion("intro");
          });
        }
      },

      silenciarAudio: () => {
        if (window.AudioManager) {
          AudioManager.detenerTodosLosAudios();
        }
      },

      // Utilidades
      reiniciar: () => window.location.reload(),
      irASeccion: (seccion) => {
        window.location.hash = seccion;
      },
    };

    console.log("🔧 Herramientas de desarrollo disponibles en window.appDebug");
    console.log(
      "Comandos: navegarA(seccion), estadoApp(), probarAudio(), etc."
    );
  },

  /**
   * Muestra información del estado inicial
   */
  _mostrarEstadoInicial() {
    const estado = {
      seccionActiva: AppState.seccionActiva?.id,
      hashURL: window.location.hash,
      audioDisponible: !!window.AudioManager,
      navegacionDisponible: !!window.Navigation,
      bokehDisponible: !!window.Bokeh,
    };

    console.log("📊 Estado inicial de la aplicación:", estado);
  },

  /**
   * Muestra error fatal cuando la aplicación no puede iniciarse
   */
  _mostrarErrorFatal(error) {
    console.error("Mostrando error fatal:", error);

    // Crear mensaje de error
    const errorHTML = `
      <div id="error-fatal" style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.9); color: #fff; 
        display: flex; align-items: center; justify-content: center;
        font-family: Arial, sans-serif; z-index: 10000;
      ">
        <div style="
          background: #ff4444; padding: 40px; border-radius: 15px;
          text-align: center; max-width: 500px; box-shadow: 0 0 30px rgba(255,68,68,0.5);
        ">
          <h2 style="margin: 0 0 20px 0; font-size: 24px;">⚠️ Error de Carga</h2>
          <p style="margin: 0 0 15px 0; font-size: 16px;">
            No se pudo inicializar la aplicación correctamente.
          </p>
          <p style="font-size: 14px; opacity: 0.9; margin: 0 0 25px 0;">
            ${error.message}
          </p>
          <p style="font-size: 12px; opacity: 0.7; margin: 0 0 30px 0;">
            Esto puede deberse a problemas de conexión o archivos faltantes en GitHub Pages.
          </p>
          <div>
            <button onclick="window.location.reload()" 
                    style="background: #fff; color: #ff4444; border: none; 
                           padding: 12px 24px; border-radius: 8px; cursor: pointer;
                           font-weight: bold; margin: 0 10px 0 0; font-size: 14px;">
              🔄 Recargar Página
            </button>
            <button onclick="window.location.href = window.location.origin + window.location.pathname" 
                    style="background: rgba(255,255,255,0.2); color: #fff; 
                           border: 1px solid rgba(255,255,255,0.5); 
                           padding: 12px 24px; border-radius: 8px; cursor: pointer;
                           margin: 0; font-size: 14px;">
              🏠 Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    `;

    // Insertar error en el DOM
    document.body.insertAdjacentHTML("beforeend", errorHTML);

    // Ocultar el contenido principal
    document
      .querySelectorAll(".section, #bokehCanvas, .vignette")
      .forEach((el) => {
        if (el && el.id !== "error-fatal") {
          el.style.display = "none";
        }
      });
  },
};
