import { apiServiciosConImagen } from "./api.js";

export function configurarFormulario(form, selectCiudad, selectModalidad, cargarServicios) { //formulario, //select de ciudad //select de modalidad y //cargar servicios para refrescar

  form.addEventListener("submit", e => {
    e.preventDefault(); //detiene el recargo de la página al enviar datos

    const formData = new FormData(); //objeto FormData que se ira construtyendo

    // si existe id → es edición
    const idServicio = document.getElementById("id-servicio").value;
    if (idServicio) {
      formData.append("idServicio", idServicio);
    }

    formData.append("nombreServicio", document.getElementById("nombre-servicio").value); //guardar el dato tomado del id del formulario en el objeto, append: guardar en algo
    formData.append("origenServicio", document.getElementById("origen-servicio").value); //value para obtener el dato 
    formData.append("idCiudad", selectCiudad.value);
    formData.append("idModalidad", selectModalidad.value);
    formData.append("detallesServicio", document.getElementById("detalles-servicio").value);
    formData.append("costoServicio", document.getElementById("costo-servicio").value);

    // Opcionales
    const numero = document.getElementById("numero-servicio").value; //value para obtener el dato y guardalo en numero
    if (numero) formData.append("numeroServicio", numero); //si se guarda agregarlo al formData, sino no eejcutar el if

    const correo = document.getElementById("correo-servicio").value;
    if (correo) formData.append("correoServicio", correo);

    const direccion = document.getElementById("direccion-servicio").value;
    if (direccion) formData.append("direccionServicio", direccion);

    const imagen = document.getElementById("imagen-servicio").files[0];
    if (imagen) formData.append("imagen", imagen);

    fetch(apiServiciosConImagen, {
      method: "POST", // SIEMPRE POST porque el backend maneja guardar/actualizar juntos
      body: formData //se envia al cuerpo de la solicitud el formData
    })
      .then(res => res.text()) //respuesta del backend trasnformada a texto
      .then(msg => {
        alert(msg); //mensaje de devolvio el bakcend 
        form.reset(); //limpiar el formulario
        document.getElementById("id-servicio").value = ""; // resetear id para volver a modo creación
        form.querySelector("button").textContent = "Guardar Servicio"; //volver a texto original
        cargarServicios(); // recarga lista al guardar con nuevo eleemento 
      })
      .catch(err => console.error("Error al guardar servicio:", err));
  });
}
