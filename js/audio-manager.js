// =============================
// MANEJADOR DE AUDIO MEJORADO Y ARREGLADO
// =============================
const AudioManager = {
  audioFondo: null,
  audioFondoFinal: null,
  audiobackground_video: null,
  audiosNarracion: null,

  init() {
    this.audioFondo = DOM.get("audio-fondo");
    this.audioFondoFinal = DOM.get("audio-fondo-final");
    this.audiobackground_video = DOM.get("audio-fondo-navidad");

    // Recopila todos los audios que no sean de fondo
    this.audiosNarracion = [
      ...DOM.getAll(
        "audio:not(#audio-fondo):not(#audio-fondo-final):not(#audio-fondo-navidad)"
      ),
    ];

    if (this.audioFondo) {
      this.audioFondo.volume = 0;
    }
    if (this.audioFondoFinal) {
      this.audioFondoFinal.volume = 0;
    }
    if (this.audiobackground_video) {
      this.audiobackground_video.volume = 0;
    }
  },

  async reproducirFondo() {
    if (!this.audioFondo || AppState.fondoIniciado) return;

    try {
      this.audioFondo.volume = 0;
      await this.audioFondo.play();
      AppState.fondoIniciado = true;
      console.log("Audio de fondo principal iniciado correctamente");

      this._fadeAudio(
        this.audioFondo,
        0,
        CONFIG.audio.volumenFondoNormal,
        CONFIG.audio.duracionFadeIn
      );
    } catch (error) {
      console.warn("Error al iniciar audio de fondo principal:", error);
    }
  },

  async reproducirFondoFinal() {
    if (!this.audioFondoFinal || AppState.fondoFinalIniciado) return;

    try {
      await this._detenerAudioFondoPrincipal();
      await this._detenerAudiobackground_video();

      this.audioFondoFinal.volume = 0;
      await this.audioFondoFinal.play();
      AppState.fondoFinalIniciado = true;
      console.log("Audio de fondo final iniciado correctamente");

      this._fadeAudio(
        this.audioFondoFinal,
        0,
        CONFIG.audio.volumenFondoFinalNormal,
        CONFIG.audio.duracionFadeIn
      );
    } catch (error) {
      console.warn("Error al iniciar audio de fondo final:", error);
    }
  },

  async reproducirbackground_video() {
    if (!this.audiobackground_video || AppState.background_videoIniciado)
      return;

    try {
      await this._detenerAudioFondoPrincipal();
      await this._detenerAudioFondoFinal();

      this.audiobackground_video.volume = 0;
      await this.audiobackground_video.play();
      AppState.background_videoIniciado = true;
      console.log("Audio de fondo navideño iniciado correctamente");

      this._fadeAudio(
        this.audiobackground_video,
        0,
        CONFIG.audio.volumenbackground_videoBajo,
        CONFIG.audio.duracionFadeIn
      );
    } catch (error) {
      console.warn("Error al iniciar audio de fondo navideño:", error);
    }
  },

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

  async _detenerAudiobackground_video() {
    if (!this.audiobackground_video || !AppState.background_videoIniciado)
      return;

    return new Promise((resolve) => {
      this._fadeAudio(
        this.audiobackground_video,
        this.audiobackground_video.volume,
        0,
        CONFIG.audio.duracionFadeOut,
        () => {
          this.audiobackground_video.pause();
          this.audiobackground_video.currentTime = 0;
          AppState.background_videoIniciado = false;
          resolve();
        }
      );
    });
  },

  detenerFondo() {
    this._detenerAudioFondoPrincipal();
  },

  detenerFondoFinal() {
    this._detenerAudioFondoFinal();
  },

  detenerbackground_video() {
    this._detenerAudiobackground_video();
  },

  detenerTodosLosAudios() {
    console.log("=== DETENIENDO TODOS LOS AUDIOS ===");
    this.detenerNarraciones();
    this.detenerFondo();
    this.detenerFondoFinal();
    this.detenerbackground_video();
  },

  saltarSeccion() {
    if (!AppState.seccionActiva || !AppState.audioReproduciendo) return;

    this.detenerNarraciones();
    SectionManager.mostrarControles(AppState.seccionActiva.id);
    this._mostrarFeedbackSalto();
  },

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

  fadeVolumenFondo(volumenObjetivo, seccionId = null) {
    const esSeccionFinal = this._esSeccionConAudioFinalEspecifico(seccionId);
    const esSeccionVideo = seccionId === "final";

    let audioActivo, estadoActivo;

    if (esSeccionVideo && AppState.background_videoIniciado) {
      audioActivo = this.audiobackground_video;
      estadoActivo = AppState.background_videoIniciado;
    } else if (esSeccionFinal) {
      audioActivo = this.audioFondoFinal;
      estadoActivo = AppState.fondoFinalIniciado;
    } else {
      audioActivo = this.audioFondo;
      estadoActivo = AppState.fondoIniciado;
    }

    if (!audioActivo) return;

    if (!estadoActivo) {
      let metodoIniciar;
      if (esSeccionVideo) {
        metodoIniciar = () => this.reproducirbackground_video();
      } else if (esSeccionFinal) {
        metodoIniciar = () => this.reproducirFondoFinal();
      } else {
        metodoIniciar = () => this.reproducirFondo();
      }

      return metodoIniciar().then(() =>
        this.fadeVolumenFondo(volumenObjetivo, seccionId)
      );
    }

    if (Math.abs(audioActivo.volume - volumenObjetivo) < 0.01) return;

    this._fadeAudio(
      audioActivo,
      audioActivo.volume,
      volumenObjetivo,
      CONFIG.audio.duracionFade
    );
  },

  _esSeccionConAudioFinalEspecifico(seccionId) {
    return ["final", "countdown", "final2"].includes(seccionId);
  },

  async reproducirNarracion(id) {
    console.log(`=== REPRODUCIR NARRACIÓN LLAMADO PARA: ${id} ===`);

    // CRÍTICO: NUNCA reproducir audio para la sección "final" (video)
    if (id === "final") {
      console.log(
        "ADVERTENCIA: Se intentó reproducir narración para sección final con video. Ignorando."
      );
      return;
    }

    // Cuando inicie una narración cualquier otra narración deberá detenerse
    this.detenerNarraciones();

    // Para otras secciones, continuar lógica normal
    await this._iniciarAudioFondoApropiado(id);
    await this._reproducirAudioSeccion(id);
  },

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

  async _reproducirAudioSeccion(id) {
    const volumenFondo = this._obtenerVolumenFondoDuranteNarracion(id);
    this._fadeAudioRapido(volumenFondo, id);

    const audio = DOM.get(`audio-${id}`);
    if (!audio) {
      console.warn(`Audio para la sección ${id} no encontrado.`);
      return SectionManager.mostrarControles(id);
    }

    try {
      audio.currentTime = 0;
      audio.volume = CONFIG.audio.volumenNarracion;
      AppState.audioReproduciendo = true;

      const finalizarAudio = () => this._finalizarAudio(id);
      audio.onended = finalizarAudio;
      audio.onerror = finalizarAudio;

      await audio.play();
      AppState.audioActual = audio;
      console.log(`Audio de narración ${id} reproduciendo`);
    } catch (error) {
      console.warn(`Error al reproducir audio ${id}:`, error);
      this._finalizarAudio(id);
    }
  },

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

  _obtenerAudioFondoActivo(id) {
    const esSeccionFinal = this._esSeccionConAudioFinalEspecifico(id);

    if (esSeccionFinal && AppState.fondoFinalIniciado) {
      return this.audioFondoFinal;
    } else if (AppState.fondoIniciado) {
      return this.audioFondo;
    } else if (AppState.background_videoIniciado) {
      return this.audiobackground_video;
    }

    return null;
  },

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

  _finalizarAudio(id) {
    AppState.audioReproduciendo = false;
    AppState.audioActual = null;

    const volumenObjetivo = this._obtenerVolumenNormalParaSeccion(id);

    this._fadeAudio(
      this._obtenerAudioFondoActivo(id),
      this._obtenerAudioFondoActivo(id)?.volume || 0,
      volumenObjetivo,
      CONFIG.audio.duracionFadeIn
    );

    SectionManager.mostrarControles(id);
  },

  _obtenerVolumenNormalParaSeccion(id) {
    if (this._esSeccionConAudioFinalEspecifico(id)) {
      if (AppState.background_videoIniciado) {
        return CONFIG.audio.volumenbackground_videoBajo;
      }
      return CONFIG.audio.volumenFondoFinalNormal;
    }
    return CONFIG.audio.volumenFondoNormal;
  },

  detenerNarraciones() {
    console.log("Deteniendo todas las narraciones");
    this.audiosNarracion.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    if (AppState.audioActual && AppState.audioActual.tagName === "VIDEO") {
      AppState.audioActual.pause();
      AppState.audioActual.currentTime = 0;
    }
    AppState.audioReproduciendo = false;
    AppState.audioActual = null;
  },

  _fadeAudio(elementoAudio, volumenInicio, volumenFin, duracion, callback) {
    if (!elementoAudio) {
      callback?.();
      return;
    }

    if (elementoAudio._fadeInterval) {
      clearInterval(elementoAudio._fadeInterval);
    }

    const pasos = Math.max(20, Math.min(50, duracion / 20));
    const tiempoPaso = duracion / pasos;
    const cambio = (volumenFin - volumenInicio) / pasos;
    let volumenActual = volumenInicio;
    let conteo = 0;

    elementoAudio._fadeInterval = setInterval(() => {
      volumenActual = Math.max(0, Math.min(1, volumenActual + cambio));
      elementoAudio.volume = volumenActual;

      conteo++;

      const completado =
        conteo >= pasos ||
        (cambio > 0 && volumenActual >= volumenFin) ||
        (cambio < 0 && volumenActual <= volumenFin);

      if (completado) {
        elementoAudio.volume = Math.max(0, Math.min(1, volumenFin));
        clearInterval(elementoAudio._fadeInterval);
        elementoAudio._fadeInterval = null;
        callback?.();
      }
    }, tiempoPaso);
  },

  manejarTransicionSeccion(seccionAnterior, seccionNueva) {
    console.log(`Transición de audio: ${seccionAnterior} -> ${seccionNueva}`);

    const esTransicionAFinal = ["final", "countdown"].includes(seccionNueva);
    const esTransicionDesdeFinal = ["final", "countdown"].includes(
      seccionAnterior
    );

    if (esTransicionAFinal && !esTransicionDesdeFinal) {
      if (seccionNueva === "final") {
        console.log(
          "Transición a sección final - NO iniciar audio, el video lo manejará"
        );
        // NO iniciar ningún audio aquí
      } else {
        this.reproducirFondoFinal();
      }
    } else if (!esTransicionAFinal && esTransicionDesdeFinal) {
      this.detenerTodosLosAudios();
      this.reproducirFondo();
    }
  },

  iniciarAudioNavidadConVideo() {
    console.log("Iniciando audio navideño para el video...");
    this.reproducirbackground_video();
  },
};
