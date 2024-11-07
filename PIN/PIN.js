// pin.js

document.addEventListener('DOMContentLoaded', () => {
    const pinDisplay = document.querySelectorAll('.pin-digit');
    const pinButtons = document.querySelectorAll('.pin-btn');
    const deleteButton = document.querySelector('.delete-btn');
    const clearButton = document.querySelector('.clear-btn');
    const confirmButton = document.getElementById('confirm-btn');
    let enteredPin = '';

    // Función para mostrar la fecha y hora actual en el formato deseado
    function updateDateTime() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        document.getElementById('time').textContent = `${day} ${month}, ${hours}:${minutes}`;
    }

    updateDateTime();
    setInterval(updateDateTime, 60000);

    const selectedCardIndex = localStorage.getItem('selectedCard');
    const cardPins = {
        0: '1234',
        1: '5678',
        2: '9101',
        3: '1122',
        4: '3344'
    };

    function updatePinDisplay() {
        pinDisplay.forEach((digit, index) => {
            digit.textContent = enteredPin[index] ? '*' : '';
        });
    }

    pinButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (enteredPin.length < 4 && button.textContent !== '<' && button.textContent !== 'C') {
                enteredPin += button.textContent;
                updatePinDisplay();
            }
        });
    });

    deleteButton.addEventListener('click', () => {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDisplay();
    });

    clearButton.addEventListener('click', () => {
        enteredPin = '';
        updatePinDisplay();
    });

    confirmButton.addEventListener('click', () => {
        const correctPin = cardPins[selectedCardIndex];
        if (enteredPin === correctPin) {
            Swal.fire({
                icon: 'success',
                title: 'PIN correcto',
                text: 'Bienvenido!',
                confirmButtonText: 'Continuar',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                window.location.href = '../INICIO/inicio.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'PIN incorrecto',
                text: 'Intente nuevamente.',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            enteredPin = '';
            updatePinDisplay();
        }
    });
});
