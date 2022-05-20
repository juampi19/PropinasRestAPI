//Funcion para crear un mensaje de alerta
export function crearMensaje( mensaje ) {
    const alerta = document.querySelector( 'div.alerta' );

    //Comprobamos que la alerta no exista para poder crearla
    if( !alerta ) {
        
        const alerta = document.createElement( 'div' );
        alerta.classList.add( 'invalid-feedback', 'd-block', 'text-center', 'alerta' );
        alerta.textContent = mensaje;

        //Agregamos al html
        document.querySelector( '.modal-body form' ).appendChild( alerta );

        setTimeout( ()=>{
            alerta.remove();
        }, 3000 );
    }
    
}

//Funcion para ocultar el modal
export function ocultarModal() {
    const modalFormulario = document.querySelector( '#formulario' );
    const modalBootstrap = bootstrap.Modal.getInstance( modalFormulario );
    modalBootstrap.hide();
}

//Funcion para mostrar las secciones ocultas
export function MostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll( '.d-none' );

    seccionesOcultas.forEach( seccion => seccion.classList.remove( 'd-none' ) );
}

//Calculando el subtotal
export function calcularSubtotal( precio, cantidad ) {
    return precio * cantidad;
}


//mensaje pedido vacio
export function mensajePedidoVacio() {
    const contenido = document.querySelector( '#resumen .contenido' );
    const texto = document.createElement( 'p' );
    texto.classList.add( 'text-center' );
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild( texto );
}