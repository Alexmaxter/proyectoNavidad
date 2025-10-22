// =============================
// GESTOR DE CONTENIDO
// =============================
const ContentManager = {
  render(id) {
    const seccion = DOM.get(id);
    const datos = CONFIG.textos[id];

    if (!seccion || !datos) {
      console.warn(`No se puede renderizar ${id}`);
      return;
    }

    if (id === "final" || id === "countdown") {
      console.log(`Saltando renderizado para: ${id}`);
      return;
    }

    this._renderTitulo(seccion, datos);
    this._renderNarrativa(seccion, datos);
    this._renderAcciones(seccion, datos, id);
  },

  _renderTitulo(seccion, datos) {
    const titulo = seccion.querySelector(".titulo h1");
    if (titulo) titulo.textContent = datos.titulo || "";
  },

  _renderNarrativa(seccion, datos) {
    const narrativa = seccion.querySelector(".narrativa");
    if (narrativa) narrativa.innerHTML = `<p>${datos.narrativa}</p>`;
  },

  _renderAcciones(seccion, datos, id) {
    const acciones = seccion.querySelector(".acciones");
    if (!acciones) return;

    if (datos.botones) {
      acciones.innerHTML = datos.botones
        .map((texto) => `<button type="button">${texto}</button>`)
        .join("");
    } else if (datos.boton) {
      acciones.innerHTML = `<button type="button">${datos.boton}</button>`;
    } else if (id.startsWith("explicacion")) {
      acciones.innerHTML = `<button type="button" class="siguiente">Siguiente</button>`;
    } else {
      acciones.innerHTML = "";
    }
  },
};

// =============================
// GESTOR DE SECCIONES
// =============================
const SectionManager = {
  async mostrar(id, saltarAudio = false) {
    console.log(`Mostrando sección: ${id}`);

    await this._fadeIn();
    this._prepare(id);
    this._activate(id, saltarAudio);
    await this._fadeOut();
  },

  async _fadeIn() {
    const overlay = DOM.get("fadeOverlay");
    if (overlay) {
      overlay.style.opacity = "1";
      overlay.style.transition = "opacity 0.4s ease";
    }
    AudioManager.detenerNarraciones();
    await new Promise((r) => setTimeout(r, 400));
  },

  _prepare(id) {
    DOM.getAll(".section").forEach((s) => s.classList.remove("active"));

    // Background
    if (id === "countdown") {
      document.body.style.backgroundColor = "#000";
      document.body.style.backgroundImage = "none";
    } else if (id === "intro") {
      document.body.style.backgroundColor = "#000";
    } else {
      document.body.style.backgroundColor = "#000";
    }

    if (AppState.temporizadorBotonFinal) {
      clearTimeout(AppState.temporizadorBotonFinal);
      AppState.temporizadorBotonFinal = null;
    }
  },

  _activate(id, saltarAudio) {
    const seccion = DOM.get(id);
    if (!seccion) {
      console.error(`Sección ${id} no encontrada`);
      return;
    }

    ContentManager.render(id);
    this._hideControls(seccion);
    seccion.classList.add("active");
    AppState.seccionActiva = seccion;

    // Countdown especial - SOLO inicializar UNA VEZ
    if (id === "countdown") {
      console.log("📍 Activando sección countdown");

      // CRÍTICO: Detener TODO antes de iniciar countdown
      AudioManager.detenerTodosLosAudios();

      // Destruir countdown previo si existe
      Countdown.destruir();

      // Esperar un momento para asegurar limpieza
      setTimeout(() => {
        // SOLO si seguimos en countdown, iniciar
        if (AppState.seccionActiva?.id === "countdown") {
          console.log("🕐 Iniciando countdown por primera vez");
          Countdown.init();

          // Reproducir audio del countdown DESPUÉS de inicializarlo
          setTimeout(() => {
            if (AppState.seccionActiva?.id === "countdown") {
              AudioManager.reproducirNarracion("countdown");
            }
          }, 500);
        }
      }, 150);
    } else {
      // Para otras secciones, destruir countdown
      Countdown.destruir();
    }

    this._handleSectionStart(id, seccion, saltarAudio);
  },

  async _fadeOut() {
    setTimeout(() => {
      const overlay = DOM.get("fadeOverlay");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.4s ease";
      }
    }, 100);
  },

  _handleSectionStart(id, seccion, saltarAudio) {
    if (id === "intro" && !AppState.playClickeado) {
      this._showPlayButton(seccion);
    } else if (id === "intro" && AppState.playClickeado) {
      this._startIntro(seccion, id);
    } else if (id === "final") {
      this._startVideoSection(seccion, id);
    } else if (id === "countdown") {
      this._showNarrativa(seccion);
    } else if (saltarAudio || AppState.seccionesVisitadas.has(id)) {
      this._showDirect(seccion, id);
    } else {
      this._startWithAudio(seccion, id);
    }

    if (id === "final2") {
      AudioManager.detenerTodosLosAudios();
    }
  },

  _startVideoSection(seccion, id) {
    console.log("Iniciando sección de video...");

    AudioManager.detenerTodosLosAudios();

    const videoContainer = seccion.querySelector(".video-container");
    const video = DOM.get("Final");

    if (!videoContainer || !video) {
      console.error("Video no encontrado");
      setTimeout(() => Navigation.navigateTo("countdown"), 1000);
      return;
    }

    videoContainer.style.display = "block";
    videoContainer.style.opacity = "1";

    setTimeout(() => this._playVideo(video), 800);
    AppState.seccionesVisitadas.add(id);
  },

  _playVideo(video) {
    // SOLUCIÓN: Verificar si ya está reproduciéndose
    if (video._isPlaying) {
      console.log("⚠️ Video ya reproduciéndose, ignorando");
      return;
    }

    if (!Preloader.isVideoReady("Final")) {
      console.warn("Video no precargado");
    }

    video._isPlaying = true;
    video.currentTime = 0;
    video.volume = CONFIG.audio.volumenNarracion;
    video.muted = false;
    video.setAttribute("playsinline", "true");
    video.removeAttribute("controls");
    video.controls = false;
    video.style.cssText = "width:100%;height:100%;object-fit:cover;cursor:none";

    const playOverlay = DOM.get("video-play-overlay");
    if (playOverlay) {
      playOverlay.classList.add("hidden");
      playOverlay.style.display = "none";
    }

    // Limpiar eventos previos
    video.onended = null;
    video.onerror = null;
    video.oncontextmenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Nuevos eventos
    const finishVideo = () => {
      video._isPlaying = false;
      this._finishVideoAndNavigate();
    };

    video.onended = finishVideo;
    video.onerror = (e) => {
      console.error("Error en video:", e);
      finishVideo();
    };

    this._tryPlay(video, playOverlay);
  },

  async _tryPlay(video, playOverlay) {
    try {
      await this._enterFullscreen(video);
      await video.play();
      console.log("✓ Video reproduciéndose");
      AppState.audioReproduciendo = true;
      AppState.audioActual = video;
    } catch (error) {
      console.warn("Reproducción bloqueada:", error);
      this._showManualControls(video, playOverlay);
    }
  },

  async _enterFullscreen(video) {
    try {
      if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        await video.mozRequestFullScreen();
      } else if (video.msRequestFullscreen) {
        await video.msRequestFullscreen();
      }
    } catch (error) {
      console.warn("Pantalla completa no disponible:", error);
    }
  },

  _showManualControls(video, playOverlay) {
    if (playOverlay) {
      playOverlay.classList.remove("hidden");
      playOverlay.style.display = "flex";
      playOverlay.onclick = () => this._manualPlay(video, playOverlay);
    }
    video.onclick = () => {
      if (video.paused) this._manualPlay(video, playOverlay);
    };
  },

  async _manualPlay(video, playOverlay) {
    try {
      await this._enterFullscreen(video);
      await video.play();
      AppState.audioReproduciendo = true;
      AppState.audioActual = video;
      if (playOverlay) {
        playOverlay.classList.add("hidden");
        playOverlay.style.display = "none";
      }
    } catch (error) {
      console.error("Error iniciando video:", error);
      this._finishVideoAndNavigate();
    }
  },

  async _finishVideoAndNavigate() {
    console.log("Finalizando video");

    const video = DOM.get("Final");

    // SOLUCIÓN: Detener y limpiar video completamente
    if (video) {
      video.pause();
      video.currentTime = 0;
      video._isPlaying = false;
      video.onended = null;
      video.onerror = null;
      video.oncontextmenu = null;
      video.onclick = null;

      // Ocultar contenedor del video
      const videoContainer = video.closest(".video-container");
      if (videoContainer) {
        videoContainer.style.display = "none";
        videoContainer.style.opacity = "0";
      }

      // Salir de pantalla completa
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (e) {
          console.warn("Error saliendo de pantalla completa:", e);
        }
      }
    }

    AppState.audioReproduciendo = false;
    AppState.audioActual = null;
    AudioManager.detenerTodosLosAudios();

    // Transición negra
    const overlay = DOM.get("fadeOverlay");
    if (overlay) {
      overlay.style.backgroundColor = "#000";
      overlay.style.opacity = "1";
      overlay.style.transition = "opacity 0.8s ease";
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Navegando a countdown...");
    await Navigation.navigateTo("countdown");

    setTimeout(() => {
      if (overlay) overlay.style.opacity = "0";
    }, 200);
  },

  _showPlayButton(seccion) {
    const playCentro = seccion.querySelector(".play-center");
    if (playCentro) {
      playCentro.classList.add("visible");
      playCentro.style.display = "flex";
    }
  },

  _startIntro(seccion, id) {
    seccion.classList.add("show-content");
    this._showNarrativa(seccion);
    AudioManager.reproducirFondo().then(() =>
      setTimeout(() => {
        AudioManager.reproducirNarracion(id);
        this._showNarrativa(seccion);
      }, 100)
    );
  },

  _showDirect(seccion, id) {
    this._showNarrativa(seccion);
    if (id !== "countdown") {
      this.mostrarControles(id);
    }
  },

  _startWithAudio(seccion, id) {
    this._showNarrativa(seccion);

    const esSeccionFinal = ["final", "countdown"].includes(id);
    const iniciarAudio = esSeccionFinal
      ? AudioManager.reproducirFondoFinal()
      : AudioManager.reproducirFondo();

    iniciarAudio.then(() =>
      setTimeout(() => AudioManager.reproducirNarracion(id), 300)
    );

    AppState.seccionesVisitadas.add(id);
  },

  _showNarrativa(seccion) {
    seccion.querySelector(".narrativa")?.classList.add("visible");
  },

  _hideControls(seccion) {
    [".play-center", ".acciones", ".input-group", ".replay-button"].forEach(
      (selector) => {
        const el = seccion.querySelector(selector);
        if (el) {
          el.classList.remove("visible");
          if (selector === ".play-center") el.style.display = "none";
        }
      }
    );

    seccion.querySelector(".narrativa")?.classList.remove("visible");

    if (seccion.id === "intro" && !AppState.playClickeado) {
      seccion.classList.remove("show-content");
    }
  },

  mostrarControles(id) {
    const seccion = AppState.seccionActiva;
    if (!seccion || seccion.id !== id) return;

    if (id === "final" || id === "countdown") {
      console.log(`No mostrar controles para: ${id}`);
      seccion
        .querySelectorAll(".acciones, .input-group, .replay-button")
        .forEach((control) => {
          control.classList.remove("visible");
          control.style.display = "none";
        });
      return;
    }

    setTimeout(() => {
      const replayButton = seccion.querySelector(".replay-button");
      if (replayButton) {
        replayButton.innerHTML = `<button type="button">${CONFIG.mensajes.repetir}</button>`;
        replayButton.classList.add("visible");
      }

      seccion.querySelector(".acciones")?.classList.add("visible");
      seccion.querySelector(".input-group")?.classList.add("visible");
    }, 500);
  },
};
