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
  _isFirebaseConnected: false,
  _videoElementForPausa: null,
  _pausaCheckInterval: null, // --- NUEVO: Timer para chequear la pausa

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

  /**
   * --- FUNCIÓN MODIFICADA ---
   * Precarga assets y pasa el callback de progreso a Render.js
   */
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

    // --- NUEVA LÓGICA DE PROGRESO ---
    // 1. Definir el callback que actualiza la UI
    const onProgress = (percentage) => {
      // Esta función se llamará desde el preloader
      Render.updateLoadingProgress(percentage);
    };

    // 2. Pasar el callback al preloader
    await Preloader.loadAssets(assetsToLoad, onProgress);
    // --- FIN DE LA NUEVA LÓGICA ---

    console.log("[App.js] 6. Assets críticos CARGADOS.");
    this._isCriticalLoadingDone = true;
    if (this._currentSection === "intro") {
      console.log(
        "[App.js] 7. La intro ya estaba visible. Ocultando barra de carga."
      );
      // Ocultar la barra (is-loading) y mostrar el botón de Play
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
      // No necesitamos reportar progreso para las cargas en 2do plano
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

  /**
   * --- FUNCIÓN MODIFICADA ---
   * Se asegura de que setIntroLoading se llame si la precarga ya terminó.
   */
  async showSection(sectionId) {
    console.log(`[App.js] Intento de navegar a: ${sectionId}`);
    const sectionData = config.sections[sectionId];
    if (!sectionData) return;
    const requestedStep = sectionData.step;

    // --- CAMBIO: Ya no se necesita el admin_unlock en la URL aquí ---
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
      // --- CAMBIO: Detener el timer de 'pausa' si salimos de ella ---
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
      // Si la precarga ya terminó, oculta la barra de carga
      if (this._isCriticalLoadingDone) {
        Render.setIntroLoading(false);
      }
      // Si la precarga NO ha terminado, app.js llamará a setIntroLoading(false)
      // cuando _preloadCriticalAssets termine.

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

    // --- NUEVO: Lógica de Pausa y Final ---
    if (sectionId === "final") {
      // Capturar el elemento de video renderizado
      this._videoElementForPausa = document.querySelector("#app-root video");
      console.log(
        "[App.js] Elemento de video capturado.",
        this._videoElementForPausa
      );
    }
    if (sectionId === "pausa") {
      // Iniciar la lógica de desbloqueo de tiempo
      // --- CAMBIO: Se ejecuta 1 vez y luego en intervalo ---
      this._checkPausaUnlock(); // Chequear inmediatamente
      this._pausaCheckInterval = setInterval(
        () => this._checkPausaUnlock(),
        30000
      ); // Y luego cada 30 seg
    }
    // --- FIN NUEVO ---

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

  // --- NUEVA FUNCIÓN HELPER ---
  _showPausaButton() {
    const acciones = document.getElementById("pausa-acciones");
    if (acciones && acciones.classList.contains("hidden-content")) {
      console.log("[App.js] ¡Desbloqueando botón 'Siguiente' de Pausa!");
      acciones.classList.remove("hidden-content");

      // --- CAMBIO: Una vez que se muestra, detenemos el timer ---
      if (this._pausaCheckInterval) {
        console.log("[App.js] Botón de Pausa mostrado. Deteniendo timer.");
        clearInterval(this._pausaCheckInterval);
        this._pausaCheckInterval = null;
      }
    }
  },

  // --- FUNCIÓN MODIFICADA ---
  async _checkPausaUnlock() {
    console.log("[App.js] Verificando desbloqueo de Pausa...");
    // --- USA LA FECHA REAL ---
    const unlockTime = new Date("2025-12-25T00:00:00-03:00").getTime(); // AR

    // 1. Check Admin Force-Unlock (desde Firebase)
    if (this._isFirebaseConnected) {
      // Volvemos a cargar el progreso para ver si el admin activó el flag
      const progressData = await FirebaseManager.loadProgress();
      if (progressData.pausaUnlocked === true) {
        console.log("[App.js] Admin forzó desbloqueo (Flag de Firebase).");
        this._showPausaButton();
        return; // Salimos, ya está desbloqueado
      }
    }

    // 2. Check Server Time (usando una API pública)
    try {
      // Usamos una API de tiempo para evitar que el usuario cambie la hora local
      const response = await fetch("https://worldtimeapi.org/api/ip");
      if (!response.ok) throw new Error("Fallo en la API de tiempo");
      const data = await response.json();
      const serverTime = new Date(data.utc_datetime).getTime();

      console.log(
        `[App.js] Hora Servidor: ${new Date(
          serverTime
        )}, Hora Desbloqueo: ${new Date(unlockTime)}`
      );

      if (serverTime >= unlockTime) {
        console.log("[App.js] ¡Tiempo cumplido! Mostrando botón.");
        this._showPausaButton();
      } else {
        console.log("[App.js] Aún no es tiempo. El timer volverá a chequear.");
      }
    } catch (e) {
      console.error(
        "Error al fetchear la hora del servidor. El timer reintentará.",
        e
      );
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

  // --- NUEVA FUNCIÓN ---
  _handlePausaNext(sectionId) {
    console.log(
      "[App.js] Botón 'Siguiente' de Pausa presionado. Intentando desbloquear video..."
    );

    // 1. Asegurarse de que el audio principal esté iniciado (BGM)
    if (!this._isAudioStarted) {
      this._isAudioStarted = true;
      AudioManager.playBGM(); // Inicia la BGM principal
      this._activeBGMType = "main";
    }

    // 2. Navegar a la sección 'final'
    Router.navigate(sectionId);

    // 3. El router llamará a showSection('final')
    //    showSection('final') renderizará el video y lo guardará en this._videoElementForPausa
    //    El video tiene autoplay=true, controls=false.

    // 4. Usar un pequeño timeout para asegurar que el DOM esté actualizado
    //    y *luego* forzar play y fullscreen.
    setTimeout(() => {
      if (this._videoElementForPausa) {
        console.log("[App.js] Intentando play() y fullscreen() en el video...");
        this._videoElementForPausa.play().catch((err) => {
          console.warn(
            "play() automático falló, el navegador mostrará controles:",
            err.message
          );
          // SI el play() falla, el navegador *mostrará* los controles.
          // Es la única forma de que el usuario vea el video.
          this._videoElementForPausa.controls = true;
        });
        Render.forceVideoFullscreen();
      } else {
        console.error(
          "[App.js] _handlePausaNext: No se encontró el elemento de video para forzar play."
        );
      }
    }, 100); // 100ms para que el DOM se actualice post-navegación
  },

  _handleNarrationEnd() {
    console.log("[App.js] Narración terminada.");

    if (this._currentSection === "intro") {
      console.log("[App.js] Mostrando botón 'Comenzar'.");
      Render.showActions();
    } else if (this._currentSection === "pausa") {
      // --- CAMBIO: Ya no hacemos el fade de 10 seg ---
      // La lógica ahora depende del botón que aparece con la fecha.
      console.log(
        "[App.js] Narración de Pausa terminada. Esperando desbloqueo de fecha."
      );
    }
  },
};

// --- PUNTO DE ENTRADA ---
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
