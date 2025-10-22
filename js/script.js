// =============================
// ACTUALIZACIÓN DE BACKGROUNDS
// =============================
const BackgroundManager = {
  backgrounds: {
    intro: "./assets/img/intro-bg.png",
    decision: "./assets/img/decision-bg.png",
    confirmacion1: "./assets/img/confirmacion1-bg.jpg",
    confirmacion2: "./assets/img/confirmacion2-bg.jpg",
    acertijo1: "./assets/img/acertijo1-bg.png",
    acertijo2: "./assets/img/acertijo2-bg.png",
    acertijo3: "./assets/img/acertijo3-bg.png",
    explicacion1: "./assets/img/explicacion1-bg.png",
    explicacion2: "./assets/img/explicacion2-bg.png",
    explicacion3: "./assets/img/explicacion3-bg.png",
    final2: "./assets/img/final2-bg.jpg",
  },

  update() {
    const activeSection = document.querySelector(".section.active");
    if (activeSection) {
      const bg =
        this.backgrounds[activeSection.id] || "./assets/img/default-bg.png";
      document.body.style.backgroundImage = `url('${bg}')`;
    } else {
      document.body.style.backgroundImage = "none";
    }
  },

  init() {
    const observer = new MutationObserver(() => this.update());

    document.querySelectorAll(".section").forEach((section) => {
      observer.observe(section, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });

    document.addEventListener("DOMContentLoaded", () => this.update());
  },
};

BackgroundManager.init();
