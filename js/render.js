// Usar los nombres de archivo correctos
import config from "./config.js";
import Validation from "./validation.js";
import Countdown from "./countdown.js";

/**
 * render.js: El Constructor de Vistas
 */
const Render = {
  _callbacks: {},
  _rootElement: null,

  init(rootElement, callbacks) {
    this._rootElement = rootElement;
    this._callbacks = callbacks;
  },

  section(sectionId) {
    console.log(`[Render.js] Renderizando sección: ${sectionId}`);
    const data = config.sections[sectionId];
    if (!data) return;
    this._rootElement.innerHTML = "";
    if (data.type === "intro") {
      this._renderIntroLayout(data);
      return;
    }
    if (data.title) {
      this._rootElement.appendChild(this._createTitle(data.title));
    }
    if (data.narrative) {
      this._rootElement.appendChild(this._createNarrative(data.narrative));
    }
    const controlesContainer = document.createElement("div");
    controlesContainer.className = "controles";
    switch (data.type) {
      case "decision":
        controlesContainer.appendChild(this._createDecisionControls(data));
        break;
      case "explanation":
        controlesContainer.appendChild(this._createExplanationControls(data));
        break;
      case "riddle":
        controlesContainer.appendChild(this._createRiddleControls(data));
        break;
      case "video":
        this._rootElement.appendChild(this._createVideoPlayer(data));
        break;
      case "countdown":
        controlesContainer.appendChild(this._createCountdownControls(data));
        break;
    }
    this._rootElement.appendChild(controlesContainer);
    if (data.type === "countdown") {
      console.log(
        "[Render.js] HTML de Countdown añadido al DOM. Iniciando Countdown.start()."
      );
      Countdown.start(config.global.countdownDate);
    }
  },

  _renderIntroLayout(data) {
    console.log(
      "[Render.js] Creando layout de 'intro' (con barra de progreso)."
    );
    const titleEl = this._createTitle(data.title);
    const narrativeEl = this._createNarrative(data.narrative);
    titleEl.classList.add("hidden-content");
    narrativeEl.classList.add("hidden-content");
    const controlesContainer = document.createElement("div");
    controlesContainer.className = "controles";
    controlesContainer.appendChild(this._createIntroPlayCenter(data));
    const accionesContainer = document.createElement("div");
    accionesContainer.className = "acciones hidden-content";
    accionesContainer.appendChild(this._createIntroActions(data));
    controlesContainer.appendChild(accionesContainer);
    this._rootElement.appendChild(titleEl);
    this._rootElement.appendChild(narrativeEl);
    this._rootElement.appendChild(controlesContainer);
  },

  _createTitle(text) {
    const titleEl = document.createElement("h1");
    titleEl.className = "titulo";
    titleEl.textContent = text;
    return titleEl;
  },

  _createNarrative(html) {
    const narrativeEl = document.createElement("p");
    narrativeEl.className = "narrativa";
    narrativeEl.innerHTML = html;
    return narrativeEl;
  },

  /**
   * --- FUNCIÓN MODIFICADA ---
   * Crea el centro de "Play" con la nueva barra de progreso.
   */
  _createIntroPlayCenter(data) {
    const playCenter = document.createElement("div");
    playCenter.className = "play-center is-loading"; // Sigue cargando por defecto
    playCenter.id = "play-center-control";
    console.log(
      "[Render.js] Creado '#play-center-control' con clase '.is-loading'."
    );

    // 1. Botón "Play" (oculto por .is-loading)
    const playButton = document.createElement("button");
    playButton.innerHTML = "<pre>▶</pre>";
    playButton.addEventListener("click", () => {
      this._callbacks.onIntroPlay();
    });

    // 2. Aviso de volumen (oculto por .is-loading)
    const avisoVolumen = document.createElement("p");
    avisoVolumen.className = "aviso-volumen";
    avisoVolumen.textContent = "🔊 Sube el volumen antes de empezar";

    // 3. Indicador de Carga (CON BARRA DE PROGRESO)
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-indicator";

    // Añadimos la barra y el texto de porcentaje
    loadingIndicator.innerHTML = `
      <div class="progress-bar-container">
        <div class="progress-bar-fill" id="progress-bar-fill"></div>
      </div>
      <div class="progress-percentage" id="progress-percentage">0%</div>
    `;

    // Añadimos todos al contenedor
    playCenter.appendChild(loadingIndicator);
    playCenter.appendChild(playButton);
    playCenter.appendChild(avisoVolumen);
    return playCenter;
  },

  _createIntroActions(data) {
    const button = document.createElement("button");
    button.textContent = data.buttonText;
    button.addEventListener("click", () => {
      this._callbacks.onNavigate(data.onNavigate);
    });
    return button;
  },

  _createDecisionControls(data) {
    const acciones = document.createElement("div");
    acciones.className = "acciones";
    data.buttons.forEach((buttonData) => {
      const button = document.createElement("button");
      button.textContent = buttonData.text;
      if (buttonData.skipNarration) {
        button.addEventListener("click", () => {
          this._callbacks.onNavigateWithSkip(buttonData.target);
        });
      } else {
        button.addEventListener("click", () => {
          this._callbacks.onNavigate(buttonData.target);
        });
      }
      acciones.appendChild(button);
    });
    return acciones;
  },

  _createExplanationControls(data) {
    const acciones = document.createElement("div");
    acciones.className = "acciones";
    if (data.buttonText) {
      const button = document.createElement("button");
      button.textContent = data.buttonText;
      button.addEventListener("click", () => {
        this._callbacks.onNavigate(data.onNavigate);
      });
      acciones.appendChild(button);
    }
    return acciones;
  },

  _createRiddleControls(data) {
    const group = document.createElement("div");
    group.className = "input-group";
    const inputContainer = document.createElement("div");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Tu respuesta";
    input.id = `respuesta-${data.validationKey}`;
    const sendButton = document.createElement("button");
    sendButton.className = "send-button";
    sendButton.textContent = "Enviar";
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    const errorMsg = document.createElement("div");
    errorMsg.className = "mensaje-error";
    errorMsg.id = `error-${data.validationKey}`;
    group.appendChild(inputContainer);
    group.appendChild(errorMsg);
    sendButton.addEventListener("click", () => {
      Validation.check(input, errorMsg, data.validationKey, () => {
        this._callbacks.onNavigate(data.onSuccess);
      });
    });
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendButton.click();
    });
    return group;
  },

  _createVideoPlayer(data) {
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-container";
    const video = document.createElement("video");
    video.src = data.video;
    video.playsInline = true;
    video.preload = "auto";
    video.autoplay = true;
    video.controls = false;
    video.addEventListener("ended", () => {
      this._callbacks.onNavigate(data.onNavigate);
    });
    video.addEventListener("play", () => {
      this._callbacks.onAudioUnlocked();
    });
    video.play().catch((error) => {
      console.warn("Autoplay de video bloqueado. Mostrando controles.", error);
      video.controls = true;
    });
    videoContainer.appendChild(video);
    return videoContainer;
  },

  _createCountdownControls(data) {
    const display = document.createElement("div");
    display.className = "countdown-display";
    display.innerHTML = `
      <div class="countdown-unit" id="unit-years">
        <span id="countdown-years">--</span>
        <label>años</label>
      </div>
      <div class="countdown-unit" id="unit-days">
        <span id="countdown-days">--</span>
        <label>días</label>
      </div>
      <div class="countdown-unit" id="unit-hours">
        <span id="countdown-hours">--</span>
        <label>horas</label>
      </div>
      <div class="countdown-unit" id="unit-minutes">
        <span id="countdown-minutes">--</span>
        <label>minutos</label>
      </div>
      <div class="countdown-unit" id="unit-seconds">
        <span id="countdown-seconds">--</span>
        <label>segundos</label>
      </div>
    `;
    return display;
  },

  /**
   * --- FUNCIÓN MODIFICADA ---
   * Habilita/deshabilita el estado de carga de la intro.
   * (Añadidos logs)
   */
  setIntroLoading(isLoading) {
    console.log(
      `[Render.js] setIntroLoading() llamado con: ${
        isLoading ? "TRUE" : "FALSE"
      }`
    );
    const playCenter = document.getElementById("play-center-control");
    if (playCenter) {
      console.log("[Render.js] ...elemento '#play-center-control' ENCONTRADO.");
      if (isLoading) {
        playCenter.classList.add("is-loading");
        console.log("[Render.js] ...clase '.is-loading' AÑADIDA.");
      } else {
        playCenter.classList.remove("is-loading");
        console.log("[Render.js] ...clase '.is-loading' QUITADA.");
      }
    } else {
      console.warn(
        "[Render.js] ...elemento '#play-center-control' NO encontrado."
      );
    }
  },

  /**
   * --- NUEVA FUNCIÓN ---
   * Actualiza la barra de progreso y el porcentaje.
   * @param {number} percentage - Un valor de 0.0 a 1.0
   */
  updateLoadingProgress(percentage) {
    const fillEl = document.getElementById("progress-bar-fill");
    const textEl = document.getElementById("progress-percentage");
    if (!fillEl || !textEl) return;

    const percentNum = Math.floor(percentage * 100);
    fillEl.style.width = `${percentNum}%`;
    textEl.textContent = `${percentNum}%`;

    if (percentage === 1) {
      // Opcional: cambiar el texto cuando llega al 100%
      textEl.textContent = "¡Listo!";
    }
  },

  showContent() {
    this._rootElement.querySelectorAll(".hidden-content").forEach((el) => {
      if (el.tagName === "H1" || el.tagName === "P") {
        el.classList.remove("hidden-content");
        el.classList.add("visible-content");
      }
    });
  },

  hidePlayButton() {
    const playButton = this._rootElement.querySelector(".play-center");
    if (playButton) {
      playButton.classList.add("hidden-content");
    }
  },

  showActions() {
    const acciones = this._rootElement.querySelector(".acciones");
    if (acciones) {
      acciones.classList.remove("hidden-content");
      acciones.classList.add("visible-content");
    }
  },
};

export default Render;
