/**
 * admin.js: Lógica del Panel de Administración
 * (Corregido con la lógica de "camino visitado" para arreglar el bug visual)
 */

// Importamos el config de la app principal para saber la estructura
import config from "./config.js";

const {
  initializeApp,
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDocs,
  deleteDoc,
  // --- CAMBIO: Importar setDoc ---
  setDoc,
} = window.firebaseAdminSDK;

// --- NUEVO: Mapa de Navegación Inversa ---
// Esto nos permite trazar el camino hacia atrás.
const pathMap = {
  decision: "intro",
  confirmacion1: "decision",
  acertijo1: "decision",
  confirmacion2: "confirmacion1",
  explicacion1: "acertijo1",
  acertijo2: "explicacion1",
  explicacion2: "acertijo2",
  acertijo3: "explicacion2",
  explicacion3: "acertijo3",
  final2: "confirmacion2",
  pausa: "explicacion3",
  final: "pausa", // Aunque se salta con QR, lo mapeamos
  countdown: "final",
};
// --- FIN DEL NUEVO MAPA ---

// Variables globales del Admin
let app;
let auth;
let db;
let provider;
let currentUserId = null;

// Referencias a los elementos del DOM (sin cambios)
const loginView = document.getElementById("admin-login");
const panelView = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userEmailEl = document.getElementById("admin-user-email");
const visualPathEl = document.getElementById("visual-path");
const detailsCardsEl = document.getElementById("details-cards");
const attemptsListEl = document.getElementById("attempts-list");
const deleteProgressBtn = document.getElementById("delete-progress-btn");

// --- CAMBIO: Añadir referencia al nuevo botón ---
const forcePausaUnlockBtn = document.getElementById("force-pausa-unlock-btn");

let activeListeners = {};

// --- signIn (MODIFICADO para compatibilidad móvil) ---
// --- ¡¡ESTA ES LA CORRECCIÓN!! ---
const signIn = async () => {
  // <--- 1. Convertir a async
  try {
    // --- 2. Añadir este bloque ---
    // Primero, cerrar sesión de cualquier usuario activo (ej. Valentino)
    if (auth.currentUser) {
      console.log(
        "Admin: Cerrando sesión del usuario actual antes de loguear..."
      );
      await signOut(auth);
    }
    // -----------------------------

    // 3. Proceder con la redirección (como antes, pero con await)
    await signInWithRedirect(auth, provider);
  } catch (error) {
    // El catch ahora maneja todo
    console.error("Admin: Error al iniciar redirección de Google:", error);
  }
};

/**
 * --- FUNCIÓN MODIFICADA ---
 * Ahora comprueba contra el "visitedPath" (Set) en lugar de "maxStep" (Number)
 */
const createStepElement = (sectionId, currentSection, visitedPath) => {
  const sectionData = config.sections[sectionId];
  if (!sectionData) return null;

  const step = sectionData.step;
  const el = document.createElement("div");
  el.className = "path-step";

  // --- LÓGICA DE ESTADO CORREGIDA ---
  if (sectionId === currentSection) {
    el.classList.add("current"); // Dónde está AHORA
  }

  // Comprueba si la sección está en el Set de visitados
  if (visitedPath.has(sectionId)) {
    el.classList.add("visited"); // Pasos alcanzados
  } else if (sectionId !== currentSection) {
    el.classList.add("locked"); // Pasos futuros o del camino alterno
  }
  // --- FIN DE LA LÓGICA CORREGIDA ---

  el.innerHTML = `
    <strong>${sectionId}</strong>
    <span>(Paso ${step})</span>
  `;
  return el;
};

/**
 * --- FUNCIÓN MODIFICADA ---
 * Ahora construye el "visitedPath" (Set) trazando el camino hacia atrás
 * desde la "lastSection" (sección máxima alcanzada).
 */
const renderVisualPath = (currentSection, maxStep, lastSection) => {
  if (!visualPathEl) return;
  visualPathEl.innerHTML = "";

  // --- NUEVA LÓGICA DE TRAZADO de CAMINO ---
  const visitedPath = new Set();
  let currentTrace = lastSection; // Empezar desde la sección máxima alcanzada

  // Trazar el camino hacia atrás hasta llegar a 'intro'
  while (currentTrace) {
    visitedPath.add(currentTrace);
    currentTrace = pathMap[currentTrace];
  }
  visitedPath.add("intro"); // Asegurarse de que 'intro' esté siempre
  // --- FIN DE LA NUEVA LÓGICA ---

  const caminoRapido = ["confirmacion1", "confirmacion2", "final2"];
  const caminoPaciente = [
    "acertijo1",
    "explicacion1",
    "acertijo2",
    "explicacion2",
    "acertijo3",
    "explicacion3",
    "pausa",
    "final",
    "countdown",
  ];

  // Renderizar usando el nuevo "visitedPath"
  visualPathEl.appendChild(
    createStepElement("intro", currentSection, visitedPath)
  );
  visualPathEl.appendChild(
    createStepElement("decision", currentSection, visitedPath)
  );

  const branchRapido = document.createElement("div");
  branchRapido.className = "path-branch";
  branchRapido.innerHTML = `<h3 class="path-branch-title">Camino Rápido</h3>`;
  caminoRapido.forEach((id) => {
    branchRapido.appendChild(
      createStepElement(id, currentSection, visitedPath)
    );
  });
  visualPathEl.appendChild(branchRapido);

  const branchPaciente = document.createElement("div");
  branchPaciente.className = "path-branch";
  branchPaciente.innerHTML = `<h3 class="path-branch-title">Camino Paciente</h3>`;
  caminoPaciente.forEach((id) => {
    branchPaciente.appendChild(
      createStepElement(id, currentSection, visitedPath)
    );
  });
  visualPathEl.appendChild(branchPaciente);
};

// --- renderDetails (sin cambios) ---
const renderDetails = (userData) => {
  if (!detailsCardsEl) return;
  const currentSection = userData.currentSection || "N/A";
  const maxSection = userData.lastSection || "N/A";
  const maxStep = userData.maxStep || 0;
  let lastUpdated = "Nunca";
  if (userData.lastUpdated) {
    lastUpdated = new Date(userData.lastUpdated).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  detailsCardsEl.innerHTML = `
    <div class="detail-card">
      <p>📍 Sección Actual (En Vivo)</p>
      <strong class="highlight">${currentSection}</strong>
    </div>
    <div class="detail-card">
      <p>🏆 Sección Máxima Alcanzada</p>
      <strong>${maxSection} (Paso ${maxStep})</strong>
    </div>
    <div class="detail-card">
      <p>⏱️ Última Actividad</p>
      <strong>${lastUpdated}</strong>
    </div>
  `;
};

/**
 * --- FUNCIÓN MODIFICADA ---
 * Pasa `lastSection` a la función de renderizado.
 */
const listenToProgress = () => {
  const progressCollection = collection(db, "progress");
  const unsubscribe = onSnapshot(progressCollection, (snapshot) => {
    console.log("Admin: ¡Datos de progreso recibidos!");
    if (snapshot.empty) {
      visualPathEl.innerHTML =
        "<p class='narrativa'>Valentino aún no ha iniciado la experiencia.</p>";
      detailsCardsEl.innerHTML = "";
      attemptsListEl.innerHTML = "<li>...</li>";
      currentUserId = null;
      deleteProgressBtn.disabled = true;
      forcePausaUnlockBtn.disabled = true; // --- CAMBIO: Deshabilitar botón
      return;
    }
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;
    currentUserId = userId;
    deleteProgressBtn.disabled = false;
    forcePausaUnlockBtn.disabled = false; // --- CAMBIO: Habilitar botón

    // --- CAMBIO AQUÍ ---
    // Pasamos los 3 datos necesarios a la lógica de renderizado
    renderVisualPath(
      userData.currentSection,
      userData.maxStep,
      userData.lastSection
    );
    // --- FIN DEL CAMBIO ---

    renderDetails(userData);
    listenToAttempts(userId);
  });
  activeListeners["progress"] = unsubscribe;
};

// --- listenToAttempts (sin cambios) ---
const listenToAttempts = (userId) => {
  if (activeListeners[userId]) {
    return;
  }
  if (!attemptsListEl) return;
  const attemptsQuery = query(
    collection(db, "progress", userId, "attempts"),
    orderBy("timestamp", "desc")
  );
  const unsubscribe = onSnapshot(attemptsQuery, (snapshot) => {
    console.log(`Admin: ¡Nuevos intentos recibidos para ${userId}!`);
    if (snapshot.empty) {
      attemptsListEl.innerHTML = "<li>Aún no hay intentos.</li>";
      return;
    }
    attemptsListEl.innerHTML = "";
    snapshot.forEach((doc) => {
      const attempt = doc.data();
      const time = new Date(attempt.timestamp).toLocaleString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const item = document.createElement("li");
      item.className = attempt.isCorrect
        ? "attempt-correct"
        : "attempt-incorrect";
      item.innerHTML = `
        <div>
          <strong>${attempt.riddleId}:</strong> 
          <span class="attempt-text">"${attempt.attempt}"</span> 
        </div>
        <span class="attempt-time">${time}</span>
      `;
      attemptsListEl.appendChild(item);
    });
  });
  activeListeners[userId] = unsubscribe;
};

// --- stopAllListeners (sin cambios) ---
const stopAllListeners = () => {
  console.log("Admin: Deteniendo todos los listeners de realtime.");
  Object.values(activeListeners).forEach((unsubscribe) => unsubscribe());
  activeListeners = {};
};

// --- handleDeleteProgress (sin cambios) ---
const handleDeleteProgress = async () => {
  if (!currentUserId) {
    alert("No hay un usuario que borrar.");
    return;
  }
  const uid = currentUserId;
  const confirmation = prompt(
    `¡ADVERTENCIA!\n\nEstás a punto de borrar TODO el progreso del usuario ${uid.substring(
      0,
      8
    )}...\n\nEscribe "borrar" para confirmar.`
  );
  if (confirmation !== "borrar") {
    alert("Reinicio cancelado.");
    return;
  }
  console.log(`Admin: Borrando progreso para el usuario ${uid}...`);
  deleteProgressBtn.disabled = true;
  deleteProgressBtn.textContent = "Borrando...";
  try {
    console.log("Admin: Borrando sub-colección 'attempts'...");
    const attemptsRef = collection(db, "progress", uid, "attempts");
    const attemptsSnapshot = await getDocs(attemptsRef);
    const deletePromises = [];
    attemptsSnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
    console.log(`Admin: ${deletePromises.length} intentos borrados.`);
    console.log("Admin: Borrando documento de progreso principal...");
    const progressDocRef = doc(db, "progress", uid);
    await deleteDoc(progressDocRef);
    console.log("Admin: ¡PROGRESO BORRADO CON ÉXITO!");
  } catch (error) {
    console.error("Admin: Error al borrar el progreso:", error);
    alert("Hubo un error al borrar el progreso: " + error.message);
  } finally {
    deleteProgressBtn.textContent = "Reiniciar Progreso del Usuario";
  }
};

// --- NUEVA FUNCIÓN: Handler para el botón de forzar desbloqueo ---
const handleForcePausaUnlock = async () => {
  if (!currentUserId) {
    alert("No hay un usuario al cual desbloquear.");
    return;
  }
  console.log(
    `Admin: Forzando desbloqueo de 'pausa' para el usuario ${currentUserId}...`
  );
  forcePausaUnlockBtn.disabled = true;
  forcePausaUnlockBtn.textContent = "Enviando...";

  try {
    const progressDocRef = doc(db, "progress", currentUserId);
    // Escribimos 'pausaUnlocked: true' en el documento del usuario
    await setDoc(progressDocRef, { pausaUnlocked: true }, { merge: true });

    console.log("Admin: ¡Desbloqueo enviado!");
    alert("¡Desbloqueo forzado enviado al usuario!");

    // Opcional: cambiar el texto del botón para mostrar que ya se hizo
    forcePausaUnlockBtn.textContent = "¡Desbloqueo Enviado!";
    // No lo re-habilitamos para no enviarlo múltiples veces
  } catch (error) {
    console.error("Admin: Error al forzar el desbloqueo:", error);
    alert("Error al enviar el desbloqueo: " + error.message);
    forcePausaUnlockBtn.disabled = false; // Re-habilitar si falla
    forcePausaUnlockBtn.textContent = "Forzar Desbloqueo de Pausa (Remoto)";
  }
};

// --- initAdmin (Modificado) ---
const initAdmin = () => {
  app = initializeApp(window.firebaseAdminSDK.firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  provider = new GoogleAuthProvider();
  loginBtn.addEventListener("click", signIn);

  // --- CORRECCIÓN: Llamar a signOut(auth) con una función de flecha ---
  logoutBtn.addEventListener("click", () => signOut(auth));

  deleteProgressBtn.addEventListener("click", handleDeleteProgress);

  // --- CAMBIO: Añadir listener al nuevo botón ---
  forcePausaUnlockBtn.addEventListener("click", handleForcePausaUnlock);

  onAuthStateChanged(auth, (user) => {
    if (user && user.providerData.some((p) => p.providerId === "google.com")) {
      console.log("Admin: Autenticado como", user.email);
      userEmailEl.textContent = user.email;
      loginView.classList.add("hidden-content");
      panelView.classList.remove("hidden-content");
      listenToProgress();
    } else {
      console.log("Admin: No autenticado.");
      loginView.classList.remove("hidden-content");
      panelView.classList.add("hidden-content");
      stopAllListeners();
    }
  });
};

// Iniciar la app de admin
initAdmin();
