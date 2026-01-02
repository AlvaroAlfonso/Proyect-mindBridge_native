import { apiCiudades, apiModalidades } from "./api.js";

export function cargarSelects(selectCiudad, selectModalidad) {

  //cargar ciudades de la BD y backend
  fetch(apiCiudades)
    .then(res => res.json())
    .then(data => {
      data.forEach(c => {
        const option = document.createElement("option");
        option.value = c.idCiudad;
        option.textContent = c.nombreCiudad;
        selectCiudad.appendChild(option);
      });
    })
    .catch(err => console.error("Error cargando ciudades:", err));
  
  //cargar modalidades de la BD y backend
  fetch(apiModalidades)
    .then(res => res.json())
    .then(data => {
      data.forEach(m => {
        const option = document.createElement("option");
        option.value = m.idModalidad;
        option.textContent = m.nombreModalidad;
        selectModalidad.appendChild(option);
      });
    })
    .catch(err => console.error("Error cargando modalidades:", err));
}