// =============================
// NAVEGACIÓN SIMPLIFICADA
// =============================
const Navigation = {
  /**
   * Navega basándose en la sección actual y la posición del botón clickeado
   * @param {string} seccionId - ID de la sección actual
   * @param {number} botonIndex - Índice del botón (0 = primero, 1 = segundo, etc.)
   */
  navegarPorPosicion(seccionId, botonIndex) {
    const destino = CONFIG.navegacion[seccionId]?.[botonIndex];

    if (!destino) {
      console.warn(`No hay destino definido para ${seccionId}[${botonIndex}]`);
      return;
    }

    // Saltar audio si regresamos a una sección ya visitada
    const saltarAudio =
      destino === "decision" && AppState.seccionesVisitadas.has("decision");

    SectionManager.mostrar(destino, saltarAudio);
  },

  /**
   * Maneja el click en botones de acción
   * @param {HTMLElement} boton - El botón clickeado
   * @param {HTMLElement} seccion - La sección actual
   */
  manejarClickBoton(boton, seccion) {
    // Obtener la posición del botón dentro de su contenedor
    const botones = [...seccion.querySelectorAll(".acciones button")];
    const indice = botones.indexOf(boton);

    if (indice === -1) {
      console.warn("No se pudo determinar el índice del botón");
      return;
    }

    this.navegarPorPosicion(seccion.id, indice);
  },

  /**
   * Maneja botones especiales (play, replay, etc.)
   * @param {HTMLElement} target - El elemento clickeado
   * @param {HTMLElement} seccion - La sección actual
   */
  manejarBotonEspecial(target, seccion) {
    if (target.closest(".play-center button")) {
      this._manejarBotonPlay(seccion);
      return true;
    }

    if (target.closest(".replay-button button")) {
      AudioManager.reproducirNarracion(seccion.id);
      return true;
    }

    if (target.closest(".send-button")) {
      const numero = seccion.id.match(/^acertijo(\d+)$/)?.[1];
      if (numero) {
        Validation.validarRespuesta(+numero);
      }
      return true;
    }

    return false;
  },

  /**
   * Maneja el botón de play en la sección intro
   */
  _manejarBotonPlay(seccion) {
    const playCentro = seccion.querySelector(".play-center");
    if (playCentro) {
      playCentro.style.display = "none";
      playCentro.classList.remove("visible");
    }

    AppState.playClickeado = true;
    seccion.classList.add("show-content");

    AudioManager.reproducirFondo().then(() => {
      AudioManager.reproducirNarracion(seccion.id);
      SectionManager._mostrarNarrativa(seccion);
    });
  },

  /**
   * Navegación desde explicaciones (botón "Siguiente")
   */
  continuarDesdeExplicacion(numeroExplicacion) {
    const destinos = { 1: "acertijo2", 2: "acertijo3", 3: "final" };
    const destino = destinos[numeroExplicacion];

    if (destino) {
      SectionManager.mostrar(destino);
    }
  },
};
