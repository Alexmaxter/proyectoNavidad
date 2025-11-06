import config from "./config.js";

/**
 * audio-manager.js: El Sonidista
 */
const AudioManager = {
  _bgmEl: null,
  _bgmFinalEl: null,
  _narrationEl: null,
  _activeBGM: null,
  _fadeInterval: null,
  _callbacks: {},

  init(callbacks) {
    this._callbacks = callbacks || {};
    this._bgmEl = document.getElementById("audio-bgm");
    this._bgmFinalEl = document.getElementById("audio-bgm-final");
    this._narrationEl = document.getElementById("audio-narration");

    this._bgmEl.src = config.global.audioBGM;
    this._bgmFinalEl.src = config.global.audioBGMFinal;
    this._narrationEl.volume = config.audio.volumenNarracion;

    this._narrationEl.addEventListener("ended", () => this._onNarrationEnded());
    this._narrationEl.addEventListener("error", () => this._onNarrationEnded());

    console.log("[Audio.js] AudioManager: Listo.");
  },

  // --- FUNCIÓN MODIFICADA ---
  // Ahora solo se encarga de reproducir la BGM principal.
  playBGM() {
    this._bgmEl.volume = config.audio.volumenFondoNormal;
    this._bgmEl
      .play()
      .catch((e) => console.warn("playBGM() bloqueado por el navegador:", e));
    this._activeBGM = this._bgmEl;
  },

  // --- FUNCIÓN MODIFICADA ---
  // Ahora solo se encarga de reproducir la BGM final.
  playBGMFinal() {
    this._bgmFinalEl.volume = config.audio.volumenFondoFinal;
    this._bgmFinalEl
      .play()
      .catch((e) =>
        console.warn("playBGMFinal() bloqueado por el navegador:", e)
      );
    this._activeBGM = this._bgmFinalEl;
  },

  playNarration(src) {
    if (!src) {
      console.warn("AudioManager: No se proporcionó 'src' para la narración.");
      this._onNarrationEnded();
      return;
    }

    if (this._activeBGM) {
      this._fadeAudio(
        this._activeBGM,
        config.audio.volumenFondoBajo,
        config.audio.duracionFadeOut
      );
    }

    this._narrationEl.src = src;
    this._narrationEl.play().catch((e) => {
      console.error("Error al reproducir narración (¿archivo faltante?):", e);
      this._onNarrationEnded();
    });
  },

  stopNarration() {
    this._stopAudio(this._narrationEl);
    this._onNarrationEnded();
  },

  // --- NUEVA FUNCIÓN ---
  /**
   * Detiene AMBAS músicas de fondo (BGM)
   */
  stopAllBGM() {
    console.log("[Audio.js] Deteniendo TODAS las BGMs.");
    this._stopAudio(this._bgmEl);
    this._stopAudio(this._bgmFinalEl);
    this._activeBGM = null;
  },

  stopAll() {
    this.stopAllBGM();
    this._stopAudio(this._narrationEl);
    if (this._fadeInterval) {
      clearInterval(this._fadeInterval);
    }
  },

  _onNarrationEnded() {
    if (this._activeBGM) {
      const targetVolume =
        this._activeBGM === this._bgmEl
          ? config.audio.volumenFondoNormal
          : config.audio.volumenFondoFinal;
      this._fadeAudio(
        this._activeBGM,
        targetVolume,
        config.audio.duracionFadeIn
      );
    }

    if (this._callbacks.onNarrationEnd) {
      this._callbacks.onNarrationEnd();
    }
  },

  _stopAudio(element) {
    if (element) {
      element.pause();
      element.currentTime = 0;
    }
  },

  _fadeAudio(element, targetVolume, duration) {
    // ... (El código de _fadeAudio es idéntico) ...
    if (this._fadeInterval) {
      clearInterval(this._fadeInterval);
    }
    const startVolume = element.volume;
    if (startVolume === targetVolume) return;
    const steps = 50;
    const stepTime = duration / steps;
    const volumeStep = (targetVolume - startVolume) / steps;
    this._fadeInterval = setInterval(() => {
      let newVolume = element.volume + volumeStep;
      if (
        (volumeStep > 0 && newVolume >= targetVolume) ||
        (volumeStep < 0 && newVolume <= targetVolume)
      ) {
        element.volume = targetVolume;
        clearInterval(this._fadeInterval);
        this._fadeInterval = null;
      } else {
        element.volume = newVolume;
      }
    }, stepTime);
  },
};

export default AudioManager;
