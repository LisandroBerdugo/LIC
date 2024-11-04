// pin.js

document.addEventListener('DOMContentLoaded', () => {
    const pinDisplay = document.querySelectorAll('.pin-digit');
    const pinButtons = document.querySelectorAll('.pin-btn');
    const deleteButton = document.querySelector('.delete-btn');
    const confirmButton = document.getElementById('confirm-btn');
    let enteredPin = '';

    // Función para mostrar la fecha y hora actual en el formato deseado
    function updateDateTime() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        // Mostrar la fecha primero y luego la hora
        document.getElementById('time').textContent = `${day} ${month}, ${hours}:${minutes}`;
    }

    // Llamar a la función para actualizar la fecha y hora al cargar
    updateDateTime();
    setInterval(updateDateTime, 60000); // Actualiza la hora cada minuto

    // Obtener la tarjeta seleccionada del localStorage
    const selectedCardIndex = localStorage.getItem('selectedCard');

    // Definimos los PINs para cada tarjeta (esto es solo para la simulación)
    const cardPins = {
        0: '1234',
        1: '5678',
        2: '9101',
        3: '1122',
        4: '3344'
    };

    // Función para actualizar la visualización del PIN
    function updatePinDisplay() {
        pinDisplay.forEach((digit, index) => {
            digit.textContent = enteredPin[index] ? '*' : ''; // Mostrar '*' por cada dígito
        });
    }

    // Evento para los botones de los números
    pinButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (enteredPin.length < 4 && button.textContent !== '<') { // Limitar a 4 dígitos
                enteredPin += button.textContent;
                updatePinDisplay();
            }
        });
    });

    // Evento para el botón de borrar
    deleteButton.addEventListener('click', () => {
        enteredPin = enteredPin.slice(0, -1); // Elimina el último dígito
        updatePinDisplay();
    });

    // Evento para el botón de confirmar
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
                // Redirigir a la pantalla de inicio después de la confirmación de SweetAlert
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
            enteredPin = ''; // Reiniciar el PIN ingresado
            updatePinDisplay(); // Limpiar la visualización del PIN
        }
    });
});
