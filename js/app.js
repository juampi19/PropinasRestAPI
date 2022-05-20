import { calcularSubtotal, crearMensaje, mensajePedidoVacio, MostrarSecciones, ocultarModal } from "./helpers/funciones.js";
import { obtenerPlatillos } from "./service/platillos.provider.js";

//VARIABLES
let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');

//EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    btnGuardarCliente.addEventListener('click', guardarCliente);
});


//FUNCIONES
function guardarCliente() {

    //Leer el contenido de los inputs
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios, some comprueba si almenos uno cumple con la condicion
    const camposVacios = [mesa, hora].some(campo => campo === '');

    if (camposVacios) {
        crearMensaje('Todos los campos son obligatorios');
        return;
    }

    //crear un objeto con los datos del cliente
    cliente = {
        ...cliente,
        mesa,
        hora
    }

    //ocultar modal
    ocultarModal();

    //MostrarSecciones
    MostrarSecciones();

    //Obtener platillo de la API
    obtenerPlatillos();

}


export function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const { id, nombre, precio, categoria } = platillo;

        //creamos el html para los platillos
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombrePlatillo = document.createElement('div');
        nombrePlatillo.classList.add('col-md-4');
        nombrePlatillo.textContent = nombre;

        const precioPlatillo = document.createElement('div');
        precioPlatillo.classList.add('col-md-3');
        precioPlatillo.textContent = `$${precio}`;

        const categoriaPlatillo = document.createElement('div');
        categoriaPlatillo.classList.add('col-md-3');
        categoriaPlatillo.textContent = categorias[categoria];

        //input para ingresar las cantidades
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.placeholder = 'Ingresa la cantidad de pedidos';
        inputCantidad.id = `producto-${id}`;
        inputCantidad.classList.add('form-control');

        //Funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = () => {
            const cantidad = parseInt(inputCantidad.value);
            //Creamos un nuevo objeto con el platillo y la cantidad juntos
            agregarPlatillo({ ...platillo, cantidad });

            //Limpiamos el html previo
            limpiarHtml();

            if( cliente.pedido.length ){
                //Mostrar resumen de los platillos
                actualizarResumen(); 
                return;
            }

            mensajePedidoVacio();
               
        }


        //contenedor del input
        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');

        agregar.appendChild(inputCantidad);

        row.appendChild(nombrePlatillo);
        row.appendChild(precioPlatillo);
        row.appendChild(categoriaPlatillo);
        row.appendChild(agregar);

        //Agregar el scripting al contenido principal
        contenido.appendChild(row);
    });

}

//Esta funcion se invoca cada vez que haga un cambio en el input de la cantidad
function agregarPlatillo(producto) {
    //Extraer el pedido actual, desde el cliente para no perder la referencia
    let { pedido } = cliente;

    //Revisamos que la cantidad sea mayor a cero
    if (producto.cantidad <= 0) {
        //Eliminamos el producto cuando este en cero
        const resultado = pedido.filter( articulo => articulo.id !== producto.id );

        cliente.pedido = [...resultado];
        return;
    }

    //comprobar que el pedido no exista con some
    const existe = pedido.some(articulo => articulo.id === producto.id);

    if (existe) {
        //Producto ya existe, actualizamos la cantidad con map
        const pedidoActualizado = pedido.map(articulo => {
            if (articulo.id === producto.id) {
                articulo.cantidad = producto.cantidad;
            }
            return articulo;
        });

        //reemplazamos el arreglo anterior por el nuevo arreglo
        cliente.pedido = [...pedidoActualizado];
        return;
    }


    //Agregamos el nuevo pedido al arreglo original con una copia del pedido anterior.
    cliente.pedido = [...pedido, producto];
    
}

function actualizarResumen() {
    
    const contenido = document.querySelector( '#resumen .contenido' );

    //Creamos el contenedor del resumen de pedidos
    const resumen = document.createElement( 'div' );
    resumen.classList.add( 'col-md-6', 'card', 'py-2', 'px-3', 'shadow', 'resumen-pedidos' );

    //Informacion de la mesa
    const mesa = document.createElement( 'p' );
    mesa.classList.add( 'fw-bold' );
    mesa.innerHTML = `Mesa: <span class="fw-light">${cliente.mesa}</span>`;

    //Informacion de la hora
    const hora = document.createElement( 'p' );
    hora.classList.add( 'fw-bold' );
    hora.innerHTML = `Hora: <span class="fw-light">${cliente.hora}</span>`;

    //Titulo de la sección
    const heading = document.createElement( 'h3' );
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add( 'my-4', 'text-center' );

    //Iterar sobre el array de pedidos
    const grupos = document.createElement( 'ul' );
    grupos.classList.add( 'list-group' );

    //Obtenemos el array de los pedidos
    const { pedido } = cliente;

    pedido.forEach( platillo => {
        const { cantidad, nombre, precio, id } = platillo;

        //Creamos el li
        const lista = document.createElement( 'li' );
        lista.classList.add( 'list-group-item' );

        const nombreEl = document.createElement( 'h4' );
        nombreEl.classList.add( 'my-4' );
        nombreEl.textContent = nombre;

        const cantidadEl = document.createElement( 'p' );
        cantidadEl.classList.add( 'fw-bold' );
        cantidadEl.innerHTML = `Cantidad: <span class="fw-light">${ cantidad }</span>`;

        const precioEl = document.createElement( 'p' );
        precioEl.classList.add( 'fw-bold' );
        precioEl.innerHTML = `Precio: <span class="fw-light">$${ precio }</span>`;

        //Subtotal del articulo
        const subtotalEl = document.createElement( 'p' );
        subtotalEl.classList.add( 'fw-bold' );
        subtotalEl.innerHTML = `Subtotal: <span class="fw-light">$${ calcularSubtotal( precio, cantidad ) }</span>`;

        //Boton para eliminar
        const bntEliminar = document.createElement( 'button' );
        bntEliminar.classList.add( 'btn', 'btn-danger' );
        bntEliminar.textContent = 'Eliminar Pedido';

        bntEliminar.onclick = () => {
            borrarPlatillo(id);
        }

        //Agregar los elementos al li
        lista.appendChild( nombreEl );
        lista.appendChild( cantidadEl );
        lista.appendChild( precioEl );
        lista.appendChild( subtotalEl );
        lista.appendChild( bntEliminar );

        //agregar lista al grupo principal
        grupos.appendChild( lista );
    } );

    //Agregar al contenedor del pedido
    resumen.appendChild( heading );
    resumen.appendChild( mesa );
    resumen.appendChild( hora );
    resumen.appendChild( grupos );

    

    contenido.appendChild( resumen );

    //Mostrar el formulario de propinas
    formularioPropinas();
    
}


//Funcion para limpiar el contenido previo.
function limpiarHtml() {
    const contenido = document.querySelector( '#resumen .contenido' );

    while( contenido.firstChild ) {
        contenido.removeChild( contenido.firstChild );
    }
}


//Borrar el platillo desde el resumen
function borrarPlatillo( id ) {
    cliente.pedido = cliente.pedido.filter( articulo => articulo.id !== id );

    //Limpiamos el html previo
    limpiarHtml();

    //Comprobamos que existan pedidos en el arreglo
    if( cliente.pedido.length ){
        //Mostrar resumen de los platillos
        actualizarResumen(); 
        return;
    }

    mensajePedidoVacio();

    //El producto se elimino regresamos los inputs a 0
    const productoEliminado = document.querySelector( `#producto-${ id }` );
    productoEliminado.value = 0;
}


function formularioPropinas() {
    const contenido = document.querySelector( '#resumen .contenido' );

    const formulario = document.createElement( 'div' );
    formulario.classList.add( 'col-md-6', 'formulario' );

    const divFormulario = document.createElement( 'div' );
    divFormulario.classList.add( 'card', 'py-2', 'px-3', 'shadow' );

    const heading = document.createElement( 'h3' );
    heading.classList.add( 'my-4', 'text-center' );
    heading.textContent = 'Propina';

    //radio button 10%
    const radio10 = document.createElement( 'input' );
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add( 'form-check-input' );
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement( 'label' );
    radio10Label.textContent = '10%';
    radio10Label.classList.add( 'form-check-label' );

    const radio10Div = document.createElement( 'div' );
    radio10Div.classList.add( 'form-check' );

    //Agregar los radios a los contenedores
    radio10Div.appendChild( radio10 );
    radio10Div.appendChild( radio10Label );

    //radio button 25%
    const radio25 = document.createElement( 'input' );
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add( 'form-check-input' );
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement( 'label' );
    radio25Label.textContent = '25%';
    radio25Label.classList.add( 'form-check-label' );

    const radio25Div = document.createElement( 'div' );
    radio25Div.classList.add( 'form-check' );

    //Agregar los radios a los contenedores
    radio25Div.appendChild( radio25 );
    radio25Div.appendChild( radio25Label );

    //radio button 50%
    const radio50 = document.createElement( 'input' );
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.classList.add( 'form-check-input' );
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement( 'label' );
    radio50Label.textContent = '50%';
    radio50Label.classList.add( 'form-check-label' );

    const radio50Div = document.createElement( 'div' );
    radio50Div.classList.add( 'form-check' );

    //Agregar los radios a los contenedores
    radio50Div.appendChild( radio50 );
    radio50Div.appendChild( radio50Label );


    //Agregar al div principal
    divFormulario.appendChild( heading );
    divFormulario.appendChild( radio10Div );
    divFormulario.appendChild( radio25Div );
    divFormulario.appendChild( radio50Div );
    formulario.appendChild( divFormulario );

    contenido.appendChild( formulario );
}


function calcularPropina() {
    const { pedido } = cliente;
    let subtotal = 0;

    //Calcular el subtotal a pagar
    pedido.forEach( articulo => {
        subtotal += articulo.cantidad * articulo.precio;

    } );

    //Seleccionar el radio buton con la propina correspondiente
    const propinaSeleccionada = document.querySelector( '[name="propina"]:checked' ).value;

    //Calcular la propina
    const propina = subtotal * ( parseInt(propinaSeleccionada) / 100 );

    //Calcular el total
    const total = subtotal + propina;

    mostrarTotalHtml( subtotal, total, propina );

}


//Funcion para mostrar el total a pagar con la propina
function mostrarTotalHtml( subtotal, total, propina ) {


    const formulario = document.querySelector( '.formulario > div' );
    
    //Contenedor de totales
    const divTotales = document.createElement( 'div' );
    divTotales.classList.add( 'total-pagar', 'my-5' );

    //Subtotal
    const subtotalParrafo = document.createElement( 'p' );
    subtotalParrafo.classList.add( 'fs-4', 'fw-bold', 'mt-2' );
    subtotalParrafo.innerHTML = `Subtotal Consumo: <span class="fw-normal">$${ subtotal }</span>`;

    //Propina
    const propinaParrafo = document.createElement( 'p' );
    propinaParrafo.classList.add( 'fs-4', 'fw-bold', 'mt-2' );
    propinaParrafo.innerHTML = `Propina Consumo: <span class="fw-normal">$${ propina }</span>`;

    //total
    const totalParrafo = document.createElement( 'p' );
    totalParrafo.classList.add( 'fs-4', 'fw-bold', 'mt-2' );
    totalParrafo.innerHTML = `Total Consumo: <span class="fw-normal">$${ total }</span>`;

    //Eliminar el ultimo resultado
    const totalPagarDiv = document.querySelector( '.total-pagar' );

    if( totalPagarDiv ) {
        totalPagarDiv.remove();
    }

    divTotales.appendChild( subtotalParrafo );
    divTotales.appendChild( propinaParrafo );
    divTotales.appendChild( totalParrafo );

    
    //Agregamos los totales al formulario
    formulario.appendChild( divTotales );
}