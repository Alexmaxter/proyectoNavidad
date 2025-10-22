// =============================
// CUENTA REGRESIVA OPTIMIZADA
// =============================
const Countdown = {
  fechaObjetivo: null,
  intervalo: null,
  revealTimers: [],
  isInitialized: false,

  init(fechaObjetivo = CONFIG.textos.countdown.fechaCuentaRegresiva) {
    if (this.isInitialized) {
      console.log("⚠️ Countdown ya inicializado, ignorando");
      return;
    }

    console.log("🕐 Iniciando countdown...");
    this.fechaObjetivo = fechaObjetivo;
    this.isInitialized = true;

    this._hideAll();

    setTimeout(() => {
      this._startRevealSequence();
      this._startTimer();
    }, 100);
  },

  _hideAll() {
    const units = ["seconds", "minutes", "hours", "days", "years"];
    units.forEach((id) => {
      const el = DOM.get(id);
      if (el?.parentElement) {
        const unit = el.parentElement;
        unit.style.transition = "none";
        unit.style.opacity = "0";
        unit.style.transform = "translateY(30px) scale(0.8)";
        unit.classList.remove("revealed", "revealing", "glitch-affected");
        el.textContent = "--";
      }
    });

    const titulo = document.querySelector(".countdown-title");
    if (titulo) {
      titulo.style.opacity = "0";
      titulo.style.transform = "translateY(-20px)";
    }
  },

  _startRevealSequence() {
    ["seconds", "minutes", "hours", "days", "years"].forEach((id) => {
      const el = DOM.get(id);
      if (el?.parentElement) {
        el.parentElement.style.transition = "none";
      }
    });

    const titulo = document.querySelector(".countdown-title");
    if (titulo) {
      titulo.style.transition = "all 1s ease-out";
      titulo.style.opacity = "0.9";
      titulo.style.transform = "translateY(0)";
    }

    const sequence = [
      { id: "seconds", delay: 200 },
      { id: "minutes", delay: 4500 },
      { id: "hours", delay: 6900 },
      { id: "days", delay: 9900 },
      { id: "years", delay: 13500 },
    ];

    sequence.forEach(({ id, delay }) => {
      const timer = setTimeout(() => this._reveal(id), delay);
      this.revealTimers.push(timer);
    });
  },

  // Genera valores VERDADERAMENTE aleatorios para cada frame
  _randomGlitch() {
    const rand = () => Math.random();

    return {
      x: rand() * 100 - 50, // -50 a 50
      y: rand() * 80 - 40, // -40 a 40
      scale: 0.2 + rand() * 1.8, // 0.2 a 2.0
      rotate: rand() * 720 - 360, // -360 a 360 grados
      skewX: rand() * 80 - 40, // -40 a 40
      skewY: rand() * 80 - 40, // -40 a 40
      blur: rand() * 8, // 0 a 8 (reducido para menos suavizado)
      brightness: 0.5 + rand() * 4, // 0.5 a 4.5
      saturate: 0.5 + rand() * 5, // 0.5 a 5.5
      hueRotate: rand() * 360, // 0 a 360
      contrast: 0.5 + rand() * 4, // 0.5 a 4.5
      invert: rand() > 0.7 ? rand() : 0, // Ocasionalmente invertir
      shadowR: (rand() - 0.5) * 60, // -30 a 30
      shadowB: (rand() - 0.5) * 60, // -30 a 30
      shadowG: (rand() - 0.5) * 40, // -20 a 20
      shadowY: (rand() - 0.5) * 40, // -20 a 20
      opacity: 0.1 + rand() * 0.9, // 0.1 a 1
    };
  },

  // Anima un elemento con efecto glitch TOTALMENTE aleatorio
  _animateGlitchReveal(container) {
    const el = container.firstElementChild; // El número dentro del container
    const duration = 1000;
    const frameTimes = []; // Tiempos variables entre frames
    let totalTime = 0;

    // Generar tiempos aleatorios para cada frame
    for (let i = 0; i < 30; i++) {
      const frameTime = 15 + Math.random() * 40; // 15-55ms por frame
      frameTimes.push(frameTime);
      totalTime += frameTime;
    }

    let currentFrame = 0;
    const frames = 30;

    const animate = () => {
      if (currentFrame >= frames) {
        // Estado final limpio
        container.style.opacity = "1";
        container.style.transform =
          "translateY(0) scale(1) rotate(0deg) skewX(0deg) skewY(0deg)";
        container.style.filter = "none";
        if (el) el.style.textShadow = "none";
        return;
      }

      const progress = currentFrame / frames;

      // Generar valores NUEVOS y ALEATORIOS en cada frame
      const g = this._randomGlitch();

      // Intensidad del glitch disminuye con el progreso
      const intensity = Math.pow(1 - progress, 1.5);

      // Añadir variación aleatoria adicional a la intensidad
      const randomIntensity = intensity * (0.8 + Math.random() * 0.4);

      container.style.opacity = g.opacity * 0.2 + progress * 0.8;

      container.style.transform = `
        translateX(${g.x * randomIntensity}px) 
        translateY(${g.y * randomIntensity}px)
        scale(${g.scale * randomIntensity + (1 - randomIntensity)}) 
        rotate(${g.rotate * randomIntensity}deg)
        skewX(${g.skewX * randomIntensity}deg)
        skewY(${g.skewY * randomIntensity}deg)
      `;

      const filters = [
        `blur(${g.blur * randomIntensity}px)`,
        `brightness(${g.brightness * randomIntensity + (1 - randomIntensity)})`,
        `saturate(${g.saturate * randomIntensity + (1 - randomIntensity)})`,
        `hue-rotate(${g.hueRotate * randomIntensity}deg)`,
        `contrast(${g.contrast * randomIntensity + (1 - randomIntensity)})`,
      ];

      if (g.invert > 0) {
        filters.push(`invert(${g.invert * randomIntensity})`);
      }

      container.style.filter = filters.join(" ");

      if (el) {
        const shadowIntensity = randomIntensity * (0.7 + Math.random() * 0.3);
        const shadows = [];

        // Sombras RGB aleatorias
        if (Math.random() > 0.3) {
          shadows.push(
            `${
              g.shadowR * shadowIntensity
            }px 0 0 rgba(255, 0, 0, ${shadowIntensity})`
          );
        }
        if (Math.random() > 0.3) {
          shadows.push(
            `${
              g.shadowB * shadowIntensity
            }px 0 0 rgba(0, 255, 255, ${shadowIntensity})`
          );
        }
        if (Math.random() > 0.5) {
          shadows.push(
            `${g.shadowG * shadowIntensity}px ${
              g.shadowY * shadowIntensity
            }px 0 rgba(0, 255, 0, ${shadowIntensity * 0.7})`
          );
        }
        if (Math.random() > 0.6) {
          shadows.push(
            `${-g.shadowR * shadowIntensity}px ${
              g.shadowY * shadowIntensity
            }px 0 rgba(255, 255, 0, ${shadowIntensity * 0.6})`
          );
        }

        el.style.textShadow = shadows.join(", ");
      }

      currentFrame++;
      // Usar tiempo aleatorio para el próximo frame
      setTimeout(animate, frameTimes[currentFrame] || 30);
    };

    animate();
  },

  // Anima elementos afectados con glitch aleatorio más corto
  _animateGlitchAffected(container) {
    const el = container.firstElementChild; // El número dentro del container
    const duration = 600;
    const frameTimes = [];

    for (let i = 0; i < 20; i++) {
      frameTimes.push(15 + Math.random() * 35);
    }

    let currentFrame = 0;
    const frames = 20;

    const animate = () => {
      if (currentFrame >= frames) {
        container.style.transform =
          "translateY(0) scale(1) rotate(0deg) skewX(0deg) skewY(0deg)";
        container.style.filter = "none";
        if (el) el.style.textShadow = "none";
        return;
      }

      const progress = currentFrame / frames;
      const g = this._randomGlitch();

      const intensity = Math.pow(1 - progress, 1.8) * 0.6;
      const randomIntensity = intensity * (0.7 + Math.random() * 0.6);

      container.style.transform = `
        translateX(${g.x * randomIntensity * 0.5}px) 
        scale(${1 + (g.scale - 1) * randomIntensity * 0.4}) 
        rotate(${g.rotate * randomIntensity * 0.3}deg)
        skewX(${g.skewX * randomIntensity * 0.5}deg)
        skewY(${g.skewY * randomIntensity * 0.3}deg)
      `;

      const filters = [
        `brightness(${1 + (g.brightness - 1) * randomIntensity * 0.5})`,
        `saturate(${1 + (g.saturate - 1) * randomIntensity * 0.5})`,
        `hue-rotate(${g.hueRotate * randomIntensity * 0.3}deg)`,
        `contrast(${1 + (g.contrast - 1) * randomIntensity * 0.4})`,
      ];

      if (Math.random() > 0.8) {
        filters.push(`blur(${g.blur * randomIntensity * 0.3}px)`);
      }

      container.style.filter = filters.join(" ");

      if (el) {
        const shadowIntensity = randomIntensity * 0.7;
        const shadows = [];

        if (Math.random() > 0.4) {
          shadows.push(
            `${
              g.shadowR * shadowIntensity
            }px 0 0 rgba(255, 0, 0, ${shadowIntensity})`
          );
        }
        if (Math.random() > 0.4) {
          shadows.push(
            `${
              g.shadowB * shadowIntensity
            }px 0 0 rgba(0, 255, 255, ${shadowIntensity})`
          );
        }

        el.style.textShadow = shadows.join(", ");
      }

      currentFrame++;
      setTimeout(animate, frameTimes[currentFrame] || 30);
    };

    animate();
  },

  _reveal(id) {
    const el = DOM.get(id);
    if (!el?.parentElement) return;

    const container = el.parentElement;
    this._updateUnit(id);

    // PRIMERO: Aplicar efecto glitch a elementos ya revelados
    this._applyGlitchToRevealed();

    // DESPUÉS: Revelar el nuevo elemento con glitch
    setTimeout(() => {
      container.classList.add("revealing");
      this._animateGlitchReveal(container);
    }, 100); // Pequeño delay para que se note la separación

    setTimeout(
      () => {
        container.classList.add("revealed");
        container.classList.remove("revealing");

        if (id === "years") {
          let pulseCount = 0;
          const pulseInterval = setInterval(() => {
            const scale = 1 + Math.sin(pulseCount * 0.5) * 0.1;
            const brightness = 1 + Math.sin(pulseCount * 0.5) * 0.3;
            container.style.transform = `scale(${scale})`;
            container.style.filter = `brightness(${brightness})`;
            pulseCount++;

            if (pulseCount > 20) {
              clearInterval(pulseInterval);
              container.style.transform = "scale(1)";
              container.style.filter = "none";
            }
          }, 100);
        }
      },
      id === "years" ? 1400 : 1000
    );
  },

  _applyGlitchToRevealed() {
    // Buscar TODOS los elementos que ya tienen la clase 'revealed'
    const allUnits = document.querySelectorAll(".countdown-unit");

    console.log("🔍 Total de unidades encontradas:", allUnits.length);

    allUnits.forEach((unit) => {
      console.log("Unidad:", unit.classList.toString());

      // Solo aplicar glitch a los que YA están revelados
      if (unit.classList.contains("revealed")) {
        console.log("✅ Aplicando glitch a unidad revelada");
        unit.classList.add("glitch-affected");
        this._animateGlitchAffected(unit);

        setTimeout(() => {
          unit.classList.remove("glitch-affected");
        }, 600);
      }
    });
  },

  _startTimer() {
    this._update();
    this.intervalo = setInterval(() => this._update(), 1000);
  },

  _update() {
    const diff = this.fechaObjetivo - new Date();

    if (diff <= 0) {
      this._showCompleted();
      return;
    }

    const time = this._calculateTime(diff);
    this._updateDisplay(time);
  },

  _updateUnit(id) {
    const diff = this.fechaObjetivo - new Date();
    if (diff <= 0) return;

    const time = this._calculateTime(diff);
    const el = DOM.get(id);
    if (!el) return;

    const values = {
      years: time.años,
      days: time.dias,
      hours: time.horas,
      minutes: time.minutos,
      seconds: time.segundos,
    };

    if (values[id] !== undefined) {
      el.textContent = String(values[id]).padStart(2, "0");
    }
  },

  _calculateTime(diff) {
    return {
      años: Math.floor(diff / (1000 * 60 * 60 * 24 * 365)),
      dias: Math.floor(
        (diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24)
      ),
      horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      segundos: Math.floor((diff % (1000 * 60)) / 1000),
    };
  },

  _updateDisplay({ años, dias, horas, minutos, segundos }) {
    const elements = ["years", "days", "hours", "minutes", "seconds"];
    const values = [años, dias, horas, minutos, segundos];

    elements.forEach((id, i) => {
      const el = DOM.get(id);
      if (!el) return;

      const container = el.parentElement;
      if (!container.classList.contains("revealed")) return;

      const newValue = String(values[i]).padStart(2, "0");
      if (el.textContent !== newValue) {
        el.style.transform = "scale(1.1)";
        el.style.transition = "transform 0.15s ease-out";

        setTimeout(() => {
          el.textContent = newValue;
          el.style.transform = "scale(1)";
        }, 75);
      }
    });
  },

  _showCompleted() {
    const countdown = DOM.get("countdown");
    if (countdown) {
      countdown.innerHTML = `<div class="countdown-completed">${CONFIG.mensajes.cuentaRegresiva.completado}</div>`;
    }
    this.destruir();
  },

  destruir() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }

    this.revealTimers.forEach((timer) => clearTimeout(timer));
    this.revealTimers = [];

    this.isInitialized = false;

    console.log("🕐 Countdown destruido");
  },
};
