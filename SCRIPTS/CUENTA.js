// cuenta.js

// Configuración inicial de saldos y nombres para cada tarjeta

const selectedCardIndex = localStorage.getItem('selectedCard');
const usuarios = [
    { 
        name: 'Ash Ketchum', 
        saldoInicial: 1000.00
    },
    { 
        name: 'Misty Waterflower', 
        saldoInicial: 100.00
    },
    { 
        name: 'Brock Harrison', 
        saldoInicial: 50.00
    },
    { 
        name: 'Gary Oak', 
        saldoInicial: 25.00
    },
    { 
        name: 'Team Rocket', 
        saldoInicial: 0.00
    }
];

// Inicializar saldo de la tarjeta seleccionada en localStorage si no existe
function inicializarSaldo() {
    if (selectedCardIndex !== null && usuarios[selectedCardIndex]) {
        const usuario = usuarios[selectedCardIndex];
        
        // Si el saldo no existe para esta tarjeta, inicialízalo con el saldoInicial
        if (!localStorage.getItem(`saldo_${selectedCardIndex}`)) {
            localStorage.setItem(`saldo_${selectedCardIndex}`, usuario.saldoInicial.toFixed(2));
        }
    }
}

// Llamar a inicializarSaldo cuando se carga la página de selección de usuario o al seleccionar la tarjeta
document.addEventListener('DOMContentLoaded', () => {
    inicializarSaldo();
});

// Función para obtener el saldo actual de la tarjeta seleccionada
function obtenerSaldo() {
    
    if (selectedCardIndex !== null) {
        return parseFloat(localStorage.getItem(`saldo_${selectedCardIndex}`)) || 0;
    }
    return 0;
}

// Función para actualizar el saldo de la tarjeta seleccionada en localStorage
function actualizarSaldo(nuevoSaldo) {
    
    if (selectedCardIndex !== null) {
        localStorage.setItem(`saldo_${selectedCardIndex}`, nuevoSaldo.toFixed(2));
    }
}

// Función para registrar una transacción en el historial con saldo inicial y final
function registrarTransaccion(tipo, cantidad) {
    if (selectedCardIndex !== null) {
        const saldoInicial = obtenerSaldo();
        let saldoFinal;

        if (tipo === 'Depósito') {
            saldoFinal = saldoInicial + cantidad;
        } else if (tipo === 'Retiro' || tipo === 'Pago de servicio') {
            saldoFinal = saldoInicial - cantidad;
        }

        // Actualizar el saldo final en localStorage
        actualizarSaldo(saldoFinal);

        // Guardar la transacción en el historial específico de cada usuario
        const transacciones = JSON.parse(localStorage.getItem(`transacciones_${selectedCardIndex}`)||'[]') || [];
        const nuevaTransaccion = {
            usuario: usuarios[selectedCardIndex].name,
            tipo: tipo,
            cantidad: cantidad.toFixed(2),
            saldoInicial: saldoInicial.toFixed(2),
            saldoFinal: saldoFinal.toFixed(2),
            fecha: new Date().toLocaleString()
        };
        transacciones.push(nuevaTransaccion);
        localStorage.setItem(`transacciones_${selectedCardIndex}`, JSON.stringify(transacciones));
    }
}

// Función de depósito
function realizarDeposito(cantidad) {
    
    if (selectedCardIndex === null) return;

    if (cantidad < 5.0 || cantidad > 1000.0) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad no válida',
            text: 'El depósito debe ser entre $5.00 y $1000.00.',
        });
        return;
    }

    const saldoActual = obtenerSaldo();
    const nuevoSaldo = saldoActual + cantidad;
    actualizarSaldo(nuevoSaldo);
    registrarTransaccion('Depósito', cantidad);
    Swal.fire({
        icon: 'success',
        title: 'Depósito exitoso',
        text: `Se han depositado $${cantidad.toFixed(2)}.`,
    });
}

// Función de retiro
function realizarRetiro(cantidad) {
    
    if (selectedCardIndex === null) return;

    if (cantidad < 5.0 || cantidad > 350.0) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad no válida',
            text: 'El retiro debe ser entre $5.00 y $350.00.',
        });
        return;
    }

    const saldoActual = obtenerSaldo();
    if (cantidad > saldoActual) {
        Swal.fire({
            icon: 'error',
            title: 'Saldo insuficiente',
            text: 'No tienes suficiente saldo para realizar este retiro.',
        });
        return;
    }

    const nuevoSaldo = saldoActual - cantidad;
    actualizarSaldo(nuevoSaldo);
    registrarTransaccion('Retiro', cantidad);
    Swal.fire({
        icon: 'success',
        title: 'Retiro exitoso',
        text: `Se han retirado $${cantidad.toFixed(2)}.`,
    });
}

// Inicializar el saldo al cargar la página
inicializarSaldo();
