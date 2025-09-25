// =============================
// MANEJADOR DE AUDIO
// =============================
const AudioManager = {
  audioFondo: null,
  audiosNarracion: null,

  init() {
    this.audioFondo = DOM.get("audio-fondo");
    this.audiosNarracion = [...DOM.getAll("audio:not(#audio-fondo)")];
    if (this.audioFondo) {
      this.audioFondo.volume = CONFIG.audio.volumenFondoNormal;
    }
  },

  async reproducirFondo() {
    if (!this.audioFondo || AppState.fondoIniciado) return;
    try {
      this.audioFondo.volume = CONFIG.audio.volumenFondoNormal;
      await this.audioFondo.play();
      AppState.fondoIniciado = true;
    } catch (error) {
      console.warn("Error al iniciar audio de fondo:", error);
    }
  },

  detenerFondo() {
    if (!this.audioFondo || !AppState.fondoIniciado) return;
    Utils.fadeAudio(
      this.audioFondo,
      this.audioFondo.volume,
      0,
      CONFIG.audio.duracionFade,
      () => {
        this.audioFondo.pause();
        this.audioFondo.currentTime = 0;
        AppState.fondoIniciado = false;
      }
    );
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
    skipFeedback.style.cssText = `
      position: fixed; top: 20px; right: 20px; 
      background: rgba(0, 0, 0, 0.8); color: white; 
      padding: 10px 15px; border-radius: 5px; 
      font-size: 14px; z-index: 1000;
      pointer-events: none; opacity: 0;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(skipFeedback);
    setTimeout(() => (skipFeedback.style.opacity = "1"), 10);
    setTimeout(() => {
      skipFeedback.style.opacity = "0";
      setTimeout(() => skipFeedback.remove(), 300);
    }, 2000);
  },

  fadeVolumenFondo(volumenObjetivo) {
    if (!this.audioFondo) return;
    if (!AppState.fondoIniciado) {
      return this.reproducirFondo().then(() =>
        this.fadeVolumenFondo(volumenObjetivo)
      );
    }
    Utils.fadeAudio(
      this.audioFondo,
      this.audioFondo.volume,
      volumenObjetivo,
      CONFIG.audio.duracionFade / 2
    );
  },

  detenerNarraciones() {
    this.audiosNarracion.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    AppState.audioActual = null;
    AppState.audioReproduciendo = false;
    if (
      AppState.fondoIniciado &&
      !["final", "final2"].includes(AppState.seccionActiva?.id)
    ) {
      this.fadeVolumenFondo(CONFIG.audio.volumenFondoNormal);
    }
  },

  async reproducirNarracion(id) {
    this.detenerNarraciones();
    if (!AppState.fondoIniciado) await this.reproducirFondo();

    const volumenFondo = ["final", "final2"].includes(id)
      ? CONFIG.audio.volumenFondoMudo
      : CONFIG.audio.volumenFondoBajo;

    if (AppState.fondoIniciado) this.fadeVolumenFondo(volumenFondo);

    const audio = DOM.get(`audio-${id}`);
    if (!audio) return SectionManager.mostrarControles(id);

    try {
      audio.currentTime = 0;
      audio.volume = CONFIG.audio.volumenNarracion;
      AppState.audioReproduciendo = true;

      audio.onended = () => this._finalizarAudio(id);
      audio.onerror = () => this._finalizarAudio(id);

      await audio.play();
      AppState.audioActual = audio;
    } catch (error) {
      console.warn(`Error al reproducir audio ${id}:`, error);
      this._finalizarAudio(id);
    }
  },

  _finalizarAudio(id) {
    AppState.audioReproduciendo = false;
    if (!["final", "final2"].includes(id)) {
      this.fadeVolumenFondo(CONFIG.audio.volumenFondoNormal);
    }
    SectionManager.mostrarControles(id);
  },
};
