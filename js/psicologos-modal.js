// Base de datos de psicólogos con información detallada
const psychologistsData = {
  "maria-gonzalez": {
    name: "Dr. María González",
    title: "Psicóloga Clínica y de Pareja",
    rating: 5,
    photo: "../images/psicologos/maria-fernandez.jpg",
    description:
      "La Dra. González es una psicóloga clínica con más de 8 años de experiencia en el tratamiento de trastornos de ansiedad, depresión y terapia de pareja. Su enfoque humanista y empático la ha convertido en una profesional altamente valorada por sus pacientes.",
    specialties: [
      "Ansiedad y trastornos relacionados",
      "Depresión y trastornos del estado de ánimo",
      "Terapia de pareja y familiar",
      "Terapia cognitivo-conductual",
      "Mindfulness y técnicas de relajación",
    ],
    city: "Bogotá",
    modality: "Híbrido (presencial/virtual)",
    cost: "$60.000 por sesión",
    experience: "8 años de experiencia",
    education:
      "Psicóloga de la Universidad Nacional de Colombia, con especialización en Terapia Cognitivo-Conductual y certificación en Terapia de Pareja por el Instituto de Terapia Familiar.",
    approach:
      "Mi enfoque terapéutico combina técnicas cognitivo-conductuales con elementos humanistas, adaptándome a las necesidades específicas de cada paciente. Creo en la importancia de crear un espacio seguro y de confianza donde las personas puedan explorar sus emociones y desarrollar herramientas para mejorar su bienestar.",
  },
  "carlos-rodriguez": {
    name: "Dr. Carlos Rodríguez",
    title: "Psicólogo Infantil y Familiar",
    rating: 4,
    photo: "../images/psicologos/carlos-rodriguez.jpg",
    description:
      "El Dr. Rodríguez es un experto en psicología infantil con más de 6 años trabajando con niños y adolescentes. Su especialización en TDAH y terapia familiar lo ha convertido en un referente en el tratamiento de problemas de comportamiento y desarrollo en menores.",
    specialties: [
      "Psicología infantil",
      "TDAH",
      "Terapia familiar",
      "Trastornos del desarrollo",
      "Orientación a padres",
    ],
    city: "Medellín",
    modality: "Presencial",
    cost: "$45.000 por sesión",
    experience: "6 años de experiencia",
    education:
      "Psicólogo de la Universidad de Antioquia, con especialización en Psicología Infantil y del Adolescente. Certificado en evaluación e intervención del TDAH por la Asociación Colombiana de Psicología.",
    approach:
      "Utilizo técnicas lúdicas y de juego para trabajar con niños, combinando terapia cognitivo-conductual adaptada a la edad del paciente. Mi trabajo incluye siempre la orientación y apoyo a los padres para garantizar el éxito del tratamiento.",
  },
  "ana-martinez": {
    name: "Dra. Ana Martínez",
    title: "Especialista en Trauma y EMDR",
    rating: 5,
    photo: "../images/psicologos/ana-gonzalez.jpg",
    description:
      "La Dra. Martínez es una especialista en trauma con más de 10 años de experiencia. Certificada en EMDR y terapia cognitivo-conductual, ha ayudado a cientos de pacientes a superar experiencias traumáticas y trastornos relacionados.",
    specialties: [
      "Trauma y TEPT",
      "EMDR",
      "Terapia cognitivo-conductual",
      "Trastornos de ansiedad",
      "Terapia de exposición",
    ],
    city: "Bogotá",
    modality: "Virtual",
    cost: "$55.000 por sesión",
    experience: "10 años de experiencia",
    education:
      "Psicóloga de la Universidad Javeriana, con maestría en Psicología Clínica. Certificada en EMDR por EMDRIA y en Terapia Cognitivo-Conductual por la Asociación Colombiana de Psicología.",
    approach:
      "Mi trabajo se centra en ayudar a las personas a procesar y superar experiencias traumáticas utilizando EMDR y técnicas cognitivo-conductuales. Creo en la capacidad de recuperación del ser humano y en la importancia de crear un ambiente terapéutico seguro y empático.",
  },
  "luis-fernandez": {
    name: "Dr. Luis Fernández",
    title: "Especialista en Adicciones y Terapia Grupal",
    rating: 4,
    photo: "../images/psicologos/luis-fernandez.jpg",
    description:
      "El Dr. Fernández es un especialista en adicciones con más de 7 años de experiencia. Su enfoque en terapia grupal y mindfulness lo ha convertido en un referente en el tratamiento de adicciones y trastornos relacionados con el consumo de sustancias.",
    specialties: [
      "Adicciones",
      "Terapia grupal",
      "Mindfulness",
      "Prevención de recaídas",
      "Terapia familiar sistémica",
    ],
    city: "Cali",
    modality: "Híbrido (presencial/virtual)",
    cost: "$50.000 por sesión",
    experience: "7 años de experiencia",
    education:
      "Psicólogo de la Universidad del Valle, con especialización en Adicciones y certificación en Terapia Grupal. Formado en Mindfulness-Based Relapse Prevention por la Universidad de California.",
    approach:
      "Mi enfoque combina terapia cognitivo-conductual con técnicas de mindfulness y terapia grupal. Creo en el poder de la comunidad y el apoyo mutuo para superar las adicciones, siempre respetando el ritmo y las necesidades individuales de cada paciente.",
  },
  "sofia-herrera": {
    name: "Dra. Sofía Herrera",
    title: "Especialista en Psicología Perinatal y Duelo",
    rating: 5,
    photo: "../images/psicologos/sofia-herrera.jpg",
    description:
      "La Dra. Herrera es una especialista en psicología perinatal con más de 9 años de experiencia. Su trabajo se centra en acompañar a las mujeres durante el embarazo, postparto y en procesos de duelo, siendo reconocida por su sensibilidad y profesionalismo.",
    specialties: [
      "Psicología perinatal",
      "Duelo",
      "Terapia de pareja",
      "Depresión postparto",
      "Infertilidad y pérdidas gestacionales",
    ],
    city: "Bogotá",
    modality: "Presencial",
    cost: "$65.000 por sesión",
    experience: "9 años de experiencia",
    education:
      "Psicóloga de la Universidad de los Andes, con especialización en Psicología Perinatal y certificación en Terapia de Duelo por el Instituto de Psicología Perinatal de España.",
    approach:
      "Mi trabajo se enfoca en acompañar a las mujeres y sus familias durante los procesos de maternidad y duelo. Utilizo un enfoque humanista y empático, combinando técnicas de terapia cognitivo-conductual con elementos de terapia narrativa para ayudar a procesar las experiencias emocionales complejas.",
  },
  "miguel-torres": {
    name: "Dr. Miguel Torres",
    title: "Especialista en Terapia Sexual y Autoestima",
    rating: 4,
    photo: "../images/psicologos/luis-torres.jpg",
    description:
      "El Dr. Torres es un especialista en terapia sexual con más de 5 años de experiencia. Su enfoque integral en sexualidad, autoestima y ansiedad social lo ha convertido en un profesional altamente valorado en el tratamiento de problemas íntimos y de confianza personal.",
    specialties: [
      "Terapia sexual",
      "Ansiedad social",
      "Autoestima",
      "Disfunciones sexuales",
      "Terapia de pareja",
    ],
    city: "Medellín",
    modality: "Virtual",
    cost: "$40.000 por sesión",
    experience: "5 años de experiencia",
    education:
      "Psicólogo de la Universidad CES, con especialización en Terapia Sexual y certificación en Terapia Cognitivo-Conductual. Miembro de la Asociación Colombiana de Terapia Sexual.",
    approach:
      "Mi enfoque terapéutico se basa en crear un ambiente de confianza y apertura para abordar temas relacionados con la sexualidad y la autoestima. Utilizo técnicas cognitivo-conductuales adaptadas, siempre desde una perspectiva de respeto y comprensión hacia la diversidad sexual y las experiencias individuales.",
  },
};

// Función para abrir el modal (alias para showPsychologistModal)
function openModal(psychologistId) {
  showPsychologistModal(psychologistId);
}

// Función para mostrar el modal con la información del psicólogo
function showPsychologistModal(psychologistId) {
  const psychologist = psychologistsData[psychologistId];
  if (!psychologist) {
    console.error("Psicólogo no encontrado:", psychologistId);
    return;
  }

  const modal = document.getElementById("psychologist-modal");
  const modalPhoto = document.getElementById("modal-photo");
  const modalName = document.getElementById("modal-name");
  const modalRating = document.getElementById("modal-rating");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalSpecialties = document.getElementById("modal-specialties");
  const modalCity = document.getElementById("modal-city");
  const modalModality = document.getElementById("modal-modality");
  const modalCost = document.getElementById("modal-cost");
  const modalExperience = document.getElementById("modal-experience");
  const modalEducation = document.getElementById("modal-education");
  const modalApproach = document.getElementById("modal-approach");

  // Llenar la información del modal
  modalPhoto.src = psychologist.photo;
  modalPhoto.alt = psychologist.name;
  modalName.textContent = psychologist.name;
  modalTitle.textContent = psychologist.title;
  modalDescription.textContent = psychologist.description;
  modalCity.textContent = psychologist.city;
  modalModality.textContent = psychologist.modality;
  modalCost.textContent = psychologist.cost;
  modalExperience.textContent = psychologist.experience;
  modalEducation.textContent = psychologist.education;
  modalApproach.textContent = psychologist.approach;

  // Crear las estrellas de calificación
  modalRating.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "star";
    if (i <= psychologist.rating) {
      star.classList.add("filled");
    }
    star.textContent = "★";
    modalRating.appendChild(star);
  }

  // Crear la lista de especialidades
  modalSpecialties.innerHTML = "";
  psychologist.specialties.forEach((specialty) => {
    const li = document.createElement("li");
    li.textContent = specialty;
    modalSpecialties.appendChild(li);
  });

  // Mostrar el modal
  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevenir scroll del body
}

// Función para cerrar el modal
function closePsychologistModal() {
  const modal = document.getElementById("psychologist-modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Restaurar scroll del body
}

// Función para manejar el contacto
function contactPsychologist(psychologistId) {
  const psychologist = psychologistsData[psychologistId];
  if (psychologist) {
    // Aquí puedes agregar la lógica para contactar al psicólogo
    // Por ejemplo, abrir un formulario de contacto o redirigir a WhatsApp
    alert(
      `Contactando a ${psychologist.name}...\n\nPróximamente podrás contactar directamente con el psicólogo.`
    );
  }
}

// Event listeners cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
  // Agregar event listeners a todos los botones "Ver detalles"
  const detailButtons = document.querySelectorAll(".btn-ver-detalles");
  detailButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Obtener el ID del psicólogo desde el data attribute o el nombre
      const card = this.closest(".psychologist-card");
      const nameElement = card.querySelector("h3");
      const psychologistName = nameElement.textContent.toLowerCase();

      // Mapear el nombre a un ID
      let psychologistId = "";
      if (psychologistName.includes("maría gonzález")) {
        psychologistId = "maria-gonzalez";
      } else if (psychologistName.includes("carlos rodríguez")) {
        psychologistId = "carlos-rodriguez";
      } else if (psychologistName.includes("ana martínez")) {
        psychologistId = "ana-martinez";
      } else if (psychologistName.includes("luis fernández")) {
        psychologistId = "luis-fernandez";
      } else if (psychologistName.includes("sofía herrera")) {
        psychologistId = "sofia-herrera";
      } else if (psychologistName.includes("miguel torres")) {
        psychologistId = "miguel-torres";
      }

      if (psychologistId) {
        showPsychologistModal(psychologistId);
      }
    });
  });

  // Event listener para cerrar el modal
  const closeModal = document.querySelector(".close-modal");
  if (closeModal) {
    closeModal.addEventListener("click", closePsychologistModal);
  }

  // Event listener para el botón "Cerrar"
  const btnCerrar = document.querySelector(".btn-cerrar");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", closePsychologistModal);
  }

  // Event listener para cerrar el modal al hacer clic fuera de él
  const modal = document.getElementById("psychologist-modal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closePsychologistModal();
      }
    });
  }

  // Cerrar modal con tecla Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closePsychologistModal();
    }
  });
});
