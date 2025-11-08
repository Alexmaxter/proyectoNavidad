/**
 * firebase-manager.js: Módulo para manejar Firebase
 * (VERSIÓN CORREGIDA CON LOGIN ANÓNIMO)
 */

const {
  initializeApp,
  getAuth,
  onAuthStateChanged,
  signInAnonymously, // <-- CAMBIADO
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  firebaseConfig,
} = window.firebaseSDK;

// --- RELLENA ESTOS DATOS con el usuario que creaste en Firebase ---
// --- ELIMINADOS USER_EMAIL y USER_PASSWORD ---
// -------------------------------------------------------------

let app;
let auth;
let db;
let currentUserId = null;
let currentMaxStep = 0;

/**
 * Inicializa Firebase e inicia sesión anónimamente.
 */
const init = () => {
  console.log("[Firebase] Inicializando...");
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // --- CAMBIO EN EL LOG ---
        console.log(
          `[Firebase] Usuario ya autenticado. UID: ${user.uid} (Anónimo: ${user.isAnonymous})`
        );
        currentUserId = user.uid;
        resolve();
      } else {
        // --- ¡¡LÓGICA CAMBIADA!! ---
        console.log(
          `[Firebase] No hay usuario. Intentando inicio de sesión anónimo...`
        );
        signInAnonymously(auth)
          .then((userCredential) => {
            console.log(
              `[Firebase] ¡Inicio de sesión anónimo EXITOSO! UID: ${userCredential.user.uid}`
            );
            currentUserId = userCredential.user.uid;
            resolve();
          })
          .catch((error) => {
            console.error(
              "[Firebase] ERROR en inicio de sesión anónimo:",
              error
            );
            alert("Error de conexión con Firebase.");
            reject(error);
          });
      }
    });
  });
};

/**
 * Carga el progreso máximo (maxStep) del usuario desde Firestore.
 */
const loadProgress = async () => {
  if (!currentUserId) {
    console.error(
      "[Firebase] No se puede cargar progreso: Usuario no autenticado."
    );
    return 0;
  }
  const docRef = doc(db, "progress", currentUserId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("[Firebase] Progreso cargado:", data);
      currentMaxStep = data.maxStep || 0;
      // Devolver el progreso completo para que app.js lo use
      return data;
    } else {
      console.log(
        "[Firebase] No se encontró progreso guardado. Empezando de 0."
      );
      return { maxStep: 0, lastSection: "intro" }; // Valor por defecto
    }
  } catch (error) {
    console.error("[Firebase] Error al cargar progreso:", error);
    return { maxStep: 0, lastSection: "intro" };
  }
};

/**
 * Guarda el progreso del usuario si el nuevo paso es mayor.
 */
const saveProgress = async (newStep, sectionId) => {
  if (!currentUserId) {
    console.error("[Firebase] No se puede guardar: Usuario no autenticado.");
    return;
  }
  if (newStep <= currentMaxStep) {
    return;
  }
  console.log(
    `[Firebase] Guardando nuevo progreso: Paso ${newStep} (Sección: ${sectionId})`
  );
  currentMaxStep = newStep;

  // Guardamos maxStep Y lastSection (para la sección máxima)
  const docRef = doc(db, "progress", currentUserId);
  const dataToSave = {
    maxStep: newStep,
    lastSection: sectionId, // Esta es la "Sección Máxima"
    lastUpdated: new Date().toISOString(),
  };
  try {
    await setDoc(docRef, dataToSave, { merge: true });
    console.log("[Firebase] ¡Progreso guardado!");
  } catch (error) {
    console.error("[Firebase] Error al guardar progreso:", error);
  }
};

/**
 * --- NUEVA FUNCIÓN ---
 * Actualiza la ubicación "actual" del usuario en CADA navegación.
 * @param {string} sectionId - La sección que el usuario está viendo AHORA.
 */
const updateCurrentLocation = async (sectionId) => {
  if (!currentUserId) {
    return; // No hacer nada si el usuario aún no está logueado
  }

  console.log(`[Firebase] Actualizando ubicación actual a: ${sectionId}`);
  const docRef = doc(db, "progress", currentUserId);

  try {
    // Usamos setDoc con merge:true para crear/actualizar solo estos campos
    // sin sobrescribir maxStep.
    await setDoc(
      docRef,
      {
        currentSection: sectionId, // Nuevo campo para "Sección Actual"
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("[Firebase] Error al actualizar la ubicación actual:", error);
  }
};

/**
 * Guarda un intento de acertijo
 */
const saveRiddleAttempt = async (riddleId, attempt, isCorrect) => {
  if (!currentUserId) {
    console.error(
      "[Firebase] No se puede guardar el intento: Usuario no autenticado."
    );
    return;
  }
  console.log(
    `[Firebase] Guardando intento para '${riddleId}': "${attempt}" (${isCorrect})`
  );
  try {
    const attemptData = {
      riddleId: riddleId,
      attempt: attempt,
      isCorrect: isCorrect,
      timestamp: new Date().toISOString(),
    };
    const attemptsCollectionRef = collection(
      db,
      "progress",
      currentUserId,
      "attempts"
    );
    await addDoc(attemptsCollectionRef, attemptData);
    console.log("[Firebase] ¡Intento guardado!");
  } catch (error) {
    console.error("[Firebase] Error al guardar el intento:", error);
  }
};

// Exportar las funciones (incluyendo la nueva)
export default {
  init,
  loadProgress,
  saveProgress,
  updateCurrentLocation, // <-- NUEVO
  saveRiddleAttempt,
};
