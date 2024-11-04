// script.js

let currentCard = 1;
const totalCards = 5;
let isTransitioning = false;

// Funcionalidad para el botón "Siguiente"
document.getElementById('next').addEventListener('click', function() {
    if (isTransitioning) return; // Prevenir clics múltiples
    currentCard += 1;
    if (currentCard > totalCards) {
        currentCard = 1; // Reiniciar a la primera tarjeta
    }
    rotateCarousel(currentCard);
});

// Funcionalidad para el botón "Anterior"
document.getElementById('prev').addEventListener('click', function() {
    if (isTransitioning) return; // Prevenir clics múltiples
    currentCard -= 1;
    if (currentCard < 1) {
        currentCard = totalCards; // Ir a la última tarjeta
    }
    rotateCarousel(currentCard);
});

// Función para rotar el carrusel al índice de tarjeta dado
function rotateCarousel(cardIndex) {
    const angle = (cardIndex - 1) * -72; // Rotación 72 grados por tarjeta
    const carousel = document.querySelector('.carousel');

    // Evitar que el usuario haga múltiples clics mientras rota
    isTransitioning = true;

    // Aplicar la rotación con una transición suave
    carousel.style.transition = 'transform 0.5s ease-out'; 
    carousel.style.transform = `rotateY(${angle}deg)`;

    // Deshabilitar la transición una vez terminada
    setTimeout(function() {
        isTransitioning = false;
    }, 500); // Debe coincidir con la duración de la transición
}

// Selección de tarjeta: guarda el índice en localStorage y redirige
document.querySelectorAll('.carousel .card').forEach((card, index) => {
    card.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar la navegación inmediata
        localStorage.setItem('selectedCard', index); // Guardar el índice de la tarjeta en localStorage
        window.location.href = card.getAttribute('href'); // Redirigir a la pantalla del PIN
    });
});
