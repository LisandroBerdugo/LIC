// pago_servicio.js

document.addEventListener('DOMContentLoaded', () => {
    const selectedCardIndex = localStorage.getItem('selectedCard');
    const userName = document.getElementById('user-name');

    // Definir usuarios con sus saldos iniciales
    const usuarios = [
        { name: 'Ash Ketchum', saldoInicial: 1000.00 },
        { name: 'Misty Waterflower', saldoInicial: 100.00 },
        { name: 'Brock Harrison', saldoInicial: 50.00 },
        { name: 'Gary Oak', saldoInicial: 25.00 },
        { name: 'Team Rocket', saldoInicial: 0.00 }
    ];

    // Obtener el tipo de servicio desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const nombreServicio = urlParams.get('servicio') || 'SERVICIO';

    // NPE válidos y montos para cada servicio
    const serviciosNPE = {
        LUZ: { '123456': 50.00, '123457': 75.00, '123458': 100.00 },
        AGUA: { '234561': 30.00, '234562': 45.00, '234563': 60.00 },
        INTERNET: { '345671': 80.00, '345672': 100.00, '345673': 120.00 },
        TELEFONO: { '456781': 40.00, '456782': 60.00, '456783': 80.00 }
    };

    let monto = 0;

    // Mostrar el nombre del usuario y el servicio
    userName.textContent = obtenerNombreUsuario();
    document.querySelector('h2').textContent = `PAGO DE ${nombreServicio.toUpperCase()}`;
    updateDateTime();
    setInterval(updateDateTime, 60000);

    // Función para ingresar un número al NPE
    function ingresarNPE(num) {
        const npeInput = document.getElementById("npeInput");
        if (npeInput.value.length < 6) {
            npeInput.value += num;
        }
    }

    // Limitar el NPE a solo números
    function soloNumeros(event) {
        const key = event.key;
        return /^[0-9]$/.test(key);
    }

    // Limitar el NPE a 6 dígitos (asegurar el límite incluso si es ingresado desde el teclado físico)
    function limitarNPE() {
        const npeInput = document.getElementById("npeInput");
        npeInput.value = npeInput.value.slice(0, 6);
    }

    // Función para borrar el último dígito ingresado
    function borrarUltimo() {
        const npeInput = document.getElementById("npeInput");
        npeInput.value = npeInput.value.slice(0, -1);
    }

    // Función para borrar todo el NPE ingresado
    function borrarTodo() {
        document.getElementById("npeInput").value = "";
        document.getElementById("amountToPay").textContent = "$0.00";
        document.getElementById("confirmButton").disabled = true;
        document.getElementById("confirmButton").classList.add("btn-disabled");
    }

    // Función para verificar el NPE ingresado
    function verificarNPE() {
        const npeInput = document.getElementById("npeInput").value;
        
        // Verificar si el NPE corresponde al servicio y obtener el monto
        if (serviciosNPE[nombreServicio] && serviciosNPE[nombreServicio][npeInput] !== undefined) {
            monto = serviciosNPE[nombreServicio][npeInput];
            document.getElementById("amountToPay").textContent = `$${monto.toFixed(2)}`;
            
            // Habilitar el botón de confirmar pago
            const confirmButton = document.getElementById("confirmButton");
            confirmButton.disabled = false;
            confirmButton.classList.remove("btn-disabled");

            // Mostrar alerta de NPE válido
            Swal.fire({
                icon: 'success',
                title: 'NPE Válido',
                text: `El NPE ingresado es válido y el monto a pagar es $${monto.toFixed(2)}.`,
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'NPE inválido',
                text: `El NPE ingresado no corresponde al servicio seleccionado (${nombreServicio}).`,
            });
            document.getElementById("amountToPay").textContent = "$0.00";
            
            // Deshabilitar el botón de confirmar pago
            const confirmButton = document.getElementById("confirmButton");
            confirmButton.disabled = true;
            confirmButton.classList.add("btn-disabled");
        }
    }

    // Confirmar el pago del servicio
    function confirmarPago() {
        const saldoAnterior = obtenerSaldo();

        if (monto > saldoAnterior) {
            Swal.fire({
                icon: 'error',
                title: 'Saldo insuficiente',
                text: 'No tienes suficiente saldo para realizar este pago.',
            });
            return;
        }

        realizarPagoServicio(monto);
        const nuevoSaldo = obtenerSaldo();

        registrarTransaccion("servicio", monto, saldoAnterior, nuevoSaldo, nombreServicio);

        Swal.fire({
            icon: 'success',
            title: '¡Pago Realizado!',
            text: `Se ha pagado $${monto.toFixed(2)} por el servicio ${nombreServicio}.`,
            confirmButtonText: 'Aceptar',
        }).then(() => {
            window.location.href = '../INICIO/inicio.html';
        });
    }

    // Función para actualizar la fecha/hora en el encabezado
    function updateDateTime() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('time').textContent = `${day} ${month}, ${hours}:${minutes}`;
    }

    // Obtener el nombre del usuario basado en la tarjeta seleccionada
    function obtenerNombreUsuario() {
        const cardInfo = {
            0: 'Ash Ketchum',
            1: 'Misty Waterflower',
            2: 'Brock Harrison',
            3: 'Gary Oak',
            4: 'Team Rocket'
        };
        return cardInfo[selectedCardIndex] || "Usuario Desconocido";
    }

    // Obtener el saldo actual del usuario, asegurando que esté inicializado
    function obtenerSaldo() {
        const saldo = localStorage.getItem(`saldo_${selectedCardIndex}`);
        if (saldo === null) {
            // Si no existe el saldo, inicializarlo con el saldo inicial del usuario
            const usuario = usuarios[selectedCardIndex];
            localStorage.setItem(`saldo_${selectedCardIndex}`, usuario.saldoInicial.toFixed(2));
            return usuario.saldoInicial;
        }
        return parseFloat(saldo);
    }

    // Realizar el pago del servicio
    function realizarPagoServicio(cantidad) {
        let saldoActual = obtenerSaldo();
        saldoActual -= cantidad;
        localStorage.setItem(`saldo_${selectedCardIndex}`, saldoActual.toFixed(2));
    }

    // Registrar la transacción como "servicio" en el historial del usuario
    function registrarTransaccion(tipo, monto, saldoInicial, saldoFinal, nombreServicio) {
        const transacciones = JSON.parse(localStorage.getItem(`transacciones_${selectedCardIndex}`)) || [];
        const transaccion = {
            tipo: tipo,
            monto: monto,
            saldoInicial: saldoInicial.toFixed(2),
            saldoFinal: saldoFinal.toFixed(2),
            nombreServicio: nombreServicio || '',
            fecha: new Date().toLocaleDateString()
        };
        transacciones.push(transaccion);
        localStorage.setItem(`transacciones_${selectedCardIndex}`, JSON.stringify(transacciones));
    }

    // Exponer funciones globales necesarias
    window.ingresarNPE = ingresarNPE;
    window.borrarUltimo = borrarUltimo;
    window.borrarTodo = borrarTodo;
    window.verificarNPE = verificarNPE;
    window.confirmarPago = confirmarPago;
    window.confirmarSalida = function() {
        Swal.fire({
            title: 'Salir',
            text: '¿Estás seguro que deseas cancelar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../INICIO/inicio.html';
            }
        });
    };
});
