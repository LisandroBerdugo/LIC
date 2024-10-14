let currentCard = 1;
const totalCards = 5;

document.getElementById('next').addEventListener('click', function() {
    currentCard = (currentCard % totalCards) + 1; // Incrementa y vuelve al inicio si llega al final
    rotateCarousel();
});

document.getElementById('prev').addEventListener('click', function() {
    currentCard = (currentCard - 1 + totalCards) % totalCards || totalCards; // Decrementa y vuelve al final si llega al inicio
    rotateCarousel();
});

function rotateCarousel() {
    const angle = (currentCard - 1) * -72; // 72 grados por cada tarjeta
    document.querySelector('.carousel').style.transform = `rotateY(${angle}deg)`;
}
