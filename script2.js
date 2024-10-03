const carrito = document.getElementById('carrito');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const totalCarrito = document.getElementById('total-carrito');

let cart = []; // Crear un array para almacenar el carrito

cargarEventListeners();

function cargarEventListeners() {
  // Agregar evento click a cada botón "Eliminar"
  lista.addEventListener('click', eliminarElemento);

  // Agregar evento click al botón "Vaciar carrito"
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

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

const productos = document.querySelectorAll('.product');

productos.forEach((producto) => {
  const botonAgregar = producto.querySelector('.agregar-al-carrito');
  botonAgregar.addEventListener('click', (e) => {
    e.preventDefault();
    const elemento = producto;
    const infoElemento = leerDatosElemento(elemento);

    // Verificar si el producto ya está en el carrito
    if (!cart.find((item) => item.id === infoElemento.id)) {
      cart.push(infoElemento);
      insertarCarrito(infoElemento);
      agregarAlCarrito(infoElemento);
    }
  });
});

function leerDatosElemento(elemento) {
  const infoElemento = {
    imagen: elemento.querySelector('img').src,
    titulo: elemento.querySelector('h3').textContent,
    precio: elemento.querySelector('.price').textContent,
    id: elemento.querySelector('.agregar-al-carrito').getAttribute('data-id'),
  };
  return infoElemento;
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
      ${elemento.precio}
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
  const elementoId = e.target.getAttribute('data-id');
  const index = cart.findIndex((item) => item.id === elementoId);
  if (index !== -1) {
    cart.splice(index, 1);
    e.target.parentElement.parentElement.remove();
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
  while (lista.firstChild) {
    lista.removeChild(lista.firstChild);
  }
  cart = [];
  actualizarTotal();
  // Vaciar carrito en localStorage
  localStorage.removeItem('carrito');
  return false;
}

function actualizarTotal() {
  let total = 0;
  cart.forEach((item) => {
    const precio = parseFloat(item.precio.replace('.', '').replace(',', '.'));
    if (!isNaN(precio)) {
      total += precio;
    }
  });
  totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
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