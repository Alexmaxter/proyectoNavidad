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
  _pausaFadeTimer: null,

  async init() {
    // ... (idéntico) ...
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
    // ... (idéntico) ...
  },
  _preloadNextSections(sectionId) {
    // ... (idéntico) ...
  },
  _fadeOut() {
    // ... (idéntico) ...
  },
  _fadeIn() {
    // ... (idéntico) ...
  },

  /**
   * --- FUNCIÓN MODIFICADA ---
   * El corazón de la app.
   */
  async showSection(sectionId) {
    console.log(`[App.js] Intento de navegar a: ${sectionId}`);
    const sectionData = config.sections[sectionId];
    if (!sectionData) return;

    const requestedStep = sectionData.step;

    // --- LÓGICA DE GUARDIA (sin cambios) ---
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

    // 2. Lógica de actualización
    this._currentSection = sectionId;
    document.body.className = `view-${sectionId}`;

    // --- CAMBIO AQUÍ ---
    // Limpiar el temporizador de fundido CADA VEZ que cambiamos de sección
    if (this._pausaFadeTimer) {
      clearTimeout(this._pausaFadeTimer);
      this._pausaFadeTimer = null;
    }
    // (La lógica del temporizador se movió a _handleNarrationEnd)
    // --- FIN DEL CAMBIO ---

    FirebaseManager.updateCurrentLocation(sectionId);

    if (requestedStep > this._userMaxStep) {
      console.log(`[App.js] Nuevo paso máximo alcanzado: ${requestedStep}`);
      this._userMaxStep = requestedStep;
      this._userLastSection = sectionId;
      FirebaseManager.saveProgress(requestedStep, sectionId);
    }

    AudioManager.stopNarration(); // Detiene la narración ANTERIOR
    if (sectionId !== "countdown") {
      Countdown.stop();
    }

    if (sectionData.type === "intro") {
      Render.section(sectionId);
      if (this._isCriticalLoadingDone) {
        Render.setIntroLoading(false);
      }
      await this._fadeIn();
      return;
    }

    // --- LÓGICA DE BGM (MODIFICADA) ---
    // Ahora '#pausa' NO es silenciosa, necesita la BGM 'main'
    // para que la narración pueda hacerle un fundido.
    let targetBGMType = "none";
    if (sectionId === "countdown") {
      targetBGMType = "final";
    } else if (sectionId !== "final") {
      // 'final' (video) es la única silenciosa
      targetBGMType = "main";
    }

    if (this._isAudioStarted && targetBGMType !== this._activeBGMType) {
      if (targetBGMType === "final") {
        AudioManager.playBGMFinal();
      } else if (targetBGMType === "main") {
        AudioManager.playBGM();
      } else {
        AudioManager.stopAllBGM(); // Solo para 'final' (video)
      }
      this._activeBGMType = targetBGMType;
    }

    Render.section(sectionId);

    // Lógica de Narración (sin cambios)
    const skip = this._skipNarrationFor === sectionId;
    this._skipNarrationFor = null;
    if (sectionData.audio && !skip) {
      console.log(`[App.js] Reproduciendo narración: ${sectionData.audio}`);
      setTimeout(() => {
        AudioManager.playNarration(sectionData.audio); // Inicia la nueva narración
      }, 100);
    }

    await this._fadeIn();
    this._preloadNextSections(sectionId);
  },

  _handleAudioUnlock() {
    // ... (idéntico) ...
  },

  _handleIntroPlay() {
    // ... (idéntico) ...
  },

  _handleSpecialNavigation(sectionId) {
    // ... (idéntico) ...
  },

  /**
   * --- FUNCIÓN MODIFICADA ---
   * Se llama CADA VEZ que CUALQUIER narración termina.
   */
  _handleNarrationEnd() {
    console.log("[App.js] Narración terminada.");

    if (this._currentSection === "intro") {
      // 1. Si terminó la intro, mostrar "Comenzar"
      console.log("[App.js] Mostrando botón 'Comenzar'.");
      Render.showActions();
    }
    // --- NUEVA LÓGICA DE PAUSA ---
    else if (this._currentSection === "pausa") {
      // 2. Si terminó la narración de #pausa, iniciar el timer de 10s
      console.log(
        "[App.js] Narración de Pausa terminada. Iniciando fundido a negro en 10 segundos."
      );

      // Limpiar por si acaso
      if (this._pausaFadeTimer) clearTimeout(this._pausaFadeTimer);

      this._pausaFadeTimer = setTimeout(() => {
        console.log("[App.js] Timer de Pausa: ¡Fundido a negro!");
        this._fadeOut();
        AudioManager.stopAllBGM(); // Silencio final
      }, 10000); // 10 segundos
    }
    // --- FIN DE LA NUEVA LÓGICA ---
  },
};

// --- PUNTO DE ENTRADA ---
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
