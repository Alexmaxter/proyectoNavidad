// =============================
// GESTOR DE CONTENIDO Y SECCIONES UNIFICADO
// =============================
const ContentManager = {
  /**
   * Renderiza el contenido de una secciÃ³n especÃ­fica
   */
  render(id) {
    const seccion = DOM.get(id);
    const datos = CONFIG.textos[id];

    if (!seccion || !datos) {
      console.warn(`No se puede renderizar ${id}`);
      return;
    }

    // Secciones especiales no necesitan renderizado estÃ¡ndar
    if (id === "final" || id === "countdown") {
      console.log(`Saltando renderizado para secciÃ³n especial: ${id}`);
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
      // MÃºltiples botones
      acciones.innerHTML = datos.botones
        .map((texto) => `<button type="button">${texto}</button>`)
        .join("");
    } else if (datos.boton) {
      // Un solo botÃ³n
      acciones.innerHTML = `<button type="button">${datos.boton}</button>`;
    } else if (id.startsWith("explicacion")) {
      // BotÃ³n siguiente
      acciones.innerHTML = `<button type="button" class="siguiente">${
        CONFIG.mensajes.siguiente || "Siguiente"
      }</button>`;
    } else {
      acciones.innerHTML = "";
    }
  },
};

// =============================
// GESTOR DE SECCIONES
// =============================
const SectionManager = {
  /**
   * Muestra una secciÃ³n con transiciones optimizadas
   */
  async mostrar(id, saltarAudio = false) {
    console.log(`Mostrando secciÃ³n: ${id}, saltarAudio: ${saltarAudio}`);

    await this._transicionEntrada();
    this._prepararSeccion(id);
    this._activarSeccion(id, saltarAudio);
    await this._transicionSalida();
  },

  /**
   * TransiciÃ³n de entrada (fade in)
   */
  async _transicionEntrada() {
    const fadeOverlay = DOM.get("fadeOverlay");
    if (fadeOverlay) {
      fadeOverlay.style.opacity = "1";
      fadeOverlay.style.transition = "opacity 0.4s ease";
    }

    AudioManager.detenerNarraciones();
    await new Promise((r) => setTimeout(r, 400));
  },

  /**
   * Prepara la nueva secciÃ³n
   */
  _prepararSeccion(id) {
    // Ocultar todas las secciones
    DOM.getAll(".section").forEach((s) => s.classList.remove("active"));

    // Color de fondo - Negro total para countdown
    if (id === "countdown") {
      document.body.style.backgroundColor = "#000";
      document.body.style.backgroundImage = "none";
    } else if (id === "intro") {
      document.body.style.backgroundColor = "#090a0f";
    } else {
      document.body.style.backgroundColor = "#1a1a1a";
    }

    // Limpiar temporizador previo
    if (AppState.temporizadorBotonFinal) {
      clearTimeout(AppState.temporizadorBotonFinal);
      AppState.temporizadorBotonFinal = null;
    }
  },

  /**
   * Activa la secciÃ³n y maneja su lÃ³gica
   */
  _activarSeccion(id, saltarAudio) {
    const seccion = DOM.get(id);

    if (!seccion) {
      console.error(`SecciÃ³n ${id} no encontrada`);
      return;
    }

    ContentManager.render(id);
    this._ocultarControles(seccion);
    seccion.classList.add("active");
    AppState.seccionActiva = seccion;

    // Manejar countdown especial
    if (id === "countdown") {
      // CRÃTICO: Detener TODO antes de iniciar countdown
      AudioManager.detenerTodosLosAudios();

      // Mantener pantalla completa en countdown
      this._mantenerPantallaCompleta();

      // Esperar un momento antes de iniciar countdown
      setTimeout(() => {
        Countdown.init();
        // Iniciar audio del countdown despuÃ©s de inicializarlo
        setTimeout(() => {
          AudioManager.reproducirNarracion("countdown");
        }, 500);
      }, 100);
    } else {
      Countdown.destruir();
    }

    this._manejarInicioSeccion(id, seccion, saltarAudio);
  },

  /**
   * Mantiene la pantalla completa activa
   */
  _mantenerPantallaCompleta() {
    // Si ya estamos en fullscreen, mantenerlo
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    ) {
      console.log("âœ“ Pantalla completa mantenida en countdown");
      return;
    }

    // Si no estamos en fullscreen, intentar activarlo de nuevo
    console.log("Reactivando pantalla completa para countdown...");
    this._activarPantallaCompletaExperiencia();
  },

  /**
   * Activa pantalla completa para toda la experiencia
   */
  async _activarPantallaCompletaExperiencia() {
    try {
      const elemento = document.documentElement; // Todo el documento

      // MÃ³viles: webkit
      if (elemento.webkitRequestFullscreen) {
        await elemento.webkitRequestFullscreen();
        console.log("âœ“ Experiencia en pantalla completa (webkit)");
        return;
      }

      // Desktop estÃ¡ndar
      if (elemento.requestFullscreen) {
        await elemento.requestFullscreen();
        console.log("âœ“ Experiencia en pantalla completa (estÃ¡ndar)");
        return;
      }

      // Otros navegadores
      if (elemento.mozRequestFullScreen) {
        await elemento.mozRequestFullScreen();
        console.log("âœ“ Experiencia en pantalla completa (moz)");
        return;
      }

      if (elemento.msRequestFullscreen) {
        await elemento.msRequestFullscreen();
        console.log("âœ“ Experiencia en pantalla completa (ms)");
        return;
      }

      console.log("Pantalla completa no disponible en este navegador");
    } catch (error) {
      console.warn("No se pudo activar pantalla completa:", error.message);
      // Continuar la experiencia normalmente

      // En mÃ³viles Android, forzar scroll para esconder barra de direcciones
      this._esconderBarraDireccionesMovil();
    }
  },

  /**
   * Esconde la barra de direcciones en mÃ³viles mediante scroll
   */
  _esconderBarraDireccionesMovil() {
    // Esta tÃ©cnica funciona en la mayorÃ­a de navegadores mÃ³viles
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 100);

    // Repetir para asegurar
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 500);

    console.log("Intentando esconder barra de direcciones mÃ³vil");
  },

  /**
   * TransiciÃ³n de salida (fade out)
   */
  async _transicionSalida() {
    setTimeout(() => {
      const fadeOverlay = DOM.get("fadeOverlay");
      if (fadeOverlay) {
        fadeOverlay.style.opacity = "0";
        fadeOverlay.style.transition = "opacity 0.4s ease";
      }
    }, 100);
  },

  /**
   * Maneja la lÃ³gica de inicio de cada secciÃ³n
   */
  _manejarInicioSeccion(id, seccion, saltarAudio) {
    console.log(`Manejando inicio: ${id}`);

    if (id === "intro" && !AppState.playClickeado) {
      this._mostrarBotonPlay(seccion);
    } else if (id === "intro" && AppState.playClickeado) {
      this._iniciarIntroCompleta(seccion, id);
    } else if (id === "final") {
      this._iniciarSeccionFinalConVideo(seccion, id);
    } else if (id === "countdown") {
      // Ya manejado en _activarSeccion
      this._mostrarSeccionDirecta(seccion, id);
    } else if (saltarAudio || AppState.seccionesVisitadas.has(id)) {
      this._mostrarSeccionDirecta(seccion, id);
    } else {
      this._iniciarSeccionConAudio(seccion, id);
    }

    // Manejar secciones finales especiales
    if (["final2"].includes(id)) {
      this._manejarSeccionFinal(id);
    }
  },

  /**
   * Maneja secciones finales
   */
  _manejarSeccionFinal(id) {
    if (id === "final2") {
      AudioManager.detenerTodosLosAudios();
    }
  },

  /**
   * Inicializa la secciÃ³n final con video
   */
  _iniciarSeccionFinalConVideo(seccion, id) {
    console.log("Iniciando secciÃ³n final con video...");

    // CRÃTICO: Detener TODOS los audios antes del video
    AudioManager.detenerTodosLosAudios();

    const videoContainer = seccion.querySelector(".video-container");
    const video = DOM.get("Final");

    if (!videoContainer || !video) {
      console.error("Video no encontrado, navegando a countdown");
      setTimeout(() => Navigation.navigateTo("countdown"), 1000);
      return;
    }

    // Asegurar visibilidad del contenedor
    videoContainer.style.display = "block";
    videoContainer.style.opacity = "1";

    // Reproducir video despuÃ©s de un delay
    setTimeout(() => this._reproducirVideoFinal(id), 800);

    AppState.seccionesVisitadas.add(id);
  },

  /**
   * Reproduce el video final
   */
  _reproducirVideoFinal(id) {
    const video = DOM.get("Final");
    const playOverlay = DOM.get("video-play-overlay");

    if (!video) {
      console.error("Video no encontrado");
      Navigation.navigateTo("countdown");
      return;
    }

    // CRÃTICO: Verificar si ya estÃ¡ reproduciÃ©ndose
    if (video._isPlaying) {
      console.log("Video ya estÃ¡ reproduciÃ©ndose, evitando reinicio");
      return;
    }

    // Verificar precarga
    if (!Preloader.isVideoReady("Final")) {
      console.warn("Video no precargado, intentando carga directa");
    }

    console.log("Preparando video final...");

    // Marcar como en reproducciÃ³n
    video._isPlaying = true;

    // Configurar video UNA SOLA VEZ
    video.currentTime = 0;
    video.volume = CONFIG.audio.volumenNarracion;
    video.muted = false;

    // NUEVO: Configurar atributos para mÃ³viles y ocultar controles
    video.setAttribute("playsinline", "true"); // Para iOS
    video.setAttribute("webkit-playsinline", "true"); // Para iOS antiguo
    video.removeAttribute("controls"); // Quitar controles nativos
    video.controls = false; // Asegurar que no hay controles

    // Estilos del video - experiencia cinematogrÃ¡fica
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.cursor = "none"; // Ocultar cursor sobre el video

    // Ocultar overlay
    if (playOverlay) {
      playOverlay.classList.add("hidden");
      playOverlay.style.display = "none";
    }

    // Eventos del video (limpiar primeros)
    video.onended = null;
    video.onerror = null;

    // Configurar nuevos eventos
    const finalizarVideo = () => {
      video._isPlaying = false;
      this._finalizarVideoYNavegar();
    };

    video.onended = finalizarVideo;
    video.onerror = (e) => {
      console.error("Error en video:", e);
      video._isPlaying = false;
      finalizarVideo();
    };

    // NUEVO: Prevenir contexto del clic derecho
    video.oncontextmenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Intentar reproducciÃ³n
    this._intentarReproduccionVideo(video, playOverlay);
  },

  /**
   * Intenta reproducir el video
   */
  async _intentarReproduccionVideo(video, playOverlay) {
    try {
      // Intentar entrar en pantalla completa primero
      await this._activarPantallaCompleta(video);

      // Reproducir video
      await video.play();

      console.log("âœ“ Video reproduciendo en pantalla completa");
      AppState.audioReproduciendo = true;
      AppState.audioActual = video;
    } catch (error) {
      console.warn("ReproducciÃ³n automÃ¡tica bloqueada:", error);
      this._mostrarControlManualVideo(video, playOverlay);
    }
  },

  /**
   * Activa pantalla completa para el video
   */
  async _activarPantallaCompleta(video) {
    try {
      // En mÃ³viles Android/iOS, usar webkitEnterFullscreen (especÃ­fico para videos)
      if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
        console.log("âœ“ Pantalla completa mÃ³vil activada (webkit)");
        return;
      }

      // En mÃ³viles modernos, usar webkitDisplayingFullscreen
      if (video.webkitDisplayingFullscreen !== undefined) {
        video.webkitEnterFullscreen();
        console.log("âœ“ Pantalla completa mÃ³vil activada");
        return;
      }

      // Desktop: Intentar fullscreen estÃ¡ndar en el video
      if (video.requestFullscreen) {
        await video.requestFullscreen();
        console.log("âœ“ Pantalla completa desktop activada");
      } else if (video.webkitRequestFullscreen) {
        await video.webkitRequestFullscreen();
        console.log("âœ“ Pantalla completa webkit activada");
      } else if (video.mozRequestFullScreen) {
        await video.mozRequestFullScreen();
        console.log("âœ“ Pantalla completa moz activada");
      } else if (video.msRequestFullscreen) {
        await video.msRequestFullscreen();
        console.log("âœ“ Pantalla completa ms activada");
      }
    } catch (error) {
      console.warn("No se pudo activar pantalla completa:", error);
      // Continuar sin pantalla completa - el usuario puede activarla manualmente
    }
  },

  /**
   * Muestra controles manuales para el video
   */
  _mostrarControlManualVideo(video, playOverlay) {
    console.log("Mostrando controles manuales");

    if (playOverlay) {
      playOverlay.classList.remove("hidden");
      playOverlay.style.display = "flex";
      playOverlay.onclick = () =>
        this._iniciarReproduccionManual(video, playOverlay);
    }

    video.onclick = () => {
      if (video.paused) {
        this._iniciarReproduccionManual(video, playOverlay);
      }
    };
  },

  /**
   * Inicia reproducciÃ³n manual del video
   */
  async _iniciarReproduccionManual(video, playOverlay) {
    try {
      // Intentar pantalla completa
      await this._activarPantallaCompleta(video);

      // Reproducir
      await video.play();

      console.log("Video iniciado manualmente");
      AppState.audioReproduciendo = true;
      AppState.audioActual = video;

      if (playOverlay) {
        playOverlay.classList.add("hidden");
        playOverlay.style.display = "none";
      }
    } catch (error) {
      console.error("Error iniciando video:", error);
      this._finalizarVideoYNavegar();
    }
  },

  /**
   * Finaliza video y navega a countdown
   */
  async _finalizarVideoYNavegar() {
    console.log("Finalizando video");

    const video = DOM.get("Final");

    // Detener video completamente
    if (video) {
      video.pause();
      video.currentTime = 0;
      video._isPlaying = false;

      // Salir de pantalla completa si estÃ¡ activa
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

    // CRÃTICO: Detener TODOS los audios antes de continuar
    AudioManager.detenerTodosLosAudios();

    // TransiciÃ³n negra completa sin efectos de luz
    const fadeOverlay = DOM.get("fadeOverlay");
    if (fadeOverlay) {
      fadeOverlay.style.backgroundColor = "#000";
      fadeOverlay.style.opacity = "1";
      fadeOverlay.style.transition = "opacity 0.8s ease";
    }

    // Esperar a que la transiciÃ³n negra complete
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Navegando a countdown...");
    await Navigation.navigateTo("countdown");

    // Fade out gradual despuÃ©s de mostrar countdown
    setTimeout(() => {
      if (fadeOverlay) {
        fadeOverlay.style.opacity = "0";
      }
    }, 200);
  },

  /**
   * Muestra botÃ³n de play
   */
  _mostrarBotonPlay(seccion) {
    const playCentro = seccion.querySelector(".play-center");
    if (playCentro) {
      playCentro.classList.add("visible");
      playCentro.style.display = "flex";
    }
  },

  /**
   * Inicia intro completa
   */
  _iniciarIntroCompleta(seccion, id) {
    seccion.classList.add("show-content");
    this._mostrarNarrativa(seccion);

    AudioManager.reproducirFondo().then(() =>
      setTimeout(() => {
        AudioManager.reproducirNarracion(id);
        this._mostrarNarrativa(seccion);
      }, 100)
    );
  },

  /**
   * Muestra secciÃ³n directamente sin audio
   */
  _mostrarSeccionDirecta(seccion, id) {
    this._mostrarNarrativa(seccion);

    // No mostrar controles para countdown
    if (id !== "countdown") {
      this.mostrarControles(id);
    }
  },

  /**
   * Inicia secciÃ³n con audio
   */
  _iniciarSeccionConAudio(seccion, id) {
    // Mostrar narrativa inmediatamente
    this._mostrarNarrativa(seccion);

    const esSeccionFinal = ["final", "countdown"].includes(id);

    const iniciarAudio = esSeccionFinal
      ? AudioManager.reproducirFondoFinal()
      : AudioManager.reproducirFondo();

    iniciarAudio.then(() =>
      setTimeout(() => {
        AudioManager.reproducirNarracion(id);
      }, 300)
    );

    AppState.seccionesVisitadas.add(id);
  },

  /**
   * Muestra narrativa
   */
  _mostrarNarrativa(seccion) {
    seccion.querySelector(".narrativa")?.classList.add("visible");
  },

  /**
   * Oculta controles
   */
  _ocultarControles(seccion) {
    [".play-center", ".acciones", ".input-group", ".replay-button"].forEach(
      (selector) => {
        const elemento = seccion.querySelector(selector);
        if (elemento) {
          elemento.classList.remove("visible");
          if (selector === ".play-center") elemento.style.display = "none";
        }
      }
    );

    seccion.querySelector(".narrativa")?.classList.remove("visible");

    if (seccion.id === "intro" && !AppState.playClickeado) {
      seccion.classList.remove("show-content");
    }
  },

  /**
   * Muestra controles despuÃ©s de audio
   */
  mostrarControles(id) {
    const { seccionActiva: seccion } = AppState;
    if (!seccion || seccion.id !== id) return;

    // No mostrar controles para secciones especiales
    if (id === "final" || id === "countdown") {
      console.log(`No mostrar controles para: ${id}`);
      const controles = seccion.querySelectorAll(
        ".acciones, .input-group, .replay-button"
      );
      controles.forEach((control) => {
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
