// =============================
// MANEJADOR DE CONTENIDO - ACTUALIZADO Y ARREGLADO
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

    // Las secciones especiales como "final" y "countdown" no necesitan renderizado estándar
    if (id === "final" || id === "countdown") {
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
// MANEJADOR DE SECCIONES - ACTUALIZADO Y ARREGLADO
// =============================
const SectionManager = {
  /**
   * Muestra una sección específica con transiciones mejoradas
   * @param {string} id - ID de la sección
   * @param {boolean} saltarAudio - Si saltar la reproducción de audio
   */
  async mostrar(id, saltarAudio = false) {
    console.log(`Mostrando sección: ${id}, saltarAudio: ${saltarAudio}`);

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
    if (!seccion) {
      console.error(`Sección ${id} no encontrada en el DOM`);
      return;
    }

    ContentManager.render(id);
    this._ocultarControles(seccion);
    seccion.classList.add("active");
    AppState.seccionActiva = seccion;

    if (id === "countdown") {
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
    console.log(`Manejando inicio de sección: ${id}`);

    if (id === "intro" && !AppState.playClickeado) {
      this._mostrarBotonPlay(seccion);
    } else if (id === "intro" && AppState.playClickeado) {
      this._iniciarIntroCompleta(seccion, id);
    } else if (id === "final") {
      // ARREGLADO: Lógica especial para la sección final con video
      this._iniciarSeccionFinalConVideo(seccion, id, saltarAudio);
    } else if (saltarAudio || AppState.seccionesVisitadas.has(id)) {
      this._mostrarSeccionDirecta(seccion, id);
    } else {
      this._iniciarSeccionConAudio(seccion, id);
    }

    // Manejo especial para secciones finales
    if (["final2", "countdown"].includes(id)) {
      this._manejarSeccionFinal(id);
    }

    // ARREGLADO: Para countdown, reproducir audio inmediatamente después del manejo final
    if (id === "countdown") {
      setTimeout(() => {
        AudioManager.reproducirNarracion("countdown");
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
    } else if (id === "countdown") {
      // Para countdown, mantener silencio completo
      AudioManager.detenerTodosLosAudios();
    }
  },

  /**
   * ARREGLADO: Inicializa la sección final con video
   */
  _iniciarSeccionFinalConVideo(seccion, id, saltarAudio) {
    console.log("Iniciando sección final con video...");

    // ARREGLADO: Verificar que la sección final tiene la estructura correcta
    const videoContainer = seccion.querySelector(".video-container");
    const video = DOM.get("Final");

    if (!videoContainer || !video) {
      console.error("Estructura de video no encontrada, navegando a countdown");
      setTimeout(() => {
        Navigation.navigateTo("countdown");
      }, 1000);
      return;
    }

    // ARREGLADO: Asegurar que el contenedor de video es visible
    videoContainer.style.display = "block";
    videoContainer.style.opacity = "1";

    // Reproducir video automáticamente después de un breve delay
    setTimeout(() => {
      this._reproducirVideoFinal(id);
    }, 800); // Aumentado el delay para asegurar que todo esté listo

    AppState.seccionesVisitadas.add(id);
  },

  /**
   * ARREGLADO: Reproduce el video de la sección final
   */
  _reproducirVideoFinal(id) {
    const video = DOM.get("Final");
    const playOverlay = DOM.get("video-play-overlay");

    if (!video) {
      console.error(
        "Video final no encontrado, navegando a countdown directamente"
      );
      Navigation.navigateTo("countdown");
      return;
    }

    console.log("Preparando video final...");

    // ARREGLADO: Verificar que el video tiene una fuente válida
    const source = video.querySelector("source");
    if (!source || !source.src) {
      console.error("Fuente de video no encontrada");
      Navigation.navigateTo("countdown");
      return;
    }

    // Configurar video
    video.currentTime = 0;
    video.volume = CONFIG.audio.volumenNarracion;
    video.muted = false;

    // ARREGLADO: Asegurar que el video es visible
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";

    // Ocultar overlay inmediatamente si existe
    if (playOverlay) {
      playOverlay.classList.add("hidden");
      playOverlay.style.display = "none";
    }

    // ARREGLADO: Configurar eventos del video para transición automática
    const finalizarVideo = () => this._finalizarVideoYNavegar();

    // Limpiar eventos previos
    video.onended = null;
    video.onerror = null;
    video.onloadeddata = null;

    video.onended = finalizarVideo;
    video.onerror = (e) => {
      console.error("Error en el video:", e);
      finalizarVideo();
    };

    // ARREGLADO: Manejar carga del video
    video.onloadeddata = () => {
      console.log("Video cargado correctamente");
    };

    // ARREGLADO: Intentar reproducción con mejor manejo de errores
    const intentarReproduccion = () => {
      return video
        .play()
        .then(() => {
          console.log("Video reproduciendo automáticamente");
          AppState.audioReproduciendo = true;
          AppState.audioActual = video;

          // Iniciar audio navideño paralelamente al video
          setTimeout(() => {
            AudioManager.iniciarAudioNavidadConVideo();
          }, 500);
        })
        .catch((error) => {
          console.warn("Reproducción automática bloqueada:", error);
          this._mostrarControlManualVideo(video, playOverlay);
        });
    };

    // ARREGLADO: Verificar si el video está listo para reproducir
    if (video.readyState >= 3) {
      // HAVE_FUTURE_DATA o mayor
      intentarReproduccion();
    } else {
      video.addEventListener("canplay", intentarReproduccion, { once: true });

      // ARREGLADO: Timeout de seguridad si el video no carga
      setTimeout(() => {
        if (video.readyState < 3) {
          console.error("Timeout: Video no se cargó correctamente");
          finalizarVideo();
        }
      }, 10000); // 10 segundos timeout
    }
  },

  /**
   * ARREGLADO: Muestra controles manuales si falla la reproducción automática
   */
  _mostrarControlManualVideo(video, playOverlay) {
    console.log("Mostrando controles manuales para el video");

    if (playOverlay) {
      playOverlay.classList.remove("hidden");
      playOverlay.style.display = "flex";
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
  },

  /**
   * Maneja la reproducción manual cuando falla la automática
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
          playOverlay.style.display = "none";
        }

        // Iniciar audio navideño también en reproducción manual
        setTimeout(() => {
          AudioManager.iniciarAudioNavidadConVideo();
        }, 500);
      })
      .catch((error) => {
        console.error("Error al iniciar video manualmente:", error);
        this._finalizarVideoYNavegar();
      });
  },

  /**
   * Finaliza la reproducción del video y navega automáticamente a countdown
   */
  _finalizarVideoYNavegar() {
    console.log("Finalizando video y navegando a countdown");

    AppState.audioReproduciendo = false;
    AppState.audioActual = null;

    // ARREGLADO: Detener audio navideño antes de navegar
    AudioManager.detenerbackground_video();

    // Navegar directamente a countdown
    setTimeout(() => {
      console.log("Navegando a countdown...");
      Navigation.navigateTo("countdown");
    }, 1000);
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
    const esSeccionFinal = ["final", "countdown"].includes(id);

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
   * ARREGLADO: Muestra los controles después de finalizar el audio/video
   * @param {string} id - ID de la sección
   */
  mostrarControles(id) {
    const { seccionActiva: seccion } = AppState;
    if (!seccion || seccion.id !== id) return;

    // ARREGLADO: No mostrar controles para las secciones finales
    if (id === "final" || id === "countdown") {
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
