const sectionBackgrounds = {
  intro: "../assets/img/intro-bg.png",
  decision: "../assets/img/decision-bg.png",
  confirmacion1: "../assets/img/confirmacion1-bg.jpg",
  confirmacion2: "../assets/img/confirmacion2-bg.jpg",
  acertijo1: "../assets/img/acertijo1-bg.png",
  acertijo2: "../assets/img/acertijo2-bg.png",
  acertijo3: "../assets/img/acertijo3-bg.png",
  explicacion1: "../assets/img/explicacion1-bg.png",
  explicacion2: "../assets/img/explicacion2-bg.png",
  explicacion3: "../assets/img/explicacion3-bg.png",
  final: "assets/img/final-bg.jpg",
  countdown: "assets/img/countdown-bg.jpg",
  final2: "assets/img/final2-bg.jpg",
};

function updateBackground() {
  const activeSection = document.querySelector(".section.active");
  if (activeSection) {
    const sectionId = activeSection.id;
    const backgroundImage =
      sectionBackgrounds[sectionId] || "assets/img/default-bg.png";
    document.body.style.backgroundImage = `url('${backgroundImage}')`;
  } else {
    document.body.style.backgroundImage = "none";
  }
}

// Observa cambios en las secciones
const observer = new MutationObserver(() => {
  updateBackground();
});

// Configura el observador para detectar cambios en las clases de las secciones
const sections = document.querySelectorAll(".section");
sections.forEach((section) => {
  observer.observe(section, { attributes: true, attributeFilter: ["class"] });
});

// Ejecuta la función al cargar la página
document.addEventListener("DOMContentLoaded", updateBackground);
