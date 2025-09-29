// =============================
// MANEJADOR DE ERRORES PARA GITHUB PAGES
// =============================
const ErrorHandler = {
  errorCount: 0,
  maxErrors: 5,

  init() {
    // Manejar errores específicos de GitHub Pages
    this._configurarManejadoresError();
    this._configurarFallbacksRecursos();
  },

  _configurarManejadoresError() {
    // Error general de JavaScript
    window.addEventListener("error", (event) => {
      this._manejarError("JavaScript Error", event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Promesas rechazadas
    window.addEventListener("unhandledrejection", (event) => {
      this._manejarError("Unhandled Promise Rejection", event.reason);
      event.preventDefault();
    });

    // Errores de recursos (imágenes, videos, audios)
    window.addEventListener(
      "error",
      (event) => {
        if (event.target !== window) {
          this._manejarErrorRecurso(event);
        }
      },
      true
    );
  },

  _configurarFallbacksRecursos() {
    // Verificar recursos críticos después de la carga
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        this._verificarRecursosCriticos();
      }, 1000);
    });
  },

  _manejarError(tipo, error, detalles = {}) {
    this.errorCount++;

    const errorInfo = {
      tipo,
      mensaje: error?.message || error?.toString() || "Error desconocido",
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...detalles,
    };

    console.error(`[ErrorHandler] ${tipo}:`, errorInfo);

    // Si hay demasiados errores, activar modo seguro
    if (this.errorCount >= this.maxErrors) {
      this._activarModoSeguro();
    }

    // Intentar recuperación específica según el tipo de error
    this._intentarRecuperacion(tipo, error);
  },

  _manejarErrorRecurso(event) {
    const elemento = event.target;
    const tipo = elemento.tagName.toLowerCase();
    const src = elemento.src || elemento.href;

    console.warn(`Error cargando ${tipo}: ${src}`);

    // Fallbacks específicos según el tipo de recurso
    switch (tipo) {
      case "audio":
        this._manejarErrorAudio(elemento);
        break;
      case "video":
        this._manejarErrorVideo(elemento);
        break;
      case "script":
        this._manejarErrorScript(elemento);
        break;
      case "link":
        this._manejarErrorCSS(elemento);
        break;
      default:
        console.warn(`No hay fallback para ${tipo}`);
    }
  },

  _manejarErrorAudio(elemento) {
    console.log("Aplicando fallback para audio fallido");

    // Marcar como no disponible en AudioManager
    const audioId = elemento.id;
    if (audioId && window.AudioManager) {
      console.warn(`Audio ${audioId} no disponible, deshabilitando`);
      // Podrías agregar una flag en AudioManager para manejar audios faltantes
    }
  },

  _manejarErrorVideo(elemento) {
    console.log("Aplicando fallback para video fallido");

    if (elemento.id === "final-video") {
      // Si el video final falla, navegar directamente a countdown
      console.warn("Video final no disponible, saltando a countdown");
      setTimeout(() => {
        if (window.Navigation) {
          Navigation.navigateTo("countdown");
        }
      }, 1000);
    }
  },

  _manejarErrorScript(elemento) {
    const src = elemento.src;
    console.error(`Script crítico fallido: ${src}`);

    // Si es un script crítico, mostrar mensaje de error
    if (src.includes("main.js") || src.includes("config.js")) {
      this._mostrarErrorCritico("Scripts esenciales no se pudieron cargar");
    }
  },

  _manejarErrorCSS(elemento) {
    const href = elemento.href;
    console.warn(`CSS fallido: ${href}`);

    // Aplicar estilos básicos de fallback
    if (href.includes("style.css")) {
      this._aplicarEstilosBasicos();
    }
  },

  _aplicarEstilosBasicos() {
    const style = document.createElement("style");
    style.textContent = `
      body { 
        font-family: Arial, sans-serif; 
        background: #000; 
        color: #fff; 
        margin: 0; 
        padding: 20px;
      }
      .section { display: none; }
      .section.active { display: block; }
      button { 
        background: #333; 
        color: #fff; 
        border: none; 
        padding: 10px 20px; 
        border-radius: 5px; 
        cursor: pointer; 
        margin: 10px;
      }
      button:hover { background: #555; }
      .error-message {
        background: #ff4444;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
    console.log("Estilos de fallback aplicados");
  },

  _verificarRecursosCriticos() {
    const recursosCriticos = [
      { id: "bokehCanvas", tipo: "canvas", nombre: "Canvas de efectos" },
      { id: "audio-fondo", tipo: "audio", nombre: "Audio de fondo" },
      { id: "final-video", tipo: "video", nombre: "Video final" },
    ];

    recursosCriticos.forEach(({ id, tipo, nombre }) => {
      const elemento = document.getElementById(id);
      if (!elemento) {
        console.warn(`Recurso crítico faltante: ${nombre} (${id})`);
        this._aplicarFallbackRecurso(id, tipo, nombre);
      }
    });

    // Verificar que las secciones principales existan
    const seccionesCriticas = ["intro", "decision", "final", "countdown"];
    seccionesCriticas.forEach((seccionId) => {
      if (!document.getElementById(seccionId)) {
        console.error(`Sección crítica faltante: ${seccionId}`);
        this._crearSeccionFallback(seccionId);
      }
    });
  },

  _aplicarFallbackRecurso(id, tipo, nombre) {
    switch (tipo) {
      case "canvas":
        // Crear canvas de reemplazo
        const canvas = document.createElement("canvas");
        canvas.id = id;
        canvas.style.cssText =
          "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;";
        document.body.appendChild(canvas);
        console.log(`Canvas de fallback creado: ${id}`);
        break;

      case "audio":
        // Crear elemento de audio vacío
        const audio = document.createElement("audio");
        audio.id = id;
        audio.style.display = "none";
        document.body.appendChild(audio);
        console.log(`Audio de fallback creado: ${id}`);
        break;

      case "video":
        // Para video, simplemente logear que no está disponible
        console.log(
          `Video ${nombre} no disponible, se saltará automáticamente`
        );
        break;
    }
  },

  _crearSeccionFallback(seccionId) {
    const seccion = document.createElement("div");
    seccion.id = seccionId;
    seccion.className = "section";
    seccion.innerHTML = `
      <div class="titulo"><h1>Sección ${seccionId}</h1></div>
      <div class="contenido">
        <div class="narrativa">
          <p>Esta sección no se pudo cargar correctamente.</p>
        </div>
      </div>
      <div class="controles">
        <div class="acciones">
          <button onclick="window.location.reload()">Recargar Página</button>
        </div>
      </div>
    `;
    document.body.appendChild(seccion);
    console.log(`Sección de fallback creada: ${seccionId}`);
  },

  _intentarRecuperacion(tipo, error) {
    switch (tipo) {
      case "JavaScript Error":
        if (error?.message?.includes("AudioManager")) {
          this._deshabilitarAudio();
        } else if (error?.message?.includes("Navigation")) {
          this._configurarNavegacionBasica();
        }
        break;

      case "Unhandled Promise Rejection":
        if (
          error?.toString()?.includes("audio") ||
          error?.toString()?.includes("play")
        ) {
          console.log("Error de audio detectado, continuando sin audio");
          this._deshabilitarAudio();
        }
        break;
    }
  },

  _deshabilitarAudio() {
    console.log("Deshabilitando sistema de audio...");

    // Crear AudioManager de fallback
    window.AudioManager = {
      init: () => {},
      reproducirFondo: () => Promise.resolve(),
      reproducirNarracion: () => Promise.resolve(),
      detenerTodosLosAudios: () => {},
      saltarSeccion: () => {},
      fadeVolumenFondo: () => {},
      manejarTransicionSeccion: () => {},
      iniciarAudioNavidadConVideo: () => {},
    };

    console.log("AudioManager de fallback instalado");
  },

  _configurarNavegacionBasica() {
    console.log("Configurando navegación básica de fallback...");

    // Navegación simple sin router complejo
    window.Navigation = {
      navigateTo: (seccionId) => {
        console.log(`Navegación básica a: ${seccionId}`);

        // Ocultar todas las secciones
        document.querySelectorAll(".section").forEach((s) => {
          s.classList.remove("active");
        });

        // Mostrar la sección objetivo
        const seccion = document.getElementById(seccionId);
        if (seccion) {
          seccion.classList.add("active");
          return Promise.resolve();
        } else {
          console.error(`Sección ${seccionId} no encontrada`);
          return Promise.reject(new Error(`Section not found: ${seccionId}`));
        }
      },

      manejarClickBoton: (boton, seccion) => {
        // Navegación básica basada en botones
        const botones = [...seccion.querySelectorAll(".acciones button")];
        const indice = botones.indexOf(boton);

        const rutas = {
          intro: { 0: "decision" },
          decision: { 0: "confirmacion1", 1: "acertijo1" },
          confirmacion1: { 0: "confirmacion2", 1: "decision" },
          confirmacion2: { 0: "final2", 1: "decision" },
          acertijo1: { success: "explicacion1" },
          explicacion1: { 0: "acertijo2" },
          acertijo2: { success: "explicacion2" },
          explicacion2: { 0: "acertijo3" },
          acertijo3: { success: "explicacion3" },
          explicacion3: { 0: "countdown" },
          final: { 0: "countdown" },
        };

        const destino = rutas[seccion.id]?.[indice];
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

    console.log("Navegación de fallback configurada");
  },

  _activarModoSeguro() {
    console.warn("Activando modo seguro debido a múltiples errores");

    // Detener todos los sistemas complejos
    this._deshabilitarAudio();
    this._configurarNavegacionBasica();

    // Mostrar mensaje de modo seguro
    const mensaje = document.createElement("div");
    mensaje.className = "error-message";
    mensaje.innerHTML = `
      <strong>Modo Seguro Activado</strong><br>
      La aplicación está funcionando con funcionalidad limitada debido a errores técnicos.
      <br><br>
      <button onclick="window.location.reload()">Recargar Página</button>
    `;

    // Insertar al inicio del body
    document.body.insertBefore(mensaje, document.body.firstChild);

    // Simplificar la interfaz
    this._simplificarInterfaz();
  },

  _simplificarInterfaz() {
    // Remover elementos complejos que podrían causar problemas
    const elementosProblematicos = [
      "#bokehCanvas",
      ".vignette",
      "audio",
      "video",
    ];

    elementosProblematicos.forEach((selector) => {
      document.querySelectorAll(selector).forEach((elemento) => {
        elemento.style.display = "none";
      });
    });

    console.log("Interfaz simplificada para modo seguro");
  },

  _mostrarErrorCritico(mensaje) {
    document.body.innerHTML = `
      <div style="
        position: fixed; top: 50%; left: 50%; 
        transform: translate(-50%, -50%);
        background: #ff4444; color: #fff; 
        padding: 30px; border-radius: 10px;
        font-family: Arial, sans-serif;
        text-align: center; max-width: 500px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
      ">
        <h2>⚠️ Error Crítico</h2>
        <p>${mensaje}</p>
        <p style="font-size: 14px; opacity: 0.9; margin-top: 20px;">
          Esto puede deberse a problemas de conexión o carga de archivos en GitHub Pages.
        </p>
        <div style="margin-top: 20px;">
          <button onclick="window.location.reload()" 
                  style="background: #fff; color: #ff4444; border: none; 
                         padding: 12px 24px; border-radius: 5px; cursor: pointer;
                         font-weight: bold; margin: 0 10px;">
            Recargar Página
          </button>
          <button onclick="window.location.href = window.location.origin + window.location.pathname" 
                  style="background: rgba(255,255,255,0.2); color: #fff; border: 1px solid #fff; 
                         padding: 12px 24px; border-radius: 5px; cursor: pointer;
                         margin: 0 10px;">
            Ir al Inicio
          </button>
        </div>
      </div>
    `;
  },

  // Método para testing
  simularError(tipo = "test") {
    if (tipo === "test") {
      throw new Error("Error de prueba generado manualmente");
    }
  },
};

// Inicializar el manejador de errores tan pronto como sea posible
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ErrorHandler.init());
} else {
  ErrorHandler.init();
}
