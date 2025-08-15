document.addEventListener("DOMContentLoaded", () => {
  const sections = [
    "intro",
    "decision",
    "acertijo1",
    "acertijo2",
    "acertijo3",
    "final",
  ];
  const audioMap = {
    intro: "audio-01",
    decision: "audio-decision",
    acertijo1: "audio-02",
    acertijo2: "audio-03",
    acertijo3: "audio-04",
    final: "audio-05",
  };

  let currentSection = "intro";
  let fondoIniciado = false;
  let eleccionRealizada = false;

  // 🎵 Iniciar audio de fondo
  const iniciarAudioFondo = () => {
    if (!fondoIniciado) {
      const audioFondo = document.getElementById("audio-fondo");
      if (audioFondo) {
        audioFondo.volume = 0.2;
        audioFondo
          .play()
          .then(() => {
            fondoIniciado = true;
          })
          .catch((error) => {
            console.log("No se pudo iniciar el audio de fondo:", error);
          });
      }
    }
  };

  // 🔇 Pausar todos los audios
  const pausarTodosLosAudios = () => {
    Object.values(audioMap).forEach((audioId) => {
      const audio = document.getElementById(audioId);
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    sections.forEach((section) => {
      const playButton = document.getElementById(`play-${section}`);
      if (playButton) {
        playButton.innerHTML = `<i class="fas fa-play"></i>`;
      }
    });
  };

  // 🎧 Control de reproducción por sección
  sections.forEach((section) => {
    const playButton = document.getElementById(`play-${section}`);
    const audioId = audioMap[section];
    const audio = document.getElementById(audioId);

    if (playButton && audio) {
      playButton.addEventListener("click", () => {
        iniciarAudioFondo();
        if (audio.paused) {
          pausarTodosLosAudios();
          audio
            .play()
            .then(() => {
              playButton.innerHTML = `<i class="fas fa-pause"></i>`;
            })
            .catch((error) => {
              console.log("Error al reproducir:", error);
            });
        } else {
          audio.pause();
          playButton.innerHTML = `<i class="fas fa-play"></i>`;
        }
      });

      audio.addEventListener("ended", () => {
        playButton.innerHTML = `<i class="fas fa-play"></i>`;
      });
    }
  });

  // 🎯 Mostrar sección de decisión
  window.mostrarDecision = () => {
    iniciarAudioFondo();
    pausarTodosLosAudios();
    document.getElementById(currentSection).style.display = "none";
    currentSection = "decision";
    document.getElementById(currentSection).style.display = "block";
  };

  // ⭐ Manejar elección de opción
  window.elegirOpcion = (tipo) => {
    if (eleccionRealizada) return;

    eleccionRealizada = true;
    iniciarAudioFondo();
    pausarTodosLosAudios();

    if (tipo === "inmediata") {
      // Si elige la opción inmediata, mostrar mensaje especial y terminar
      document.getElementById("decision").style.display = "none";
      document.getElementById("final").style.display = "block";
      currentSection = "final";

      // Cambiar el contenido del mensaje final
      document.querySelector("#final .monto").textContent = "$50.000";
      document.getElementById("mensaje-final-contenido").innerHTML = `
        <span class="monto">$50.000</span> ahora mismo...<br />
        <br />
        Elegiste tomar el dinero ahora, Valentino.<br />
        Es una decisión válida.<br />
        A veces lo inmediato también tiene su valor.<br />
        <br />
        Pero recordá...<br />
        En la vida siempre hay momentos donde podés elegir<br />
        entre lo que querés ahora y lo que podrías tener después.<br />
        <br />
        La paciencia y la confianza a menudo traen<br />
        recompensas mucho mayores.<br />
        <br />
        Esta fue tu primera gran decisión.<br />
        Habrá muchas más en el futuro.<br />
        <br />
        🎁 ¡Feliz Navidad, Valentino! ✨
      `;
    } else {
      // Si elige esperar, continúa con los acertijos
      mostrarAcertijo(1);
    }
  };

  // 🎯 Mostrar acertijo
  window.mostrarAcertijo = (id) => {
    iniciarAudioFondo();
    pausarTodosLosAudios();
    document.getElementById(currentSection).style.display = "none";
    currentSection = `acertijo${id}`;
    document.getElementById(currentSection).style.display = "block";
  };

  // ✅ Validar respuesta
  window.validarAcertijo = (id) => {
    const respuesta = document
      .getElementById(`respuesta${id}`)
      .value.toLowerCase()
      .trim();
    const error = document.getElementById(`error${id}`);
    const respuestasCorrectas = {
      1: "responsabilidad",
      2: "tiempo",
      3: "paciencia",
    };

    if (respuesta === respuestasCorrectas[id]) {
      error.textContent = "";
      error.classList.remove("show", "error");
      pausarTodosLosAudios();
      if (id < 3) {
        mostrarAcertijo(id + 1);
      } else {
        document.getElementById("acertijo3").style.display = "none";
        document.getElementById("final").style.display = "block";
        currentSection = "final";
      }
    } else {
      error.textContent = "✨ Respuesta incorrecta. Intenta de nuevo. ✨";
      error.classList.add("show", "error");
    }
  };

  // 🚀 Botón "Comenzar" inicia juego
  const comenzarBtn = document.querySelector("#intro .boton button");
  if (comenzarBtn) {
    comenzarBtn.addEventListener("click", () => {
      iniciarAudioFondo();
      mostrarDecision();
    });
  }
});
