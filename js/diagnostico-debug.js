// =============================
// SCRIPT DE DIAGNÓSTICO PARA GITHUB PAGES
// =============================
// Agregar este script TEMPORALMENTE para diagnosticar el problema

const DiagnosticoGitHub = {
  init() {
    console.log("=== INICIANDO DIAGNÓSTICO GITHUB PAGES ===");

    // Verificar cuando se cargue la página
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.ejecutarDiagnostico()
      );
    } else {
      this.ejecutarDiagnostico();
    }

    // También ejecutar después de 2 segundos para asegurar que todo esté cargado
    setTimeout(() => this.ejecutarDiagnosticoCompleto(), 2000);
  },

  ejecutarDiagnostico() {
    console.log("--- Diagnóstico Básico ---");
    this.verificarDOM();
    this.verificarConfiguracion();
    this.verificarRecursos();
  },

  ejecutarDiagnosticoCompleto() {
    console.log("--- Diagnóstico Completo ---");
    this.verificarDOM();
    this.verificarConfiguracion();
    this.verificarRecursos();
    this.verificarNavegacion();
    this.verificarVideo();
    this.crearPanelDiagnostico();
  },

  verificarDOM() {
    console.log("🔍 Verificando DOM...");

    const secciones = [
      "intro",
      "decision",
      "acertijo1",
      "explicacion1",
      "acertijo2",
      "explicacion2",
      "acertijo3",
      "explicacion3",
      "final",
      "countdown",
      "final2",
    ];

    secciones.forEach((seccion) => {
      const elemento = document.getElementById(seccion);
      console.log(
        `Sección ${seccion}:`,
        elemento ? "✅ Existe" : "❌ No encontrada"
      );
    });

    // Verificar elementos específicos de la sección final
    const seccionFinal = document.getElementById("final");
    if (seccionFinal) {
      const videoContainer = seccionFinal.querySelector(".video-container");
      const video = document.getElementById("Final");
      const videoSource = video?.querySelector("source");

      console.log("🎬 Elementos de video:");
      console.log(
        "- Video container:",
        videoContainer ? "✅ Existe" : "❌ No encontrado"
      );
      console.log("- Video element:", video ? "✅ Existe" : "❌ No encontrado");
      console.log(
        "- Video source:",
        videoSource ? "✅ Existe" : "❌ No encontrada"
      );

      if (videoSource) {
        console.log("- Video src:", videoSource.src || "Sin src");
      }

      if (seccionFinal) {
        console.log("- HTML de sección final (primeros 300 chars):");
        console.log(seccionFinal.innerHTML.substring(0, 300) + "...");
      }
    }
  },

  verificarConfiguracion() {
    console.log("⚙️ Verificando configuración...");

    if (typeof CONFIG !== "undefined") {
      console.log("✅ CONFIG existe");

      if (CONFIG.navegacion) {
        console.log("✅ CONFIG.navegacion existe");
        console.log("Rutas de explicacion3:", CONFIG.navegacion.explicacion3);
      } else {
        console.log("❌ CONFIG.navegacion no existe");
      }

      if (CONFIG.textos) {
        console.log("✅ CONFIG.textos existe");
        console.log("Secciones en CONFIG.textos:", Object.keys(CONFIG.textos));
      } else {
        console.log("❌ CONFIG.textos no existe");
      }
    } else {
      console.log("❌ CONFIG no existe");
    }
  },

  verificarRecursos() {
    console.log("📦 Verificando recursos...");

    // Verificar scripts
    const scripts = [
      "config.js",
      "navigation.js",
      "content-manager.js",
      "main.js",
    ];
    scripts.forEach((script) => {
      const elemento = document.querySelector(`script[src*="${script}"]`);
      console.log(
        `Script ${script}:`,
        elemento ? "✅ Cargado" : "❌ No encontrado"
      );
    });

    // Verificar video
    const video = document.getElementById("Final");
    if (video) {
      console.log("🎬 Estado del video:");
      console.log("- readyState:", video.readyState);
      console.log("- networkState:", video.networkState);
      console.log("- error:", video.error);
      console.log("- currentSrc:", video.currentSrc);
    }
  },

  verificarNavegacion() {
    console.log("🧭 Verificando navegación...");

    if (typeof Navigation !== "undefined") {
      console.log("✅ Navigation existe");
      console.log("Navigation methods:", Object.keys(Navigation));

      if (typeof Navigation.continuarDesdeExplicacion === "function") {
        console.log("✅ continuarDesdeExplicacion existe");
      } else {
        console.log("❌ continuarDesdeExplicacion no es una función");
      }
    } else {
      console.log("❌ Navigation no existe");
    }

    if (typeof AppState !== "undefined") {
      console.log("✅ AppState existe");
      console.log("AppState actual:", {
        seccionActiva: AppState.seccionActiva?.id,
        playClickeado: AppState.playClickeado,
        seccionesVisitadas: [...(AppState.seccionesVisitadas || [])],
      });
    } else {
      console.log("❌ AppState no existe");
    }
  },

  verificarVideo() {
    console.log("🎥 Verificación específica del video...");

    const video = document.getElementById("Final");
    if (!video) {
      console.log("❌ Video no encontrado en DOM");
      return;
    }

    console.log("Video encontrado, propiedades:");
    console.log("- tagName:", video.tagName);
    console.log("- src:", video.src);
    console.log("- preload:", video.preload);
    console.log("- autoplay:", video.autoplay);
    console.log("- controls:", video.controls);

    const sources = video.querySelectorAll("source");
    console.log(`- Sources encontradas: ${sources.length}`);

    sources.forEach((source, index) => {
      console.log(`  Source ${index + 1}:`);
      console.log(`    - src: ${source.src}`);
      console.log(`    - type: ${source.type}`);
    });

    // Intentar cargar el video
    if (video.readyState === 0) {
      console.log("Intentando cargar video...");
      video.load();

      video.addEventListener(
        "loadeddata",
        () => {
          console.log("✅ Video cargado correctamente");
        },
        { once: true }
      );

      video.addEventListener(
        "error",
        (e) => {
          console.log("❌ Error cargando video:", e);
        },
        { once: true }
      );
    }
  },

  crearPanelDiagnostico() {
    // Crear panel visual para diagnóstico
    const panel = document.createElement("div");
    panel.id = "panel-diagnostico";
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      max-width: 300px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 10000;
      border: 2px solid #ff6b6b;
    `;

    const seccionFinal = document.getElementById("final");
    const video = document.getElementById("Final");
    const videoSource = video?.querySelector("source");
    const navegacionOK =
      typeof Navigation !== "undefined" &&
      typeof Navigation.continuarDesdeExplicacion === "function";

    panel.innerHTML = `
      <div style="text-align: center; margin-bottom: 10px; color: #ff6b6b;">
        <strong>🔍 DIAGNÓSTICO GITHUB</strong>
      </div>
      <div>Sección Final: ${seccionFinal ? "✅" : "❌"}</div>
      <div>Video Element: ${video ? "✅" : "❌"}</div>
      <div>Video Source: ${videoSource ? "✅" : "❌"}</div>
      <div>Navegación: ${navegacionOK ? "✅" : "❌"}</div>
      <div>CONFIG: ${typeof CONFIG !== "undefined" ? "✅" : "❌"}</div>
      <hr style="margin: 10px 0; border-color: #333;">
      <div style="font-size: 11px;">
        <strong>Pruebas:</strong><br>
        <button onclick="DiagnosticoGitHub.probarNavegacion()" style="margin: 2px; padding: 5px; font-size: 10px;">
          Probar Nav → Final
        </button><br>
        <button onclick="DiagnosticoGitHub.probarVideo()" style="margin: 2px; padding: 5px; font-size: 10px;">
          Probar Video
        </button><br>
        <button onclick="DiagnosticoGitHub.ocultarPanel()" style="margin: 2px; padding: 5px; font-size: 10px;">
          Ocultar Panel
        </button>
      </div>
    `;

    document.body.appendChild(panel);
  },

  probarNavegacion() {
    console.log("=== PRUEBA DE NAVEGACIÓN ===");

    if (typeof Navigation !== "undefined" && Navigation.navigateTo) {
      console.log("Intentando navegar a 'final'...");
      Navigation.navigateTo("final")
        .then(() => {
          console.log("✅ Navegación a 'final' exitosa");
        })
        .catch((error) => {
          console.log("❌ Error navegando a 'final':", error);
        });
    } else {
      console.log("❌ Navigation.navigateTo no disponible");
    }
  },

  probarVideo() {
    console.log("=== PRUEBA DE VIDEO ===");

    const video = document.getElementById("Final");
    if (!video) {
      console.log("❌ Video no encontrado");
      return;
    }

    console.log("Video encontrado, intentando reproducir...");

    video
      .play()
      .then(() => {
        console.log("✅ Video se está reproduciendo");
        setTimeout(() => video.pause(), 2000); // Pausar después de 2 segundos
      })
      .catch((error) => {
        console.log("❌ Error reproduciendo video:", error);
      });
  },

  ocultarPanel() {
    const panel = document.getElementById("panel-diagnostico");
    if (panel) {
      panel.remove();
    }
  },
};

// Inicializar diagnóstico automáticamente
DiagnosticoGitHub.init();

// Hacer disponible globalmente para testing manual
window.DiagnosticoGitHub = DiagnosticoGitHub;
