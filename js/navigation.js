// =============================
// NAVEGACIÓN CON HASH ROUTING - ARREGLADO
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

    console.log(
      `Navegando desde ${seccionId} índice ${botonIndex} hacia ${destino}`
    );

    // Usar hash routing en lugar de navegación de página
    this.navigateTo(destino);
  },

  /**
   * ARREGLADO: Navega a una sección específica usando hash routing
   * @param {string} sectionId - ID de la sección destino
   */
  navigateTo(sectionId) {
    console.log(`NavigateTo llamado para: ${sectionId}`);

    if (!CONFIG.textos[sectionId]) {
      console.error(`Sección ${sectionId} no existe en CONFIG.textos`);
      return;
    }

    // Verificar que la sección existe en el DOM
    const seccionDestino = DOM.get(sectionId);
    if (!seccionDestino) {
      console.error(`Sección ${sectionId} no existe en el DOM`);
      return;
    }

    // Evitar loops infinitos
    if (window.location.hash.slice(1) === sectionId) {
      console.log(`Ya estamos en la sección ${sectionId}, evitando loop`);
      return;
    }

    // ARREGLADO: Manejo especial para navegación a sección final
    if (sectionId === "final") {
      console.log("Navegando a sección final, preparando audio de fondo final");
      // Asegurar inicio de fondo final antes de la navegación
      AudioManager.reproducirFondoFinal().catch((error) => {
        console.warn("Error al iniciar audio de fondo final:", error);
      });
    }

    // ARREGLADO: Forzar actualización del hash incluso si es similar
    if (window.location.hash) {
      // Limpiar hash primero para forzar el cambio
      history.replaceState(null, null, " ");
      setTimeout(() => {
        window.location.hash = sectionId;
      }, 50);
    } else {
      window.location.hash = sectionId;
    }
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

    console.log(`Click en botón índice ${indice} de sección ${seccion.id}`);
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
   * ARREGLADO: Navegación desde explicaciones (botón "Siguiente")
   */
  continuarDesdeExplicacion(numeroExplicacion) {
    console.log(`Continuando desde explicacion${numeroExplicacion}`);

    const destinos = { 1: "acertijo2", 2: "acertijo3", 3: "final" };
    const destino = destinos[numeroExplicacion];

    if (destino) {
      console.log(`Navegando de explicacion${numeroExplicacion} a ${destino}`);

      // ARREGLADO: Para explicacion3 -> final, asegurar que el DOM esté listo
      if (numeroExplicacion === 3 && destino === "final") {
        // Verificar que la sección final existe antes de navegar
        const seccionFinal = DOM.get("final");
        const video = DOM.get("final-video");

        if (!seccionFinal) {
          console.error("Sección final no encontrada en DOM");
          // Fallback a finalRegalo si final no existe
          this.navigateTo("finalRegalo");
          return;
        }

        if (!video) {
          console.warn(
            "Video no encontrado, navegando directamente a finalRegalo"
          );
          this.navigateTo("finalRegalo");
          return;
        }

        console.log("Elementos de sección final verificados, navegando...");
      }

      this.navigateTo(destino);
    } else {
      console.error(
        `No hay destino definido para explicacion${numeroExplicacion}`
      );
    }
  },
};
