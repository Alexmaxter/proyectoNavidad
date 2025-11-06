// Usar los nombres de archivo correctos
import config from "./config.js";

/**
 * router.js: El Navegante
 */
const Router = {
  _onNavigate: null,

  /**
   * --- FUNCIÓN MODIFICADA ---
   * Arregla la "race condition" de la carga inicial.
   */
  init(onNavigateCallback) {
    console.log("[Router.js] 1. Inicializando y añadiendo listeners...");
    this._onNavigate = onNavigateCallback;

    // 1. Añadir listeners INMEDIATAMENTE
    window.addEventListener("hashchange", () => this._handleHashChange());
    window.addEventListener("load", () => this._handleHashChange());

    // 2. --- CORRECCIÓN DE RACE CONDITION ---
    // Comprobar si el evento 'load' YA ocurrió
    // (lo cual es casi seguro, porque app.js tiene 'await's)
    if (document.readyState === "complete") {
      console.log(
        "[Router.js] 2. 'load' event ya ocurrió. Disparando manualmente _handleHashChange()."
      );
      // Si ya cargó, disparar el handler manualmente
      // para que se cargue la sección inicial (#intro)
      this._handleHashChange();
    } else {
      console.log(
        "[Router.js] 2. 'load' event aún no ha ocurrido. Esperando..."
      );
    }
  },

  /**
   * Manejador central de cambios de ruta.
   * Lee el hash, lo valida y llama al callback.
   */
  _handleHashChange() {
    console.log("[Router.js] 3. ¡Hash changed! (o 'load' ocurrió)");

    // Si _onNavigate aún no está listo (app.js no ha terminado), esperar
    if (!this._onNavigate) {
      console.warn(
        "[Router.js] _handleHashChange se disparó, pero _onNavigate es nulo. Reintentando..."
      );
      setTimeout(() => this._handleHashChange(), 100);
      return;
    }

    let sectionId = window.location.hash.substring(1);

    if (!sectionId) {
      sectionId = "intro";
    }

    if (config.sections[sectionId]) {
      console.log(`[Router.js] 4. Navegando a sección: ${sectionId}`);
      this._onNavigate(sectionId); // Llama a App.showSection
    } else {
      // Si el hash es inválido (ej. #acertijo99), redirigir
      console.warn(
        `[Router.js] Guardia: La sección "${sectionId}" no existe. Redirigiendo a #intro.`
      );
      this.navigate("intro", true);
    }
  },

  /**
   * Navega programáticamente a una nueva sección.
   * @param {string} sectionId - El ID de la sección (ej. "decision")
   * @param {boolean} [replace=false] - Si es true, reemplaza la entrada
   */
  navigate(sectionId, replace = false) {
    console.log(`[Router.js] navigate() llamado para: ${sectionId}`);

    // Prevenir navegación nula si se llama antes de tiempo
    if (sectionId === window.location.hash.substring(1)) {
      return;
    }

    if (replace) {
      window.location.replace(`#${sectionId}`);
    } else {
      window.location.hash = sectionId;
    }
  },
};

// Exportamos el objeto del Router
export default Router;
