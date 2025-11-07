/**
 * preloader.js: Módulo de Precarga de Assets
 *
 * (Versión 2.0 - Robusta con Fetch y Reporte de Progreso)
 *
 * Carga assets usando fetch() para asegurar que la descarga
 * se complete o falle de manera predecible.
 */

// Un Set para rastrear qué assets ya hemos intentado cargar
const loadedAssets = new Set();

/**
 * Carga un solo asset usando fetch().
 * @param {object} asset - Objeto { type: 'image' | 'audio' | 'video', src: '...' }
 * @returns {Promise<string>}
 */
const loadAsset = (asset) => {
  // Si no tiene 'src' o ya lo hemos intentado, resolver inmediatamente
  if (!asset.src || loadedAssets.has(asset.src)) {
    return Promise.resolve(asset.src);
  }

  loadedAssets.add(asset.src);

  return fetch(asset.src)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error ${response.status} al cargar ${asset.src}`);
      }
      // No necesitamos el contenido (blob/buffer), solo saber que se descargó.
      // El navegador lo cacheará automáticamente.
      return asset.src;
    })
    .catch((error) => {
      console.error(`[Preloader] Fallo al cargar asset: ${asset.src}`, error);
      // ¡Importante! Resolvemos la promesa igualmente (como un éxito)
      // para que UN asset roto (ej. 404) no detenga toda la precarga.
      return Promise.resolve(asset.src);
    });
};

/**
 * Función pública para cargar una lista de assets.
 * @param {Array<object>} assetsToLoad - Array de objetos de asset
 * @param {function} onProgress - Callback que se ejecuta cada vez que un
 * asset se carga. Recibe (percentage).
 */
const loadAssets = async (assetsToLoad, onProgress) => {
  // Filtramos cualquier asset nulo o sin 'src'
  const validAssets = assetsToLoad.filter((asset) => asset && asset.src);
  const totalAssets = validAssets.length;
  let loadedCount = 0;

  if (totalAssets === 0) {
    if (onProgress) onProgress(1); // 100% si no hay nada que cargar
    return;
  }

  // Creamos un array de promesas
  const promises = validAssets.map((asset) => {
    return loadAsset(asset).then((src) => {
      // Cuando CUALQUIER asset termine...
      loadedCount++;
      const percentage = loadedCount / totalAssets;

      // Llamar al callback de progreso
      if (onProgress) {
        onProgress(percentage);
      }
      return src;
    });
  });

  // Esperar a que TODAS las promesas (incluso las fallidas) se completen
  await Promise.allSettled(promises);

  console.log(`[Preloader] Lote de ${totalAssets} assets procesado.`);
};

// Exportamos solo la función pública
export default {
  loadAssets,
};
