// =============================
// CUENTA REGRESIVA
// =============================
const Countdown = {
  fechaObjetivo: null,
  intervalo: null,

  /**
   * Inicializa la cuenta regresiva con una fecha objetivo
   * @param {Date} fechaObjetivo - Fecha objetivo para la cuenta regresiva
   */
  init(fechaObjetivo = CONFIG.textos.final.fechaCuentaRegresiva) {
    this.fechaObjetivo = fechaObjetivo;
    this.actualizar();
    this.intervalo = setInterval(() => this.actualizar(), 1000);
  },

  /**
   * Actualiza el display de la cuenta regresiva
   */
  actualizar() {
    const ahora = new Date();
    const diferencia = this.fechaObjetivo - ahora;

    if (diferencia <= 0) {
      this.mostrarCompletado();
      return;
    }

    const tiempo = this._calcularTiempo(diferencia);
    this._actualizarDisplay(tiempo);
  },

  /**
   * Calcula el tiempo restante en diferentes unidades
   * @param {number} diferencia - Diferencia en millisegundos
   * @returns {Object} Objeto con años, días, horas, minutos y segundos
   */
  _calcularTiempo(diferencia) {
    return {
      años: Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365)),
      dias: Math.floor(
        (diferencia % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24)
      ),
      horas: Math.floor(
        (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutos: Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)),
      segundos: Math.floor((diferencia % (1000 * 60)) / 1000),
    };
  },

  /**
   * Actualiza los elementos del display con los valores de tiempo
   * @param {Object} tiempo - Objeto con los valores de tiempo
   */
  _actualizarDisplay({ años, dias, horas, minutos, segundos }) {
    const elementos = ["years", "days", "hours", "minutes", "seconds"];
    const valores = [años, dias, horas, minutos, segundos];

    elementos.forEach((id, index) => {
      const elemento = DOM.get(id);
      if (elemento) {
        elemento.textContent = valores[index].toString().padStart(2, "0");
      }
    });
  },

  /**
   * Muestra el mensaje de cuenta regresiva completada
   */
  mostrarCompletado() {
    const countdown = DOM.get("countdown");
    if (countdown) {
      countdown.innerHTML = `<div class="countdown-completed">${CONFIG.mensajes.cuentaRegresiva.completado}</div>`;
    }
    this.destruir();
  },

  /**
   * Destruye el intervalo de la cuenta regresiva
   */
  destruir() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  },
};
