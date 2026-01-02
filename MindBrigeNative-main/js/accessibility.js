/**
 * Sistema Simple de Accesibilidad para MindBridge
 * Solo tamaño de letra y contraste
 */

class AccessibilityManager {
  constructor() {
    this.currentFontSize = "normal";
    this.isHighContrast = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadUserPreferences();
  }

  /**
   * Configurar controles simples
   */
  setupEventListeners() {
    // Controles de tamaño de fuente
    const fontControls = document.querySelectorAll('input[name="font-size"]');
    fontControls.forEach((control) => {
      control.addEventListener("change", (e) => {
        this.setFontSize(e.target.id);
      });
    });

    // Control de contraste alto
    const contrastControl = document.getElementById("high-contrast");
    if (contrastControl) {
      contrastControl.addEventListener("change", (e) => {
        this.toggleHighContrast(e.target.checked);
      });
    }
  }

  /**
   * Cargar preferencias guardadas
   */
  loadUserPreferences() {
    const savedFontSize = localStorage.getItem("mindbridge-font-size");
    const savedContrast = localStorage.getItem("mindbridge-high-contrast");

    if (savedFontSize) {
      this.setFontSize(savedFontSize);
      const radio = document.getElementById(savedFontSize);
      if (radio) radio.checked = true;
    }

    if (savedContrast === "true") {
      this.toggleHighContrast(true);
      const checkbox = document.getElementById("high-contrast");
      if (checkbox) checkbox.checked = true;
    }
  }

  /**
   * Cambiar tamaño de letra
   */
  setFontSize(size) {
    this.currentFontSize = size;
    document.body.className = document.body.className.replace(
      /font-size-\w+/g,
      ""
    );
    document.body.classList.add(`font-size-${size}`);
    localStorage.setItem("mindbridge-font-size", size);
  }

  /**
   * Cambiar contraste
   */
  toggleHighContrast(enabled) {
    this.isHighContrast = enabled;
    if (enabled) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
    localStorage.setItem("mindbridge-high-contrast", enabled);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  window.accessibilityManager = new AccessibilityManager();
});

// Funciones globales para compatibilidad
window.togglePassword = function (inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;

  if (input.type === "password") {
    input.type = "text";
    button.setAttribute("aria-label", "Ocultar contraseña");
  } else {
    input.type = "password";
    button.setAttribute("aria-label", "Mostrar contraseña");
  }
};

window.hideNotification = function () {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.style.display = "none";
  }
};
