// =============================
// PRECARGA DE RECURSOS
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

  async preloadImage(src) {
    if (this.cache.images.has(src)) {
      return this.cache.images.get(src);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.warn(`⏱️ Timeout imagen: ${src}`);
        reject(new Error(`Image timeout: ${src}`));
      }, 15000);

      img.onload = () => {
        clearTimeout(timeout);
        this.cache.images.set(src, img);
        this.stats.imagesLoaded++;
        console.log(`✓ Imagen: ${src}`);
        resolve(img);
      };

      img.onerror = (error) => {
        clearTimeout(timeout);
        this.stats.errors++;
        console.warn(`✗ Error imagen: ${src}`);
        reject(error);
      };

      img.src = src;
    });
  },

  async preloadImages(sources) {
    console.log(`Precargando ${sources.length} imágenes...`);

    const promises = sources.map((src) =>
      this.preloadImage(src).catch(() => {
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

  async preloadVideo(videoId) {
    if (this.cache.videos.has(videoId)) {
      return this.cache.videos.get(videoId);
    }

    const video = document.getElementById(videoId);
    if (!video) {
      throw new Error(`Video "${videoId}" no encontrado`);
    }

    if (video.readyState >= 3) {
      console.log(`✓ Video ${videoId} ya cargado`);
      this.cache.videos.set(videoId, video);
      return video;
    }

    console.log(`Precargando video: ${videoId}...`);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        console.warn(`⏱️ Timeout video: ${videoId}`);
        reject(new Error(`Video timeout: ${videoId}`));
      }, 10000);

      const cleanup = () => {
        clearTimeout(timeout);
        video.removeEventListener("canplaythrough", handleSuccess);
        video.removeEventListener("error", handleError);
      };

      const handleSuccess = () => {
        cleanup();
        this.cache.videos.set(videoId, video);
        this.stats.videosLoaded++;
        console.log(`✓ Video: ${videoId} (readyState: ${video.readyState})`);
        resolve(video);
      };

      const handleError = (error) => {
        cleanup();
        this.stats.errors++;
        console.error(`✗ Error video: ${videoId}`, error);
        reject(error);
      };

      video.addEventListener("canplaythrough", handleSuccess, { once: true });
      video.addEventListener("error", handleError, { once: true });
      video.load();
    });
  },

  async preloadAudio(audioId) {
    if (this.cache.audios.has(audioId)) {
      return this.cache.audios.get(audioId);
    }

    const audio = document.getElementById(audioId);
    if (!audio) {
      console.warn(`Audio "${audioId}" no encontrado`);
      return null;
    }

    if (audio.readyState >= 2) {
      console.log(`✓ Audio ${audioId} ya cargado`);
      this.cache.audios.set(audioId, audio);
      return audio;
    }

    console.log(`Precargando audio: ${audioId}...`);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        cleanup();
        console.warn(`⏱️ Timeout audio: ${audioId}`);
        resolve(null);
      }, 5000);

      const cleanup = () => {
        clearTimeout(timeout);
        audio.removeEventListener("canplay", handleSuccess);
        audio.removeEventListener("error", handleError);
      };

      const handleSuccess = () => {
        cleanup();
        this.cache.audios.set(audioId, audio);
        this.stats.audiosLoaded++;
        console.log(`✓ Audio: ${audioId}`);
        resolve(audio);
      };

      const handleError = () => {
        cleanup();
        console.warn(`✗ Error audio: ${audioId}`);
        resolve(null);
      };

      audio.addEventListener("canplay", handleSuccess, { once: true });
      audio.addEventListener("error", handleError, { once: true });
      audio.load();
    });
  },

  async preloadAudios(audioIds) {
    console.log(`Precargando ${audioIds.length} audios...`);

    const promises = audioIds.map((id) => this.preloadAudio(id));
    const results = await Promise.all(promises);

    console.log(
      `✓ ${this.stats.audiosLoaded}/${audioIds.length} audios cargados`
    );
    return results.filter(Boolean);
  },

  isVideoReady(videoId) {
    const video =
      this.cache.videos.get(videoId) || document.getElementById(videoId);
    return video && video.readyState >= 3;
  },

  getStats() {
    return {
      ...this.stats,
      cachedImages: this.cache.images.size,
      cachedVideos: this.cache.videos.size,
      cachedAudios: this.cache.audios.size,
    };
  },

  clearCache() {
    this.cache.images.clear();
    this.cache.videos.clear();
    this.cache.audios.clear();
    console.log("🧹 Caché limpiada");
  },

  async preloadSectionAssets(sectionId) {
    const backgrounds = {
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
      final: "./assets/img/final-bg.jpg",
      countdown: "./assets/img/countdown-bg.jpg",
      final2: "./assets/img/final2-bg.jpg",
    };

    const bg = backgrounds[sectionId];
    const audioId = `audio-${sectionId}`;
    const promises = [];

    if (bg) promises.push(this.preloadImage(bg));
    if (document.getElementById(audioId))
      promises.push(this.preloadAudio(audioId));

    if (sectionId === "final") {
      promises.push(
        this.preloadVideo("Final").catch(() => {
          console.warn("Video final no disponible");
          return null;
        })
      );
    }

    await Promise.allSettled(promises);
  },
};
