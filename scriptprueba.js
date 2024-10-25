document.addEventListener('DOMContentLoaded', () => {
    const carrito = document.getElementById('carrito');
    const listaCarrito = document.querySelector('#lista-carrito tbody');
    const totalCarrito = document.getElementById('total-carrito');
    const btnVaciarCarrito = document.getElementById('vaciar-carrito');
    const btnIniciarCompra = document.getElementById('iniciar-compra');

    let carritoCompras = JSON.parse(localStorage.getItem('carrito')) || [];

    function actualizarCarrito() {
        listaCarrito.innerHTML = '';
        let total = 0;

        carritoCompras.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${producto.imagen}" width="50"></td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td><a href="#" class="borrar-producto" data-id="${producto.id}">X</a></td>
            `;
            listaCarrito.appendChild(row);
            total += producto.precio * producto.cantidad;
        });

        totalCarrito.innerText = `Total: $${total}`;
        localStorage.setItem('carrito', JSON.stringify(carritoCompras));

        // Volver a agregar eventos
        agregarEventos();
    }

    function agregarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-al-carrito')) {
            const id = e.target.getAttribute('data-id');
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseFloat(e.target.getAttribute('data-precio'));
            const imagenElement = e.target.closest('.product').querySelector('img');

            const producto = {
                id,
                nombre,
                precio,
                cantidad: 1,
                imagen: imagenElement.src
            };

            const existe = carritoCompras.some(prod => prod.id === producto.id);
            if (existe) {
                carritoCompras = carritoCompras.map(prod => {
                    if (prod.id === producto.id) {
                        prod.cantidad++;
                    }
                    return prod;
                });
            } else {
                carritoCompras.push(producto);
            }
            actualizarCarrito();
        }
    }

    function eliminarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('borrar-producto')) {
            const id = e.target.getAttribute('data-id');
            console.log(`Eliminando producto con ID: ${id}`);
            carritoCompras = carritoCompras.filter(prod => prod.id !== id);
            actualizarCarrito();
        }
    }

    function vaciarCarrito() {
        console.log("Vaciando carrito");
        carritoCompras = [];
        actualizarCarrito();
    }

    function agregarEventos() {
        document.querySelectorAll('.borrar-producto').forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });

        btnVaciarCarrito.addEventListener('click', vaciarCarrito);
    }

    document.querySelectorAll('.agregar-al-carrito').forEach(boton => {
        boton.addEventListener('click', agregarProducto);
    });

    // Actualizar carrito al cargar la página
    actualizarCarrito();
});


document.querySelectorAll('.agregar-al-carrito').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        
        const loadingText = this.querySelector('.loadingText');
        const tickIcon = this.querySelector('.tickIcon');
        const originalText = 'Agregar al carrito';

        // Mostrar "Cargando..." y ocultar texto original
        this.firstChild.textContent = '';
        loadingText.style.display = 'inline';

        // Simular el tiempo de carga
        setTimeout(() => {
            loadingText.style.display = 'none'; // Oculta "Cargando..."
            tickIcon.style.display = 'inline';  // Muestra el ✔️

            // Restaurar el botón después de mostrar el ✔️
            setTimeout(() => {
                tickIcon.style.display = 'none';
                this.firstChild.textContent = originalText; // Restaurar texto original
            }, 1500); // Tiempo después del tick
        }, 1000); // Tiempo de carga simulado
    });
});
