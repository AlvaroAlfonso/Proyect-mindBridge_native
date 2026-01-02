// Sistema de autenticación simple
// Para login y registro de usuarios

// Variables globales
var urlBase = "http://localhost:8081/api/auth/";

// Iniciar sistema de autenticación
function iniciarAutenticacion() {
  console.log("🔐 Iniciando sistema de autenticación...");

  // Configurar formularios
  configurarFormularios();

  // Configurar validaciones
  configurarValidaciones();

  // Verificar si ya está logueado
  verificarSesionExistente();
}

// Configurar formularios
function configurarFormularios() {
  // Formulario de LOGIN
  var formularioLogin = document.getElementById("loginForm");
  if (formularioLogin) {
    formularioLogin.addEventListener("submit", manejarLogin);
    console.log("✅ Formulario de login configurado");
  }

  // Formulario de REGISTRO
  var formularioRegistro = document.getElementById("registerForm");
  if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", manejarRegistro);
    console.log("✅ Formulario de registro configurado");
  }
}

// Configurar validaciones
function configurarValidaciones() {
  // Validación de contraseña
  var campoPassword = document.getElementById("password");
  if (campoPassword) {
    campoPassword.addEventListener("input", verificarFuerzaPassword);
  }

  // Validación de confirmación de contraseña
  var campoConfirmarPassword = document.getElementById("confirm_password");
  if (campoConfirmarPassword) {
    campoConfirmarPassword.addEventListener(
      "input",
      verificarCoincidenciaPassword
    );
  }

  // Validación de email
  var camposEmail = document.querySelectorAll('input[type="email"]');
  for (var i = 0; i < camposEmail.length; i++) {
    camposEmail[i].addEventListener("blur", validarEmail);
  }
}

// Manejar login
function manejarLogin(evento) {
  evento.preventDefault(); // Evitar que se envíe el formulario automáticamente

  console.log("🔑 Procesando login...");

  var formulario = evento.target;
  var datos = obtenerDatosFormulario(formulario);

  // Validar datos
  if (!validarDatosLogin(datos)) {
    return;
  }

  // Mostrar carga
  mostrarCarga(formulario, true);

  // Enviar al servidor
  enviarLogin(datos, formulario);
}

// Manejar registro
function manejarRegistro(evento) {
  evento.preventDefault(); // Evitar que se envíe el formulario automáticamente

  console.log("📝 Procesando registro...");

  var formulario = evento.target;
  var datos = obtenerDatosFormulario(formulario);

  // Validar datos
  if (!validarDatosRegistro(datos)) {
    return;
  }

  // Mostrar carga
  mostrarCarga(formulario, true);

  // Enviar al servidor
  enviarRegistro(datos, formulario);
}

// Obtener datos del formulario
function obtenerDatosFormulario(formulario) {
  var datos = {};
  var elementos = formulario.elements;

  for (var i = 0; i < elementos.length; i++) {
    var elemento = elementos[i];
    if (elemento.name && elemento.type !== "submit") {
      datos[elemento.name] = elemento.value;
    }
  }

  return datos;
}

// Validar datos de login
function validarDatosLogin(datos) {
  var esValido = true;

  // Validar email
  if (!datos.email_usuario || !esEmailValido(datos.email_usuario)) {
    mostrarErrorCampo("email", "Por favor ingresa un email válido");
    esValido = false;
  }

  // Validar contraseña
  if (!datos.contraseña_usuario || datos.contraseña_usuario.length < 1) {
    mostrarErrorCampo("password", "La contraseña es requerida");
    esValido = false;
  }

  return esValido;
}

// Validar datos de registro
function validarDatosRegistro(datos) {
  var esValido = true;

  // Validar nombre
  if (!datos.nombre_usuario || datos.nombre_usuario.length < 2) {
    mostrarErrorCampo("nombre", "El nombre debe tener al menos 2 caracteres");
    esValido = false;
  }

  // Validar email
  if (!datos.email_usuario || !esEmailValido(datos.email_usuario)) {
    mostrarErrorCampo("email", "Por favor ingresa un email válido");
    esValido = false;
  }

  // Validar contraseña
  if (!datos.contraseña_usuario || datos.contraseña_usuario.length < 8) {
    mostrarErrorCampo(
      "password",
      "La contraseña debe tener al menos 8 caracteres"
    );
    esValido = false;
  }

  // Validar confirmación de contraseña
  if (
    datos.confirmar_contraseña &&
    datos.contraseña_usuario !== datos.confirmar_contraseña
  ) {
    mostrarErrorCampo("confirm_password", "Las contraseñas no coinciden");
    esValido = false;
  }

  // Validar términos y condiciones
  var checkboxTerminos = document.getElementById("terms");
  if (checkboxTerminos && !checkboxTerminos.checked) {
    mostrarNotificacion(
      "error",
      "Términos y condiciones",
      "Debes aceptar los términos y condiciones"
    );
    esValido = false;
  }

  return esValido;
}

// Enviar login al servidor
function enviarLogin(datos, formulario) {
  // Preparar datos para el backend Spring Boot
  var datosLogin = {
    username: datos.email_usuario,
    password: datos.contraseña_usuario,
  };

  fetch(urlBase + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosLogin),
  })
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (resultado) {
      if (resultado.success) {
        // Guardar token en localStorage
        if (resultado.token) {
          localStorage.setItem("authToken", resultado.token);
          localStorage.setItem("userEmail", datos.email_usuario);
        }

        mostrarNotificacion("success", "¡Bienvenido!", resultado.message);

        // Redirigir después de un momento
        setTimeout(function () {
          redirigirAlInicio();
        }, 1500);
      } else {
        mostrarNotificacion(
          "error",
          "Error de inicio de sesión",
          resultado.message || "Credenciales incorrectas"
        );
      }
    })
    .catch(function (error) {
      console.error("Error de login:", error);
      mostrarNotificacion(
        "error",
        "Error de conexión",
        "No se pudo conectar con el servidor"
      );
    })
    .finally(function () {
      mostrarCarga(formulario, false);
    });
}

// Enviar registro al servidor
function enviarRegistro(datos, formulario) {
  // Preparar datos para el backend Spring Boot
  var tipoId = datos.tipo_usuario_id ? parseInt(datos.tipo_usuario_id, 10) : 2; // Paciente por defecto
  var datosRegistro = {
    username: datos.email_usuario,
    password: datos.contraseña_usuario,
    tipoUsuarioId: tipoId,
    telefono: datos.telefono_usuario || null,
    fechaNacimiento: datos.fecha_nacimiento || null,
    genero: datos.genero_usuario || null,
  };

  fetch(urlBase + "register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosRegistro),
  })
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (resultado) {
      if (resultado.success) {
        // Guardar token en localStorage si se proporciona
        if (resultado.token) {
          localStorage.setItem("authToken", resultado.token);
          localStorage.setItem("userEmail", datos.email_usuario);
        }

        mostrarNotificacion("success", "¡Registro exitoso!", resultado.message);

        // Redirigir a login después de un momento
        setTimeout(function () {
          window.location.href = "/pages/ingresar.html";
        }, 2000);
      } else {
        mostrarNotificacion(
          "error",
          "Error de registro",
          resultado.message || "Error al crear la cuenta"
        );
      }
    })
    .catch(function (error) {
      console.error("Error de registro:", error);
      mostrarNotificacion(
        "error",
        "Error de conexión",
        "No se pudo conectar con el servidor"
      );
    })
    .finally(function () {
      mostrarCarga(formulario, false);
    });
}

// Validaciones en tiempo real
function validarEmail(evento) {
  var campo = evento.target;
  var email = campo.value.trim();

  if (email && !esEmailValido(email)) {
    mostrarErrorCampo(campo.id, "Por favor ingresa un email válido");
    return false;
  }

  limpiarErrorCampo(campo);
  return true;
}

function verificarFuerzaPassword(evento) {
  var password = evento.target.value;
  var fuerza = calcularFuerzaPassword(password);
  actualizarFuerzaPassword(fuerza);
}

function verificarCoincidenciaPassword(evento) {
  var password = document.getElementById("password").value;
  var confirmarPassword = evento.target.value;

  if (confirmarPassword && password !== confirmarPassword) {
    mostrarErrorCampo("confirm_password", "Las contraseñas no coinciden");
    return false;
  }

  limpiarErrorCampo(evento.target);
  return true;
}

// Funciones de validación
function esEmailValido(email) {
  var patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(email);
}

function calcularFuerzaPassword(password) {
  var puntos = 0;

  if (password.length >= 8) puntos += 1;
  if (password.length >= 12) puntos += 1;
  if (/[a-z]/.test(password)) puntos += 1;
  if (/[A-Z]/.test(password)) puntos += 1;
  if (/[0-9]/.test(password)) puntos += 1;
  if (/[^A-Za-z0-9]/.test(password)) puntos += 1;

  if (puntos <= 2) return { nivel: "weak", texto: "Débil" };
  if (puntos <= 4) return { nivel: "fair", texto: "Regular" };
  if (puntos <= 5) return { nivel: "good", texto: "Buena" };
  return { nivel: "strong", texto: "Fuerte" };
}

// Funciones de interfaz
function mostrarErrorCampo(idCampo, mensaje) {
  var campo = document.getElementById(idCampo);
  if (!campo) return;

  var mensajeError = campo.parentNode.querySelector(".msg-error");
  if (mensajeError) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = "block";
  }

  campo.style.borderColor = "#EF4444";
  campo.style.backgroundColor = "#FEF2F2";
}

function limpiarErrorCampo(campo) {
  if (typeof campo === "string") {
    campo = document.getElementById(campo);
  }

  if (!campo) return;

  var mensajeError = campo.parentNode.querySelector(".msg-error");
  if (mensajeError) {
    mensajeError.style.display = "none";
  }

  campo.style.borderColor = "";
  campo.style.backgroundColor = "";
}

function actualizarFuerzaPassword(fuerza) {
  var barraFuerza = document.querySelector(".strength-fill");
  var textoFuerza = document.querySelector(".strength-text");

  if (barraFuerza && textoFuerza) {
    barraFuerza.className = "strength-fill " + fuerza.nivel;
    textoFuerza.textContent = fuerza.texto;
  }
}

function mostrarCarga(formulario, estaCargando) {
  var botonEnviar = formulario.querySelector(".btn-auth");
  var textoBoton = botonEnviar.querySelector(".btn-text");
  var indicadorCarga = botonEnviar.querySelector(".btn-loading");

  if (estaCargando) {
    textoBoton.style.display = "none";
    indicadorCarga.style.display = "flex";
    botonEnviar.disabled = true;
  } else {
    textoBoton.style.display = "block";
    indicadorCarga.style.display = "none";
    botonEnviar.disabled = false;
  }
}

function mostrarNotificacion(tipo, titulo, mensaje) {
  var notificacion = document.getElementById("notification");
  if (!notificacion) return;

  var icono = notificacion.querySelector(".notification-icon");
  var tituloElemento = notificacion.querySelector(".notification-title");
  var mensajeElemento = notificacion.querySelector(".notification-message");

  // Limpiar clases anteriores
  notificacion.className = "notification";
  notificacion.classList.add(tipo);

  // Configurar contenido
  tituloElemento.textContent = titulo;
  mensajeElemento.textContent = mensaje;

  // Configurar icono
  icono.textContent = tipo === "success" ? "✓" : "✕";

  // Mostrar notificación
  notificacion.style.display = "block";

  // Auto-ocultar después de 5 segundos
  setTimeout(function () {
    ocultarNotificacion();
  }, 5000);
}

function ocultarNotificacion() {
  var notificacion = document.getElementById("notification");
  if (notificacion) {
    notificacion.style.display = "none";
  }
}

function redirigirAlInicio() {
  window.location.href = "../index.html";
}

// Verificar sesión existente
function verificarSesionExistente() {
  var token = localStorage.getItem("authToken");
  if (token) {
    // Verificar si el token es válido haciendo una petición a un endpoint protegido
    fetch("http://localhost:8081/api/psicologos", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(function (respuesta) {
        if (respuesta.ok) {
          // Token válido, usuario ya logueado
          console.log("Usuario ya autenticado");
          // No redirigir automáticamente, permitir que el usuario use la página
        } else {
          // Token inválido, limpiar localStorage
          localStorage.removeItem("authToken");
          localStorage.removeItem("userEmail");
        }
      })
      .catch(function (error) {
        console.log("No hay sesión activa o error de conexión");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
      });
  }
}

// Funciones globales (para usar en HTML)
function togglePassword(idInput) {
  var input = document.getElementById(idInput);
  if (!input) return;

  var tipo = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", tipo);
}

function hideNotification() {
  ocultarNotificacion();
}

function logout() {
  // Limpiar localStorage (no hay endpoint de logout en el backend actual)
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");

  // Redirigir al inicio
  window.location.href = "../index.html";
}

// Funciones de utilidad para autenticación
function getAuthToken() {
  return localStorage.getItem("authToken");
}

function isAuthenticated() {
  return !!getAuthToken();
}

function getAuthHeaders() {
  var token = getAuthToken();
  if (token) {
    return {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
  };
}

// Función para hacer peticiones autenticadas
function authenticatedFetch(url, options = {}) {
  var headers = getAuthHeaders();
  if (options.headers) {
    headers = { ...headers, ...options.headers };
  }

  return fetch(url, {
    ...options,
    headers: headers,
  });
}

// Iniciar cuando la página esté lista
document.addEventListener("DOMContentLoaded", function () {
  console.log("📄 Página cargada, iniciando autenticación...");
  iniciarAutenticacion();
});
