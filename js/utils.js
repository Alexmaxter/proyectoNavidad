// =============================
// UTILIDADES GENERALES
// =============================
const Utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
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

  fadeAudio(elementoAudio, volumenInicio, volumenFin, duracion, callback) {
    if (!elementoAudio) return callback?.();
    const pasos = 30;
    const tiempoPaso = duracion / pasos;
    const cambio = (volumenFin - volumenInicio) / pasos;
    let volumenActual = volumenInicio;
    let conteo = 0;
    const intervalo = setInterval(() => {
      volumenActual = Math.max(0, Math.min(1, volumenActual + cambio));
      elementoAudio.volume = volumenActual;
      if (
        ++conteo >= pasos ||
        (cambio > 0 && volumenActual >= volumenFin) ||
        (cambio < 0 && volumenActual <= volumenFin)
      ) {
        elementoAudio.volume = volumenFin;
        clearInterval(intervalo);
        callback?.();
      }
    }, tiempoPaso);
  },
};

// =============================
// CACHE DE REFERENCIAS DOM
// =============================
const DOM = (() => {
  const cache = {};
  return {
    get: (id) => cache[id] ?? (cache[id] = document.getElementById(id)),
    getAll: (selector) => document.querySelectorAll(selector),
    clear: () => Object.keys(cache).forEach((key) => delete cache[key]),
  };
})();
