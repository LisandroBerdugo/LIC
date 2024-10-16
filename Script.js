let currentCard = 1;
const totalCards = 5;
let isTransitioning = false;

document.getElementById('next').addEventListener('click', function() {
    if (isTransitioning) return; // Prevenir clics múltiples
    currentCard += 1;
    if (currentCard > totalCards) {
        currentCard = 1; // Reiniciar a la primera tarjeta
    }
    rotateCarousel(currentCard);
});

document.getElementById('prev').addEventListener('click', function() {
    if (isTransitioning) return; // Prevenir clics múltiples
    currentCard -= 1;
    if (currentCard < 1) {
        currentCard = totalCards; // Ir a la última tarjeta
    }
    rotateCarousel(currentCard);
});

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
