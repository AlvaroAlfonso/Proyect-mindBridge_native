import { cargarSelects } from "./modules/selects.js";
import { configurarFormulario } from "./modules/form.js";
import { cargarServicios } from "./modules/servicios.js";

const listaServicios = document.getElementById("lista-servicios"); //articulo dentro del template
const form = document.getElementById("form-servicio"); //formulario del html
const selectCiudad = document.getElementById("id-ciudad"); //campo del formulario: ciudad
const selectModalidad = document.getElementById("id-modalidad"); //campo del formulario: modalidad
const template = document.querySelector("#contenido-servicios"); //template donde se genera el contenido

// Inicialización
document.addEventListener("DOMContentLoaded", () => { //cada vez que se genere el dom
  cargarServicios(listaServicios, template);
  cargarSelects(selectCiudad, selectModalidad);
  configurarFormulario(form, selectCiudad, selectModalidad, () =>
    cargarServicios(listaServicios, template)
  );
});