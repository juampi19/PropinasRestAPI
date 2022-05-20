import { mostrarPlatillos } from "../app.js";

//Funcion para poder obtener los platillos de la API
export async function obtenerPlatillos() {
    const urlPlatillos = 'http://localhost:4000/platillos';

    try {
        const respuesta = await fetch(urlPlatillos);
        const resultado = await respuesta.json()

        mostrarPlatillos(resultado);

    } catch (error) {
        throw error;
    }
}