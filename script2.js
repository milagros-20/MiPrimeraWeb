const carrito = document.getElementById('carrito');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

let cart = []; // Crear un array para almacenar el carrito

cargarEventListeners();

function cargarEventListeners() {
    // Agregar evento click a cada botón "Eliminar"
    lista.addEventListener('click', eliminarElemento);
  
    // Agregar evento click al botón "Vaciar carrito"
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
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
    }
  });
});

function leerDatosElemento(elemento) {
  const infoElemento = {
    imagen: elemento.querySelector('img').src,
    titulo: elemento.querySelector('h3, p').textContent,
    price: elemento.querySelector('.price').textContent,
    id: elemento.querySelector('a').getAttribute('data-id'),
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
      ${elemento.price}
    </td>
    <td>
      <a href="#" class="borrar" data-id="${elemento.id}" >X </a>
    </td>
  `;

  lista.appendChild(row);
}

function eliminarElemento(e) {
  e.preventDefault();
  const elementoId = e.target.getAttribute('data-id');
  const index = cart.findIndex((item) => item.id === elementoId);
  if (index !== -1) {
    cart.splice(index, 1);
    e.target.parentElement.parentElement.remove();
  }
}

function vaciarCarrito() {
  while (lista.firstChild) {
    lista.removeChild(lista.firstChild);
  }
  cart = [];
  return false;
}