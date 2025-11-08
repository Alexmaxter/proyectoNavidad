/**
 * firebase-manager.js: Módulo para manejar Firebase
 * (VERSIÓN NUEVA: ARQUITECTURA "BD ÚNICA")
 */

const {
  initializeApp,
  getAuth,
  onAuthStateChanged,
  signInAnonymously, // <-- Importación correcta
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  firebaseConfig,
} = window.firebaseSDK;

// --- ¡¡ESTA ES LA CLAVE!! ---
// Todas las escrituras irán a este ID de documento.
const PROGRESS_DOC_ID = "valentino";
// ------------------------------

let app;
let auth;
let db;
let currentUserId = null; // Lo guardamos solo para saber que estamos autenticados
let currentMaxStep = 0;

/**
 * Inicializa Firebase e inicia sesión anónimamente.
 */
const init = () => {
  console.log("[Firebase] Inicializando (Arquitectura BD Única)...");
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.isAnonymous) {
        // Usuario anónimo ya existe
        console.log(
          `[Firebase] Usuario anónimo ya autenticado. UID: ${user.uid}`
        );
        currentUserId = user.uid;
        resolve();
      } else {
        // No hay usuario, o es un usuario incorrecto (ej. admin)
        console.log(
          `[Firebase] No hay usuario anónimo. Intentando nuevo inicio de sesión...`
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
            // Este es el error (auth/admin-restricted-operation)
            // Si el Paso Cero no se hizo, fallará aquí.
            alert(
              "Error de conexión con Firebase. Verifica la configuración de Identity Platform."
            );
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
  // --- CAMBIO ---
  // Lee siempre desde el documento hardcodeado
  const docRef = doc(db, "progress", PROGRESS_DOC_ID);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("[Firebase] Progreso cargado:", data);
      currentMaxStep = data.maxStep || 0;
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

  // --- CAMBIO ---
  // Comparamos con el maxStep local para no escribir en la BD innecesariamente
  if (newStep <= currentMaxStep) {
    return;
  }

  console.log(
    `[Firebase] Guardando nuevo progreso: Paso ${newStep} (Sección: ${sectionId})`
  );
  currentMaxStep = newStep; // Actualizamos el maxStep local

  // --- CAMBIO ---
  // Guarda siempre en el documento hardcodeado
  const docRef = doc(db, "progress", PROGRESS_DOC_ID);
  const dataToSave = {
    maxStep: newStep,
    lastSection: sectionId, // Esta es la "Sección Máxima"
    lastUpdated: new Date().toISOString(),
  };
  try {
    // Usamos merge: true para crear el documento si no existe, o actualizarlo si ya existe
    await setDoc(docRef, dataToSave, { merge: true });
    console.log("[Firebase] ¡Progreso guardado!");
  } catch (error) {
    console.error("[Firebase] Error al guardar progreso:", error);
  }
};

/**
 * Actualiza la ubicación "actual" del usuario en CADA navegación.
 */
const updateCurrentLocation = async (sectionId) => {
  if (!currentUserId) {
    return;
  }

  console.log(`[Firebase] Actualizando ubicación actual a: ${sectionId}`);
  // --- CAMBIO ---
  // Actualiza siempre el documento hardcodeado
  const docRef = doc(db, "progress", PROGRESS_DOC_ID);

  try {
    await setDoc(
      docRef,
      {
        currentSection: sectionId,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true } // merge: true es VITAL aquí para no borrar maxStep
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
    // --- CAMBIO ---
    // Guarda en la subcolección del documento hardcodeado
    const attemptsCollectionRef = collection(
      db,
      "progress",
      PROGRESS_DOC_ID,
      "attempts"
    );
    await addDoc(attemptsCollectionRef, attemptData);
    console.log("[Firebase] ¡Intento guardado!");
  } catch (error) {
    console.error("[Firebase] Error al guardar el intento:", error);
  }
};

// Exportar las funciones
export default {
  init,
  loadProgress,
  saveProgress,
  updateCurrentLocation,
  saveRiddleAttempt,
};
