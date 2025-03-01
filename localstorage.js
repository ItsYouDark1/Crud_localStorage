// Variables globales
const d = document;
let clienteInput = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let descripcionInput = d.querySelector(".descripcion");
let btnGuardar = d.querySelector(".btn-guardar");
let tabla = d.querySelector(".table > tbody");
let inputFiltro = d.querySelector(".input-filtro");
let btnExportar = d.querySelector(".btn-exportar"); // Botón de exportar PDF

const listadoPedidos = "Pedidos"; // Clave en localStorage

// Evento click en el botón guardar
btnGuardar.addEventListener("click", () => {
    let datos = validarFormulario();
    if (datos) {  
        guardarDatos(datos);
        borrarTabla();
        mostrarDatos();
    }
});

// Evento para filtrar datos en tiempo real
inputFiltro.addEventListener("input", filtrarDatos);

// Evento para exportar PDF
btnExportar.addEventListener("click", exportarPDF);

// Función para validar el formulario
function validarFormulario() {
    if (clienteInput.value === "" || productoInput.value === "" || precioInput.value === "" || imagenInput.value === ""){
        alert("Todos los campos son obligatorios");
        return;
    }

    let datosForm = {
        cliente: clienteInput.value,
        producto: productoInput.value,
        precio: precioInput.value,
        imagen: imagenInput.value,
        descripcion: descripcionInput.value
    };

    console.log(datosForm);

    // Limpiar los campos después de enviar
    clienteInput.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    descripcionInput.value = "";

    return datosForm;
}

// Función para guardar datos en localStorage
function guardarDatos(datos) {
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    // Agregar el nuevo pedido
    pedidos.push(datos);

    // Guardar en localStorage
    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));

    alert("Los datos se guardaron correctamente");
}

// Función para obtener y mostrar datos en la tabla
function mostrarDatos(pedidos = null) {
    let pedidosLista = pedidos || JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    borrarTabla();

    pedidosLista.forEach((p, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${p.cliente}</td>
            <td>${p.producto}</td>
            <td>${p.precio}</td>
            <td><img src="${p.imagen}" width="50"></td>
            <td>${p.descripcion}</td>
            <td>
                <button onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-danger">❌</button>
                <button onclick="ActualizarPedido(${i})" class="btn-editar btn btn-warning">✏</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

// Función para borrar la tabla
function borrarTabla(){
    tabla.innerHTML = "";
}

// Función para filtrar datos
function filtrarDatos() {
    let filtro = inputFiltro.value.toLowerCase();
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    let pedidosFiltrados = pedidos.filter(p => 
        p.cliente.toLowerCase().includes(filtro) ||
        p.producto.toLowerCase().includes(filtro) ||
        p.precio.toLowerCase().includes(filtro)
    );

    mostrarDatos(pedidosFiltrados);
}

// Función para eliminar pedido
function eliminarPedido(pos){
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    let confirmar = confirm(`¿Estás seguro de eliminar el pedido del cliente: ${pedidos[pos].cliente}?`);
    if (confirmar) {
        pedidos.splice(pos, 1);
        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        borrarTabla();
        mostrarDatos();
        alert("El pedido ha sido eliminado.");
    }   
}

// Función para actualizar pedido
function ActualizarPedido(pos){
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    // Pasar los datos al formulario
    clienteInput.value = pedidos[pos].cliente; 
    productoInput.value = pedidos[pos].producto;
    precioInput.value = pedidos[pos].precio;
    imagenInput.value = pedidos[pos].imagen;
    descripcionInput.value = pedidos[pos].descripcion;

    let btnActualizar = d.querySelector(".btn-actualizar");
    btnActualizar.classList.remove("d-none");
    btnGuardar.classList.add("d-none");

    // Evento del botón actualizar
    btnActualizar.onclick = function() {
        pedidos[pos].cliente = clienteInput.value;
        pedidos[pos].producto = productoInput.value;
        pedidos[pos].precio = precioInput.value;
        pedidos[pos].imagen = imagenInput.value;
        pedidos[pos].descripcion = descripcionInput.value;

        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        alert("El pedido ha sido actualizado");
        
        borrarTabla();
        mostrarDatos();

        clienteInput.value = "";
        productoInput.value = "";
        precioInput.value = "";
        descripcionInput.value = "";
        
        btnActualizar.classList.add("d-none");
        btnGuardar.classList.remove("d-none");
    };
}

// Función para exportar a PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);
    doc.text("Lista de Pedidos", 14, 20);

    // Obtener datos de localStorage
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];
    
    // Crear encabezados
    let encabezados = ["#", "Cliente", "Producto", "Precio", "Descripción"];
    let data = pedidos.map((p, i) => [i + 1, p.cliente, p.producto, p.precio, p.descripcion]);

    // Dibujar la tabla
    doc.autoTable({
        head: [encabezados],
        body: data,
        startY: 30,
    });

    // Descargar el PDF
    doc.save("Pedidos.pdf");
}

// Mostrar los datos al cargar la página
d.addEventListener("DOMContentLoaded", function(){
    mostrarDatos();
});