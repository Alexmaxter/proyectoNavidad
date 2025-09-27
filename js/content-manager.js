// =============================
// MANEJADOR DE CONTENIDO
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
// MANEJADOR DE SECCIONES
// =============================
const SectionManager = {
  /**
   * Muestra una sección específica con transiciones
   * @param {string} id - ID de la sección
   * @param {boolean} saltarAudio - Si saltar la reproducción de audio
   */
  async mostrar(id, saltarAudio = false) {
    await this._transicionEntrada();
    this._prepararSeccion(id);
    this._activarSeccion(id, saltarAudio);
    await this._transicionSalida();
  },

  /**
   * Ejecuta la transición de entrada (fade in)
   */
  async _transicionEntrada() {
    const fadeOverlay = DOM.get("fadeOverlay");
    if (fadeOverlay) fadeOverlay.style.opacity = "1";

    AudioManager.detenerNarraciones();
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
    } else if (saltarAudio || AppState.seccionesVisitadas.has(id)) {
      this._mostrarSeccionDirecta(seccion, id);
    } else {
      this._iniciarSeccionConAudio(seccion, id);
    }

    if (["final2", "finalRegalo"].includes(id)) {
      AudioManager.detenerFondo();
    }
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
    AudioManager.reproducirFondo().then(() =>
      setTimeout(() => {
        AudioManager.reproducirNarracion(id);
        this._mostrarNarrativa(seccion);

        // NUEVA LÓGICA: Si es la sección final, programar aparición del botón durante la narración
        if (id === "final") {
          this._programarBotonFinalDuranteAudio(seccion);
        }
      }, 100)
    );
    AppState.seccionesVisitadas.add(id);
  },

  /**
   * Programa la aparición del botón "Mostrar regalo" durante el audio (a los 125 segundos)
   * @param {HTMLElement} seccion - Sección del final
   */
  _programarBotonFinalDuranteAudio(seccion) {
    const tiempoAparicion = 125000; // 125 segundos en milisegundos

    AppState.temporizadorBotonFinal = setTimeout(() => {
      const acciones = seccion.querySelector(".acciones");
      if (acciones && AppState.seccionActiva?.id === "final") {
        acciones.classList.add("visible");
        console.log("Botón 'Mostrar regalo' activado después de 125 segundos");
      }
    }, tiempoAparicion);
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
   * Muestra los controles después de finalizar el audio
   * @param {string} id - ID de la sección
   */
  mostrarControles(id) {
    const { seccionActiva: seccion } = AppState;
    if (!seccion || seccion.id !== id) return;

    setTimeout(() => {
      const replayButton = seccion.querySelector(".replay-button");
      if (replayButton) {
        replayButton.innerHTML = `<button type="button">${CONFIG.mensajes.repetir}</button>`;
        replayButton.classList.add("visible");
      }

      // Para la sección final, NO mostrar automáticamente las acciones
      // ya que se muestran durante el audio con el temporizador
      if (id !== "final") {
        seccion.querySelector(".acciones")?.classList.add("visible");
      }

      seccion.querySelector(".input-group")?.classList.add("visible");
    }, 500);
  },
};
