//! Variables
const guardarClienteBtn = document.querySelector('#guardar-cliente');
guardarClienteBtn.addEventListener('click', guardarCliente);

let cliente = {
    mesa: '',
    hora: '',
    pedido: [],
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres',
}


//! Funciones
function guardarCliente() {

    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;
    const camposVacios = [mesa, hora].some(campo => campo === '');

    if (camposVacios) {
        const existeError = document.querySelector('.invalid-feedback');

        if (!existeError) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Llene los campos correctamente';
            document.querySelector('.modal-body').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 2000);
        }
        return;
    }

    //* Asignar datos del formulario a 'cliente'
    cliente = { ...cliente, mesa, hora };

    //* Ocultar Modal (Codigo de Bootstrap)
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    // Mostrar las secciones
    mostrarSecciones();

    // Consultar la API para obtener los platos(json local)
    obtenerPlatos();
}


function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    /**
     * Como hay varios elementos con la misma clase uso 'querySelectorAll' y 'seccionesOcultas'
     * se convierte en un arreglo
     */
    seccionesOcultas.forEach(secciones => secciones.classList.remove('d-none'));
}

function obtenerPlatos() {
    const url = 'data/db.json';

    fetch(url)
        .then(answer => answer.json())
        .then(datos => mostrarPlatos(datos.platillos))
        .catch(error => console.log(error))
}

function mostrarPlatos(platillos = []) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platos => {

        const row = document.createElement('DIV');
        row.classList.add('row', 'py-2', 'border-top');

        // Mostrar nombre de los platos
        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platos.nombre;

        // Mostrar precio de los platos
        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$ ${platos.precio}`;

        // Mostrar categoria de los platos
        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platos.categoria];

        // Input de numero para las cantidades de Platos
        const cantidadInput = document.createElement('INPUT');
        cantidadInput.type = 'number';
        cantidadInput.min = 0;
        cantidadInput.value = 0;
        cantidadInput.id = `producto-${platos.id}`;
        cantidadInput.classList.add('form-control');
        // Funcion que detecta la cantidad y el plato que se esta agregando
        cantidadInput.onchange = () => {
            const cantidad = parseInt(cantidadInput.value);
            agregarPlato({ ...platos, cantidad });
        };

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2', 'py-3');
        agregar.appendChild(cantidadInput);


        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    });
}

function agregarPlato(producto) { // 'poducto' contiene los datos del pedido actual y la cantidad

    let { pedido } = cliente;

    // Revisar que la cantidad sea mayor que cero
    if (producto.cantidad > 0) {

        //Comprueba que el elemento existe en el arreglo
        if (pedido.some(pedidoX => pedidoX.id === producto.id)) {

            const pedidoActualizado = pedido.map(pedidoX => {
                // Actualizar la cantidad
                if (pedidoX.id === producto.id) {
                    pedidoX.cantidad = producto.cantidad;
                }
                return pedidoX;
            });

            cliente.pedido = [...pedidoActualizado]; // Se asigna el nuevo array a 'cliente.pedido'
        } else {

            cliente.pedido = [...pedido, producto]; // El pedido no existe, se agrega al arreglo de 'pedido'
        }

    } else {
        const resultado = pedido.filter(elementoX => elementoX.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    limpiarHTML();

    if (cliente.pedido.length) {
        // Mostrar el Resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }
}

function actualizarResumen() {

    const contenido = document.querySelector('#resumen .contenido');


    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    // Titulo de la Seccion
    const heading = document.createElement('H3');
    heading.textContent = 'Platos Consumidos: ';
    heading.classList.add('fw-bold', 'text-center');

    const headingSpan = document.createElement('SPAN');
    headingSpan.textContent = cliente.pedido.nombre;
    headingSpan.classList.add('fw-normal');

    // Iterar sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;

    pedido.forEach(pedidoX => {
        const { nombre, cantidad, precio, id } = pedidoX;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('text-center', 'my-4');
        nombreEl.textContent = nombre;

        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';


        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';


        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        // Botón para Eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar Pedido';

        // Funcion para eliminar ese contenido
        btnEliminar.onclick = function () {
            eliminarProducto(id);
        }

        // Agregar los Labels a sus contenedores
        cantidadEl.appendChild(cantidadValor)
        precioEl.appendChild(precioValor)
        subtotalEl.appendChild(subtotalValor);


        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        grupo.appendChild(lista);

    })

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);
    hora.appendChild(headingSpan);

    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    // Mostrar Formulario de Propinas
    formularioPropinas();
}


function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio, cantidad) {
    return `$${precio * cantidad}`;
}

function eliminarProducto(id) {
    const { pedido } = cliente;
    const resultado = pedido.filter(elementoX => elementoX.id !== id);
    cliente.pedido = [...resultado];

    limpiarHTML();

    if (cliente.pedido.length) {
        // Mostrar el Resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    // El pedido que se elimine hay que hacer cero su cantidad
    const productoEliminado = `#producto-${id}`;

    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos al pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina:';

    // Radio Button 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = () => { calcularPropina(radio10.value) };

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('from-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    // Radio Button 20%
    const radio20 = document.createElement('INPUT');
    radio20.type = 'radio';
    radio20.name = 'propina';
    radio20.value = '20';
    radio20.classList.add('form-check-input');
    radio20.onclick = () => { calcularPropina(radio20.value) };

    const radio20Label = document.createElement('LABEL');
    radio20Label.textContent = '20%';
    radio20Label.classList.add('form-check-label');

    const radio20Div = document.createElement('DIV');
    radio20Div.classList.add('from-check');

    radio20Div.appendChild(radio20);
    radio20Div.appendChild(radio20Label);

    // Radio Button 40%
    const radio40 = document.createElement('INPUT');
    radio40.type = 'radio';
    radio40.name = 'propina';
    radio40.value = '40';
    radio40.classList.add('form-check-input');
    radio40.onclick = () => { calcularPropina(radio40.value) };

    const radio40Label = document.createElement('LABEL');
    radio40Label.textContent = '40%';
    radio40Label.classList.add('form-check-label');

    const radio40Div = document.createElement('DIV');
    radio40Div.classList.add('from-check');

    radio40Div.appendChild(radio40);
    radio40Div.appendChild(radio40Label);


    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio20Div);
    divFormulario.appendChild(radio40Div);

    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);
}

function calcularPropina(valor) {
    let subtotal = 0;
    const { pedido } = cliente;

    pedido.forEach(pedidoX => {
        subtotal += pedidoX.cantidad * pedidoX.precio;
    })

    const propina = subtotal * parseInt(valor) / 100;
    const total = subtotal + propina;

    mostrarTotalHTML(subtotal, total, propina);
}

function mostrarTotalHTML(subtotal, total, propina) {

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar');



    // Subtotal
    const subtotalText = document.createElement('P');
    subtotalText.classList.add('fs-3', 'fw-bold', 'mt-2');
    subtotalText.textContent = 'Subtotal Consumo:';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal', 'mx-2');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalText.appendChild(subtotalSpan);

    // Propina
    const propinaText = document.createElement('P');
    propinaText.classList.add('fs-3', 'fw-bold', 'mt-2');
    propinaText.textContent = 'Propina:';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal', 'mx-2');
    propinaSpan.textContent = `$${propina}`;

    propinaText.appendChild(propinaSpan);

    // Total a Pagar
    const totalText = document.createElement('P');
    totalText.classList.add('fs-3', 'fw-bold', 'mt-2');
    totalText.textContent = 'Total a Pagar:';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal', 'mx-2');
    totalSpan.textContent = `$${total}`;

    totalText.appendChild(totalSpan);

    // Eliminar el ultimo resultado
    const totalPagarDiv = document.querySelector('.total-pagar');

    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalText);
    divTotales.appendChild(propinaText);
    divTotales.appendChild(totalText);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}