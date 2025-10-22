// =============================
// MANEJADOR DE AUDIO OPTIMIZADO
// =============================
const AudioManager = {
  audioFondo: null,
  audioFondoFinal: null,
  audiosNarracion: null,
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

  async reproducirFondo() {
    if (!this.audioFondo || AppState.fondoIniciado) return;

    try {
      this.audioFondo.volume = 0;
      await this.audioFondo.play();
      AppState.fondoIniciado = true;

      this._fade(
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

  async reproducirFondoFinal() {
    if (!this.audioFondoFinal || AppState.fondoFinalIniciado) return;

    try {
      await this._stopMainBackground();

      this.audioFondoFinal.volume = 0;
      await this.audioFondoFinal.play();
      AppState.fondoFinalIniciado = true;

      this._fade(
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

  async _stopMainBackground() {
    if (!this.audioFondo || !AppState.fondoIniciado) return;

    return new Promise((resolve) => {
      this._fade(
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

  async _stopFinalBackground() {
    if (!this.audioFondoFinal || !AppState.fondoFinalIniciado) return;

    return new Promise((resolve) => {
      this._fade(
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

  detenerTodosLosAudios() {
    console.log("Deteniendo todos los audios");
    this.detenerNarraciones();
    this._stopMainBackground();
    this._stopFinalBackground();
  },

  saltarSeccion() {
    if (!AppState.seccionActiva || !AppState.audioReproduciendo) return;

    this.detenerNarraciones();
    SectionManager.mostrarControles(AppState.seccionActiva.id);
    this._showSkipFeedback();
  },

  _showSkipFeedback() {
    const feedback = document.createElement("div");
    feedback.textContent = CONFIG.mensajes.saltarNarracion;
    feedback.className = "skip-feedback";

    document.body.appendChild(feedback);
    setTimeout(() => feedback.classList.add("show"), 10);
    setTimeout(() => {
      feedback.classList.remove("show");
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  },

  async reproducirNarracion(id) {
    console.log(`🔊 Reproduciendo narración: ${id}`);

    // CRÍTICO: Nunca reproducir audio para video
    if (id === "final") {
      console.log("Sección final es video, no hay narración");
      return;
    }

    // CRÍTICO: Prevenir doble reproducción del countdown
    if (id === "countdown" && this.currentNarration?.id === `audio-${id}`) {
      console.log("⚠️ Audio de countdown ya reproduciéndose, ignorando");
      return;
    }

    this.detenerNarraciones();
    await this._startAppropriateBackground(id);
    await this._playSection(id);
  },

  async _startAppropriateBackground(id) {
    const isFinal = ["final", "countdown"].includes(id);

    if (isFinal) {
      if (!AppState.fondoFinalIniciado) await this.reproducirFondoFinal();
    } else {
      if (!AppState.fondoIniciado) await this.reproducirFondo();
    }
  },

  async _playSection(id) {
    const bgVolume = this._getBackgroundVolume(id);
    this._quickFade(bgVolume, id);

    const audio = DOM.get(`audio-${id}`);

    if (!audio) {
      console.warn(`Audio para ${id} no encontrado`);
      setTimeout(() => SectionManager.mostrarControles(id), 1000);
      return;
    }

    // CRÍTICO: Verificar si ya está reproduciéndose
    if (!audio.paused && audio.currentTime > 0) {
      console.log(`⚠️ Audio ${id} ya está reproduciéndose, ignorando`);
      return;
    }

    try {
      audio.currentTime = 0;
      audio.volume = CONFIG.audio.volumenNarracion;
      AppState.audioReproduciendo = true;

      const finish = () => this._finishAudio(id);

      audio.onended = null;
      audio.onerror = null;
      audio.onended = finish;
      audio.onerror = (error) => {
        console.warn(`Error reproduciendo audio ${id}:`, error);
        finish();
      };

      await audio.play();
      AppState.audioActual = audio;
      this.currentNarration = audio;

      console.log(`✓ Narración ${id} reproduciendo`);
    } catch (error) {
      console.warn(`Error al intentar reproducir audio ${id}:`, error);
      this._finishAudio(id);
    }
  },

  _quickFade(targetVolume, id) {
    const activeBg = this._getActiveBackground(id);
    if (!activeBg) return;

    this._fade(
      activeBg,
      activeBg.volume,
      targetVolume,
      CONFIG.audio.duracionFadeRapido
    );
  },

  _getActiveBackground(id) {
    const isFinal = ["final", "countdown"].includes(id);

    if (isFinal && AppState.fondoFinalIniciado) {
      return this.audioFondoFinal;
    } else if (AppState.fondoIniciado) {
      return this.audioFondo;
    }

    return null;
  },

  _getBackgroundVolume(id) {
    const special = {
      final: CONFIG.audio.volumenFondoMudo,
      final2: CONFIG.audio.volumenFondoMudo,
      countdown: CONFIG.audio.volumenFondoMudo,
    };

    return special[id] !== undefined
      ? special[id]
      : CONFIG.audio.volumenFondoBajo;
  },

  _finishAudio(id) {
    AppState.audioReproduciendo = false;
    AppState.audioActual = null;
    this.currentNarration = null;

    const targetVolume = this._getNormalVolume(id);
    const activeBg = this._getActiveBackground(id);

    if (activeBg) {
      this._fade(
        activeBg,
        activeBg.volume,
        targetVolume,
        CONFIG.audio.duracionFadeIn
      );
    }

    SectionManager.mostrarControles(id);
  },

  _getNormalVolume(id) {
    return ["final", "countdown"].includes(id)
      ? CONFIG.audio.volumenFondoFinalNormal
      : CONFIG.audio.volumenFondoNormal;
  },

  detenerNarraciones() {
    console.log("Deteniendo narraciones");

    this.audiosNarracion.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        audio.onended = null;
        audio.onerror = null;
      }
    });

    if (AppState.audioActual) {
      if (AppState.audioActual.tagName === "VIDEO") {
        AppState.audioActual.pause();
        AppState.audioActual.currentTime = 0;
        AppState.audioActual._isPlaying = false;
      } else if (AppState.audioActual.tagName === "AUDIO") {
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

  _fade(audio, start, end, duration, callback) {
    if (!audio) {
      callback?.();
      return;
    }

    const key = audio.id || "unnamed";
    if (this.fadeIntervals.has(key)) {
      clearInterval(this.fadeIntervals.get(key));
    }

    const steps = Math.max(20, Math.min(50, duration / 20));
    const stepTime = duration / steps;
    const change = (end - start) / steps;
    let current = start;
    let count = 0;

    const interval = setInterval(() => {
      current = Math.max(0, Math.min(1, current + change));
      audio.volume = current;
      count++;

      const done =
        count >= steps ||
        (change > 0 && current >= end) ||
        (change < 0 && current <= end);

      if (done) {
        audio.volume = Math.max(0, Math.min(1, end));
        clearInterval(interval);
        this.fadeIntervals.delete(key);
        callback?.();
      }
    }, stepTime);

    this.fadeIntervals.set(key, interval);
  },

  manejarTransicionSeccion(anterior, nueva) {
    console.log(`Transición audio: ${anterior} → ${nueva}`);

    const toFinal = ["final", "countdown"].includes(nueva);
    const fromFinal = ["final", "countdown"].includes(anterior);

    if (toFinal && !fromFinal) {
      if (nueva === "final") {
        console.log("Transición a final - NO iniciar audio (video lo maneja)");
      } else {
        this.reproducirFondoFinal();
      }
    } else if (!toFinal && fromFinal) {
      this.detenerTodosLosAudios();
      this.reproducirFondo();
    }
  },

  cleanup() {
    this.fadeIntervals.forEach((interval) => clearInterval(interval));
    this.fadeIntervals.clear();
    this.detenerTodosLosAudios();
  },
};
