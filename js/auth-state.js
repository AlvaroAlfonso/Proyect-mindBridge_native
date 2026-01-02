// Gestión del estado de autenticación
// Controla si el usuario está logueado o no

// Variables globales
var urlBase = "../php/";
var usuarioActual = null;
var estaLogueado = false;

// Iniciar gestión de autenticación
function iniciarGestionAuth() {
  console.log("🔐 Iniciando gestión de autenticación...");

  // Verificar estado de autenticación
  verificarEstadoAuth();

  // Configurar eventos
  configurarEventos();
}

// Verificar estado de autenticación
function verificarEstadoAuth() {
  console.log("🔍 Verificando estado de autenticación...");

  fetch(urlBase + "check_auth.php", {
    method: "GET",
    credentials: "include",
  })
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      if (datos.authenticated) {
        estaLogueado = true;
        usuarioActual = datos.usuario;
        console.log("✅ Usuario autenticado:", usuarioActual.nombre);
      } else {
        estaLogueado = false;
        usuarioActual = null;
        console.log("❌ Usuario no autenticado");
      }

      // Actualizar la interfaz
      actualizarInterfaz();
    })
    .catch(function (error) {
      console.log("Error verificando autenticación:", error);
      estaLogueado = false;
      usuarioActual = null;
      actualizarInterfaz();
    });
}

// Actualizar interfaz
function actualizarInterfaz() {
  actualizarHeader();
  actualizarNavegacion();
  actualizarContenidoProtegido();
}

// Actualizar header
function actualizarHeader() {
  var enlacesAuth = document.querySelector(".auth-links");
  if (!enlacesAuth) return;

  if (estaLogueado) {
    // Mostrar menú de usuario logueado
    enlacesAuth.innerHTML = crearMenuUsuario();
  } else {
    // Mostrar botones de login/registro
    enlacesAuth.innerHTML = crearBotonesAuth();
  }
}

// Crear menú de usuario
function crearMenuUsuario() {
  return `
        <div class="user-menu">
            <div class="user-info">
                <span class="user-name">Hola, ${usuarioActual.nombre}</span>
                <div class="user-dropdown">
                    <button class="dropdown-toggle" onclick="alternarMenuUsuario()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="dropdown-menu" id="userDropdown">
                        <a href="dashboard.html" class="dropdown-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Mi Perfil
                        </a>
                        <a href="appointments.html" class="dropdown-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Mis Citas
                        </a>
                        <a href="resources.html" class="dropdown-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Mis Recursos
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" onclick="cerrarSesion()" class="dropdown-item logout">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Cerrar Sesión
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Crear botones de autenticación
function crearBotonesAuth() {
  return `
        <a href="./pages/login.html" class="btn-login">Iniciar Sesión</a>
        <a href="./pages/register.html" class="btn-register">Registrarse</a>
    `;
}

// Actualizar navegación
function actualizarNavegacion() {
  // Mostrar/ocultar enlaces protegidos
  var enlacesProtegidos = document.querySelectorAll("[data-protected]");

  for (var i = 0; i < enlacesProtegidos.length; i++) {
    var enlace = enlacesProtegidos[i];
    if (estaLogueado) {
      enlace.style.display = "block";
    } else {
      enlace.style.display = "none";
    }
  }
}

// Actualizar contenido protegido
function actualizarContenidoProtegido() {
  // Mostrar/ocultar contenido protegido
  var contenidoProtegido = document.querySelectorAll(".protected-content");

  for (var i = 0; i < contenidoProtegido.length; i++) {
    var contenido = contenidoProtegido[i];
    if (estaLogueado) {
      contenido.style.display = "block";
    } else {
      contenido.style.display = "none";
    }
  }

  // Mostrar mensaje de login requerido
  var elementosLoginRequerido = document.querySelectorAll(".login-required");

  for (var i = 0; i < elementosLoginRequerido.length; i++) {
    var elemento = elementosLoginRequerido[i];
    if (!estaLogueado) {
      elemento.innerHTML = crearMensajeLoginRequerido();
    }
  }
}

// Crear mensaje de login requerido
function crearMensajeLoginRequerido() {
  return `
        <div class="login-prompt">
            <div class="login-prompt-content">
                <h3>Inicia sesión para acceder</h3>
                <p>Necesitas una cuenta para acceder a este contenido</p>
                <div class="login-prompt-actions">
                    <a href="./pages/login.html" class="btn-login">Iniciar Sesión</a>
                    <a href="./pages/register.html" class="btn-register">Registrarse</a>
                </div>
            </div>
        </div>
    `;
}

// Configurar eventos
function configurarEventos() {
  // Cerrar dropdown al hacer clic fuera
  document.addEventListener("click", function (evento) {
    var dropdown = document.getElementById("userDropdown");
    var toggle = document.querySelector(".dropdown-toggle");

    if (
      dropdown &&
      toggle &&
      !dropdown.contains(evento.target) &&
      !toggle.contains(evento.target)
    ) {
      dropdown.classList.remove("show");
    }
  });
}

// Funciones globales (para usar en HTML)
function alternarMenuUsuario() {
  var dropdown = document.getElementById("userDropdown");
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

function cerrarSesion() {
  console.log("🚪 Cerrando sesión...");

  fetch(urlBase + "logout.php", {
    method: "POST",
    credentials: "include",
  })
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (resultado) {
      if (resultado.success) {
        estaLogueado = false;
        usuarioActual = null;
        actualizarInterfaz();

        // Redirigir al inicio
        window.location.href = "../index.html";
      }
    })
    .catch(function (error) {
      console.log("Error al cerrar sesión:", error);
      // Redirigir de todas formas
      window.location.href = "../index.html";
    });
}

// Iniciar cuando la página esté lista
document.addEventListener("DOMContentLoaded", function () {
  console.log("📄 Página cargada, iniciando gestión de autenticación...");
  iniciarGestionAuth();
});
