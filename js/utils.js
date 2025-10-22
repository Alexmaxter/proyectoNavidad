// =============================
// UTILIDADES
// =============================
const Utils = {
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  normalizar: (str) =>
    str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " "),

  lerp: (inicio, fin, t) => inicio + (fin - inicio) * t,
};

// =============================
// CACHE DOM
// =============================
const DOM = (() => {
  const cache = {};
  return {
    get: (id) => cache[id] ?? (cache[id] = document.getElementById(id)),
    getAll: (selector) => document.querySelectorAll(selector),
    clear: () => Object.keys(cache).forEach((key) => delete cache[key]),
  };
})();

// =============================
// VALIDADOR DE RESPUESTAS
// =============================
const Validation = {
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
      !esVacio && this._esCorrecta(datos.respuestaCorrecta, respuesta);

    this._limpiarEstados(error, input);

    if (esVacio || !esCorrecta) {
      this._mostrarError(error, input, esVacio);
      return;
    }

    this._mostrarExito(input, numeroAcertijo);
  },

  _esCorrecta(tipo, respuesta) {
    const validas = CONFIG.respuestasValidas[tipo];
    return validas ? validas.includes(respuesta) : false;
  },

  _limpiarEstados(error, input) {
    error.classList.remove("show");
    input.classList.remove("input-correct", "input-incorrect", "shake");
  },

  _mostrarError(error, input, esVacio) {
    const mensaje = esVacio
      ? CONFIG.mensajes.errorVacio
      : CONFIG.mensajes.erroresIncorrecto[
          Math.floor(Math.random() * CONFIG.mensajes.erroresIncorrecto.length)
        ];

    error.textContent = mensaje;
    error.classList.add("show");
    input.classList.add("input-incorrect", "shake");

    setTimeout(() => {
      input.value = "";
      input.classList.remove("input-incorrect", "shake");
      error.classList.remove("show");
    }, 3000);
  },

  _mostrarExito(input, numeroAcertijo) {
    input.classList.add("input-correct");
    setTimeout(() => {
      Navigation.navigateTo(`explicacion${numeroAcertijo}`);
    }, 800);
  },
};
