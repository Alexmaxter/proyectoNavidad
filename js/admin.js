/**
 * admin.js: Lógica del Panel de Administración
 * (VERSIÓN SIN SEGURIDAD - ACCESO DIRECTO)
 */

import config from "./config.js";

// --- Destructuring simplificado (SIN AUTH) ---
const {
  initializeApp,
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDocs,
  deleteDoc,
  setDoc,
} = window.firebaseAdminSDK;

const PROGRESS_DOC_ID = "valentino";

// Mapa de Navegación Inversa (sin cambios)
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
  final: "pausa",
  countdown: "final",
};

// --- Variables de Auth eliminadas ---
let app;
let db;
let currentUserId = PROGRESS_DOC_ID;

// --- Referencias a elementos de login/logout eliminadas ---
const visualPathEl = document.getElementById("visual-path");
const detailsCardsEl = document.getElementById("details-cards");
const attemptsListEl = document.getElementById("attempts-list");
const deleteProgressBtn = document.getElementById("delete-progress-btn");
const forcePausaUnlockBtn = document.getElementById("force-pausa-unlock-btn");

let activeListeners = {};

// --- FUNCIÓN signIn ELIMINADA ---

// createStepElement (sin cambios)
const createStepElement = (sectionId, currentSection, visitedPath) => {
  const sectionData = config.sections[sectionId];
  if (!sectionData) return null;
  const step = sectionData.step;
  const el = document.createElement("div");
  el.className = "path-step";
  if (sectionId === currentSection) {
    el.classList.add("current");
  }
  if (visitedPath.has(sectionId)) {
    el.classList.add("visited");
  } else if (sectionId !== currentSection) {
    el.classList.add("locked");
  }
  el.innerHTML = `
    <strong>${sectionId}</strong>
    <span>(Paso ${step})</span>
  `;
  return el;
};

// renderVisualPath (sin cambios)
const renderVisualPath = (currentSection, maxStep, lastSection) => {
  if (!visualPathEl) return;
  visualPathEl.innerHTML = "";
  const visitedPath = new Set();
  let currentTrace = lastSection;
  while (currentTrace) {
    visitedPath.add(currentTrace);
    currentTrace = pathMap[currentTrace];
  }
  visitedPath.add("intro");
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

// renderDetails (sin cambios)
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

// listenToProgress (sin cambios)
const listenToProgress = () => {
  const progressDocRef = doc(db, "progress", PROGRESS_DOC_ID);
  const unsubscribe = onSnapshot(progressDocRef, (docSnap) => {
    console.log("Admin: ¡Datos de progreso recibidos!");
    if (!docSnap.exists()) {
      visualPathEl.innerHTML =
        "<p class='narrativa'>El documento 'valentino' aún no ha sido creado.</p>";
      detailsCardsEl.innerHTML = "";
      attemptsListEl.innerHTML = "<li>...</li>";
      deleteProgressBtn.disabled = true;
      forcePausaUnlockBtn.disabled = true;
      return;
    }
    const userData = docSnap.data();
    deleteProgressBtn.disabled = false;
    forcePausaUnlockBtn.disabled = false;
    renderVisualPath(
      userData.currentSection,
      userData.maxStep,
      userData.lastSection
    );
    renderDetails(userData);
    listenToAttempts(PROGRESS_DOC_ID);
  });
  activeListeners["progress"] = unsubscribe;
};

// listenToAttempts (sin cambios)
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

// stopAllListeners (sin cambios)
const stopAllListeners = () => {
  console.log("Admin: Deteniendo todos los listeners de realtime.");
  Object.values(activeListeners).forEach((unsubscribe) => unsubscribe());
  activeListeners = {};
};

// handleDeleteProgress (sin cambios)
const handleDeleteProgress = async () => {
  const uid = PROGRESS_DOC_ID;
  const confirmation = prompt(
    `¡ADVERTENCIA!\n\nEstás a punto de borrar TODO el progreso del documento '${uid}'...\n\nEscribe "borrar" para confirmar.`
  );
  if (confirmation !== "borrar") {
    alert("Reinicio cancelado.");
    return;
  }
  console.log(`Admin: Borrando progreso para el documento ${uid}...`);
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

// handleForcePausaUnlock (sin cambios)
const handleForcePausaUnlock = async () => {
  const uid = PROGRESS_DOC_ID;
  console.log(
    `Admin: Forzando desbloqueo de 'pausa' para el documento ${uid}...`
  );
  forcePausaUnlockBtn.disabled = true;
  forcePausaUnlockBtn.textContent = "Enviando...";
  try {
    const progressDocRef = doc(db, "progress", uid);
    await setDoc(progressDocRef, { pausaUnlocked: true }, { merge: true });
    console.log("Admin: ¡Desbloqueo enviado!");
    alert("¡Desbloqueo forzado enviado al usuario!");
    forcePausaUnlockBtn.textContent = "¡Desbloqueo Enviado!";
  } catch (error) {
    console.error("Admin: Error al forzar el desbloqueo:", error);
    alert("Error al enviar el desbloqueo: " + error.message);
    forcePausaUnlockBtn.disabled = false;
    forcePausaUnlockBtn.textContent = "Forzar Desbloqueo de Pausa (Remoto)";
  }
};

// --- initAdmin (Simplificado) ---
const initAdmin = () => {
  app = initializeApp(window.firebaseAdminSDK.firebaseConfig);
  db = getFirestore(app);

  // --- Se eliminaron los listeners de login/logout ---
  deleteProgressBtn.addEventListener("click", handleDeleteProgress);
  forcePausaUnlockBtn.addEventListener("click", handleForcePausaUnlock);

  // --- Se eliminó onAuthStateChanged ---

  // --- Cargar los datos directamente al iniciar ---
  console.log("Admin: Acceso directo. Cargando datos de progreso...");
  listenToProgress();
};

// Iniciar la app de admin
initAdmin();
