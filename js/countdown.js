/**
 * countdown.js: El Temporizador
 */
const Countdown = {
  _intervalId: null,
  _revealTimeouts: [],
  _previousValues: {}, // Para rastrear cambios (Request 6)

  /**
   * Calcula el tiempo restante, incluyendo AÑOS.
   */
  _calculateTime(targetDate) {
    // ... (idéntico) ...
    const diff = targetDate - new Date().getTime();
    if (diff <= 0) return null;
    const s = 1000,
      m = s * 60,
      h = m * 60,
      d = h * 24,
      y = d * 365.25;
    const años = Math.floor(diff / y);
    const dias = Math.floor((diff % y) / d);
    const horas = Math.floor((diff % d) / h);
    const minutos = Math.floor((diff % h) / m);
    const segundos = Math.floor((diff % m) / s);
    return { años, dias, horas, minutos, segundos };
  },

  /**
   * Revela una unidad del contador con "fade arriba"
   */
  _revealUnit(id, value, delay) {
    const timer = setTimeout(() => {
      const unitEl = document.getElementById(`unit-${id}`);
      const spanEl = document.getElementById(`countdown-${id}`);

      if (unitEl && spanEl) {
        console.log(`[Countdown.js] Revelando: ${id} (delay: ${delay}ms)`);
        // Poner el valor inicial
        const textValue = String(value).padStart(2, "0");
        spanEl.textContent = textValue;
        this._previousValues[id] = textValue; // Guardar valor inicial

        // Añadir clase para la animación CSS (fade arriba)
        unitEl.classList.add("is-visible");
      }
    }, delay);

    this._revealTimeouts.push(timer);
  },

  /**
   * --- NUEVA FUNCIÓN (Request 6) ---
   * Actualiza un número y aplica el "aumento leve" (pulse)
   */
  _updateUnit(id, value) {
    const spanEl = document.getElementById(`countdown-${id}`);
    if (!spanEl) return; // Salir si el elemento no existe

    const textValue = String(value).padStart(2, "0");

    // Solo animar si el valor CAMBIÓ
    if (this._previousValues[id] !== textValue) {
      this._previousValues[id] = textValue; // Actualizar valor
      spanEl.textContent = textValue; // Poner nuevo valor

      // Aplicar el "aumento leve"
      spanEl.classList.add("is-pulsing");

      // Quitar la clase después de que termine la animación (CSS es 150ms)
      setTimeout(() => {
        spanEl.classList.remove("is-pulsing");
      }, 150);
    }
  },

  /**
   * Inicia la cuenta regresiva.
   */
  start(targetDateISO) {
    console.log("[Countdown.js] Iniciando...");
    this.stop();

    const targetDate = new Date(targetDateISO).getTime();

    const initialTime = this._calculateTime(targetDate);

    if (!initialTime) {
      // El tiempo ya se cumplió, revelar todo en 0
      console.log("[Countdown.js] Tiempo cumplido. Revelando en 0.");
      this._revealUnit("seconds", 0, 0);
      this._revealUnit("minutes", 0, 0);
      this._revealUnit("hours", 0, 0);
      this._revealUnit("days", 0, 0);
      this._revealUnit("years", 0, 0);
      return;
    }

    // --- CAMBIO: Revelación con retardo y suspense (Request 3 y 4) ---
    // Empezando por segundos (abajo) y subiendo
    this._revealUnit("seconds", initialTime.segundos, 1500); // 1.5s
    this._revealUnit("minutes", initialTime.minutos, 3000); // 3.0s
    this._revealUnit("hours", initialTime.horas, 4500); // 4.5s
    this._revealUnit("days", initialTime.dias, 6000); // 6.0s
    this._revealUnit("years", initialTime.años, 7500); // 7.5s

    // 3. Iniciar el temporizador de actualización
    this._intervalId = setInterval(() => {
      const time = this._calculateTime(targetDate);

      if (!time) {
        this.stop();
        // Asegurarse de que todo esté en 00 al parar
        this._updateUnit("seconds", 0);
        this._updateUnit("minutes", 0);
        this._updateUnit("hours", 0);
        this._updateUnit("days", 0);
        this._updateUnit("years", 0);
        return;
      }

      // --- CAMBIO: Usar el helper de "aumento leve" (Request 6) ---
      this._updateUnit("seconds", time.segundos);
      this._updateUnit("minutes", time.minutos);
      this._updateUnit("hours", time.horas);
      this._updateUnit("days", time.dias);
      this._updateUnit("years", time.años);
    }, 1000);
  },

  /**
   * Detiene la cuenta regresiva.
   */
  stop() {
    if (this._intervalId) {
      console.log("[Countdown.js] Deteniendo.");
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this._revealTimeouts.forEach(clearTimeout);
    this._revealTimeouts = [];
    this._previousValues = {}; // Limpiar valores
  },
};

export default Countdown;
