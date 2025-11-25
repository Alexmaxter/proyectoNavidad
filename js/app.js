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
 * (Versión con Mega Precarga: 3 pasos por camino)
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
  _isFirebaseConnected: false,
  _videoElementForPausa: null,
  _pausaCheckInterval: null,

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
      onPausaNext: this._handlePausaNext.bind(this),
    });

    try {
      await FirebaseManager.init();
      const progress = await FirebaseManager.loadProgress();
      this._userMaxStep = progress.maxStep || 0;
      this._userLastSection = progress.lastSection || "intro";
      this._isFirebaseConnected = true;
      console.log(
        `[App.js] 3. (ONLINE) Progreso cargado: Step ${this._userMaxStep} (${this._userLastSection})`
      );
    } catch (error) {
      this._isFirebaseConnected = false;
      console.warn(
        "[App.js] ERROR de Firebase. Iniciando en modo offline.",
        error
      );
      try {
        const localProgress = JSON.parse(
          localStorage.getItem("proyectoNavidadProgress")
        );
        if (localProgress) {
          this._userMaxStep = localProgress.maxStep || 0;
          this._userLastSection = localProgress.lastSection || "intro";
          console.log(
            `[App.js] 3. (OFFLINE) Progreso cargado: Step ${this._userMaxStep}`
          );
        } else {
          console.log(
            "[App.js] 3. (OFFLINE) No hay progreso local. Empezando de 0."
          );
        }
      } catch (e) {
        console.error("Error al leer localStorage", e);
      }
    }

    Router.init((sectionId) => this.showSection(sectionId));
    console.log("[App.js] 4. Router inicializado.");

    this._preloadCriticalAssets();
  },

  // --- MEGA PRECARGA: 3 pasos de profundidad ---
  async _preloadCriticalAssets() {
    console.log("[App.js] 3. Iniciando MEGA PRECARGA de assets críticos...");

    // Referencias a las secciones
    const intro = config.sections.intro;
    const decision = config.sections.decision;

    // Camino Paciente (Pasos 1, 2 y 3)
    const pac1 = config.sections.acertijo1;
    const pac2 = config.sections.explicacion1;
    const pac3 = config.sections.acertijo2; // <-- NUEVO: Agregamos el 3er paso

    // Camino Rápido (Pasos 1, 2 y Final)
    const rap1 = config.sections.confirmacion1;
    const rap2 = config.sections.confirmacion2;
    const rap3 = config.sections.final2; // <-- NUEVO: Agregamos el final alternativo

    const assetsToLoad = [
      // 1. Base
      { type: "image", src: intro.background },
      { type: "audio", src: intro.audio },
      { type: "image", src: decision.background },
      { type: "audio", src: decision.audio },
      { type: "audio", src: config.global.audioBGM },

      // 2. Camino Paciente (3 niveles de profundidad)
      { type: "image", src: pac1.background },
      { type: "audio", src: pac1.audio },
      { type: "image", src: pac2.background },
      { type: "audio", src: pac2.audio },
      { type: "image", src: pac3.background }, // Pre-cargando Acertijo 2
      { type: "audio", src: pac3.audio },

      // 3. Camino Rápido (3 niveles de profundidad - Todo el camino rápido)
      { type: "image", src: rap1.background },
      { type: "audio", src: rap1.audio },
      { type: "image", src: rap2.background },
      { type: "audio", src: rap2.audio },
      { type: "image", src: rap3.background }, // Pre-cargando Final 2
      { type: "audio", src: rap3.audio },
    ];

    const onProgress = (percentage) => {
      Render.updateLoadingProgress(percentage);
    };

    // Bloquear hasta que todo esto cargue
    await Preloader.loadAssets(assetsToLoad, onProgress);

    console.log("[App.js] 6. Assets críticos (Mega Precarga) CARGADOS.");
    this._isCriticalLoadingDone = true;
    if (this._currentSection === "intro") {
      console.log(
        "[App.js] 7. La intro ya estaba visible. Ocultando barra de carga."
      );
      Render.setIntroLoading(false);
    }
  },

  _preloadNextSections(sectionId) {
    const currentSection = config.sections[sectionId];
    if (!currentSection) return;
    let nextSectionIds = new Set();
    if (currentSection.onNavigate)
      nextSectionIds.add(currentSection.onNavigate);
    if (currentSection.onSuccess) nextSectionIds.add(currentSection.onSuccess);
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
      Preloader.loadAssets(assetsToLoad, null);
    }
  },

  _fadeOut() {
    console.log("[App.js] Fundido A NEGRO.");
    const overlay = document.getElementById("fade-overlay");
    overlay.style.pointerEvents = "auto";
    return new Promise((resolve) => {
      overlay.style.opacity = "1";
      setTimeout(resolve, 400);
    });
  },

  _fadeIn() {
    console.log("[App.js] Fundido DESDE NEGRO.");
    const overlay = document.getElementById("fade-overlay");
    return new Promise((resolve) => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.style.pointerEvents = "none";
        resolve();
      }, 400);
    });
  },

  async showSection(sectionId) {
    console.log(`[App.js] Intento de navegar a: ${sectionId}`);
    const sectionData = config.sections[sectionId];
    if (!sectionData) return;
    const requestedStep = sectionData.step;

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

    if (this._currentSection !== null) {
      if (this._currentSection === "final") {
        this._videoElementForPausa = null;
      }
      if (this._currentSection === "pausa") {
        if (this._pausaCheckInterval) {
          console.log("[App.js] Saliendo de Pausa. Deteniendo timer.");
          clearInterval(this._pausaCheckInterval);
          this._pausaCheckInterval = null;
        }
      }
      await this._fadeOut();
    }

    this._currentSection = sectionId;
    document.body.className = `view-${sectionId}`;

    if (this._pausaFadeTimer) {
      clearTimeout(this._pausaFadeTimer);
      this._pausaFadeTimer = null;
    }

    if (this._isFirebaseConnected) {
      FirebaseManager.updateCurrentLocation(sectionId);
    }

    if (requestedStep > this._userMaxStep) {
      console.log(`[App.js] Nuevo paso máximo alcanzado: ${requestedStep}`);
      this._userMaxStep = requestedStep;
      this._userLastSection = sectionId;
      if (this._isFirebaseConnected) {
        FirebaseManager.saveProgress(requestedStep, sectionId);
      }
      try {
        localStorage.setItem(
          "proyectoNavidadProgress",
          JSON.stringify({
            maxStep: requestedStep,
            lastSection: sectionId,
          })
        );
        console.log("[App.js] Progreso guardado en localStorage.");
      } catch (e) {
        console.warn("Error al guardar en localStorage", e);
      }
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
      await this._fadeIn();
      return;
    }

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

    if (sectionId === "final") {
      this._videoElementForPausa = document.querySelector("#app-root video");
      console.log(
        "[App.js] Elemento de video capturado.",
        this._videoElementForPausa
      );
    }
    if (sectionId === "pausa") {
      this._checkPausaUnlock();
      this._pausaCheckInterval = setInterval(
        () => this._checkPausaUnlock(),
        30000
      );
    }

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

  _showPausaButton() {
    const acciones = document.getElementById("pausa-acciones");
    if (acciones && acciones.classList.contains("hidden-content")) {
      console.log("[App.js] ¡Desbloqueando botón 'Siguiente' de Pausa!");
      acciones.classList.remove("hidden-content");

      if (this._pausaCheckInterval) {
        console.log("[App.js] Botón de Pausa mostrado. Deteniendo timer.");
        clearInterval(this._pausaCheckInterval);
        this._pausaCheckInterval = null;
      }
    }
  },

  async _checkPausaUnlock() {
    console.log("[App.js] Verificando desbloqueo de Pausa...");
    const unlockTime = new Date(config.global.unlockDate).getTime();

    if (this._isFirebaseConnected) {
      const progressData = await FirebaseManager.loadProgress();
      if (progressData.pausaUnlocked === true) {
        console.log("[App.js] Admin forzó desbloqueo (Flag de Firebase).");
        this._showPausaButton();
        return;
      }
    }

    try {
      const response = await fetch("https://worldtimeapi.org/api/ip");
      if (!response.ok) throw new Error("Fallo en la API de tiempo");
      const data = await response.json();
      const serverTime = new Date(data.utc_datetime).getTime();

      console.log(
        `[App.js] Hora Servidor: ${new Date(serverTime)}, Objetivo: ${new Date(
          unlockTime
        )}`
      );

      if (serverTime >= unlockTime) {
        console.log("[App.js] ¡Tiempo cumplido! Mostrando botón.");
        this._showPausaButton();
      } else {
        console.log("[App.js] Aún no es tiempo. El timer volverá a chequear.");
      }
    } catch (e) {
      console.error(
        "Error al fetchear hora servidor. Intentando fallback local...",
        e
      );

      const localTime = Date.now();
      if (localTime >= unlockTime) {
        console.log("[App.js] (Fallback) Tiempo cumplido según hora local.");
        this._showPausaButton();
      }
    }
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

  _handlePausaNext(sectionId) {
    console.log(
      "[App.js] Botón 'Siguiente' de Pausa presionado. Intentando desbloquear video..."
    );

    if (!this._isAudioStarted) {
      this._isAudioStarted = true;
      AudioManager.playBGM();
      this._activeBGMType = "main";
    }

    Router.navigate(sectionId);

    setTimeout(() => {
      if (this._videoElementForPausa) {
        console.log("[App.js] Intentando play() y fullscreen() en el video...");
        this._videoElementForPausa.play().catch((err) => {
          console.warn(
            "play() automático falló, el navegador mostrará controles:",
            err.message
          );
          this._videoElementForPausa.controls = true;
        });
        Render.forceVideoFullscreen();
      } else {
        console.error(
          "[App.js] _handlePausaNext: No se encontró el elemento de video para forzar play."
        );
      }
    }, 100);
  },

  _handleNarrationEnd() {
    console.log("[App.js] Narración terminada.");

    if (this._currentSection === "intro") {
      console.log("[App.js] Mostrando botón 'Comenzar'.");
      Render.showActions();
    } else if (this._currentSection === "pausa") {
      console.log(
        "[App.js] Narración de Pausa terminada. Esperando desbloqueo de fecha."
      );
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
