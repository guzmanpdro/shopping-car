// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    // Al presionar el boton "Agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso);
    // Elimina curos del carrito
    carrito.addEventListener('click', eliminarCurso)
    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        // Resetea el arreglo "articulosCarrito"
        articulosCarrito = [];
        // Elimina todo el elemento HTML
        limpiarHTML();
    })

    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('articulos')) || [];
        carritoHTML();
    })
}

// Funciones
function agregarCurso(event) {
    event.preventDefault();
    if(event.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = (event.target.parentElement.parentElement);
        leerDatosCurso(cursoSeleccionado);
    }
}

// Elimina un curso del carrito
function eliminarCurso(event) {
    event.preventDefault();
    if(event.target.classList.contains('borrar-curso')) {
        const cursoId = event.target.getAttribute('data-id');

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );
        carritoHTML();
        sincronizarStorage();
    }
}

// Extraer la información del curso
function leerDatosCurso(curso) {
    // Crear objecto con la información del curso
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1,
    }

    // Verifica la existencia de un elemento en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if(existe) {
        // Se actualiza la cantidad
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso;
            } else {
                return curso;
            }
        })
        articulosCarrito = [...cursos];
    } else {
        // Agrega elemento al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    
    carritoHTML();
}

// Limpiar y Generar HTML del carrito
function carritoHTML() {
    // Limpiar HTML
    limpiarHTML();

    // Generar HTML
    articulosCarrito.forEach(curso => {
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" alt="${curso.titulo}" width="100">
            </td>
            <td>
                ${titulo}
            </td>
            <td>
                ${precio}
            </td>
            <td>
                ${cantidad}
            </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `;
        // Agregar el HTML en la etiqueta tbody
        contenedorCarrito.appendChild(row);

        // Agregar carrito de compra al storage
        sincronizarStorage();
    })
}

function sincronizarStorage() {
    localStorage.setItem('articulos', JSON.stringify(articulosCarrito));
}

function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}