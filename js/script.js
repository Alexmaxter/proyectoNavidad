// ✅ Respuestas correctas por número de acertijo
const respuestasCorrectas = {
  1: "responsabilidad",
  2: "tiempo",
  3: "paciencia",
};

// ✨ Muestra la sección correspondiente
function mostrarAcertijo(num) {
  ocultarTodasLasSecciones();
  const acertijo = document.getElementById(`acertijo${num}`);
  if (acertijo) acertijo.style.display = "block";
  const error = document.getElementById(`error${num}`);
  if (error) error.textContent = "";
}

// 💡 Valida la respuesta ingresada

function validarAcertijo(num) {
  const input = document.getElementById(`respuesta${num}`);
  const respuesta = input.value.trim().toLowerCase();
  const correcto = respuestasCorrectas[num];

  if (respuesta === correcto) {
    num === 3 ? mostrarFinal() : mostrarAcertijo(num + 1);
  } else {
    const error = document.getElementById(`error${num}`);
    if (error) {
      error.textContent = "Respuesta incorrecta. ¡Probá de nuevo!";
    }
  }
}

function mostrarMensaje(texto) {
  const modal = document.getElementById("mensajeEmergente");
  const contenido = document.getElementById("textoEmergente");
  contenido.textContent = texto;
  modal.style.display = "flex";
}

function cerrarMensaje() {
  document.getElementById("mensajeEmergente").style.display = "none";
}

// 🎁 Muestra el mensaje final
function mostrarFinal() {
  ocultarTodasLasSecciones();
  const final = document.getElementById("final");
  if (final) final.style.display = "block";
}

// 🧼 Oculta todas las secciones
function ocultarTodasLasSecciones() {
  const ids = ["intro", "acertijo1", "acertijo2", "acertijo3", "final"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}
