// frontend/public/script.js
console.log('¡El script del frontend está cargado!');

const backendMessageElement = document.getElementById('backend-message');
const getMessageButton = document.getElementById('get-message-btn'); // Obtenemos el botón

async function getMessageFromBackend() {
    try {
        const response = await fetch('/api/saludo');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        backendMessageElement.textContent = data.message;
    } catch (error) {
        console.error('Error al obtener el saludo del backend:', error);
        backendMessageElement.textContent = 'Error al conectar con el servidor.';
    }
}

// Ejecuta la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    getMessageFromBackend(); // Llama a la función
    // Asigna el evento click al botón solo cuando el DOM esté cargado
    if (getMessageButton) { // Asegurarse de que el botón existe
        getMessageButton.addEventListener('click', getMessageFromBackend);
    } else {
        console.warn('Botón con ID "get-message-btn" no encontrado.');
    }
});