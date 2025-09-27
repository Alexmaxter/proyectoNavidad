// =============================
// VALIDADOR DE RESPUESTAS (SOLO ACERTIJOS)
// =============================
const Validation = {
  /**
   * Valida la respuesta de un acertijo específico
   * @param {number} numeroAcertijo - Número del acertijo (1, 2, 3)
   */
  validarRespuesta(numeroAcertijo) {
    const input = DOM.get(`respuesta${numeroAcertijo}`);
    const error = DOM.get(`error${numeroAcertijo}`);
    const datos = CONFIG.textos[`acertijo${numeroAcertijo}`];

    if (!input || !error || !datos) {
      console.warn(
        `No se encontraron elementos para acertijo${numeroAcertijo}`
      );
      return;
    }

    const respuesta = Utils.normalizar(input.value);
    const esVacio = !respuesta;
    const esCorrecta =
      !esVacio && this._esRespuestaCorrecta(datos.respuestaCorrecta, respuesta);

    this._limpiarEstados(error, input);

    if (esVacio || !esCorrecta) {
      this._mostrarError(error, input, esVacio);
      return;
    }

    this._mostrarExito(input, numeroAcertijo);
  },

  /**
   * Verifica si una respuesta es correcta según las opciones válidas
   * @param {string} tipoRespuesta - Tipo de respuesta esperada (constancia, paciencia, disciplina)
   * @param {string} respuestaUsuario - Respuesta normalizada del usuario
   * @returns {boolean} - True si la respuesta es correcta
   */
  _esRespuestaCorrecta(tipoRespuesta, respuestaUsuario) {
    const respuestasValidas = CONFIG.respuestasValidas[tipoRespuesta];
    return respuestasValidas
      ? respuestasValidas.includes(respuestaUsuario)
      : false;
  },

  /**
   * Limpia los estados visuales previos del input y error
   */
  _limpiarEstados(error, input) {
    error.classList.remove("show");
    input.classList.remove("input-correct", "input-incorrect", "shake");
  },

  /**
   * Muestra un error en el input (respuesta vacía o incorrecta)
   */
  _mostrarError(error, input, esVacio) {
    const mensajeError = esVacio
      ? CONFIG.mensajes.errorVacio
      : CONFIG.mensajes.erroresIncorrecto[
          Math.floor(Math.random() * CONFIG.mensajes.erroresIncorrecto.length)
        ];

    error.textContent = mensajeError;
    error.classList.add("show");
    input.classList.add("input-incorrect", "shake");

    setTimeout(() => {
      input.value = "";
      input.classList.remove("input-incorrect", "shake");
      error.classList.remove("show");
    }, 3000);
  },

  /**
   * Muestra el éxito y navega a la siguiente sección
   */
  _mostrarExito(input, numeroAcertijo) {
    input.classList.add("input-correct");

    setTimeout(() => {
      Navigation.navigateTo(`explicacion${numeroAcertijo}`);
    }, 800);
  },
};
