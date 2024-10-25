const carrito = document.getElementById('carrito');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const totalCarrito = document.getElementById('total-carrito');

let cart = []; // Arreglo para el carrito

cargarEventListeners();

// Cargar carrito desde localStorage al iniciar la página
document.addEventListener('DOMContentLoaded', cargarCarritoDesdeLocalStorage);

function cargarEventListeners() {
  lista.addEventListener('click', eliminarElemento);
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

  const productos = document.querySelectorAll('.product');
  productos.forEach((producto) => {
    const botonAgregar = producto.querySelector('.agregar-al-carrito');
    botonAgregar.addEventListener('click', (e) => {
      e.preventDefault();
      agregarProductoAlCarrito(producto, botonAgregar);
    });
  });
}

function agregarProductoAlCarrito(producto, botonAgregar) {
  const infoElemento = leerDatosElemento(producto);

  // Cambiar estado del botón a "Cargando..."
  botonAgregar.textContent = '';
  botonAgregar.classList.add('cargando');

  setTimeout(() => {
    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.find((item) => item.id === infoElemento.id);

    if (existingProduct) {
      // Incrementar cantidad si ya existe
      existingProduct.cantidad++;

      // Actualizar la fila correspondiente en la tabla
      const row = lista.querySelector(`.borrar[data-id="${infoElemento.id}"]`).parentElement.parentElement;
      row.children[3].textContent = existingProduct.cantidad; // Actualizar cantidad en la fila
    } else {
      // Agregar nuevo producto con cantidad 1
      infoElemento.cantidad = 1;
      cart.push(infoElemento);
      insertarCarrito(infoElemento); // Insertar nueva fila en el carrito
    }

    // Cambiar texto del botón a "✔" después de agregar
    botonAgregar.textContent = ''; 
    botonAgregar.classList.remove('cargando');
    botonAgregar.classList.add('agregado');

    setTimeout(() => {
      botonAgregar.textContent = 'Agregar al carrito'; // Restablecer texto original
      botonAgregar.classList.remove('agregado');
    }, 1000);

    actualizarTotal(); // Actualizar total del carrito
    guardarCarritoEnLocalStorage(); // Guardar el carrito en localStorage
  }, 1000); // Simulación de carga de 1 segundo
}

function insertarCarrito(elemento) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><img src="${elemento.imagen}" width=100 /></td>
    <td>${elemento.titulo}</td>
    <td><strong>${elemento.precio}<strong></td>
    <td>${elemento.cantidad}</td>
    <td><a href="#" class="borrar" data-id="${elemento.id}">X</a></td>
  `;
  lista.appendChild(row);
  actualizarTotal(); // Actualizar total al insertar
}

function eliminarElemento(e) {
  e.preventDefault();
  if (e.target.classList.contains('borrar')) {
    const elementoId = e.target.getAttribute('data-id'); // Comparar como string
    const index = cart.findIndex((item) => item.id === elementoId);
    if (index !== -1) {
      cart.splice(index, 1); // Eliminar del carrito
      e.target.parentElement.parentElement.remove(); // Eliminar fila de la tabla
    }
    actualizarTotal(); // Actualizar total después de eliminar
    guardarCarritoEnLocalStorage(); // Actualizar localStorage después de eliminar
  }
}

function vaciarCarrito() {
  while (lista.firstChild) {
    lista.removeChild(lista.firstChild);
  }
  cart = []; // Reiniciar carrito
  actualizarTotal(); // Actualizar total
  localStorage.removeItem('carrito'); // Limpiar localStorage
}

function actualizarTotal() {
  let total = 0;
  cart.forEach((item) => {
    const precioString = item.precio.replace('$', '').replace('.', '').replace(',', '.');
    const precio = parseFloat(precioString);
    if (!isNaN(precio)) {
      total += precio * item.cantidad; // Calcular total
    }
  });
  const totalFormateado = total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'ARS' });
  totalCarrito.textContent = `Total: ${totalFormateado}`; // Mostrar total formateado
}

function leerDatosElemento(elemento) {
  return {
    imagen: elemento.querySelector('img').src,
    titulo: elemento.querySelector('h3').textContent,
    precio: elemento.querySelector('.price').textContent,
    id: elemento.querySelector('.agregar-al-carrito').getAttribute('data-id'), // Obtener ID desde el botón
  };
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(cart)); // Guardar carrito en localStorage
}

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || []; // Obtener carrito del localStorage o arreglo vacío
}

function cargarCarritoDesdeLocalStorage() {
  cart = obtenerCarrito(); // Cargar carrito desde localStorage
  cart.forEach((producto) => {
    insertarCarrito(producto); // Insertar productos en la tabla
  });
  actualizarTotal(); // Actualizar total al cargar
}
