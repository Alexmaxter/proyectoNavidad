// =============================
// MANEJADOR DE AUDIO SIMPLIFICADO
// =============================
const AudioManager = {
  // State machine
  state: "IDLE", // IDLE | PLAYING_BG | PLAYING_NARRATION

  // Referencias
  audioFondo: null,
  audioFondoFinal: null,
  audiosNarracion: null,

  // Control
  currentNarration: null,
  fadeIntervals: new Map(),

  init() {
    console.log("Inicializando AudioManager...");

    this.audioFondo = DOM.get("audio-fondo");
    this.audioFondoFinal = DOM.get("audio-fondo-final");
    this.audiosNarracion = [
      ...DOM.getAll("audio:not(#audio-fondo):not(#audio-fondo-final)"),
    ];

    if (this.audioFondo) this.audioFondo.volume = 0;
    if (this.audioFondoFinal) this.audioFondoFinal.volume = 0;

    console.log("✓ AudioManager inicializado");
  },

  /**
   * Reproduce audio de fondo principal
   */
  async reproducirFondo() {
    if (!this.audioFondo || AppState.fondoIniciado) {
      return;
    }

    try {
      this.audioFondo.volume = 0;
      await this.audioFondo.play();
      AppState.fondoIniciado = true;

      this._fadeAudio(
        this.audioFondo,
        0,
        CONFIG.audio.volumenFondoNormal,
        CONFIG.audio.duracionFadeIn
      );

      console.log("✓ Audio de fondo iniciado");
    } catch (error) {
      console.warn("Error iniciando audio de fondo:", error);
    }
  },

  /**
   * Reproduce audio de fondo final
   */
  async reproducirFondoFinal() {
    if (!this.audioFondoFinal || AppState.fondoFinalIniciado) {
      return;
    }

    try {
      // Detener audio de fondo principal primero
      await this._detenerAudioFondoPrincipal();

      this.audioFondoFinal.volume = 0;
      await this.audioFondoFinal.play();
      AppState.fondoFinalIniciado = true;

      this._fadeAudio(
        this.audioFondoFinal,
        0,
        CONFIG.audio.volumenFondoFinalNormal,
        CONFIG.audio.duracionFadeIn
      );

      console.log("✓ Audio de fondo final iniciado");
    } catch (error) {
      console.warn("Error iniciando audio de fondo final:", error);
    }
  },

  /**
   * Detiene audio de fondo principal
   */
  async _detenerAudioFondoPrincipal() {
    if (!this.audioFondo || !AppState.fondoIniciado) return;

    return new Promise((resolve) => {
      this._fadeAudio(
        this.audioFondo,
        this.audioFondo.volume,
        0,
        CONFIG.audio.duracionFadeOut,
        () => {
          this.audioFondo.pause();
          this.audioFondo.currentTime = 0;
          AppState.fondoIniciado = false;
          resolve();
        }
      );
    });
  },

  /**
   * Detiene audio de fondo final
   */
  async _detenerAudioFondoFinal() {
    if (!this.audioFondoFinal || !AppState.fondoFinalIniciado) return;

    return new Promise((resolve) => {
      this._fadeAudio(
        this.audioFondoFinal,
        this.audioFondoFinal.volume,
        0,
        CONFIG.audio.duracionFadeOut,
        () => {
          this.audioFondoFinal.pause();
          this.audioFondoFinal.currentTime = 0;
          AppState.fondoFinalIniciado = false;
          resolve();
        }
      );
    });
  },

  /**
   * Detiene todos los audios
   */
  detenerTodosLosAudios() {
    console.log("Deteniendo todos los audios");
    this.detenerNarraciones();
    this._detenerAudioFondoPrincipal();
    this._detenerAudioFondoFinal();
  },

  /**
   * Salta la narración actual
   */
  saltarSeccion() {
    if (!AppState.seccionActiva || !AppState.audioReproduciendo) return;

    this.detenerNarraciones();
    SectionManager.mostrarControles(AppState.seccionActiva.id);
    this._mostrarFeedbackSalto();
  },

  /**
   * Muestra feedback visual al saltar
   */
  _mostrarFeedbackSalto() {
    const skipFeedback = document.createElement("div");
    skipFeedback.textContent = CONFIG.mensajes.saltarNarracion;
    skipFeedback.className = "skip-feedback";

    document.body.appendChild(skipFeedback);
    setTimeout(() => skipFeedback.classList.add("show"), 10);
    setTimeout(() => {
      skipFeedback.classList.remove("show");
      setTimeout(() => skipFeedback.remove(), 300);
    }, 2000);
  },

  /**
   * Ajusta volumen de fondo con fade
   */
  fadeVolumenFondo(volumenObjetivo, seccionId = null) {
    const esSeccionFinal = this._esSeccionConAudioFinalEspecifico(seccionId);
    const audioActivo = esSeccionFinal ? this.audioFondoFinal : this.audioFondo;
    const estadoActivo = esSeccionFinal
      ? AppState.fondoFinalIniciado
      : AppState.fondoIniciado;

    if (!audioActivo) return;

    // Si no está iniciado, iniciar primero
    if (!estadoActivo) {
      const metodoIniciar = esSeccionFinal
        ? () => this.reproducirFondoFinal()
        : () => this.reproducirFondo();

      return metodoIniciar().then(() =>
        this.fadeVolumenFondo(volumenObjetivo, seccionId)
      );
    }

    // Ya está cerca del volumen objetivo
    if (Math.abs(audioActivo.volume - volumenObjetivo) < 0.01) return;

    this._fadeAudio(
      audioActivo,
      audioActivo.volume,
      volumenObjetivo,
      CONFIG.audio.duracionFade
    );
  },

  /**
   * Verifica si es sección con audio final
   */
  _esSeccionConAudioFinalEspecifico(seccionId) {
    return ["final", "countdown", "final2"].includes(seccionId);
  },

  /**
   * Reproduce narración de una sección
   */
  async reproducirNarracion(id) {
    console.log(`Reproduciendo narración: ${id}`);

    // CRÍTICO: Nunca reproducir audio para la sección "final" (video)
    if (id === "final") {
      console.log("Sección final es video, no reproducir narración");
      return;
    }

    // Detener cualquier narración previa
    this.detenerNarraciones();

    // Iniciar audio de fondo apropiado
    await this._iniciarAudioFondoApropiado(id);

    // Reproducir audio de la sección
    await this._reproducirAudioSeccion(id);
  },

  /**
   * Inicia el audio de fondo apropiado para la sección
   */
  async _iniciarAudioFondoApropiado(id) {
    const esSeccionFinal = this._esSeccionConAudioFinalEspecifico(id);

    if (esSeccionFinal) {
      if (!AppState.fondoFinalIniciado) {
        await this.reproducirFondoFinal();
      }
    } else {
      if (!AppState.fondoIniciado) {
        await this.reproducirFondo();
      }
    }
  },

  /**
   * Reproduce el audio específico de una sección
   */
  async _reproducirAudioSeccion(id) {
    // Bajar volumen de fondo
    const volumenFondo = this._obtenerVolumenFondoDuranteNarracion(id);
    this._fadeAudioRapido(volumenFondo, id);

    const audio = DOM.get(`audio-${id}`);

    if (!audio) {
      console.warn(`Audio para ${id} no encontrado`);
      // Esperar un poco antes de mostrar controles
      setTimeout(() => {
        SectionManager.mostrarControles(id);
      }, 1000);
      return;
    }

    try {
      audio.currentTime = 0;
      audio.volume = CONFIG.audio.volumenNarracion;
      AppState.audioReproduciendo = true;

      const finalizarAudio = () => this._finalizarAudio(id);

      // Limpiar listeners previos
      audio.onended = null;
      audio.onerror = null;

      // Configurar nuevos listeners
      audio.onended = finalizarAudio;
      audio.onerror = (error) => {
        console.warn(`Error reproduciendo audio ${id}:`, error);
        finalizarAudio();
      };

      await audio.play();
      AppState.audioActual = audio;
      this.currentNarration = audio;

      console.log(`✓ Narración ${id} reproduciendo`);
    } catch (error) {
      console.warn(`Error al intentar reproducir audio ${id}:`, error);
      this._finalizarAudio(id);
    }
  },

  /**
   * Fade rápido para transiciones
   */
  _fadeAudioRapido(volumenObjetivo, id) {
    const audioActivo = this._obtenerAudioFondoActivo(id);
    if (!audioActivo) return;

    this._fadeAudio(
      audioActivo,
      audioActivo.volume,
      volumenObjetivo,
      CONFIG.audio.duracionFadeRapido
    );
  },

  /**
   * Obtiene el audio de fondo activo
   */
  _obtenerAudioFondoActivo(id) {
    const esSeccionFinal = this._esSeccionConAudioFinalEspecifico(id);

    if (esSeccionFinal && AppState.fondoFinalIniciado) {
      return this.audioFondoFinal;
    } else if (AppState.fondoIniciado) {
      return this.audioFondo;
    }

    return null;
  },

  /**
   * Obtiene el volumen de fondo apropiado durante narración
   */
  _obtenerVolumenFondoDuranteNarracion(id) {
    const volumenesEspeciales = {
      final: CONFIG.audio.volumenFondoMudo,
      final2: CONFIG.audio.volumenFondoMudo,
      countdown: CONFIG.audio.volumenFondoMudo,
    };

    return volumenesEspeciales[id] !== undefined
      ? volumenesEspeciales[id]
      : CONFIG.audio.volumenFondoBajo;
  },

  /**
   * Finaliza la reproducción de audio
   */
  _finalizarAudio(id) {
    AppState.audioReproduciendo = false;
    AppState.audioActual = null;
    this.currentNarration = null;

    const volumenObjetivo = this._obtenerVolumenNormalParaSeccion(id);
    const audioActivo = this._obtenerAudioFondoActivo(id);

    if (audioActivo) {
      this._fadeAudio(
        audioActivo,
        audioActivo.volume,
        volumenObjetivo,
        CONFIG.audio.duracionFadeIn
      );
    }

    SectionManager.mostrarControles(id);
  },

  /**
   * Obtiene el volumen normal para una sección
   */
  _obtenerVolumenNormalParaSeccion(id) {
    if (this._esSeccionConAudioFinalEspecifico(id)) {
      return CONFIG.audio.volumenFondoFinalNormal;
    }
    return CONFIG.audio.volumenFondoNormal;
  },

  /**
   * Detiene todas las narraciones
   */
  detenerNarraciones() {
    console.log("Deteniendo narraciones");

    // Detener todos los audios de narración
    this.audiosNarracion.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        // Limpiar eventos
        audio.onended = null;
        audio.onerror = null;
      }
    });

    // Si hay un video reproduciéndose, detenerlo también
    if (AppState.audioActual) {
      if (AppState.audioActual.tagName === "VIDEO") {
        AppState.audioActual.pause();
        AppState.audioActual.currentTime = 0;
        AppState.audioActual._isPlaying = false;
      } else if (AppState.audioActual.tagName === "AUDIO") {
        // Es un audio de narración
        if (!AppState.audioActual.paused) {
          AppState.audioActual.pause();
          AppState.audioActual.currentTime = 0;
        }
        AppState.audioActual.onended = null;
        AppState.audioActual.onerror = null;
      }
    }

    AppState.audioReproduciendo = false;
    AppState.audioActual = null;
    this.currentNarration = null;

    console.log("✓ Narraciones detenidas");
  },

  /**
   * Función de fade mejorada con limpieza de intervalos
   */
  _fadeAudio(elementoAudio, volumenInicio, volumenFin, duracion, callback) {
    if (!elementoAudio) {
      callback?.();
      return;
    }

    // Limpiar fade anterior si existe
    const fadeKey = elementoAudio.id || "unnamed";
    if (this.fadeIntervals.has(fadeKey)) {
      clearInterval(this.fadeIntervals.get(fadeKey));
    }

    const pasos = Math.max(20, Math.min(50, duracion / 20));
    const tiempoPaso = duracion / pasos;
    const cambio = (volumenFin - volumenInicio) / pasos;
    let volumenActual = volumenInicio;
    let conteo = 0;

    const intervalo = setInterval(() => {
      volumenActual = Math.max(0, Math.min(1, volumenActual + cambio));
      elementoAudio.volume = volumenActual;

      conteo++;

      const completado =
        conteo >= pasos ||
        (cambio > 0 && volumenActual >= volumenFin) ||
        (cambio < 0 && volumenActual <= volumenFin);

      if (completado) {
        elementoAudio.volume = Math.max(0, Math.min(1, volumenFin));
        clearInterval(intervalo);
        this.fadeIntervals.delete(fadeKey);
        callback?.();
      }
    }, tiempoPaso);

    this.fadeIntervals.set(fadeKey, intervalo);
  },

  /**
   * Maneja transición entre secciones
   */
  manejarTransicionSeccion(seccionAnterior, seccionNueva) {
    console.log(`Transición audio: ${seccionAnterior} → ${seccionNueva}`);

    const esTransicionAFinal = ["final", "countdown"].includes(seccionNueva);
    const esTransicionDesdeFinal = ["final", "countdown"].includes(
      seccionAnterior
    );

    if (esTransicionAFinal && !esTransicionDesdeFinal) {
      if (seccionNueva === "final") {
        console.log("Transición a final - NO iniciar audio (video lo maneja)");
        // No iniciar audio aquí
      } else {
        this.reproducirFondoFinal();
      }
    } else if (!esTransicionAFinal && esTransicionDesdeFinal) {
      this.detenerTodosLosAudios();
      this.reproducirFondo();
    }
  },

  /**
   * Limpia todos los intervalos de fade
   */
  cleanup() {
    this.fadeIntervals.forEach((interval) => clearInterval(interval));
    this.fadeIntervals.clear();
    this.detenerTodosLosAudios();
  },
};
