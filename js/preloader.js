/**
 * preloader.js: Módulo de Precarga de Assets
 *
 * Carga imágenes, audio y video en la caché del navegador
 * y evita volver a cargar assets ya cacheados.
 */

// Un Set para rastrear qué assets ya hemos intentado cargar
const loadedAssets = new Set();

/**
 * Carga un solo asset.
 * @param {object} asset - Objeto { type: 'image' | 'audio' | 'video', src: '...' }
 * @returns {Promise<string>}
 */
const loadAsset = (asset) => {
  if (!asset.src || loadedAssets.has(asset.src)) {
    // Si no tiene 'src' o ya está cargado, resolver inmediatamente
    return Promise.resolve(asset.src);
  }

  loadedAssets.add(asset.src);

  return new Promise((resolve, reject) => {
    let element;

    switch (asset.type) {
      case "image":
        element = new Image();
        element.onload = () => resolve(asset.src);
        break;

      case "audio":
        element = document.createElement("audio");
        element.oncanplaythrough = () => resolve(asset.src);
        break;

      case "video":
        element = document.createElement("video");
        element.oncanplaythrough = () => resolve(asset.src);
        break;

      default:
        console.warn(`Preloader: Tipo de asset desconocido: ${asset.type}`);
        return resolve(asset.src); // Resolver para no bloquear la carga
    }

    element.onerror = () => {
      console.error(`Preloader: No se pudo cargar ${asset.src}`);
      reject(asset.src); // Rechazar si el archivo no se encuentra (404)
    };

    element.src = asset.src;
    element.load(); // Iniciar la carga
  });
};

/**
 * Función pública para cargar una lista de assets.
 * @param {Array<object>} assetsToLoad - Array de objetos de asset
 * @returns {Promise<void>}
 */
const loadAssets = async (assetsToLoad) => {
  // Filtramos cualquier asset nulo o sin 'src'
  const validAssets = assetsToLoad.filter((asset) => asset && asset.src);

  const promises = validAssets.map(loadAsset);

  try {
    // Promise.allSettled no se detiene si un asset falla (404)
    await Promise.allSettled(promises);
    console.log(`Preloader: Lote de ${promises.length} assets procesado.`);
  } catch (e) {
    console.error("Preloader: Ocurrió un error durante la precarga.", e);
  }
};

// Exportamos solo la función pública
export default {
  loadAssets,
};
