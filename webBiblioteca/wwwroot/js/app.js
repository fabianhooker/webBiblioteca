const apiUrl = "https://localhost:7149/api/alquileres"; 
const apiLibrosUrl = "https://localhost:7149/api/Libros";
const endPointGetAll = "/GetAll";
const endPointGetById = "/GetById";
const endPointCreate = "/Create";
const endPointUpdate = "/Update";
const endPointDelete = "/Delete";

// Cargar alquileres al inicio
document.addEventListener("DOMContentLoaded", obtenerAlquileres);

async function obtenerAlquileres() {
    var url = apiUrl + endPointGetAll;
    const response = await fetch(url);
    const alquileres = await response.json();
    let contenido = "";

    alquileres.forEach(alquiler => {
        contenido += `
            <tr>
                <td>${alquiler.iD_Alquiler}</td>
                <td>${alquiler.iD_Usuario}</td>
                <td>${alquiler.nombre} ${alquiler.apellido}</td>
                <td>${alquiler.iD_Libro}</td>
                <td>${alquiler.titulo}</td>
                <td>${new Date(alquiler.fecha_Alquiler).toLocaleDateString()}</td>
                <td>${alquiler.fecha_Devolucion ? new Date(alquiler.fecha_Devolucion).toLocaleDateString() : "Pendiente"}</td>
                <td>${alquiler.estado}</td>
                <td>${alquiler.penalidad ?? "0.00"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarAlquiler(${alquiler.iD_Alquiler})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarAlquiler(${alquiler.iD_Alquiler})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("alquileresTable").innerHTML = contenido;
}

async function guardarAlquiler() {

    var url = apiUrl + endPointCreate;
    const ID_Usuario = parseInt(document.getElementById("idUsuario").value);
    const ID_Libro = parseInt(document.getElementById("idLibro").value);
    const Fecha_Alquiler = document.getElementById("fechaAlquiler").value || null;
    const Fecha_Devolucion = document.getElementById("fechaDevolucion").value || null;
    const Estado = document.getElementById("estado").value;
    const Penalidad = parseFloat(document.getElementById("penalidad").value) || 0.00;
  
    const alquiler = { ID_Usuario, ID_Libro, Fecha_Alquiler, Fecha_Devolucion, Estado, Penalidad };

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alquiler)
    });

    obtenerAlquileres();
    bootstrap.Modal.getInstance(document.getElementById("modalAlquiler")).hide();
}

async function eliminarAlquiler(id) {
    var url = apiUrl + endPointDelete + '?id=' + id;
    if (confirm("¿Estás seguro de eliminar este alquiler?")) {
        const response = await fetch(url, { method: "DELETE" });
        if (response.ok) {
            alert("Alquiler eliminado con éxito");
            obtenerAlquileres();
        } else {
            alert("Error al eliminar el alquiler");
        }
    }
}



function abrirModal() {
    cargarLibros();
    document.getElementById("idUsuario").value = "";

    document.getElementById("fechaAlquiler").value = "";
    document.getElementById("fechaDevolucion").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("penalidad").value = "0.00";
    new bootstrap.Modal(document.getElementById("modalAlquiler")).show();
}

async function editarAlquiler(id) {
    cargarEditarLibros();
    var url = apiUrl + endPointGetById + "?id=" + id;
    const response = await fetch(url);

    if (!response.ok) {
        alert("Error al obtener los datos del alquiler");
        return;
    }

    const alquiler = await response.json();
  
    document.getElementById("editId").value = alquiler.iD_Alquiler;
    document.getElementById("editIdUsuario").value = alquiler.iD_Usuario;
    document.getElementById("editIdLibro").value = alquiler.iD_Libro;
    document.getElementById("editFechaAlquiler").value = alquiler.fecha_Alquiler ? alquiler.fecha_Alquiler.split("T")[0] : "";
    document.getElementById("editFechaDevolucion").value = alquiler.fecha_Devolucion ? alquiler.fecha_Devolucion.split("T")[0] : "";
    document.getElementById("editEstado").value = alquiler.estado;
    document.getElementById("editPenalidad").value = alquiler.penalidad ?? "0.00";

    new bootstrap.Modal(document.getElementById("modalEditar")).show();
}

async function guardarEdicion() {
    var url = apiUrl + endPointUpdate;
    const ID_Alquiler = document.getElementById("editId").value;
    const ID_Usuario = parseInt(document.getElementById("editIdUsuario").value);
    const ID_Libro = parseInt(document.getElementById("editIdLibro").value);
    const Fecha_Alquiler = document.getElementById("editFechaAlquiler").value || null;
    const Fecha_Devolucion = document.getElementById("editFechaDevolucion").value || null;
    const Estado = document.getElementById("editEstado").value;
    const Penalidad = parseFloat(document.getElementById("editPenalidad").value) || 0.00;

    const alquiler = { ID_Alquiler, ID_Usuario, ID_Libro, Fecha_Alquiler, Fecha_Devolucion, Estado, Penalidad };

    const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alquiler),
    });

    if (response.ok) {
        alert("Alquiler actualizado con éxito");
        bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
        obtenerAlquileres();
    } else {
        alert("Error al actualizar el alquiler");
    }
}





async function cargarLibros() {
    const url = apiLibrosUrl + endPointGetAll;
    const response = await fetch(url);
    const libros = await response.json();

    const selectLibro = document.getElementById("idLibro");
   
    libros.forEach(libro => {
        const option = document.createElement("option");
        option.value = libro.iD_Libro;     // o libro.iD_Libro si viene así
        option.text = libro.titulo;
        selectLibro.appendChild(option);
    });
}




async function cargarEditarLibros() {
    const url = apiLibrosUrl + endPointGetAll;
    const response = await fetch(url);
    const libros = await response.json();

    const selectLibro = document.getElementById("editIdLibro");
    libros.forEach(libro => {
        const option = document.createElement("option");
        option.value = libro.iD_Libro;     // o libro.iD_Libro si viene así
        option.text = libro.titulo;
        selectLibro.appendChild(option);
    });
}