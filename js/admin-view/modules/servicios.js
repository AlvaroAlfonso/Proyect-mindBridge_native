import { apiURL } from "./api.js";
import { eliminarServicio } from "./eliminar.js";

export function cargarServicios(listaServicios, template) {

  //array de imagenes default 
  const defaultImages = [
    "/images/admin-view/default-img.webp",
    "/images/admin-view/default-img2.webp",
    "/images/admin-view/default-img3.webp",
    "/images/admin-view/default-img4.webp",
    "/images/admin-view/default-img5.webp",
  ];

  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      listaServicios.innerHTML = "";

      const fragment = document.createDocumentFragment();

      data.forEach((servicio) => {
        const clone = template.content.cloneNode(true);

        clone.querySelector("#id-serv").textContent = servicio.idServicio;
        clone.querySelector("#nombre-serv").textContent =
          servicio.nombreServicio;
        clone.querySelector("#origen-serv").textContent =
          servicio.origenServicio;
        clone.querySelector("#ciudad-serv").textContent =
          servicio.ciudad?.nombreCiudad || "N/A";
        clone.querySelector("#modalidad-serv").textContent =
          servicio.modalidad?.nombreModalidad || "N/A";
        clone.querySelector("#detalles-serv").textContent =
          servicio.detallesServicio;
        clone.querySelector("#numero-serv").textContent =
          servicio.numeroServicio || "No aplica";
        clone.querySelector("#correo-serv").textContent =
          servicio.correoServicio || "No aplica";
        clone.querySelector("#direccion-serv").textContent =
          servicio.direccionServicio || "No aplica";
        clone.querySelector("#costo-serv").textContent =
          servicio.costoServicio || "sin costo";

        //asignar imagenes
        const img = clone.querySelector("#imagen-serv");
        if (servicio.imagenServicio) {
          img.src = `/uploads/${servicio.imagenServicio}`;
        } else {
          // Elegir aleatoriamente una imagen default
          const randomIndex = Math.floor(Math.random() * defaultImages.length);
          img.src = defaultImages[randomIndex];
        }
        //img.src = servicio.imagenServicio || "../img/default-img.webp"; //imagen predeterminada en frontend

        //BOTON DE ELIMINAR DE CADA SERVICIO :)
        const btnEliminar = clone.querySelector("#btn-eliminar");
        btnEliminar.addEventListener("click", () => {
          eliminarServicio(servicio.idServicio, () =>
            cargarServicios(listaServicios, template)
          );
        });

        // BOTON DE EDITAR DE CADA SERVICIO :)
        const btnEditar = clone.querySelector("#btn-editar");
        btnEditar.addEventListener("click", () => {
          // llenar formulario con datos del servicio
          document.getElementById("id-servicio").value = servicio.idServicio;
          document.getElementById("nombre-servicio").value =
            servicio.nombreServicio;
          document.getElementById("origen-servicio").value =
            servicio.origenServicio;
          document.querySelector("#ciudad-serv").textContent =
            servicio.ciudad?.nombreCiudad || "N/A";
          document.querySelector("#modalidad-serv").textContent =
            servicio.modalidad?.nombreModalidad || "N/A";
          document.getElementById("detalles-servicio").value =
            servicio.detallesServicio;
          document.getElementById("numero-servicio").value =
            servicio.numeroServicio || "";
          document.getElementById("correo-servicio").value =
            servicio.correoServicio || "";
          document.getElementById("direccion-servicio").value =
            servicio.direccionServicio || "";
          document.getElementById("costo-servicio").value =
            servicio.costoServicio || "";

          // cambiar texto del botón para modo edición
          document.querySelector("#form-servicio button").textContent =
            "Actualizar Servicio";
        });

        fragment.appendChild(clone);
      });

      listaServicios.appendChild(fragment);
    })
    .catch((err) => console.error("Error cargando servicios:", err));
}
