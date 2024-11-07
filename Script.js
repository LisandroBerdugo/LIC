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

// Funcionalidad para el botón "Restablecer demo"
document.getElementById('borrar').addEventListener('click', function() {
    Swal.fire({
        title: 'Está a punto de restablecer los datos',
        text: '¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear(); // Limpia el local storage
        }
    });
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

// Selección de tarjeta: guarda el índice en localStorage y muestra la animación de carga
document.querySelectorAll('.carousel .card').forEach((card, index) => {
    card.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar la navegación inmediata
        localStorage.setItem('selectedCard', index); // Guardar el índice de la tarjeta en localStorage
        
        // Mostrar mensaje de "Leyendo los datos de su tarjeta" con animación de la pokebola
        Swal.fire({
            title: 'Leyendo los datos de su tarjeta, por favor espere...',
            html: '<img src="IMAGENES/pokebola1.png" class="pokebola-animada" alt="Pokebola">',
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: {
                popup: 'no-scroll-swal' // Clase personalizada para quitar la barra de desplazamiento
            },
            didOpen: () => {
                setTimeout(() => {
                    // Después de 3 segundos, redirigir a la pantalla del PIN
                    window.location.href = card.getAttribute('href');
                }, 5000);
            }
        });
    });
});
