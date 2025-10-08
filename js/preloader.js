// =============================
// SISTEMA DE PRECARGA DE RECURSOS
// =============================
const Preloader = {
  cache: {
    images: new Map(),
    videos: new Map(),
    audios: new Map(),
  },

  stats: {
    imagesLoaded: 0,
    videosLoaded: 0,
    audiosLoaded: 0,
    errors: 0,
  },

  /**
   * Precarga una imagen y la cachea
   * @param {string} src - URL de la imagen
   * @returns {Promise<HTMLImageElement>}
   */
  async preloadImage(src) {
    if (this.cache.images.has(src)) {
      return this.cache.images.get(src);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      // Timeout para evitar esperas infinitas
      const timeout = setTimeout(() => {
        console.warn(`⏱️ Timeout cargando imagen: ${src}`);
        reject(new Error(`Image timeout: ${src}`));
      }, 15000); // 15 segundos

      img.onload = () => {
        clearTimeout(timeout);
        this.cache.images.set(src, img);
        this.stats.imagesLoaded++;
        console.log(`✓ Imagen precargada: ${src}`);
        resolve(img);
      };

      img.onerror = (error) => {
        clearTimeout(timeout);
        this.stats.errors++;
        console.warn(`✗ Error cargando imagen: ${src}`, error);
        reject(error);
      };

      img.src = src;
    });
  },

  /**
   * Precarga múltiples imágenes en paralelo
   * @param {string[]} sources - Array de URLs
   * @returns {Promise<HTMLImageElement[]>}
   */
  async preloadImages(sources) {
    console.log(`Precargando ${sources.length} imágenes...`);

    const promises = sources.map((src) =>
      this.preloadImage(src).catch((err) => {
        console.warn(`Imagen opcional no cargada: ${src}`);
        return null;
      })
    );

    const results = await Promise.all(promises);
    console.log(
      `✓ ${this.stats.imagesLoaded}/${sources.length} imágenes cargadas`
    );

    return results.filter(Boolean);
  },

  /**
   * Precarga un video COMPLETAMENTE antes de usarlo
   * @param {string} videoId - ID del elemento video en el DOM
   * @returns {Promise<HTMLVideoElement>}
   */
  async preloadVideo(videoId) {
    if (this.cache.videos.has(videoId)) {
      return this.cache.videos.get(videoId);
    }

    const video = document.getElementById(videoId);

    if (!video) {
      throw new Error(`Video con id "${videoId}" no encontrado`);
    }

    // Verificar si ya está cargado
    if (video.readyState >= 3) {
      console.log(`✓ Video ${videoId} ya estaba cargado`);
      this.cache.videos.set(videoId, video);
      return video;
    }

    console.log(`Precargando video: ${videoId}...`);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        console.warn(`⏱️ Timeout precargando video: ${videoId}`);
        reject(new Error(`Video timeout: ${videoId}`));
      }, 10000); // 10 segundos timeout

      const cleanup = () => {
        clearTimeout(timeout);
        video.removeEventListener("canplaythrough", handleSuccess);
        video.removeEventListener("error", handleError);
      };

      const handleSuccess = () => {
        cleanup();
        this.cache.videos.set(videoId, video);
        this.stats.videosLoaded++;
        console.log(
          `✓ Video precargado: ${videoId} (readyState: ${video.readyState})`
        );
        resolve(video);
      };

      const handleError = (error) => {
        cleanup();
        this.stats.errors++;
        console.error(`✗ Error precargando video: ${videoId}`, error);
        reject(error);
      };

      video.addEventListener("canplaythrough", handleSuccess, { once: true });
      video.addEventListener("error", handleError, { once: true });

      // Forzar carga
      video.load();
    });
  },

  /**
   * Precarga un audio
   * @param {string} audioId - ID del elemento audio en el DOM
   * @returns {Promise<HTMLAudioElement>}
   */
  async preloadAudio(audioId) {
    if (this.cache.audios.has(audioId)) {
      return this.cache.audios.get(audioId);
    }

    const audio = document.getElementById(audioId);

    if (!audio) {
      console.warn(`Audio con id "${audioId}" no encontrado`);
      return null;
    }

    // Verificar si ya está cargado
    if (audio.readyState >= 2) {
      console.log(`✓ Audio ${audioId} ya estaba cargado`);
      this.cache.audios.set(audioId, audio);
      return audio;
    }

    console.log(`Precargando audio: ${audioId}...`);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        cleanup();
        console.warn(
          `⏱️ Timeout precargando audio: ${audioId} (continuando sin él)`
        );
        resolve(null);
      }, 5000); // 5 segundos timeout

      const cleanup = () => {
        clearTimeout(timeout);
        audio.removeEventListener("canplay", handleSuccess);
        audio.removeEventListener("error", handleError);
      };

      const handleSuccess = () => {
        cleanup();
        this.cache.audios.set(audioId, audio);
        this.stats.audiosLoaded++;
        console.log(`✓ Audio precargado: ${audioId}`);
        resolve(audio);
      };

      const handleError = (error) => {
        cleanup();
        console.warn(`✗ Error precargando audio: ${audioId}`, error);
        resolve(null); // No rechazar, solo resolver con null
      };

      audio.addEventListener("canplay", handleSuccess, { once: true });
      audio.addEventListener("error", handleError, { once: true });

      audio.load();
    });
  },

  /**
   * Precarga múltiples audios en paralelo
   * @param {string[]} audioIds - Array de IDs de audio
   * @returns {Promise<HTMLAudioElement[]>}
   */
  async preloadAudios(audioIds) {
    console.log(`Precargando ${audioIds.length} audios...`);

    const promises = audioIds.map((id) => this.preloadAudio(id));
    const results = await Promise.all(promises);

    console.log(
      `✓ ${this.stats.audiosLoaded}/${audioIds.length} audios cargados`
    );

    return results.filter(Boolean);
  },

  /**
   * Verifica si un video está listo para reproducir
   * @param {string} videoId - ID del video
   * @returns {boolean}
   */
  isVideoReady(videoId) {
    const video =
      this.cache.videos.get(videoId) || document.getElementById(videoId);
    return video && video.readyState >= 3;
  },

  /**
   * Obtiene estadísticas de precarga
   * @returns {Object}
   */
  getStats() {
    return {
      ...this.stats,
      cachedImages: this.cache.images.size,
      cachedVideos: this.cache.videos.size,
      cachedAudios: this.cache.audios.size,
    };
  },

  /**
   * Limpia la caché de recursos
   */
  clearCache() {
    this.cache.images.clear();
    this.cache.videos.clear();
    this.cache.audios.clear();
    console.log("🧹 Caché de preloader limpiada");
  },

  /**
   * Precarga recursos críticos al inicio de la aplicación
   * @returns {Promise<void>}
   */
  async preloadCriticalAssets() {
    console.log("=== PRECARGANDO RECURSOS CRÍTICOS ===");

    const criticalImages = [
      "./assets/img/intro-bg.png",
      "./assets/img/decision-bg.png",
    ];

    const criticalAudios = ["audio-fondo", "audio-intro"];

    try {
      await Promise.allSettled([
        this.preloadImages(criticalImages),
        this.preloadAudios(criticalAudios),
      ]);

      console.log("✓ Recursos críticos precargados");
      console.log("Estadísticas:", this.getStats());
    } catch (error) {
      console.error("Error en precarga crítica:", error);
      // No bloquear la aplicación por errores de precarga
    }
  },

  /**
   * Precarga recursos de una sección específica bajo demanda
   * @param {string} sectionId - ID de la sección
   * @returns {Promise<void>}
   */
  async preloadSectionAssets(sectionId) {
    const sectionBackgrounds = {
      intro: "./assets/img/intro-bg.png",
      decision: "./assets/img/decision-bg.png",
      confirmacion1: "./assets/img/confirmacion1-bg.jpg",
      confirmacion2: "./assets/img/confirmacion2-bg.jpg",
      acertijo1: "./assets/img/acertijo1-bg.png",
      acertijo2: "./assets/img/acertijo2-bg.png",
      acertijo3: "./assets/img/acertijo3-bg.png",
      explicacion1: "./assets/img/explicacion1-bg.png",
      explicacion2: "./assets/img/explicacion2-bg.png",
      explicacion3: "./assets/img/explicacion3-bg.png",
      final: "assets/img/final-bg.jpg",
      countdown: "assets/img/countdown-bg.jpg",
      final2: "assets/img/final2-bg.jpg",
    };

    const bgImage = sectionBackgrounds[sectionId];
    const audioId = `audio-${sectionId}`;

    const promises = [];

    if (bgImage) {
      promises.push(this.preloadImage(bgImage));
    }

    if (document.getElementById(audioId)) {
      promises.push(this.preloadAudio(audioId));
    }

    // Precarga especial para la sección final (video)
    if (sectionId === "final") {
      promises.push(
        this.preloadVideo("Final").catch((err) => {
          console.warn("Video final no disponible, se saltará");
          return null;
        })
      );
    }

    await Promise.allSettled(promises);
  },
};
