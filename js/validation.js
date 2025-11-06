// Usar los nombres de archivo correctos
import config from "./config.js";
// --- NUEVA IMPORTACIÓN ---
import FirebaseManager from "./firebase-manager.js";

/**
 * validation.js: El Validador de Acertijos
 */
const Validation = {
  /**
   * Normaliza un string
   */
  _normalize(str) {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  },

  /**
   * --- FUNCIÓN MODIFICADA ---
   * Verifica la respuesta de un acertijo.
   */
  check(inputEl, errorEl, validationKey, onSuccess) {
    const userInput = inputEl.value;
    const normalizedInput = this._normalize(userInput);

    const validAnswers = config.validation[validationKey];
    if (!validAnswers) {
      console.error(`Validación: No se encontró la clave "${validationKey}".`);
      return;
    }

    const isCorrect = validAnswers.includes(normalizedInput);

    // --- ¡NUEVA LÓGICA DE GUARDADO DE INTENTOS! ---
    // Guardar el intento en Firebase ANTES de mostrar el resultado.
    // Usamos el 'userInput' original para ver exactamente lo que escribió.
    FirebaseManager.saveRiddleAttempt(validationKey, userInput, isCorrect);
    // --- Fin de la nueva lógica ---

    if (!normalizedInput) {
      errorEl.textContent = "Por favor, escribe una respuesta.";
      errorEl.classList.add("show");
      return;
    }

    if (isCorrect) {
      // ¡Éxito!
      errorEl.classList.remove("show");
      inputEl.disabled = true;
      onSuccess();
    } else {
      // Error
      errorEl.textContent = "No es la respuesta correcta, reflexiona...";
      errorEl.classList.add("show");
      inputEl.value = ""; // Limpiar el input para reintentar
    }
  },
};

export default Validation;
