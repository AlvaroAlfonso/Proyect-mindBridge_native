import { apiURL } from "./api.js";  // donde tienes tu base URL

export function eliminarServicio(id, cargarServicios) {
  if (!confirm("¿Seguro que deseas eliminar este servicio?")) {
    return;
  }

  fetch(`${apiURL}/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar");
      return res.text();
    })
    .then(msg => {
      alert(msg || "Servicio eliminado con éxito");
      cargarServicios(); // refresca la lista después de eliminar
    })
    .catch(err => console.error("Error al eliminar servicio:", err));
}