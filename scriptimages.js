let currentIndex = 0;
const images = document.querySelector('.carousel-images');
const dots = document.querySelectorAll('.dot');
const totalImages = images.children.length;

function moverDerecha() {
    // Incrementa el índice de la imagen
    currentIndex++;
    if (currentIndex >= totalImages) {
        currentIndex = 0; // Regresa al inicio
    }
    // Mueve el contenedor de imágenes
    images.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Actualiza los puntitos
    actualizarPuntos();
}

function actualizarPuntos() {
    // Elimina la clase "active" de todos los puntitos
    dots.forEach(dot => dot.classList.remove('active'));
    // Añade la clase "active" al puntito correspondiente
    dots[currentIndex].classList.add('active');
}

// Cambia la imagen cada 3 segundos
setInterval(moverDerecha, 3000);