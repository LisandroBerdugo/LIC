document.addEventListener('DOMContentLoaded', () => {
    const selectedCardIndex = localStorage.getItem('selectedCard');
    const userName = document.getElementById('user-name');

    const usuarios = [
        { name: 'Ash Ketchum', saldoInicial: 500.00 },
        { name: 'Lisandro Berdugo', saldoInicial: 100.00 },
        { name: 'Brock Harrison', saldoInicial: 50.00 },
        { name: 'Gary Oak', saldoInicial: 25.00 },
        { name: 'Team Rocket', saldoInicial: 0.00 }
    ];

    const urlParams = new URLSearchParams(window.location.search);
    const nombreServicio = urlParams.get('servicio') || 'SERVICIO';

    const serviciosNPE = {
        LUZ: { 
              '123451': 50.01, 
              '123452': 75.25, 
              '123453': 1000.00 
        },
        
        AGUA: { 
              '234561': 30.02, 
              '234562': 45.26, 
              '234563': 6000.00 
        },
        INTERNET: { 
              '345671': 80.03, 
              '345672': 100.27, 
              '345673': 1200.00 
        },
        TELEFONO: { 
              '456781': 40.04, 
              '456782': 60.28, 
              '456783': 8000.00 
        }
    };

    let monto = 0;

    // Asignar el nombre de usuario desde localStorage
    userName.textContent = localStorage.getItem('selectedCardUserName') || obtenerNombreUsuario();

    document.querySelector('h2').textContent = `PAGO DE ${nombreServicio.toUpperCase()}`;
    updateDateTime();
    setInterval(updateDateTime, 60000);

    function ingresarNPE(num) {
        const npeInput = document.getElementById("npeInput");
        if (npeInput.value.length < 6) {
            npeInput.value += num;
        }
    }

    function soloNumeros(event) {
        const key = event.key;
        return /^[0-9]$/.test(key);
    }

    function limitarNPE() {
        const npeInput = document.getElementById("npeInput");
        npeInput.value = npeInput.value.slice(0, 6);
    }

    function borrarUltimo() {
        const npeInput = document.getElementById("npeInput");
        npeInput.value = npeInput.value.slice(0, -1);
    }

    function borrarTodo() {
        document.getElementById("npeInput").value = "";
        document.getElementById("amountToPay").textContent = "$0.00";
        document.getElementById("confirmButton").disabled = true;
        document.getElementById("confirmButton").classList.add("btn-disabled");
    }

    function verificarNPE() {
        const npeInput = document.getElementById("npeInput").value;

        if (serviciosNPE[nombreServicio] && serviciosNPE[nombreServicio][npeInput] !== undefined) {
            monto = serviciosNPE[nombreServicio][npeInput];
            document.getElementById("amountToPay").textContent = `$${monto.toFixed(2)}`;

            const confirmButton = document.getElementById("confirmButton");
            confirmButton.disabled = false;
            confirmButton.classList.remove("btn-disabled");

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
            borrarTodo();
        }
    }

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
            showCancelButton: true,
            confirmButtonText: 'Imprimir ticket',
            cancelButtonText: 'Salir'
        }).then((result) => {
            if (result.isConfirmed) {
                imprimirTicket(nombreServicio, monto, saldoAnterior, nuevoSaldo);
            }
            borrarTodo();
        });
    }

    function imprimirTicket(servicio, monto, saldoAnterior, nuevoSaldo) {
        if (window.jspdf && window.jspdf.jsPDF) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Ticket de Pago", 20, 20);
            doc.setFontSize(12);
            doc.text(`Usuario: ${obtenerNombreUsuario()}`, 20, 30);
            doc.text(`Servicio: ${servicio}`, 20, 40);
            doc.text(`Monto Pagado: $${monto.toFixed(2)}`, 20, 50);
            doc.text(`Saldo Anterior: $${saldoAnterior.toFixed(2)}`, 20, 60);
            doc.text(`Saldo Actual: $${nuevoSaldo.toFixed(2)}`, 20, 70);

            const now = new Date();
            const fecha = now.toLocaleDateString();
            const hora = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            doc.text(`Fecha: ${fecha}`, 20, 80);
            doc.text(`Hora: ${hora}`, 20, 90);
            doc.text("Agencia San Salvador - POKEBANK tu mejor opción", 20, 110);
            doc.save(`Ticket_Pago_${servicio}.pdf`);
        } else {
            console.error("jsPDF no está disponible.");
        }
    }

    function updateDateTime() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('time').textContent = `${day} ${month}, ${hours}:${minutes}`;
    }

    function obtenerNombreUsuario() {
        const cardInfo = {
            0: 'Ash Ketchum',
            1: 'Lisandro Berdugo',
            2: 'Brock Harrison',
            3: 'Gary Oak',
            4: 'Team Rocket'
        };
        return cardInfo[selectedCardIndex] || "Usuario Desconocido";
    }

    function obtenerSaldo() {
        const saldo = localStorage.getItem(`saldo_${selectedCardIndex}`);
        if (saldo === null) {
            const usuario = usuarios[selectedCardIndex];
            localStorage.setItem(`saldo_${selectedCardIndex}`, usuario.saldoInicial.toFixed(2));
            return usuario.saldoInicial;
        }
        return parseFloat(saldo);
    }

    function realizarPagoServicio(cantidad) {
        let saldoActual = obtenerSaldo();
        saldoActual -= cantidad;
        localStorage.setItem(`saldo_${selectedCardIndex}`, saldoActual.toFixed(2));
    }

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
                borrarTodo();
                window.location.href = '../INICIO/inicio.html';
            }
        });
    };
});
