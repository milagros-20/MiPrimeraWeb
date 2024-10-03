const carrito = document.getElementById('carrito');
const totalCarrito = document.querySelector('#carrito #total-carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const iniciarCompraButton = document.getElementById('iniciar-compra');

cargarEventListeners();

// Función para agregar producto al carrito y almacenar en localStorage
function agregarAlCarrito(producto) {
  // Obtener los datos del carrito actual
  let carritoLocalStorage = JSON.parse(localStorage.getItem('carrito')) || [];

  // Agregar el producto al carrito
  carritoLocalStorage.push(producto);

  // Guardar los datos del carrito en localStorage
  localStorage.setItem('carrito', JSON.stringify(carritoLocalStorage));
}

// Función para obtener los datos del carrito de localStorage
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function cargarEventListeners() {

    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

}

function comprarElemento(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-al-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id'),
    }
    insertarCarrito(infoElemento);
    const carritoLocalStorage = obtenerCarrito();
    carritoLocalStorage.push(infoElemento);
    localStorage.setItem('carrito', JSON.stringify(carritoLocalStorage));
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>
        <img src="${elemento.imagen}" width=100 />
    </td>
    <td>
        ${elemento.titulo}
    </td>
    <td>
        <p>${elemento.precio}</p>
    </td>
    <td>
        <a href="#" class="borrar" data-id="${elemento.id}" >X </a>
    </td>
    `;

    lista.appendChild(row);
    actualizarTotal();
}

function eliminarElemento(e) {
    e.preventDefault();
    let elemento,
        elementoId;
    if(e.target.classList.contains('borrar')) {
        e.target.parentElement.parentElement.remove();
        elemento = e.target.parentElement.parentElement;
        elementoId = elemento.querySelector('a').getAttribute('data-id');
    }
    actualizarTotal();
    // Eliminar producto del carrito en localStorage
    const carritoLocalStorage = obtenerCarrito();
    const indice = carritoLocalStorage.findIndex(producto => producto.id === elementoId);
    if (indice !== -1) {
        carritoLocalStorage.splice(indice, 1);
        localStorage.setItem('carrito', JSON.stringify(carritoLocalStorage));
    }
}

function vaciarCarrito() {
    while(lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    actualizarTotal();
    // Vaciar carrito en localStorage
    localStorage.removeItem('carrito');
    return false;
}

function actualizarTotal() {
    let total = 0;
    const rows = lista.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const precio = rows[i].querySelector('td:nth-of-type(3) p').textContent;
        const precioFloat = parseFloat(precio.replace('$', ''));
        total += precioFloat;
    }
    if (totalCarrito) {
        totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
    }
}

function cargarCarritoDesdeLocalStorage() {
    const carritoLocalStorage = obtenerCarrito();
    carritoLocalStorage.forEach((producto) => {
        insertarCarrito(producto);
    });
    actualizarTotal(); // Call actualizarTotal here
}

// Call cargarCarritoDesdeLocalStorage when the page loads
document.addEventListener('DOMContentLoaded', cargarCarritoDesdeLocalStorage);

const agregarAlCarritoButtons = document.querySelectorAll('.agregar-al-carrito');

agregarAlCarritoButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.add('clicked'); /* add clicked class to trigger animation */
    setTimeout(() => {
      button.classList.remove('clicked'); /* remove clicked class after animation finishes */
    }, 500); /* wait for 500ms (duration of animation) */
  });
});
