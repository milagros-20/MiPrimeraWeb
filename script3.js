// Seleccionamos elementos del DOM
const addToCartBtn = document.querySelector('.add-to-cart-btn');
const quantityInput = document.getElementById('quantity');
const modeloSelect = document.getElementById('filtro-opciones');
const listaCarrito = document.querySelector('#lista-carrito tbody');
const totalCarrito = document.getElementById('total-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

let carrito = [];

// Cargar carrito desde localStorage al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    carrito = obtenerCarritoDeLocalStorage(); // Cargar el carrito almacenado
    renderCarrito(); // Renderizar el carrito al cargar
});

// Función para agregar productos al carrito
addToCartBtn.addEventListener('click', () => {
    const cantidad = parseInt(quantityInput.value); // Asegurarnos de que la cantidad es un número
    const modelo = modeloSelect.options[modeloSelect.selectedIndex]?.text; // Verificamos si hay modelo seleccionado
    const precio = 2500; // Precio fijo del vidrio

    const imagenProducto = "images/vidrios/1.jpg"; // Asegurarnos de tener la imagen del producto

    if (cantidad > 0 && modelo) { // Asegurarnos de que el modelo no es undefined
        const nombreProducto = `${modelo} (Vidrio)`; // Nombre completo del producto
        const productoExistente = carrito.find(producto => producto.modelo === nombreProducto);

        if (productoExistente) {
            // Si el producto ya existe, incrementar la cantidad
            productoExistente.cantidad += cantidad;
            productoExistente.subtotal = productoExistente.cantidad * precio;
        } else {
            // Agregar nuevo producto
            const producto = {
                modelo: nombreProducto,
                cantidad: cantidad,
                precio: precio,
                subtotal: cantidad * precio,
                imagen: imagenProducto
            };
            carrito.push(producto);
        }

        // Guardar el carrito en localStorage después de agregar un producto
        guardarCarritoEnLocalStorage();
        renderCarrito(); // Renderizar carrito actualizado
    } else {
        alert('Por favor, selecciona un modelo y una cantidad válida.');
    }
});

// Función para renderizar el carrito
function renderCarrito() {
    listaCarrito.innerHTML = ''; // Limpiamos el carrito
    let total = 0;

    carrito.forEach((producto, index) => {
        total += producto.subtotal; // Sumar subtotales para calcular el total general

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${producto.imagen}" width="50" alt="${producto.modelo}"></td>
            <td>${producto.modelo || 'Producto'}</td>
            <td><strong>$${producto.precio.toFixed(2)}</strong></td>
            <td>${producto.cantidad}</td>
            <td><button class="borrar" data-index="${index}">X</button></td>
        `;
        listaCarrito.appendChild(row);
    });

    totalCarrito.textContent = `Total: $${total.toFixed(2)}`; // Mostrar el total formateado correctamente

    // Añadir eventos a los botones de eliminar
    document.querySelectorAll('.borrar').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (index !== null) {
                carrito.splice(index, 1); // Eliminar del carrito
                guardarCarritoEnLocalStorage(); // Actualizar localStorage
                renderCarrito(); // Volver a renderizar
            }
        });
    });
}

// Función para vaciar el carrito
vaciarCarritoBtn.addEventListener('click', () => {
    carrito = []; // Limpiar el carrito
    renderCarrito(); // Volver a renderizar
    localStorage.removeItem('carrito'); // Limpiar localStorage
});

// Función para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar carrito en localStorage
}

// Función para obtener el carrito de localStorage
function obtenerCarritoDeLocalStorage() {
    return JSON.parse(localStorage.getItem('carrito')) || []; // Obtener carrito de localStorage o devolver un array vacío
}
