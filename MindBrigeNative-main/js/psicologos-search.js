// Usa la URL de la API definida en la página si existe, con fallback local
const BASE_API =
  typeof window !== "undefined" && window.API_URL
    ? window.API_URL
    : "http://localhost:8081/api";
const URI = `${BASE_API}/psicologos`;

window.onload = function () {
  startPage();
};

function startPage() {
  document
    .getElementById("search-button")
    .addEventListener("click", buscarPsicologos);
  document
    .getElementById("clear-button")
    .addEventListener("click", limpiarFiltros);
}

function limpiarFiltros() {
  document.getElementById("ciudad").value = "";
  document.getElementById("modalidad").value = "";
  document.getElementById("especialidad").value = "";
  document.getElementById("especial").value = "";

  document.getElementById("psychologists-grid").innerHTML = "";
  document.getElementById("results-section").style.display = "none";
  document.getElementById("results-message").style.display = "none";
  document.getElementById("initial-message").style.display = "block";
  document.getElementById("psychologists-quantity").innerText = "0";
}

async function buscarPsicologos() {
  console.log("🔍 Iniciando búsqueda de psicólogos...");
  const psicologos = await fetchPsicologos();
  if (!psicologos) {
    console.log("❌ No se obtuvieron psicólogos de la API");
    return;
  }
  console.log("✅ Psicólogos obtenidos:", psicologos.length);

  const ciudad = document.getElementById("ciudad").value;
  const modalidad = document.getElementById("modalidad").value;
  const especialidad = document.getElementById("especialidad").value;
  const condicion = document.getElementById("especial").value;

  // Mapeo de valores del frontend a IDs de la base de datos
  const ciudadMap = {
    bogota: 1,
    medellin: 2,
    cali: 3,
  };

  const modalidadMap = {
    presencial: 1,
    virtual: 2,
    hibrido: 3,
  };

  const especialidadMap = {
    ansiedad: 1,
    depresion: 2,
    pareja: 3,
    infantil: 4,
  };

  const condicionMap = {
    "discapacidad-visual": 1,
    "discapacidad-auditiva": 2,
    "discapacidad-motora": 3,
    "discapacidad-cognitiva": 4,
    "otras-discapacidades": 5,
  };

  // ✅ Filtrado en frontend
  const filtrados = psicologos.filter((psico) => {
    const matchCiudad = !ciudad || psico.ciudad?.idCiudad == ciudadMap[ciudad];
    const matchModalidad =
      !modalidad || psico.modalidad?.idModalidad == modalidadMap[modalidad];
    const matchEspecialidad =
      !especialidad ||
      psico.especialidad?.idEspecialidad == especialidadMap[especialidad];
    const matchCondicion =
      !condicion ||
      psico.otrasCondiciones?.idOtrasCond == condicionMap[condicion];

    return matchCiudad && matchModalidad && matchEspecialidad && matchCondicion;
  });

  const cantidadPsicologos = filtrados.length;
  console.log("📊 Filtros aplicados:", {
    ciudad,
    modalidad,
    especialidad,
    condicion,
  });
  console.log("📊 Psicólogos filtrados:", cantidadPsicologos);
  console.log("📊 Primeros psicólogos:", filtrados.slice(0, 2));

  cambiarCantidadPsicologos(cantidadPsicologos);
  cargarPsicologos(filtrados);
  document.getElementById("results-message").style.display = "block";
}

function cambiarCantidadPsicologos(cantidad) {
  document.getElementById("psychologists-quantity").innerText = cantidad;
}

function cargarPsicologos(psicologos) {
  document.getElementById("initial-message").style.display = "none";
  document.getElementById("results-section").style.display = "block";
  const grid = document.getElementById("psychologists-grid");
  grid.innerHTML = "";

  psicologos.forEach((psico) => {
    const card = document.createElement("div");
    card.classList.add("psychologists-card");

    card.innerHTML = `
      <h3>${psico.nombrePsicologo}</h3>
      <div class="rating">
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
      </div>
      <div class="profile-picture">
        <img src="../images/psicologos/${psico.imagen}" alt="${
      psico.nombrePsicologo
    }" class="psychologist-photo">
      </div>
      <div class="psychologist-info">
        <div class="info-item">
          <strong>Especialidad:</strong>
          <span>${
            psico.especialidad?.nombreEspecialidad || "No especificado"
          }</span>
        </div>
        <div class="info-item">
          <strong>Ciudad:</strong>
          <span>${psico.ciudad?.nombreCiudad || "No especificada"}</span>
        </div>
        <div class="info-item">
          <strong>Modalidad:</strong>
          <span>${psico.modalidad?.nombreModalidad || "No especificada"}</span>
        </div>
        <div class="info-item">
          <strong>Costo:</strong>
          <span>$${
            psico.costoPsicologo?.toLocaleString() || "No especificado"
          } por sesión</span>
        </div>
      </div>
      <button class="btn-ver-detalles" data-id="${
        psico.idPsicologo
      }">Ver detalles</button>
    `;
    grid.append(card);
  });

  document.querySelectorAll(".btn-ver-detalles").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      abrirModal(id);
    });
  });
}

async function abrirModal(id) {
  try {
    const response = await fetch(`${URI}/${id}`);
    const data = await response.json();

    // Admite respuestas directas o envueltas { success, data }
    const psico = data && data.success !== undefined ? data.data || data : data;
    if (!psico) {
      console.error("Error al obtener psicólogo:", data && data.message);
      return;
    }

    // Relleno de datos ficticios por psicólogo si faltan
    const enriched = enrichPsychologistWithMocks(psico);

    document.getElementById(
      "modal-photo"
    ).src = `../images/psicologos/${enriched.imagen}`;
    document.getElementById("modal-name").innerText = enriched.nombrePsicologo;
    document.getElementById("modal-title").innerText =
      enriched.especialidad?.nombreEspecialidad ||
      "Especialidad no especificada";
    document.getElementById("modal-description").innerText =
      enriched.descripcionPsicologo || "Sin descripción disponible.";

    document.getElementById("modal-specialties").innerHTML = enriched
      .especialidades?.length
      ? enriched.especialidades
          .map((e) => `<li>${e.nombreEspecialidad || e}</li>`)
          .join("")
      : `<li>${
          enriched.especialidad?.nombreEspecialidad || "No especificado"
        }</li>`;

    document.getElementById("modal-city").innerText =
      enriched.ciudad?.nombreCiudad || enriched.ciudad || "No especificada";
    document.getElementById("modal-modality").innerText =
      enriched.modalidad?.nombreModalidad ||
      enriched.modalidad ||
      "No especificada";
    document.getElementById("modal-cost").innerText = `$${
      (enriched.costoPsicologo &&
        Number(enriched.costoPsicologo).toLocaleString()) ||
      "No especificado"
    } por sesión`;
    document.getElementById("modal-experience").innerText =
      enriched.experienciaPsicologo ||
      enriched.horarioPsicologo ||
      "No especificado";

    document.getElementById("modal-education").innerText =
      enriched.formacionPsicologo || "No especificada";
    document.getElementById("modal-approach").innerText =
      enriched.enfoquePsicologo || "No especificado";

    const modal = document.getElementById("psychologist-modal");
    modal.style.display = "block";

    modal.querySelector(".close-modal").onclick = () =>
      (modal.style.display = "none");
    modal.querySelector(".btn-cerrar").onclick = () =>
      (modal.style.display = "none");
    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  } catch (error) {
    console.error("Error en la petición:", error);
  }
}

// Helpers para generar contenido ficticio y consistente por psicólogo
function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getPsicoKey(psico) {
  if (psico.imagen) {
    const base = psico.imagen.split("/").pop();
    return base ? base.replace(/\.[^.]+$/, "") : slugify(psico.nombrePsicologo);
  }
  return slugify(psico.nombrePsicologo);
}

const MOCK_DETAILS = {
  "ana-gonzalez": {
    descripcionPsicologo:
      "Psicóloga clínica enfocada en ansiedad y regulación emocional con herramientas de TCC y mindfulness.",
    formacionPsicologo:
      "Psicología – U. Nacional. Especialización en Terapia Cognitivo-Conductual.",
    enfoquePsicologo:
      "Trabajo colaborativo, psicoeducación y planes de acción graduales con exposición y prevención de respuesta.",
    especialidades: ["Ansiedad", "Regulación emocional", "Estrés laboral"],
    experienciaPsicologo: "6 años de experiencia",
  },
  "andres-lopez": {
    descripcionPsicologo:
      "Acompaño procesos de autoestima y habilidades sociales, integrando técnicas ACT y TCC.",
    formacionPsicologo:
      "Psicología – U. de Antioquia. Diplomado en Aceptación y Compromiso (ACT).",
    enfoquePsicologo:
      "Intervenciones breves basadas en valores y entrenamiento en habilidades.",
    especialidades: ["Autoestima", "Ansiedad social", "Habilidades sociales"],
    experienciaPsicologo: "5 años de experiencia",
  },
  "carlos-rodriguez": {
    descripcionPsicologo:
      "Psicólogo infantil. Fortalezco rutinas y pautas de crianza con intervención familiar.",
    formacionPsicologo:
      "Psicología – U. del Valle. Especialización en Psicología Infantil.",
    enfoquePsicologo:
      "Modelo cognitivo-conductual adaptado a infancia y entrenamiento a padres.",
    especialidades: ["Psicología infantil", "TDAH", "Conducta"],
    experienciaPsicologo: "7 años de experiencia",
  },
  "luis-fernandez": {
    descripcionPsicologo:
      "Especialista en adicciones. Programas de prevención de recaídas y mindfulness.",
    formacionPsicologo:
      "Psicología – U. del Valle. Certificación en Terapia de Adicciones.",
    enfoquePsicologo: "TCC + mindfulness y trabajo grupal con redes de apoyo.",
    especialidades: ["Adicciones", "Mindfulness", "Terapia grupal"],
    experienciaPsicologo: "8 años de experiencia",
  },
  "luis-torres": {
    descripcionPsicologo:
      "Intervención en estrés crónico y burnout para profesionales de alto rendimiento.",
    formacionPsicologo:
      "Psicología – U. Javeriana. Maestría en Psicología de la Salud.",
    enfoquePsicologo:
      "Técnicas de activación conductual, manejo del tiempo y hábitos.",
    especialidades: ["Estrés", "Burnout", "Productividad saludable"],
    experienciaPsicologo: "9 años de experiencia",
  },
  "maria-fernandez": {
    descripcionPsicologo:
      "Terapia de pareja y apego. Mejora de comunicación, límites y reparación de vínculos.",
    formacionPsicologo:
      "Psicología – U. de los Andes. Formación en Terapia Focalizada en las Emociones (EFT).",
    enfoquePsicologo: "Enfoque sistémico-emocional con tareas entre sesiones.",
    especialidades: ["Terapia de pareja", "Apego", "Comunicación"],
    experienciaPsicologo: "10 años de experiencia",
  },
  "sofia-herrera": {
    descripcionPsicologo:
      "Acompañamiento perinatal y procesos de duelo con mirada compasiva y basada en evidencia.",
    formacionPsicologo:
      "Psicología – U. Rosario. Especialización en Psicología Perinatal.",
    enfoquePsicologo:
      "Humanista integrativo, técnicas narrativas y TCC según necesidad.",
    especialidades: ["Perinatal", "Duelo", "Depresión posparto"],
    experienciaPsicologo: "9 años de experiencia",
  },
};

function enrichPsychologistWithMocks(psico) {
  const key = getPsicoKey(psico);
  const mock = MOCK_DETAILS[key] || {};
  return {
    ...psico,
    descripcionPsicologo:
      psico.descripcionPsicologo || mock.descripcionPsicologo,
    formacionPsicologo: psico.formacionPsicologo || mock.formacionPsicologo,
    enfoquePsicologo: psico.enfoquePsicologo || mock.enfoquePsicologo,
    especialidades:
      psico.especialidades && psico.especialidades.length
        ? psico.especialidades
        : (mock.especialidades || []).map((n) => ({ nombreEspecialidad: n })),
    experienciaPsicologo:
      psico.experienciaPsicologo || mock.experienciaPsicologo,
  };
}

async function fetchPsicologos() {
  try {
    const response = await fetch(URI);
    const payload = await response.json();

    // Soporta múltiples formatos de respuesta:
    // 1) Array directo
    if (Array.isArray(payload)) return payload;

    // 2) { data: [...] }
    if (payload && Array.isArray(payload.data)) return payload.data;

    // 3) { success: true, data: [...] }
    if (payload && payload.success && Array.isArray(payload.data))
      return payload.data;

    // 4) { success: true, data: [{ data: [...] }] } (formato previo)
    if (
      payload &&
      payload.success &&
      Array.isArray(payload.data) &&
      payload.data[0]?.data
    ) {
      return payload.data[0].data;
    }

    console.error("Formato de respuesta no esperado para psicólogos", payload);
    return;
  } catch (error) {
    console.error("Error en la petición:", error);
  }
}
