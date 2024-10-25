const carrito = document.getElementById('carrito');
const totalCarrito = document.querySelector('#carrito #total-carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

cargarEventListeners();

function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-al-carrito')) {
        const elemento = e.target.parentElement;
        const infoElemento = leerDatosElemento(elemento);
        agregarAlCarrito(infoElemento);
        actualizarCarrito();
    }
}

function agregarAlCarrito(producto) {
    let carritoLocalStorage = obtenerCarrito();

    // Comprobar si el producto ya existe en el carrito
    const existingProduct = carritoLocalStorage.find(item => item.id === producto.id);
    if (existingProduct) {
        existingProduct.cantidad++; // Incrementar la cantidad
    } else {
        producto.cantidad = 1; // Agregar cantidad inicial
        carritoLocalStorage.push(producto);
    }

    localStorage.setItem('carrito', JSON.stringify(carritoLocalStorage));
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function actualizarCarrito() {
    const carritoLocalStorage = obtenerCarrito();
    lista.innerHTML = ''; // Limpiar la lista
    carritoLocalStorage.forEach((producto) => {
        insertarCarrito(producto);
    });
    actualizarTotal(); // Llamar una vez al final
}

function leerDatosElemento(elemento) {
    return {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent.trim(), // Asegúrate de que h3 existe
        precio: elemento.querySelector('.precio').textContent.trim(), // Asegúrate de que .precio existe
        id: elemento.querySelector('a').getAttribute('data-id'),
    };
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${elemento.imagen}" width="100" /></td>
        <td>${elemento.titulo}</td>
        <td><p><strong>${elemento.precio}</strong></p></td>
        <td>${elemento.cantidad}</td>
        <td><a href="#" class="borrar" data-id="${elemento.id}">X</a></td>
    `;
    lista.appendChild(row);
}

function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        const elementoId = e.target.getAttribute('data-id');
        const carritoLocalStorage = obtenerCarrito();
        const updatedCarrito = carritoLocalStorage.filter(item => item.id !== elementoId);
        localStorage.setItem('carrito', JSON.stringify(updatedCarrito));
        actualizarCarrito();
    }
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    lista.innerHTML = ''; // Limpiar la lista
    actualizarTotal();
}

function actualizarTotal() {
    let total = 0;
    const carritoLocalStorage = obtenerCarrito();
    carritoLocalStorage.forEach((item) => {
        // Asegúrate de formatear el precio correctamente
        const precio = parseFloat(item.precio.replace('$', '').replace('.', '').replace(',', '.'));
        total += precio * item.cantidad; // Multiplicar por la cantidad
    });
    const totalFormateado = total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'ARS' });
    totalCarrito.textContent = `Total: ${totalFormateado}`;
}

function cargarCarritoDesdeLocalStorage() {
    const carritoLocalStorage = obtenerCarrito();
    if (carritoLocalStorage.length > 0) {
        carritoLocalStorage.forEach((producto) => {
            insertarCarrito(producto);
        });
        actualizarTotal();
    }
}

// Llamar a cargarCarritoDesdeLocalStorage cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarCarritoDesdeLocalStorage);
