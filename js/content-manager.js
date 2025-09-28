// =============================
// MANEJADOR DE CONTENIDO - ACTUALIZADO
// =============================
const ContentManager = {
  /**
   * Renderiza el contenido de una sección específica
   * @param {string} id - ID de la sección
   */
  render(id) {
    const seccion = DOM.get(id);
    const datos = CONFIG.textos[id];
    if (!seccion || !datos) return;

    // Las secciones especiales como "final" y "finalRegalo" no necesitan renderizado estándar
    if (id === "final" || id === "finalRegalo") {
      console.log(`Saltando renderizado estándar para sección especial: ${id}`);
      return;
    }

    this._renderTitulo(seccion, datos);
    this._renderNarrativa(seccion, datos);
    this._renderAcciones(seccion, datos, id);
  },

  /**
   * Renderiza el título de la sección
   */
  _renderTitulo(seccion, datos) {
    const titulo = seccion.querySelector(".titulo h1");
    if (titulo) titulo.textContent = datos.titulo || "";
  },

  /**
   * Renderiza la narrativa de la sección
   */
  _renderNarrativa(seccion, datos) {
    const narrativa = seccion.querySelector(".narrativa");
    if (narrativa) narrativa.innerHTML = `<p>${datos.narrativa}</p>`;
  },

  /**
   * Renderiza los botones de acción según el tipo de sección
   */
  _renderAcciones(seccion, datos, id) {
    const acciones = seccion.querySelector(".acciones");
    if (!acciones) return;

    if (datos.botones) {
      // Múltiples botones (decisión, confirmaciones)
      acciones.innerHTML = datos.botones
        .map((texto) => `<button type="button">${texto}</button>`)
        .join("");
    } else if (datos.boton) {
      // Un solo botón (intro, final)
      acciones.innerHTML = `<button type="button">${datos.boton}</button>`;
    } else if (id.startsWith("explicacion")) {
      // Botón siguiente para explicaciones
      acciones.innerHTML = `<button type="button" class="siguiente">${
        CONFIG.mensajes.siguiente || "Siguiente"
      }</button>`;
    } else {
      acciones.innerHTML = "";
    }
  },
};

// =============================
// MANEJADOR DE SECCIONES - ACTUALIZADO
// =============================
const SectionManager = {
  /**
   * Muestra una sección específica con transiciones mejoradas
   * @param {string} id - ID de la sección
   * @param {boolean} saltarAudio - Si saltar la reproducción de audio
   */
  async mostrar(id, saltarAudio = false) {
    // Guardar sección anterior para manejo de transiciones de audio
    const seccionAnterior = AppState.seccionActiva?.id;
    AppState.seccionAnterior = seccionAnterior;

    await this._transicionEntrada();
    this._prepararSeccion(id);
    this._activarSeccion(id, saltarAudio);
    await this._transicionSalida();

    // Manejar transición de audio después de mostrar la sección
    if (seccionAnterior && seccionAnterior !== id) {
      AudioManager.manejarTransicionSeccion(seccionAnterior, id);
    }
  },

  /**
   * Ejecuta la transición de entrada (fade in)
   */
  async _transicionEntrada() {
    const fadeOverlay = DOM.get("fadeOverlay");
    if (fadeOverlay) fadeOverlay.style.opacity = "1";

    AudioManager.detenerNarraciones(); // Asegura que cualquier narración se detenga al iniciar una transición
    await new Promise((r) => setTimeout(r, 400));
  },

  /**
   * Prepara la nueva sección (limpia estado anterior)
   */
  _prepararSeccion(id) {
    DOM.getAll(".section").forEach((s) => s.classList.remove("active"));
    document.body.style.backgroundColor =
      id === "intro" ? "#090a0f" : "#1a1a1a";

    // Asegurar que la transición del bokeh funcione correctamente
    setTimeout(() => {
      Bokeh.transicion(id);
    }, 100);

    // Limpiar temporizador previo si existe
    if (AppState.temporizadorBotonFinal) {
      clearTimeout(AppState.temporizadorBotonFinal);
      AppState.temporizadorBotonFinal = null;
    }
  },

  /**
   * Activa la sección y maneja su lógica específica
   */
  _activarSeccion(id, saltarAudio) {
    const seccion = DOM.get(id);
    if (!seccion) return;

    ContentManager.render(id);
    this._ocultarControles(seccion);
    seccion.classList.add("active");
    AppState.seccionActiva = seccion;

    if (id === "finalRegalo") {
      Countdown.init();
    } else {
      Countdown.destruir();
    }

    this._manejarInicioSeccion(id, seccion, saltarAudio);
  },

  /**
   * Ejecuta la transición de salida (fade out)
   */
  async _transicionSalida() {
    setTimeout(() => {
      const fadeOverlay = DOM.get("fadeOverlay");
      if (fadeOverlay) fadeOverlay.style.opacity = "0";
    }, 100);
  },

  /**
   * Maneja la lógica específica de inicio de cada sección
   */
  _manejarInicioSeccion(id, seccion, saltarAudio) {
    if (id === "intro" && !AppState.playClickeado) {
      this._mostrarBotonPlay(seccion);
    } else if (id === "intro" && AppState.playClickeado) {
      this._iniciarIntroCompleta(seccion, id);
    } else if (id === "final") {
      // Lógica especial para la sección final con video
      this._iniciarSeccionFinalConVideo(seccion, id, saltarAudio);
    } else if (saltarAudio || AppState.seccionesVisitadas.has(id)) {
      this._mostrarSeccionDirecta(seccion, id);
    } else {
      this._iniciarSeccionConAudio(seccion, id);
    }

    // Manejo especial para secciones finales
    if (["final2", "finalRegalo"].includes(id)) {
      this._manejarSeccionFinal(id);
    }

    // Para finalRegalo, reproducir audio inmediatamente después del manejo final
    if (id === "finalRegalo") {
      // Pequeño delay para asegurar que el countdown se inicialice y el silencio se aplique
      setTimeout(() => {
        AudioManager.reproducirNarracion("finalRegalo");
      }, 200);
    }
  },

  /**
   * Maneja el comportamiento específico de las secciones finales
   */
  _manejarSeccionFinal(id) {
    if (id === "final2") {
      // Para final2, detener todos los audios de fondo
      AudioManager.detenerTodosLosAudios();
    } else if (id === "finalRegalo") {
      // Para finalRegalo, mantener silencio completo
      AudioManager.detenerTodosLosAudios();
    }
  },

  /**
   * Inicializa la sección final con video - MODIFICADO
   */
  _iniciarSeccionFinalConVideo(seccion, id, saltarAudio) {
    console.log("Iniciando sección final con video...");

    // Reproducir video automáticamente después de un breve delay
    setTimeout(() => {
      this._reproducirVideoFinal(id);
    }, 500);

    AppState.seccionesVisitadas.add(id);
  },

  /**
   * Reproduce el video de la sección final - MODIFICADO PARA TRANSICIÓN AUTOMÁTICA
   */
  _reproducirVideoFinal(id) {
    const video = DOM.get("final-video");
    const playOverlay = DOM.get("video-play-overlay");

    if (!video) {
      console.warn(
        "Video final no encontrado, navegando a finalRegalo directamente"
      );
      // MODIFICADO: Si no hay video, ir directamente a finalRegalo
      Navigation.navigateTo("finalRegalo");
      return;
    }

    console.log("Preparando video final...");

    // Configurar video
    video.currentTime = 0;
    video.volume = CONFIG.audio.volumenNarracion;
    video.muted = false;

    // Ocultar overlay inmediatamente si existe
    if (playOverlay) {
      playOverlay.classList.add("hidden");
    }

    // MODIFICADO: Configurar eventos del video para transición automática
    const finalizarVideo = () => this._finalizarVideoYNavegar();

    video.onended = finalizarVideo;
    video.onerror = (e) => {
      console.error("Error en el video:", e);
      finalizarVideo();
    };

    // Intentar reproducción automática inmediatamente
    video
      .play()
      .then(() => {
        console.log("Video reproduciendo automáticamente");
        AppState.audioReproduciendo = true;
        AppState.audioActual = video;

        // Iniciar audio navideño paralelamente al video
        setTimeout(() => {
          AudioManager.iniciarAudioNavidadConVideo();
        }, 500);

        // ELIMINADO: Ya no programamos aparición del botón durante el video
        // this._programarBotonFinalDuranteVideo(id);
      })
      .catch((error) => {
        console.warn("Reproducción automática bloqueada:", error);

        // Si falla la reproducción automática, mostrar overlay para click manual
        if (playOverlay) {
          playOverlay.classList.remove("hidden");
          playOverlay.onclick = () => {
            this._iniciarReproduccionManual(video, playOverlay);
          };
        }

        // También permitir click en el video
        video.onclick = () => {
          if (video.paused) {
            this._iniciarReproduccionManual(video, playOverlay);
          }
        };
      });
  },

  /**
   * Maneja la reproducción manual cuando falla la automática - MODIFICADO
   */
  _iniciarReproduccionManual(video, playOverlay) {
    video
      .play()
      .then(() => {
        console.log("Video iniciado manualmente");
        AppState.audioReproduciendo = true;
        AppState.audioActual = video;

        if (playOverlay) {
          playOverlay.classList.add("hidden");
        }

        // Iniciar audio navideño también en reproducción manual
        setTimeout(() => {
          AudioManager.iniciarAudioNavidadConVideo();
        }, 500);

        // ELIMINADO: Ya no programamos aparición del botón
        // this._programarBotonFinalDuranteVideo(id);
      })
      .catch((error) => {
        console.error("Error al iniciar video manualmente:", error);
        this._finalizarVideoYNavegar();
      });
  },

  /**
   * NUEVO: Finaliza la reproducción del video y navega automáticamente a finalRegalo
   */
  _finalizarVideoYNavegar() {
    AppState.audioReproduciendo = false;
    AppState.audioActual = null;

    console.log("Video finalizado, navegando automáticamente a finalRegalo");

    // Navegar directamente a finalRegalo sin mostrar controles
    setTimeout(() => {
      Navigation.navigateTo("finalRegalo");
    }, 1000); // Pequeño delay para suavizar la transición
  },

  /**
   * Muestra el botón de play para la intro
   */
  _mostrarBotonPlay(seccion) {
    const playCentro = seccion.querySelector(".play-center");
    if (playCentro) {
      playCentro.classList.add("visible");
      playCentro.style.display = "flex";
    }
  },

  /**
   * Inicia la intro completa (con audio)
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
   * Muestra la sección directamente (sin audio)
   */
  _mostrarSeccionDirecta(seccion, id) {
    this._mostrarNarrativa(seccion);
    this.mostrarControles(id);
  },

  /**
   * Inicia la sección con audio
   */
  _iniciarSeccionConAudio(seccion, id) {
    // Determinar si necesitamos audio de fondo especial
    const esSeccionFinal = ["final", "finalRegalo"].includes(id);

    const iniciarAudio = esSeccionFinal
      ? AudioManager.reproducirFondoFinal()
      : AudioManager.reproducirFondo();

    iniciarAudio.then(() =>
      setTimeout(() => {
        AudioManager.reproducirNarracion(id);
        this._mostrarNarrativa(seccion);
      }, 100)
    );
    AppState.seccionesVisitadas.add(id);
  },

  /**
   * Muestra la narrativa de la sección
   */
  _mostrarNarrativa(seccion) {
    seccion.querySelector(".narrativa")?.classList.add("visible");
  },

  /**
   * Oculta todos los controles de una sección
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
   * Muestra los controles después de finalizar el audio/video - MODIFICADO
   * @param {string} id - ID de la sección
   */
  mostrarControles(id) {
    const { seccionActiva: seccion } = AppState;
    if (!seccion || seccion.id !== id) return;

    // MODIFICADO: No mostrar controles para las secciones finales
    if (id === "final" || id === "finalRegalo") {
      console.log(`Saltando mostrar controles para sección final: ${id}`);
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
