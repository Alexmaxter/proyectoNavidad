// Usar los nombres de archivo correctos
import config from "./config.js";
import Router from "./router.js";
import Render from "./render.js";
import AudioManager from "./audio-manager.js";
import Countdown from "./countdown.js";
import Preloader from "./preloader.js";
import FirebaseManager from "./firebase-manager.js";

/**
 * app.js: El Orquestador
 */
const App = {
  _isAudioStarted: false,
  _currentSection: null,
  _activeBGMType: null,
  _skipNarrationFor: null,
  _isCriticalLoadingDone: false,
  _userMaxStep: 0,
  _userLastSection: "intro",
  _isExceptionNav: false,

  async init() {
    console.log("[App.js] 1. Proyecto Navidad: Iniciando...");

    const rootElement = document.getElementById("app-root");
    if (!rootElement) {
      return console.error("[App.js] ERROR FATAL: No se encontró #app-root.");
    }

    AudioManager.init({
      onNarrationEnd: this._handleNarrationEnd.bind(this),
    });

    Render.init(rootElement, {
      onNavigate: (sectionId) => Router.navigate(sectionId),
      onIntroPlay: this._handleIntroPlay.bind(this),
      onNavigateWithSkip: this._handleSpecialNavigation.bind(this),
      onAudioUnlocked: this._handleAudioUnlock.bind(this),
    });

    try {
      await FirebaseManager.init();
      console.log("[App.js] 2. Firebase autenticado.");

      const progress = await FirebaseManager.loadProgress();
      this._userMaxStep = progress.maxStep || 0;
      this._userLastSection = progress.lastSection || "intro";
      console.log(
        `[App.js] 3. Progreso máximo cargado: Step ${this._userMaxStep} (${this._userLastSection})`
      );
    } catch (error) {
      console.error(
        "[App.js] ERROR FATAL de Firebase. La app no puede continuar.",
        error
      );
      return;
    }

    Router.init((sectionId) => this.showSection(sectionId));
    console.log("[App.js] 4. Router inicializado.");

    this._preloadCriticalAssets();
  },

  async _preloadCriticalAssets() {
    console.log("[App.js] 3. Iniciando precarga de assets críticos...");
    const intro = config.sections.intro;
    const decision = config.sections.decision;
    const assetsToLoad = [
      { type: "image", src: intro.background },
      { type: "audio", src: intro.audio },
      { type: "image", src: decision.background },
      { type: "audio", src: decision.audio },
      { type: "audio", src: config.global.audioBGM },
    ];
    await Preloader.loadAssets(assetsToLoad);
    console.log("[App.js] 6. Assets críticos CARGADOS.");
    this._isCriticalLoadingDone = true;
    if (this._currentSection === "intro") {
      console.log("[App.js] 7. La intro ya estaba visible. Ocultando spinner.");
      Render.setIntroLoading(false);
    }
  },

  _preloadNextSections(sectionId) {
    const currentSection = config.sections[sectionId];
    if (!currentSection) return;
    let nextSectionIds = new Set();
    if (currentSection.onNavigate) {
      nextSectionIds.add(currentSection.onNavigate);
    }
    if (currentSection.onSuccess) {
      nextSectionIds.add(currentSection.onSuccess);
    }
    if (currentSection.buttons) {
      currentSection.buttons.forEach((btn) => nextSectionIds.add(btn.target));
    }
    let assetsToLoad = [];
    nextSectionIds.forEach((id) => {
      const data = config.sections[id];
      if (data) {
        if (data.background)
          assetsToLoad.push({ type: "image", src: data.background });
        if (data.audio) assetsToLoad.push({ type: "audio", src: data.audio });
        if (data.video) assetsToLoad.push({ type: "video", src: data.video });
        if (id === "final") {
          assetsToLoad.push({
            type: "audio",
            src: config.global.audioBGMFinal,
          });
        }
      }
    });
    if (assetsToLoad.length > 0) {
      console.log(
        `[App.js] Precargando ${assetsToLoad.length} assets de '${sectionId}' en 2do plano...`
      );
      Preloader.loadAssets(assetsToLoad);
    }
  },

  /**
   * --- FUNCIÓN MODIFICADA ---
   * Helper para el fundido A negro
   */
  _fadeOut() {
    console.log("[App.js] Fundido A NEGRO.");
    const overlay = document.getElementById("fade-overlay");
    // --- CORRECCIÓN AQUÍ ---
    // Hacer que el overlay sea "sólido" (atrape clics)
    overlay.style.pointerEvents = "auto";

    return new Promise((resolve) => {
      overlay.style.opacity = "1";
      setTimeout(resolve, 400); // Duración del fundido
    });
  },

  /**
   * --- FUNCIÓN MODIFICADA ---
   * Helper para el fundido DESDE negro
   */
  _fadeIn() {
    console.log("[App.js] Fundido DESDE NEGRO.");
    const overlay = document.getElementById("fade-overlay");

    return new Promise((resolve) => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        // --- CORRECCIÓN AQUÍ ---
        // Hacer que el overlay sea "invisible" a los clics
        overlay.style.pointerEvents = "none";
        resolve();
      }, 400);
    });
  },

  /**
   * El corazón de la app. Se llama CADA VEZ que la ruta cambia.
   */
  async showSection(sectionId) {
    console.log(`[App.js] Intento de navegar a: ${sectionId}`);
    const sectionData = config.sections[sectionId];
    if (!sectionData) return;

    const requestedStep = sectionData.step;

    // --- LÓGICA DE GUARDIA (Progreso Forzado) ---
    if (requestedStep < this._userMaxStep) {
      if (this._isExceptionNav) {
        console.log(
          `[App.js] Guardia: NAVEGACIÓN EXCEPCIONAL permitida a ${sectionId}.`
        );
        this._isExceptionNav = false;
      } else {
        console.warn(
          `[App.js] Guardia: Navegación a step ${requestedStep} BLOQUEADA (Max: ${this._userMaxStep}).`
        );
        const maxSectionId = this._userLastSection;

        if (maxSectionId && maxSectionId !== sectionId) {
          Router.navigate(maxSectionId, true);
        }
        return;
      }
    }

    // 1. Fundido a negro
    if (this._currentSection !== null) {
      await this._fadeOut();
    }

    // --- (La pantalla está en negro) ---

    // 2. Lógica de actualización
    this._currentSection = sectionId;
    document.body.className = `view-${sectionId}`;

    FirebaseManager.updateCurrentLocation(sectionId);

    if (requestedStep > this._userMaxStep) {
      console.log(`[App.js] Nuevo paso máximo alcanzado: ${requestedStep}`);
      this._userMaxStep = requestedStep;
      this._userLastSection = sectionId;
      FirebaseManager.saveProgress(requestedStep, sectionId);
    }

    AudioManager.stopNarration();
    if (sectionId !== "countdown") {
      Countdown.stop();
    }

    if (sectionData.type === "intro") {
      Render.section(sectionId);
      if (this._isCriticalLoadingDone) {
        Render.setIntroLoading(false);
      }
      // --- CORRECCIÓN AQUÍ ---
      // Si volvemos a la intro, forzamos el fadeIn
      // (antes solo lo hacía si !this._isAudioStarted)
      await this._fadeIn();
      return;
    }

    // Lógica de BGM
    let targetBGMType = "none";
    if (sectionId === "countdown") {
      targetBGMType = "final";
    } else if (sectionId !== "final") {
      targetBGMType = "main";
    }
    if (this._isAudioStarted && targetBGMType !== this._activeBGMType) {
      if (targetBGMType === "final") {
        AudioManager.playBGMFinal();
      } else if (targetBGMType === "main") {
        AudioManager.playBGM();
      } else {
        AudioManager.stopAllBGM();
      }
      this._activeBGMType = targetBGMType;
    }

    Render.section(sectionId);

    // Lógica de Narración
    const skip = this._skipNarrationFor === sectionId;
    this._skipNarrationFor = null;
    if (sectionData.audio && !skip) {
      console.log(`[App.js] Reproduciendo narración: ${sectionData.audio}`);
      setTimeout(() => {
        AudioManager.playNarration(sectionData.audio);
      }, 100);
    }

    await this._fadeIn();
    this._preloadNextSections(sectionId);
  },

  _handleAudioUnlock() {
    if (this._isAudioStarted) return;
    console.log(
      "[App.js] Interacción de usuario (video) ha DESBLOQUEADO el audio."
    );
    this._isAudioStarted = true;
    if (this._currentSection === "countdown") {
      AudioManager.playBGMFinal();
      this._activeBGMType = "final";
    }
  },

  _handleIntroPlay() {
    console.log("[App.js] Botón 'Play' presionado.");
    if (this._isAudioStarted) return;
    this._isAudioStarted = true;

    AudioManager.playBGM();
    this._activeBGMType = "main";

    Render.showContent();
    Render.hidePlayButton();

    const introAudio = config.sections.intro.audio;
    if (introAudio) {
      setTimeout(() => {
        AudioManager.playNarration(introAudio);
      }, 300);
    }
  },

  _handleSpecialNavigation(sectionId) {
    console.log(`[App.js] Navegación ESPECIAL (excepción) a ${sectionId}.`);
    this._isExceptionNav = true;
    this._skipNarrationFor = sectionId;
    Router.navigate(sectionId);
  },

  _handleNarrationEnd() {
    console.log("[App.js] Narración terminada.");
    if (this._currentSection === "intro") {
      console.log("[App.js] Mostrando botón 'Comenzar'.");
      Render.showActions();
    }
  },
};

// --- PUNTO DE ENTRADA ---
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
