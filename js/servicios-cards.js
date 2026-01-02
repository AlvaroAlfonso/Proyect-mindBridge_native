// URLs de las APIs
const apiURL = "http://localhost:8080/api/v1/servicios";


function cargarRecursos() {

  // array de imágenes default
  const defaultImages = [
    "/images/admin-view/default-img.webp",
    "/images/admin-view/default-img2.webp",
    "/images/admin-view/default-img3.webp",
    "/images/admin-view/default-img4.webp",
    "/images/admin-view/default-img5.webp",
  ];

  const listaRecursos = document.querySelector(".info-cards-container"); //eñ papá
  const template = document.getElementById("card-template"); //el template

  //CONSUMO DE LA API
  fetch(apiURL)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
    console.log("Datos recibidos:", data);
        
      listaRecursos.innerHTML = ""; //limpiar antes de aregar 
      const fragment = document.createDocumentFragment();

      // Limitar a 3 servicios
      const serviciosLimitados = data.slice(0, 3); //3 cards

      if (serviciosLimitados.length === 0) {
        listaRecursos.innerHTML =
          '<p class="no-data">No hay recursos disponibles en este momento.</p>';
        return;
      }

      serviciosLimitados.forEach((recurso) => {
        const clone = template.content.cloneNode(true);

        // datos en card
        clone.querySelector(".titulo").textContent = recurso.nombreServicio || "Sin nombre";
        clone.querySelector(".origen").textContent = recurso.origenServicio || "N/A";
        clone.querySelector(".ciudad").textContent = recurso.ciudad?.nombreCiudad || "N/A";
        clone.querySelector(".modalidad").textContent = recurso.modalidad?.nombreModalidad || "N/A";
        clone.querySelector(".costo").textContent = recurso.costoServicio
          ? `$${recurso.costoServicio}` //interpolar para poner $ :)
          : "Sin costo";

        // imagen aleatoria si no hay en backend
        const img = clone.querySelector(".imagen-card");
        if (recurso.imagenServicio) {
          img.src = `/uploads/${recurso.imagenServicio}`;
          img.alt = recurso.nombreServicio || "Imagen del recurso";
        } else {
          const randomIndex = Math.floor(Math.random() * defaultImages.length);
          img.src = defaultImages[randomIndex];
          img.alt = "Imagen por defecto del recurso";
        }

        fragment.appendChild(clone);
      });

      listaRecursos.appendChild(fragment);
    })
    .catch((err) => {
      console.error("Error cargando recursos:", err);
    });
}

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", cargarRecursos);
