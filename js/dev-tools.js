// js/dev-tools.js - Para facilitar el testing
const DevTools = {
  init() {
    // Solo en desarrollo
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      this.createTestingPanel();
    }
  },

  createTestingPanel() {
    const panel = document.createElement("div");
    panel.style.cssText = `
      position: fixed; top: 10px; left: 10px; 
      background: rgba(0,0,0,0.8); color: white; 
      padding: 10px; border-radius: 5px; z-index: 9999;
      font-size: 12px; max-width: 200px;
    `;

    const sections = Object.keys(CONFIG.textos);
    panel.innerHTML = `
      <strong>Testing Panel</strong><br>
      ${sections
        .map(
          (section) =>
            `<a href="#${section}" style="color: #4CAF50; margin: 2px 5px 2px 0; text-decoration: underline;">${section}</a>`
        )
        .join("")}
    `;

    document.body.appendChild(panel);
  },
};
