// =============================
// MANEJADOR DE AUDIO MEJORADO
// =============================
const AudioManager = {
  audioFondo: null,
  audioFondoFinal: null, // Audio especifico para la sección final
  audioFondoNavidad: null, // NUEVO: Audio de fondo navideño para el video
  audiosNarracion: null,

  init() {
    this.audioFondo = DOM.get("audio-fondo");
    this.audioFondoFinal = DOM.get("audio-fondo-final");
    this.audioFondoNavidad = DOM.get("audio-fondo-navidad"); // NUEVO: para fondoNavidad.mp3

    // Recopila todos los audios que no sean de fondo
    this.audiosNarracion = [
      ...DOM.getAll(
        "audio:not(#audio-fondo):not(#audio-fondo-final):not(#audio-fondo-navidad)"
      ),
    ];

    if (this.audioFondo) {
      this.audioFondo.volume = 0; // Empezar en 0 para fade in suave
    }
    if (this.audioFondoFinal) {
      this.audioFondoFinal.volume = 0; // Empezar en 0 para fade in suave
    }
    if (this.audioFondoNavidad) {
      this.audioFondoNavidad.volume = 0; // Empezar en 0 para fade in suave
    }

    // IMPORTANTE: NO iniciar audio automáticamente aquí
    // El audio debe iniciarse solo cuando el usuario presiona play
  },

  async reproducirFondo() {
    if (!this.audioFondo || AppState.fondoIniciado) return;

    try {
      this.audioFondo.volume = 0; // Asegurar que empiece en 0
      await this.audioFondo.play();
      AppState.fondoIniciado = true;
      console.log("Audio de fondo principal iniciado correctamente");

      // Fade in suave al volumen normal
      this._fadeAudio(
        this.audioFondo,
        0,
        CONFIG.audio.volumenFondoNormal,
        CONFIG.audio.duracionFadeIn
      );
    } catch (error) {
      console.warn("Error al iniciar audio de fondo principal:", error);
    }
  },

  async reproducirFondoFinal() {
    if (!this.audioFondoFinal || AppState.fondoFinalIniciado) return;

    try {
      // Detener audio de fondo principal primero si está activo
      await this._detenerAudioFondoPrincipal();
      // Detener audio navideño si está activo
      await this._detenerAudioFondoNavidad();

      this.audioFondoFinal.volume = 0; // Asegurar que empiece en 0
      await this.audioFondoFinal.play();
      AppState.fondoFinalIniciado = true;
      console.log("Audio de fondo final iniciado correctamente");

      // Fade in suave
      this._fadeAudio(
        this.audioFondoFinal,
        0,
        CONFIG.audio.volumenFondoFinalNormal,
        CONFIG.audio.duracionFadeIn
      );
    } catch (error) {
      console.warn("Error al iniciar audio de fondo final:", error);
    }
  },

  // NUEVO: Método para reproducir audio navideño durante el video
  async reproducirFondoNavidad() {
    if (!this.audioFondoNavidad || AppState.fondoNavidadIniciado) return;

    try {
      // Detener otros audios de fondo
      await this._detenerAudioFondoPrincipal();
      await this._detenerAudioFondoFinal();

      this.audioFondoNavidad.volume = 0; // Asegurar que empiece en 0
      await this.audioFondoNavidad.play();
      AppState.fondoNavidadIniciado = true;
      console.log("Audio de fondo navideño iniciado correctamente");

      // Fade in suave con volumen bajo
      this._fadeAudio(
        this.audioFondoNavidad,
        0,
        CONFIG.audio.volumenFondoNavidadBajo,
        CONFIG.audio.duracionFadeIn
      );
    } catch (error) {
      console.warn("Error al iniciar audio de fondo navideño:", error);
    }
  },

  async _detenerAudioFondoPrincipal() {
    if (!this.audioFondo || !AppState.fondoIniciado) return;

    return new Promise((resolve) => {
      this._fadeAudio(
        this.audioFondo,
        this.audioFondo.volume,
        0,
        CONFIG.audio.duracionFadeOut,
        () => {
          this.audioFondo.pause();
          this.audioFondo.currentTime = 0;
          AppState.fondoIniciado = false;
          resolve();
        }
      );
    });
  },

  async _detenerAudioFondoFinal() {
    if (!this.audioFondoFinal || !AppState.fondoFinalIniciado) return;

    return new Promise((resolve) => {
      this._fadeAudio(
        this.audioFondoFinal,
        this.audioFondoFinal.volume,
        0,
        CONFIG.audio.duracionFadeOut,
        () => {
          this.audioFondoFinal.pause();
          this.audioFondoFinal.currentTime = 0;
          AppState.fondoFinalIniciado = false;
          resolve();
        }
      );
    });
  },

  // NUEVO: Método para detener audio navideño
  async _detenerAudioFondoNavidad() {
    if (!this.audioFondoNavidad || !AppState.fondoNavidadIniciado) return;

    return new Promise((resolve) => {
      this._fadeAudio(
        this.audioFondoNavidad,
        this.audioFondoNavidad.volume,
        0,
        CONFIG.audio.duracionFadeOut,
        () => {
          this.audioFondoNavidad.pause();
          this.audioFondoNavidad.currentTime = 0;
          AppState.fondoNavidadIniciado = false;
          resolve();
        }
      );
    });
  },

  detenerFondo() {
    this._detenerAudioFondoPrincipal();
  },

  detenerFondoFinal() {
    this._detenerAudioFondoFinal();
  },

  detenerFondoNavidad() {
    this._detenerAudioFondoNavidad();
  },

  detenerTodosLosAudios() {
    this.detenerNarraciones();
    this.detenerFondo();
    this.detenerFondoFinal();
    this.detenerFondoNavidad(); // NUEVO: También detener audio navideño
  },

  saltarSeccion() {
    if (!AppState.seccionActiva || !AppState.audioReproduciendo) return;

    this.detenerNarraciones(); // Detiene cualquier narración o video en curso
    SectionManager.mostrarControles(AppState.seccionActiva.id);
    this._mostrarFeedbackSalto();
  },

  _mostrarFeedbackSalto() {
    const skipFeedback = document.createElement("div");
    skipFeedback.textContent = CONFIG.mensajes.saltarNarracion;
    skipFeedback.className = "skip-feedback"; // Usar clase CSS para estilos

    document.body.appendChild(skipFeedback);
    setTimeout(() => skipFeedback.classList.add("show"), 10);
    setTimeout(() => {
      skipFeedback.classList.remove("show");
      setTimeout(() => skipFeedback.remove(), 300);
    }, 2000);
  },

  fadeVolumenFondo(volumenObjetivo, seccionId = null) {
    // Determinar qué audio de fondo usar
    const esSeccionFinal = this._esSeccionConAudioFinalEspecifico(seccionId);
    const esSeccionVideo = seccionId === "final"; // Para la sección del video

    let audioActivo, estadoActivo;

    if (esSeccionVideo && AppState.fondoNavidadIniciado) {
      // Durante el video, usar audio navideño
      audioActivo = this.audioFondoNavidad;
      estadoActivo = AppState.fondoNavidadIniciado;
    } else if (esSeccionFinal) {
      // Secciones finales normales
      audioActivo = this.audioFondoFinal;
      estadoActivo = AppState.fondoFinalIniciado;
    } else {
      // Sección principal
      audioActivo = this.audioFondo;
      estadoActivo = AppState.fondoIniciado;
    }

    if (!audioActivo) return;

    if (!estadoActivo) {
      // Si no está iniciado, iniciarlo primero
      let metodoIniciar;
      if (esSeccionVideo) {
        metodoIniciar = () => this.reproducirFondoNavidad();
      } else if (esSeccionFinal) {
        metodoIniciar = () => this.reproducirFondoFinal();
      } else {
        metodoIniciar = () => this.reproducirFondo();
      }

      return metodoIniciar().then(() =>
        this.fadeVolumenFondo(volumenObjetivo, seccionId)
      );
    }

    // Optimización: No fade si ya está en el volumen objetivo
    if (Math.abs(audioActivo.volume - volumenObjetivo) < 0.01) return;

    this._fadeAudio(
      audioActivo,
      audioActivo.volume,
      volumenObjetivo,
      CONFIG.audio.duracionFade
    );
  },

  _esSeccionConAudioFinalEspecifico(seccionId) {
    return ["final", "finalRegalo", "final2"].includes(seccionId);
  },

  async reproducirNarracion(id) {
    // Cuando inicie una narración cualquier otra narración deberá detenerse
    this.detenerNarraciones(); // Asegura que cualquier audio o video anterior se detenga

    // Manejar caso especial de la sección final (video)
    if (id === "final") {
      return this._manejarSeccionFinal();
    }

    // Para otras secciones, continuar lógica normal
    await this._iniciarAudioFondoApropiado(id);
    await this._reproducirAudioSeccion(id);
  },

  async _manejarSeccionFinal() {
    // MODIFICADO: Mutear completamente el audio de fondo antes del video
    if (AppState.fondoIniciado || AppState.fondoFinalIniciado) {
      // Fade out rápido hasta mutear
      this.fadeVolumenFondo(0, "final");

      // Esperar a que termine el fade out
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.audio.duracionFadeRapido)
      );
    }

    // El video se maneja desde SectionManager, no aquí
    AppState.audioReproduciendo = true;
  },

  async _iniciarAudioFondoApropiado(id) {
    const esSeccionFinal = this._esSeccionConAudioFinalEspecifico(id);

    if (esSeccionFinal) {
      if (!AppState.fondoFinalIniciado) {
        await this.reproducirFondoFinal();
      }
    } else {
      if (!AppState.fondoIniciado) {
        await this.reproducirFondo();
      }
    }
  },

  async _reproducirAudioSeccion(id) {
    // MODIFICADO: La música de fondo debe bajar cuando un audio de narración esté reproduciendo
    const volumenFondo = this._obtenerVolumenFondoDuranteNarracion(id);

    // Fade out rápido del volumen de fondo
    this._fadeAudioRapido(volumenFondo, id);

    const audio = DOM.get(`audio-${id}`);
    if (!audio) {
      console.warn(`Audio para la sección ${id} no encontrado.`);
      return SectionManager.mostrarControles(id);
    }

    try {
      audio.currentTime = 0;
      audio.volume = CONFIG.audio.volumenNarracion;
      AppState.audioReproduciendo = true;

      // Configurar eventos
      const finalizarAudio = () => this._finalizarAudio(id);
      audio.onended = finalizarAudio;
      audio.onerror = finalizarAudio;

      await audio.play();
      AppState.audioActual = audio; // Guarda la referencia al audio que se está reproduciendo
    } catch (error) {
      console.warn(`Error al reproducir audio ${id}:`, error);
      this._finalizarAudio(id);
    }
  },

  // NUEVO: Método para fade rápido durante narraciones
  _fadeAudioRapido(volumenObjetivo, id) {
    const audioActivo = this._obtenerAudioFondoActivo(id);
    if (!audioActivo) return;

    this._fadeAudio(
      audioActivo,
      audioActivo.volume,
      volumenObjetivo,
      CONFIG.audio.duracionFadeRapido // Fade más rápido para narraciones
    );
  },

  _obtenerAudioFondoActivo(id) {
    const esSeccionFinal = this._esSeccionConAudioFinalEspecifico(id);

    if (esSeccionFinal && AppState.fondoFinalIniciado) {
      return this.audioFondoFinal;
    } else if (AppState.fondoIniciado) {
      return this.audioFondo;
    } else if (AppState.fondoNavidadIniciado) {
      return this.audioFondoNavidad;
    }

    return null;
  },

  _obtenerVolumenFondoDuranteNarracion(id) {
    // Configuraciones específicas por sección
    const volumenesEspeciales = {
      final: CONFIG.audio.volumenFondoMudo, // Muteado para video
      final2: CONFIG.audio.volumenFondoMudo,
      finalRegalo: CONFIG.audio.volumenFondoMudo,
    };

    return volumenesEspeciales[id] !== undefined
      ? volumenesEspeciales[id]
      : CONFIG.audio.volumenFondoBajo; // Volumen bajo durante narraciones normales
  },

  _finalizarAudio(id) {
    AppState.audioReproduciendo = false;
    AppState.audioActual = null; // Limpia la referencia al audio actual

    // MODIFICADO: Cuando termine debe volver a su volumen original con fade in suave
    const volumenObjetivo = this._obtenerVolumenNormalParaSeccion(id);

    // Fade in suave de vuelta al volumen normal
    this._fadeAudio(
      this._obtenerAudioFondoActivo(id),
      this._obtenerAudioFondoActivo(id)?.volume || 0,
      volumenObjetivo,
      CONFIG.audio.duracionFadeIn // Fade in más suave
    );

    SectionManager.mostrarControles(id);
  },

  _obtenerVolumenNormalParaSeccion(id) {
    if (this._esSeccionConAudioFinalEspecifico(id)) {
      if (AppState.fondoNavidadIniciado) {
        return CONFIG.audio.volumenFondoNavidadBajo;
      }
      return CONFIG.audio.volumenFondoFinalNormal;
    }
    return CONFIG.audio.volumenFondoNormal;
  },

  detenerNarraciones() {
    this.audiosNarracion.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    // Si el audio actual es un video (sección final), también detenerlo
    if (AppState.audioActual && AppState.audioActual.tagName === "VIDEO") {
      AppState.audioActual.pause();
      AppState.audioActual.currentTime = 0;
    }
    AppState.audioReproduciendo = false;
    AppState.audioActual = null; // Asegura que se limpie la referencia
  },

  // Método mejorado para fade de audio con mejor control
  _fadeAudio(elementoAudio, volumenInicio, volumenFin, duracion, callback) {
    if (!elementoAudio) {
      callback?.();
      return;
    }

    // Cancelar fade previo si existe
    if (elementoAudio._fadeInterval) {
      clearInterval(elementoAudio._fadeInterval);
    }

    const pasos = Math.max(20, Math.min(50, duracion / 20)); // Entre 20-50 pasos
    const tiempoPaso = duracion / pasos;
    const cambio = (volumenFin - volumenInicio) / pasos;
    let volumenActual = volumenInicio;
    let conteo = 0;

    elementoAudio._fadeInterval = setInterval(() => {
      volumenActual = Math.max(0, Math.min(1, volumenActual + cambio));
      elementoAudio.volume = volumenActual;

      conteo++;

      const completado =
        conteo >= pasos ||
        (cambio > 0 && volumenActual >= volumenFin) ||
        (cambio < 0 && volumenActual <= volumenFin);

      if (completado) {
        elementoAudio.volume = Math.max(0, Math.min(1, volumenFin));
        clearInterval(elementoAudio._fadeInterval);
        elementoAudio._fadeInterval = null;
        callback?.();
      }
    }, tiempoPaso);
  },

  manejarTransicionSeccion(seccionAnterior, seccionNueva) {
    const esTransicionAFinal = ["final", "finalRegalo"].includes(seccionNueva);
    const esTransicionDesdeFinal = ["final", "finalRegalo"].includes(
      seccionAnterior
    );

    if (esTransicionAFinal && !esTransicionDesdeFinal) {
      // Al ir a sección final, iniciar proceso de transición
      if (seccionNueva === "final") {
        // Para la sección del video, no iniciar audio aún
        // El audio navideño se iniciará cuando empiece el video
        console.log(
          "Transición a sección final - audio se iniciará con el video"
        );
      } else {
        this.reproducirFondoFinal();
      }
    } else if (!esTransicionAFinal && esTransicionDesdeFinal) {
      this.detenerTodosLosAudios(); // Detener todos los audios finales
      this.reproducirFondo();
    }
  },

  // NUEVO: Método específico para iniciar audio navideño con el video
  iniciarAudioNavidadConVideo() {
    console.log("Iniciando audio navideño para el video...");
    this.reproducirFondoNavidad();
  },
};
