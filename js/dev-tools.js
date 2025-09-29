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
    // Crear contenedor principal del panel
    const panel = document.createElement("div");
    panel.id = "dev-tools-panel";
    panel.style.cssText = `
      position: fixed; top: 10px; left: 10px;
      z-index: 9999; font-family: Arial, sans-serif;
      transition: transform 0.3s ease-in-out;
    `;

    // Contenido del panel (inicialmente oculto)
    const panelContent = document.createElement("div");
    panelContent.className = `
      bg-gray-900 text-white p-4 rounded-lg shadow-lg 
      max-w-xs w-64 border border-gray-700
      hidden
    `;
    panelContent.id = "dev-tools-content";

    // Generar enlaces a secciones
    const sections = Object.keys(CONFIG.textos);
    panelContent.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <strong class="text-sm font-bold text-green-400">Testing Panel</strong>
        <button id="dev-tools-toggle" class="text-gray-400 hover:text-white">
          <svg class="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        ${sections
          .map(
            (section) => `
              <a href="#${section}" 
                 class="text-xs bg-gray-800 hover:bg-green-600 text-white 
                        py-1 px-2 rounded block text-center 
                        transition-colors duration-200">
                ${section}
              </a>`
          )
          .join("")}
      </div>
    `;

    // Botón de toggle (visible cuando el panel está colapsado)
    const toggleButton = document.createElement("button");
    toggleButton.id = "dev-tools-toggle-btn";
    toggleButton.className = `
      bg-green-600 text-white p-2 rounded-full 
      shadow-lg hover:bg-green-700 transition-colors duration-200
    `;
    toggleButton.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    `;

    // Añadir elementos al panel
    panel.appendChild(toggleButton);
    panel.appendChild(panelContent);

    // Añadir Tailwind CSS CDN dinámicamente
    const tailwindLink = document.createElement("link");
    tailwindLink.rel = "stylesheet";
    tailwindLink.href =
      "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
    document.head.appendChild(tailwindLink);

    // Añadir panel al DOM
    document.body.appendChild(panel);

    // Lógica para colapsar/expandir
    const togglePanel = () => {
      const isHidden = panelContent.classList.contains("hidden");
      if (isHidden) {
        panelContent.classList.remove("hidden");
        toggleButton.classList.add("hidden");
        panel.style.transform = "translateX(0)";
      } else {
        panelContent.classList.add("hidden");
        toggleButton.classList.remove("hidden");
        panel.style.transform = "translateX(-10px)";
      }
    };

    // Configurar eventos
    toggleButton.addEventListener("click", togglePanel);
    panelContent
      .querySelector("#dev-tools-toggle")
      .addEventListener("click", togglePanel);

    // Colapsar por defecto
    panelContent.classList.add("hidden");
    toggleButton.classList.remove("hidden");
  },
};
