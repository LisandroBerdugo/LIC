// inicio.js

document.addEventListener('DOMContentLoaded', () => {
    const cardInfo = {
        0: { name: 'Ash Ketchum' },
        1: { name: 'Misty Waterflower' },
        2: { name: 'Brock Harrison' },
        3: { name: 'Gary Oak' },
        4: { name: 'Team Rocket' }
    };

    const selectedCardIndex = localStorage.getItem('selectedCard');

    if (selectedCardIndex !== null && cardInfo[selectedCardIndex]) {
        const card = cardInfo[selectedCardIndex];
        document.getElementById('user-name').textContent = card.name;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró la información de la tarjeta.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = '../index.html';
        });
    }

    function updateDateTime() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        // Mostrar la fecha primero y luego la hora
        document.getElementById('time').textContent = `${day} ${month}, ${hours}:${minutes}`;
    }

    updateDateTime();
    setInterval(updateDateTime, 60000);

    window.confirmarSalida = function() {
        Swal.fire({
            title: 'Está a punto de salir',
            text: '¿Desea continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('selectedCard');
                window.location.href = '../index.html';
            }
        });
    }
});
