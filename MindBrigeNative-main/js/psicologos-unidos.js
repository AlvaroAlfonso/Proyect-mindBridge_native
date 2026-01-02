// JavaScript para la página de Psicólogos Unidos

// Base API backend y helpers de autenticación
const API_BASE = "http://localhost:8081/api";
function getAuthToken() {
  return localStorage.getItem("authToken");
}
function getAuthHeaders() {
  const t = getAuthToken();
  return t
    ? { Authorization: "Bearer " + t, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

// Persistencia local (usada solo como respaldo visual si falla el backend)
let psychologistsDatabase =
  JSON.parse(localStorage.getItem("psychologistsDatabase")) || [];

// Función para inicializar la página
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("psychologist-form");
  const successMessage = document.getElementById("success-message");
  // Cargar opciones reales desde el backend
  loadSelectOptions();

  // Manejar envío del formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    handleFormSubmit();
  });

  // Cerrar mensaje de éxito al hacer clic fuera
  successMessage.addEventListener("click", function (e) {
    if (e.target === successMessage) {
      hideSuccessMessage();
    }
  });
});

// Función para manejar el envío del formulario
async function handleFormSubmit() {
  const form = document.getElementById("psychologist-form");
  const formData = new FormData(form);

  // Validar formulario
  if (!validateForm(formData)) {
    return;
  }
  // Mapear especialidades por nombre -> IDs conocidos
  const especialidadesTexto = (formData.get("especialidades") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  let especialidadesIds = [];
  try {
    const ref = JSON.parse(
      document
        .getElementById("especialidades")
        .getAttribute("data-especialidades-ref") || "[]"
    );
    especialidadesIds = ref
      .filter((e) =>
        especialidadesTexto.some((t) => e.nombre.toLowerCase().includes(t))
      )
      .map((e) => e.id);
  } catch {}

  const costo = parseInt(formData.get("tarifa_propuesta"), 10);
  // Fallback seguro si no se pudo mapear por texto
  const defaultEspecialidadId =
    especialidadesIds && especialidadesIds.length ? especialidadesIds[0] : 1; // 1 = Ansiedad (existe en la BD)
  if (!especialidadesIds || !especialidadesIds.length) {
    especialidadesIds = [defaultEspecialidadId];
  }
  const formEl = document.getElementById("psychologist-form");
  const otrasCondAttr = formEl.getAttribute("data-otras-cond-id");
  const idOtrasCondParsed = otrasCondAttr ? parseInt(otrasCondAttr, 10) : 1; // fallback seguro

  // Validaciones duras para evitar IDs nulos
  const ciudadVal = formData.get("ciudad");
  const modalidadVal = formData.get("modalidad");
  if (!ciudadVal) {
    alert("Selecciona una ciudad.");
    return;
  }
  if (!modalidadVal) {
    alert("Selecciona una modalidad.");
    return;
  }

  const body = {
    imagen: null,
    nombrePsicologo: formData.get("nombre"),
    idCiudad: parseInt(ciudadVal, 10),
    idModalidad: parseInt(modalidadVal, 10),
    costoPsicologo: isNaN(costo) ? 0 : costo,
    idEspecialidad: defaultEspecialidadId,
    numeroPsicologo: formData.get("telefono"),
    correoPsicologo: formData.get("email"),
    universidadGraduacion: formData.get("universidad"),
    añoGraduacion: formData.get("año_graduacion")
      ? parseInt(formData.get("año_graduacion"), 10)
      : null,
    experiencia: formData.get("experiencia"),
    motivacion: formData.get("motivacion"),
    idOtrasCond: idOtrasCondParsed,
    tarjetaPsicologo: "Pendiente", // Se llenará después con el número real de tarjeta
    tarjetaEntidad: "Colegio Colombiano de Psicólogos", // Entidad que emite la tarjeta
    horarioPsicologo: formData.get("disponibilidad"),
    especialidadesIds,
    condicionesIds: [],
  };

  const token = getAuthToken();
  if (!token) {
    alert("Debes iniciar sesión para enviar la solicitud.");
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/psicologos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const json = await resp
      .json()
      .catch(() => ({ success: false, message: "Error de parseo" }));

    if (resp.ok && json.success) {
      showSuccessMessage();
      form.reset();
      console.log("Creado en backend:", json.data);
    } else {
      // Respaldo local si falla backend
      addPsychologist({
        id: generateId(),
        ...body,
        fecha_registro: new Date().toISOString(),
        estado: "pendiente",
        calificacion: 0,
        sesiones_realizadas: 0,
      });
      alert(
        "No se pudo guardar en el servidor (" +
          (json.message || resp.statusText) +
          "). Se guardó localmente para no perder la info."
      );
    }
  } catch (e) {
    addPsychologist({
      id: generateId(),
      ...body,
      fecha_registro: new Date().toISOString(),
      estado: "pendiente",
      calificacion: 0,
      sesiones_realizadas: 0,
    });
    alert("Error de red. Se guardó localmente.");
  }
}

// Función para validar el formulario
function validateForm(formData) {
  const requiredFields = [
    "nombre",
    "email",
    "telefono",
    "ciudad",
    "universidad",
    "año_graduacion",
    "especialidades",
    "modalidad",
    "experiencia",
    "tarifa_propuesta",
    "disponibilidad",
    "motivacion",
  ];

  for (let field of requiredFields) {
    if (!formData.get(field) || formData.get(field).trim() === "") {
      alert(`El campo ${field} es requerido`);
      return false;
    }
  }

  // Validar email
  const email = formData.get("email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor ingresa un email válido");
    return false;
  }

  // Validar teléfono
  const telefono = formData.get("telefono");
  if (telefono.length < 10) {
    alert("Por favor ingresa un teléfono válido");
    return false;
  }

  // Validar año de graduación
  const año = parseInt(formData.get("año_graduacion"));
  const currentYear = new Date().getFullYear();
  if (año < 1990 || año > currentYear) {
    alert("Por favor ingresa un año de graduación válido");
    return false;
  }

  // Validar tarifa
  const tarifa = parseInt(formData.get("tarifa_propuesta"));
  if (tarifa < 20000 || tarifa > 100000) {
    alert("La tarifa debe estar entre $20,000 y $100,000");
    return false;
  }

  // Validar términos y condiciones
  if (!formData.get("terminos")) {
    alert("Debes aceptar los términos y condiciones");
    return false;
  }

  return true;
}

// Función para generar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para agregar psicólogo a la base de datos
function addPsychologist(psychologist) {
  psychologistsDatabase.push(psychologist);
  localStorage.setItem(
    "psychologistsDatabase",
    JSON.stringify(psychologistsDatabase)
  );
}

// Función para obtener todos los psicólogos
function getAllPsychologists() {
  return psychologistsDatabase;
}

// Función para obtener psicólogo por ID
function getPsychologistById(id) {
  return psychologistsDatabase.find((p) => p.id === id);
}

// Función para actualizar psicólogo
function updatePsychologist(id, updatedData) {
  const index = psychologistsDatabase.findIndex((p) => p.id === id);
  if (index !== -1) {
    psychologistsDatabase[index] = {
      ...psychologistsDatabase[index],
      ...updatedData,
    };
    localStorage.setItem(
      "psychologistsDatabase",
      JSON.stringify(psychologistsDatabase)
    );
    return true;
  }
  return false;
}

// Función para eliminar psicólogo
function deletePsychologist(id) {
  const index = psychologistsDatabase.findIndex((p) => p.id === id);
  if (index !== -1) {
    psychologistsDatabase.splice(index, 1);
    localStorage.setItem(
      "psychologistsDatabase",
      JSON.stringify(psychologistsDatabase)
    );
    return true;
  }
  return false;
}

// Función para filtrar psicólogos
function filterPsychologists(filters) {
  return psychologistsDatabase.filter((psychologist) => {
    if (filters.ciudad && psychologist.ciudad !== filters.ciudad) return false;
    if (filters.modalidad && psychologist.modalidad !== filters.modalidad)
      return false;
    if (filters.experiencia && psychologist.experiencia !== filters.experiencia)
      return false;
    if (filters.estado && psychologist.estado !== filters.estado) return false;
    if (filters.especialidad) {
      const especialidades = psychologist.especialidades.map((e) =>
        e.toLowerCase()
      );
      if (
        !especialidades.some((e) =>
          e.includes(filters.especialidad.toLowerCase())
        )
      )
        return false;
    }
    return true;
  });
}

// Función para mostrar mensaje de éxito
function showSuccessMessage() {
  const successMessage = document.getElementById("success-message");
  successMessage.style.display = "flex";

  // Auto-cerrar después de 5 segundos
  setTimeout(() => {
    hideSuccessMessage();
  }, 5000);
}

// Función para ocultar mensaje de éxito
function hideSuccessMessage() {
  const successMessage = document.getElementById("success-message");
  successMessage.style.display = "none";
}

// Cargar selects desde backend
async function loadSelectOptions() {
  try {
    const [ciudades, modalidades, especialidades, condiciones] =
      await Promise.all([
        fetch(`${API_BASE}/ciudades`)
          .then((r) => r.json())
          .catch(() => ({})),
        fetch(`${API_BASE}/modalidades`)
          .then((r) => r.json())
          .catch(() => ({})),
        fetch(`${API_BASE}/especialidades`)
          .then((r) => r.json())
          .catch(() => ({})),
        fetch(`${API_BASE}/condiciones`)
          .then((r) => r.json())
          .catch(() => ({})),
      ]);

    const ciuSel = document.getElementById("ciudad");
    const modSel = document.getElementById("modalidad");
    const espTextarea = document.getElementById("especialidades");
    const form = document.getElementById("psychologist-form");

    if (ciudades && ciudades.success && Array.isArray(ciudades.data)) {
      ciuSel.innerHTML =
        '<option value="">Seleccionar ciudad</option>' +
        ciudades.data
          .map(
            (c) => `<option value="${c.idCiudad}">${c.nombreCiudad}</option>`
          )
          .join("");
      // seleccionar por defecto la primera ciudad si no hay valor
      if (!ciuSel.value && ciudades.data.length) {
        ciuSel.value = String(ciudades.data[0].idCiudad);
      }
    }
    if (modalidades && modalidades.success && Array.isArray(modalidades.data)) {
      modSel.innerHTML =
        '<option value="">Seleccionar modalidad</option>' +
        modalidades.data
          .map(
            (m) =>
              `<option value="${m.idModalidad}">${m.nombreModalidad}</option>`
          )
          .join("");
      if (!modSel.value && modalidades.data.length) {
        modSel.value = String(modalidades.data[0].idModalidad);
      }
    }
    if (
      especialidades &&
      especialidades.success &&
      Array.isArray(especialidades.data)
    ) {
      espTextarea.placeholder =
        "Ej: " +
        especialidades.data
          .slice(0, 3)
          .map((e) => e.nombreEspecialidad)
          .join(", ");
      // Normalizar a {id, nombre} para el mapeo posterior
      const refNorm = especialidades.data.map((e) => ({
        idEspecialidad: e.idEspecialidad,
        nombreEspecialidad: e.nombreEspecialidad,
      }));
      espTextarea.setAttribute(
        "data-especialidades-ref",
        JSON.stringify(refNorm)
      );
    }

    // Asignar por defecto una "otras condiciones" válida (ID 1 suele existir)
    form.setAttribute("data-otras-cond-id", "1");
  } catch {}
}

// Función para exportar base de datos (para administradores)
function exportDatabase() {
  const dataStr = JSON.stringify(psychologistsDatabase, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "psychologists_database.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Función para importar base de datos (para administradores)
function importDatabase(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      psychologistsDatabase = data;
      localStorage.setItem(
        "psychologistsDatabase",
        JSON.stringify(psychologistsDatabase)
      );
      alert("Base de datos importada correctamente");
    } catch (error) {
      alert("Error al importar la base de datos: " + error.message);
    }
  };
  reader.readAsText(file);
}

// Estadísticas de la base de datos
function getDatabaseStats() {
  const total = psychologistsDatabase.length;
  const aprobados = psychologistsDatabase.filter(
    (p) => p.estado === "aprobado"
  ).length;
  const pendientes = psychologistsDatabase.filter(
    (p) => p.estado === "pendiente"
  ).length;
  const rechazados = psychologistsDatabase.filter(
    (p) => p.estado === "rechazado"
  ).length;

  return {
    total,
    aprobados,
    pendientes,
    rechazados,
  };
}

// Función para buscar psicólogos por especialidad
function searchPsychologistsBySpecialty(specialty) {
  return psychologistsDatabase.filter((psychologist) => {
    const especialidades = psychologist.especialidades.map((e) =>
      e.toLowerCase()
    );
    return especialidades.some((e) => e.includes(specialty.toLowerCase()));
  });
}

// Función para obtener psicólogos por ciudad
function getPsychologistsByCity(city) {
  return psychologistsDatabase.filter((p) => p.ciudad === city);
}

// Función para obtener psicólogos por modalidad
function getPsychologistsByModality(modality) {
  return psychologistsDatabase.filter((p) => p.modalidad === modality);
}

// Función para ordenar psicólogos por tarifa
function sortPsychologistsByPrice(ascending = true) {
  return [...psychologistsDatabase].sort((a, b) => {
    return ascending
      ? a.tarifa_propuesta - b.tarifa_propuesta
      : b.tarifa_propuesta - a.tarifa_propuesta;
  });
}

// Función para ordenar psicólogos por experiencia
function sortPsychologistsByExperience(ascending = true) {
  const experienceOrder = { "0-1": 1, "2-5": 2, "6-10": 3, "10+": 4 };
  return [...psychologistsDatabase].sort((a, b) => {
    const aExp = experienceOrder[a.experiencia] || 0;
    const bExp = experienceOrder[b.experiencia] || 0;
    return ascending ? aExp - bExp : bExp - aExp;
  });
}

// Exportar funciones para uso global
window.psychologistsDB = {
  addPsychologist,
  getAllPsychologists,
  getPsychologistById,
  updatePsychologist,
  deletePsychologist,
  filterPsychologists,
  exportDatabase,
  importDatabase,
  getDatabaseStats,
  searchPsychologistsBySpecialty,
  getPsychologistsByCity,
  getPsychologistsByModality,
  sortPsychologistsByPrice,
  sortPsychologistsByExperience,
};
