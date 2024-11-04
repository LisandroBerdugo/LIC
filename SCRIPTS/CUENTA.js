// cuenta.js

// Configuración inicial del saldo y transacciones
const usuario = 'Ash Ketchum';
const saldoInicial = 1000.0;
const maxDeposito = 1000.0;
const minDepositoRetiro = 5.0;
const maxRetiro = 350.0;

// Inicializar saldo y transacciones en localStorage si no existen
if (!localStorage.getItem('saldo')) {
    localStorage.setItem('saldo', saldoInicial.toFixed(2)); // Convertir a string con dos decimales
}
if (!localStorage.getItem('transacciones')) {
    localStorage.setItem('transacciones', JSON.stringify([])); // Inicializa como un array vacío
}

// Función para obtener el saldo actual
function obtenerSaldo() {
    return parseFloat(localStorage.getItem('saldo'));
}

// Función para actualizar el saldo en localStorage
function actualizarSaldo(nuevoSaldo) {
    localStorage.setItem('saldo', nuevoSaldo.toFixed(2));
}

// Función para registrar una transacción en el historial
function registrarTransaccion(tipo, cantidad) {
    const transacciones = JSON.parse(localStorage.getItem('transacciones'));
    const nuevaTransaccion = {
        tipo: tipo,
        cantidad: cantidad.toFixed(2),
        fecha: new Date().toLocaleString() // Fecha y hora actual
    };
    transacciones.push(nuevaTransaccion);
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
}

// Función para realizar un depósito
function realizarDeposito(cantidad) {
    if (cantidad < minDepositoRetiro || cantidad > maxDeposito) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad no válida',
            text: `El depósito debe ser entre $${minDepositoRetiro} y $${maxDeposito}.`,
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

// Función para realizar un retiro
function realizarRetiro(cantidad) {
    if (cantidad < minDepositoRetiro || cantidad > maxRetiro) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad no válida',
            text: `El retiro debe ser entre $${minDepositoRetiro} y $${maxRetiro}.`,
        });
        return;
    }
    const saldoActual = obtenerSaldo();
    if (cantidad > saldoActual) {
        Swal.fire({
            icon: 'error',
            title: 'Saldo insuficiente',
            text: `No tienes suficiente saldo para realizar este retiro.`,
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

// Función para realizar un pago de servicio
function realizarPagoServicio(cantidad) {
    if (cantidad < minDepositoRetiro || cantidad > maxRetiro) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad no válida',
            text: `El pago debe ser entre $${minDepositoRetiro} y $${maxRetiro}.`,
        });
        return;
    }
    const saldoActual = obtenerSaldo();
    if (cantidad > saldoActual) {
        Swal.fire({
            icon: 'error',
            title: 'Saldo insuficiente',
            text: `No tienes suficiente saldo para realizar este pago.`,
        });
        return;
    }
    const nuevoSaldo = saldoActual - cantidad;
    actualizarSaldo(nuevoSaldo);
    registrarTransaccion('Pago de servicio', cantidad);
    Swal.fire({
        icon: 'success',
        title: 'Pago exitoso',
        text: `Se ha realizado un pago de $${cantidad.toFixed(2)}.`,
    });
}

// Función para mostrar el historial de transacciones
function mostrarHistorialTransacciones() {
    const transacciones = JSON.parse(localStorage.getItem('transacciones'));
    let historial = '';
    transacciones.forEach((transaccion) => {
        historial += `${transaccion.fecha}: ${transaccion.tipo} - $${transaccion.cantidad}\n`;
    });
    Swal.fire({
        icon: 'info',
        title: 'Historial de transacciones',
        html: `<pre>${historial}</pre>`, // Usa pre para formato de texto preservado
    });
}
