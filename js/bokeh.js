const Bokeh = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  items: [],

  configuracionColores: {
    intro: {
      fondo: ["#242b3aff", "#60b48c"],
      colores: [
        ["#3cb488", "#60b48c"],
        ["#4cc498", "#70c49c"],
        ["#2ca478", "#50a47c"],
      ],
      cantidad: 15,
      cantidadDefinidos: 6,
    },
    decision: {
      fondo: ["#0f1a0a", "#54ff90"],
      colores: [
        ["#64ffa0", "#88ffb4"],
        ["#74ffb0", "#98ffc4"],
        ["#54ff90", "#78ffa4"],
      ],
      cantidad: 14,
      cantidadDefinidos: 6,
    },
    confirmacion1: {
      fondo: ["#0a1a1f", "#1890a4"],
      colores: [
        ["#28a0b4", "#4cb4c8"],
        ["#38b0c4", "#5cc4d8"],
        ["#1890a4", "#3ca4b8"],
      ],
      cantidad: 12,
      cantidadDefinidos: 4,
    },
    confirmacion2: {
      fondo: ["#1f1a0a", "#ffb854"],
      colores: [
        ["#ffc864", "#ffdc88"],
        ["#ffd874", "#ffec98"],
        ["#ffb854", "#ffcc78"],
      ],
      cantidad: 14,
      cantidadDefinidos: 6,
    },
    acertijo1: {
      fondo: ["#1a0a1f", "#3a005cff"],
      colores: [
        ["#ff64ff", "#ff88ff"],
        ["#ff74ff", "#ff98ff"],
        ["#ff54ff", "#ff78ff"],
      ],
      cantidad: 13,
      cantidadDefinidos: 5,
    },
    explicacion1: {
      fondo: ["#0a1f16", "#005a30ff"],
      colores: [
        ["#50c8a0", "#74dcb4"],
        ["#60d8b0", "#84ecc4"],
        ["#40b890", "#64cca4"],
      ],
      cantidad: 15,
      cantidadDefinidos: 8,
    },
    acertijo2: {
      fondo: ["#0a1f1f", "#005a5aff"],
      colores: [
        ["#64ffff", "#88ffff"],
        ["#74ffff", "#98ffff"],
        ["#54ffff", "#78ffff"],
      ],
      cantidad: 12,
      cantidadDefinidos: 4,
    },
    explicacion2: {
      fondo: ["#0a1f16", "#005a30ff"],
      colores: [
        ["#78f0ff", "#9cf4ff"],
        ["#88f4ff", "#acf8ffff"],
        ["#68ecff", "#8cf0ff"],
      ],
      cantidad: 17,
      cantidadDefinidos: 8,
    },
    acertijo3: {
      fondo: ["#1f160a", "#5f3300ff"],
      colores: [
        ["#ffb464", "#ffc888"],
        ["#ffc474", "#ffd898"],
        ["#ffa454", "#ffb878"],
      ],
      cantidad: 13,
      cantidadDefinidos: 5,
    },
    explicacion3: {
      fondo: ["#1f1f0a", "#3a3a0f"],
      colores: [
        ["#f0ff78", "#f4ff9c"],
        ["#f4ff88", "#f8ffac"],
        ["#ecff68", "#f0ff8c"],
      ],
      cantidad: 18,
      cantidadDefinidos: 9,
    },
    final: {
      fondo: ["#000000", "#000000"], // Changed to solid black
      colores: [],
      cantidad: 0,
      cantidadDefinidos: 0,
    },
    finalRegalo: {
      fondo: ["#000000", "#000000"],
      colores: [],
      cantidad: 0,
      cantidadDefinidos: 0,
    },
    final2: {
      fondo: ["#0a1f14", "#0f4a28"],
      colores: [
        ["#64ffc8", "#88ffdc"],
        ["#74ffd8", "#98ffec"],
        ["#54ffb8", "#78ffcc"],
      ],
      cantidad: 19,
      cantidadDefinidos: 9,
    },
  },

  colorFondoActual: ["#0a0f1a", "#1a0f2a"],
  colorFondoObjetivo: ["#0a0f1a", "#1a0f2a"],

  init() {
    this.canvas = document.getElementById("bokehCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.redimensionar();

    window.addEventListener("resize", () => {
      this.redimensionar();
    });

    this._crearElementos("intro");
    this._configurarInteracciones();
    this.animar();
  },

  redimensionar() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },

  transicion(idSeccion) {
    const config = this.configuracionColores[idSeccion];
    if (!config) return;

    this.colorFondoObjetivo = [...config.fondo];

    // Para final y finalRegalo, limpiar todos los elementos
    if (idSeccion === "final" || idSeccion === "finalRegalo") {
      this.items = [];
      return;
    }

    this._ajustarCantidadElementos(config);
    this._actualizarColoresElementos(config);

    // Asignar nuevas posiciones objetivo para animación suave
    this.items.forEach((item) => {
      item.targetX = this._rand(0, this.width);
      item.targetY = this._rand(0, this.height);
    });
  },

  _crearElementos(idSeccion) {
    const config =
      this.configuracionColores[idSeccion] || this.configuracionColores.intro;
    this.items = [];
    this.colorFondoObjetivo = [...config.fondo];

    // No crear elementos para final o finalRegalo
    if (idSeccion === "final" || idSeccion === "finalRegalo") return;

    this._generarElementosBlur(config);
    this._generarElementosDefinidos(config);
  },

  _generarElementosBlur(config) {
    for (let i = 0; i < config.cantidad; i++)
      this._crearElemento("blur", config, [8, 20], [15, 200]);
  },
  _generarElementosDefinidos(config) {
    for (let i = 0; i < (config.cantidadDefinidos || 0); i++)
      this._crearElemento("defined", config, [0, 0], [8, 75]);
  },

  _crearElemento(tipo, config, blurRange, radiusRange) {
    const radius = this._rand(radiusRange[0], radiusRange[1]);
    const blur = tipo === "blur" ? this._rand(blurRange[0], blurRange[1]) : 0;
    const x = this._rand(0, this.width),
      y = this._rand(0, this.height);
    const colorSet =
      config.colores[Math.floor(Math.random() * config.colores.length)] ||
      config.colores[0];
    const directionX = this._rand(-0.5, 0.5),
      directionY = this._rand(-0.5, 0.5);

    this.items.push({
      x,
      y,
      targetX: x,
      targetY: y,
      radius,
      originalRadius: radius,
      blur,
      type: tipo,
      initialXDirection: directionX,
      initialYDirection: directionY,
      initialBlurDirection: directionX,
      colorOne: colorSet[0],
      colorTwo: colorSet[1],
      targetColorOne: colorSet[0],
      targetColorTwo: colorSet[1],
      pulsePhase: Math.random() * Math.PI * 2,
      _phaseOffset: Math.random() * Math.PI * 2,
      opacity: tipo === "defined" ? this._rand(0.15, 0.3) : 0.5,
      targetOpacity: tipo === "defined" ? this._rand(0.15, 0.4) : 0.5,
    });
  },

  _ajustarCantidadElementos(config) {
    const blurItems = this.items.filter((i) => i.type === "blur");
    const definedItems = this.items.filter((i) => i.type === "defined");
    this._ajustarTipoElementos(
      blurItems,
      config.cantidad,
      "blur",
      config,
      [8, 45],
      [15, 85]
    );
    this._ajustarTipoElementos(
      definedItems,
      config.cantidadDefinidos || 0,
      "defined",
      config,
      [0, 0],
      [8, 25]
    );
  },

  _ajustarTipoElementos(
    items,
    targetCount,
    tipo,
    config,
    blurRange,
    radiusRange
  ) {
    const diff = targetCount - items.length;
    if (diff > 0)
      for (let i = 0; i < diff; i++)
        this._crearElemento(tipo, config, blurRange, radiusRange);
    else if (diff < 0)
      this.items = this.items.filter(
        (item) => item.type !== tipo || items.indexOf(item) < targetCount
      );
  },

  _actualizarColoresElementos(config) {
    this.items.forEach((item) => {
      const colorSet =
        config.colores[Math.floor(Math.random() * config.colores.length)];
      item.targetColorOne = colorSet[0];
      item.targetColorTwo = colorSet[1];
      if (item.type === "defined") item.targetOpacity = this._rand(0.15, 0.4);
    });
  },

  _configurarInteracciones() {
    if (!this.canvas) return;
    this.canvas.addEventListener("mousemove", ({ clientX, clientY }) => {
      this.items.forEach((item) => {
        const dx = clientX - item.x,
          dy = clientY - item.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 150) {
          const force = ((150 - distance) / 150) * 0.05;
          item.initialXDirection += (dx / distance) * force;
          item.initialYDirection += (dy / distance) * force;
          item.initialXDirection = Math.max(
            -0.5,
            Math.min(0.5, item.initialXDirection)
          );
          item.initialYDirection = Math.max(
            -0.5,
            Math.min(0.5, item.initialYDirection)
          );
          if (item.type === "blur")
            item.blur = Math.min(item.blur + force * 10, 60);
          if (item.type === "defined")
            item.opacity = Math.min(item.opacity + force * 0.5, 0.7);
        }
      });
    });
  },

  actualizar() {
    const adjX = 0.2,
      adjY = 0.2,
      adjBlur = 0.8,
      tSpeed = 0.02;
    this._actualizarColoresFondo(tSpeed);
    this.items.forEach((item) => {
      this._actualizarColoresItem(item, tSpeed);
      this._actualizarMovimiento(item, adjX, adjY, adjBlur);
      this._actualizarPulso(item);
    });
  },

  _actualizarColoresFondo(speed) {
    this.colorFondoActual = this.colorFondoActual.map((c, i) =>
      this._lerpColor(c, this.colorFondoObjetivo[i], speed)
    );
  },
  _actualizarColoresItem(item, speed) {
    item.colorOne = this._lerpColor(item.colorOne, item.targetColorOne, speed);
    item.colorTwo = this._lerpColor(item.colorTwo, item.targetColorTwo, speed);
    if (item.type === "defined" && item.targetOpacity !== undefined)
      item.opacity = this._lerp(item.opacity, item.targetOpacity, speed);
  },

  _actualizarMovimiento(item, adjX, adjY, adjBlur) {
    if (
      item.x + item.initialXDirection * adjX > this.width ||
      item.x + item.initialXDirection * adjX < 0
    )
      item.initialXDirection *= -1;
    if (
      item.y + item.initialYDirection * adjY > this.height ||
      item.y + item.initialYDirection * adjY < 0
    )
      item.initialYDirection *= -1;
    if (item.type === "blur") {
      if (
        item.blur + item.initialBlurDirection * adjBlur > 60 ||
        item.blur + item.initialBlurDirection * adjBlur < 8
      )
        item.initialBlurDirection *= -1;
      item.blur += item.initialBlurDirection * adjBlur;
    }

    // Movimiento oscilante
    item.x +=
      (item.targetX - item.x) * 0.02 + Math.sin(item.pulsePhase * 0.5) * 0.1;
    item.y +=
      (item.targetY - item.y) * 0.02 + Math.cos(item.pulsePhase * 0.5) * 0.1;
  },

  _actualizarPulso(item) {
    const speed = item.type === "defined" ? 0.015 : 0.01;
    const intensity = item.type === "defined" ? 0.08 : 0.03;
    item.pulsePhase += speed;
    const multiplier =
      1 + Math.sin(item.pulsePhase + item._phaseOffset) * intensity;
    item.radius = item.originalRadius * multiplier;
  },

  dibujar() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Dibujar fondo (negro sólido para final y finalRegalo, gradiente para otros)
    if (
      this.colorFondoActual[0] === "#000000" &&
      this.colorFondoActual[1] === "#000000"
    ) {
      // Fondo negro sólido
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else {
      // Gradiente normal para otras secciones
      const grd = this.ctx.createLinearGradient(0, this.height, this.width, 0);
      grd.addColorStop(0, this.colorFondoActual[0]);
      grd.addColorStop(1, this.colorFondoActual[1]);
      this.ctx.fillStyle = grd;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Solo dibujar elementos si no es final o finalRegalo
    if (this.items.length > 0) {
      this._dibujarElementosBlur();
      this._dibujarElementosDefinidos();
    }
  },

  _dibujarElementosBlur() {
    const blurItems = this.items.filter((i) => i.type === "blur");
    this.ctx.globalCompositeOperation = "lighter";
    blurItems.forEach((item) => {
      const grd = this.ctx.createRadialGradient(
        item.x,
        item.y,
        item.radius * 0.2,
        item.x,
        item.y,
        item.radius
      );
      grd.addColorStop(0, item.colorOne);
      grd.addColorStop(1, this._addOpacityToHex(item.colorTwo, 0));
      this.ctx.fillStyle = grd;
      this.ctx.beginPath();
      this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  },

  _dibujarElementosDefinidos() {
    const definedItems = this.items.filter((i) => i.type === "defined");
    this.ctx.globalCompositeOperation = "normal";
    definedItems.forEach((item) => {
      const grd = this.ctx.createRadialGradient(
        item.x,
        item.y,
        item.radius * 0.2,
        item.x,
        item.y,
        item.radius
      );
      grd.addColorStop(0, this._addOpacityToHex(item.colorOne, item.opacity));
      grd.addColorStop(1, this._addOpacityToHex(item.colorTwo, item.opacity));
      this.ctx.fillStyle = grd;
      this.ctx.beginPath();
      this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  },

  animar() {
    this.actualizar();
    this.dibujar();
    requestAnimationFrame(() => this.animar());
  },

  // UTILIDADES
  _rand(min, max) {
    return Math.random() * (max - min) + min;
  },
  _lerp(a, b, t) {
    return a + (b - a) * t;
  },
  _lerpColor(c1, c2, t) {
    const r1 = parseInt(c1.slice(1, 3), 16),
      g1 = parseInt(c1.slice(3, 5), 16),
      b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16),
      g2 = parseInt(c2.slice(3, 5), 16),
      b2 = parseInt(c2.slice(5, 7), 16);
    const r = Math.round(r1 + (r2 - r1) * t),
      g = Math.round(g1 + (g2 - g1) * t),
      b = Math.round(b1 + (b2 - b1) * t);
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  },
  _addOpacityToHex(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  },
};

window.addEventListener("DOMContentLoaded", () => Bokeh.init());
