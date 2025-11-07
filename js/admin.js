/**
 * admin.js: Lógica del Panel de Administración
 * (Actualizado con Nueva UX 2.0 y la sección #pausa)
 */

// Importamos el config de la app principal para saber la estructura
import config from "./config.js";

const {
  initializeApp,
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDocs,
  deleteDoc,
} = window.firebaseAdminSDK;

// ... (variables globales sin cambios) ...
let app;
let auth;
let db;
let provider;
let currentUserId = null;
const loginView = document.getElementById("admin-login");
const panelView = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userEmailEl = document.getElementById("admin-user-email");
const visualPathEl = document.getElementById("visual-path");
const detailsCardsEl = document.getElementById("details-cards");
const attemptsListEl = document.getElementById("attempts-list");
const deleteProgressBtn = document.getElementById("delete-progress-btn");
let activeListeners = {};

// --- signIn (sin cambios) ---
const signIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(
        "Admin: ¡Inicio de sesión de Google exitoso!",
        result.user.email
      );
    })
    .catch((error) => {
      console.error("Admin: Error en el popup de Google:", error);
    });
};

// --- logOut (sin cambios) ---
const logOut = () => {
  signOut(auth);
};

// --- createStepElement (sin cambios) ---
const createStepElement = (sectionId, currentSection, maxStep) => {
  const sectionData = config.sections[sectionId];
  if (!sectionData) return null;
  const step = sectionData.step;
  const el = document.createElement("div");
  el.className = "path-step";
  if (sectionId === currentSection) {
    el.classList.add("current");
  }
  if (step <= maxStep) {
    el.classList.add("visited");
  }
  if (step > maxStep) {
    el.classList.add("locked");
  }
  el.innerHTML = `
    <strong>${sectionId}</strong>
    <span>(Paso ${step})</span>
  `;
  return el;
};

/**
 * --- FUNCIÓN MODIFICADA ---
 * Construye y renderiza el árbol de progreso visual completo
 * (Actualizado con #pausa)
 */
const renderVisualPath = (currentSection, maxStep) => {
  if (!visualPathEl) return;
  visualPathEl.innerHTML = ""; // Limpiar el mapa

  // Definir los dos caminos basados en config.js
  const caminoRapido = ["confirmacion1", "confirmacion2", "final2"];

  // --- CAMBIO AQUÍ: Añadido 'pausa' ---
  const caminoPaciente = [
    "acertijo1",
    "explicacion1",
    "acertijo2",
    "explicacion2",
    "acertijo3",
    "explicacion3",
    "pausa", // <-- AÑADIDO
    "final",
    "countdown",
  ];

  // --- Renderizar Paso Inicial Común ---
  visualPathEl.appendChild(createStepElement("intro", currentSection, maxStep));
  visualPathEl.appendChild(
    createStepElement("decision", currentSection, maxStep)
  );

  // --- Renderizar Bifurcación: Camino Rápido ---
  const branchRapido = document.createElement("div");
  branchRapido.className = "path-branch";
  branchRapido.innerHTML = `<h3 class="path-branch-title">Camino Rápido</h3>`;
  caminoRapido.forEach((id) => {
    branchRapido.appendChild(createStepElement(id, currentSection, maxStep));
  });
  visualPathEl.appendChild(branchRapido);

  // --- Renderizar Bifurcación: Camino Paciente ---
  const branchPaciente = document.createElement("div");
  branchPaciente.className = "path-branch";
  branchPaciente.innerHTML = `<h3 class="path-branch-title">Camino Paciente</h3>`;
  caminoPaciente.forEach((id) => {
    branchPaciente.appendChild(createStepElement(id, currentSection, maxStep));
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

// --- listenToProgress (sin cambios) ---
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
      return;
    }
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;
    currentUserId = userId;
    deleteProgressBtn.disabled = false;
    renderVisualPath(userData.currentSection, userData.maxStep);
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

// --- initAdmin (sin cambios) ---
const initAdmin = () => {
  app = initializeApp(window.firebaseAdminSDK.firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  provider = new GoogleAuthProvider();
  loginBtn.addEventListener("click", signIn);
  logoutBtn.addEventListener("click", logOut);
  deleteProgressBtn.addEventListener("click", handleDeleteProgress);
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
