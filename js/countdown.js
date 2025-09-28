// =============================
// CUENTA REGRESIVA CON ANIMACIÓN REVELADORA
// =============================
const Countdown = {
  fechaObjetivo: null,
  intervalo: null,
  revealTimers: [],
  initialized: false, // Para controlar el estado inicial

  /**
   * Inicializa la cuenta regresiva con una fecha objetivo
   * @param {Date} fechaObjetivo - Fecha objetivo para la cuenta regresiva
   */
  init(fechaObjetivo = CONFIG.textos.countdown.fechaCuentaRegresiva) {
    this.fechaObjetivo = fechaObjetivo;
    this.initialized = false;

    // PRIMERO configurar todo oculto
    this.ocultarTodoInicialmente();

    // DESPUÉS iniciar las animaciones
    setTimeout(() => {
      this.prepararAnimacionRevelacion();
      this.actualizar();
      this.intervalo = setInterval(() => this.actualizar(), 1000);
      this.initialized = true;
    }, 100);
  },

  /**
   * Oculta todos los elementos desde el inicio
   */
  ocultarTodoInicialmente() {
    const unidades = ["seconds", "minutes", "hours", "days", "years"];

    unidades.forEach((id) => {
      const elemento = DOM.get(id);
      if (elemento && elemento.parentElement) {
        const unit = elemento.parentElement;
        // Ocultar completamente sin transiciones
        unit.style.transition = "none";
        unit.style.opacity = "0";
        unit.style.transform = "translateY(30px) scale(0.8)";
        unit.classList.remove("revealed", "revealing");

        // Limpiar contenido inicial para evitar flash
        elemento.textContent = "--";
      }
    });

    // Ocultar título también
    const titulo = document.querySelector(".countdown-title");
    if (titulo) {
      titulo.style.opacity = "0";
      titulo.style.transform = "translateY(-20px)";
    }
  },

  /**
   * Prepara la animación de revelación progresiva
   */
  prepararAnimacionRevelacion() {
    // Reactivar transiciones después del setup inicial
    const unidades = ["seconds", "minutes", "hours", "days", "years"];
    unidades.forEach((id) => {
      const elemento = DOM.get(id);
      if (elemento && elemento.parentElement) {
        const unit = elemento.parentElement;
        unit.style.transition =
          "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      }
    });

    // Mostrar título primero
    const titulo = document.querySelector(".countdown-title");
    if (titulo) {
      titulo.style.transition = "all 1s ease-out";
      titulo.style.opacity = "0.9";
      titulo.style.transform = "translateY(0)";
    }

    // Secuencia de revelación con delays
    const secuenciaRevelacion = [
      { id: "seconds", delay: 200, descripcion: "Segundos" },
      { id: "minutes", delay: 4500, descripcion: "Minutos" },
      { id: "hours", delay: 6900, descripcion: "Horas" },
      { id: "days", delay: 9900, descripcion: "Días" },
      { id: "years", delay: 13500, descripcion: "AÑOS - Gran revelación" },
    ];

    secuenciaRevelacion.forEach(({ id, delay, descripcion }) => {
      const timer = setTimeout(() => {
        this.revelarUnidad(id);
        console.log(`Revelado: ${descripcion}`);
      }, delay);

      this.revealTimers.push(timer);
    });
  },

  /**
   * Revela una unidad específica con animación
   * @param {string} id - ID de la unidad a revelar
   */
  revelarUnidad(id) {
    const elemento = DOM.get(id);
    if (!elemento || !elemento.parentElement) return;

    const contenedor = elemento.parentElement;

    // Calcular y mostrar el valor actual antes de la animación
    this._actualizarUnidadEspecifica(id);

    // Añadir clase de revelación para trigger de animación
    contenedor.classList.add("revealing");

    // Animar la revelación
    contenedor.style.opacity = "1";
    contenedor.style.transform = "translateY(0) scale(1)";

    // Después de la animación, marcar como revelado
    setTimeout(
      () => {
        contenedor.classList.add("revealed");
        contenedor.classList.remove("revealing");

        // Efecto especial para años
        if (id === "years") {
          this.aplicarEfectoEspecialAnos(contenedor);
        }
      },
      id === "years" ? 1200 : 800
    );
  },

  /**
   * Aplica efecto especial cuando se revelan los años
   * @param {HTMLElement} contenedor - Contenedor del elemento años
   */
  aplicarEfectoEspecialAnos(contenedor) {
    // Efecto de brillo y escala especial para los años
    contenedor.style.animation = "specialYearsEffect 2s ease-out";

    // Agregar clase especial para efectos CSS adicionales si existen
    contenedor.classList.add("years-special-effect");

    // Remover el efecto después de la animación
    setTimeout(() => {
      contenedor.style.animation = "";
      contenedor.classList.remove("years-special-effect");
    }, 2000);

    console.log("Efecto especial aplicado a los años");
  },

  /**
   * Actualiza una unidad específica con su valor actual
   * @param {string} id - ID de la unidad a actualizar
   */
  _actualizarUnidadEspecifica(id) {
    const ahora = new Date();
    const diferencia = this.fechaObjetivo - ahora;

    if (diferencia <= 0) return;

    const tiempo = this._calcularTiempo(diferencia);
    const elemento = DOM.get(id);

    if (!elemento) return;

    const mapeoValores = {
      years: tiempo.años,
      days: tiempo.dias,
      hours: tiempo.horas,
      minutes: tiempo.minutos,
      seconds: tiempo.segundos,
    };

    const valor = mapeoValores[id];
    if (valor !== undefined) {
      elemento.textContent = valor.toString().padStart(2, "0");
    }
  },

  /**
   * Actualiza el display de la cuenta regresiva
   */
  actualizar() {
    if (!this.initialized) return;

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
        const contenedor = elemento.parentElement;
        const estaRevelado = contenedor.classList.contains("revealed");

        // Solo actualizar si ya está revelado
        if (estaRevelado) {
          const nuevoValor = valores[index].toString().padStart(2, "0");

          if (elemento.textContent !== nuevoValor) {
            // Animación sutil de cambio de número
            elemento.style.transform = "scale(1.1)";
            elemento.style.transition = "transform 0.15s ease-out";

            setTimeout(() => {
              elemento.textContent = nuevoValor;
              elemento.style.transform = "scale(1)";
            }, 75);
          }
        }
      }
    });
  },

  /**
   * Muestra el mensaje de cuenta regresiva completada
   */
  mostrarCompletado() {
    const countdown = DOM.get("countdown");
    if (countdown) {
      countdown.innerHTML = `
        <div class="countdown-completed">
          ${CONFIG.mensajes.cuentaRegresiva.completado}
        </div>
      `;
    }
    this.destruir();
  },

  /**
   * Destruye el intervalo y los temporizadores de revelación
   */
  destruir() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }

    // Limpiar temporizadores de revelación
    this.revealTimers.forEach((timer) => clearTimeout(timer));
    this.revealTimers = [];

    this.initialized = false;
  },
};
