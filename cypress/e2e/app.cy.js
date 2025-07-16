// cypress/e2e/app.cy.js
describe('Pruebas de la Interfaz de Usuario', () => {
  beforeEach(() => {
    // Asegúrate de que el servidor backend esté corriendo en localhost:3000
    cy.visit('http://localhost:3000'); 
  });

  it('debería mostrar el mensaje del backend al cargar la página', () => {
    cy.get('#backend-message').should('contain', '¡Hola desde el backend del Fuerte de Libros!');
  });

  it('debería actualizar el mensaje del backend al hacer clic en el botón', () => {
    // Guarda el texto inicial
    cy.get('#backend-message').invoke('text').then((initialText) => {
      cy.get('#get-message-btn').click(); // Haz clic en el botón

      // Espera un poco para que la llamada a la API se complete
      cy.wait(500); 

      // El mensaje debería ser diferente (la hora debe haber cambiado)
      cy.get('#backend-message').invoke('text').should((newText) => {
        expect(newText).not.to.eq(initialText); // El nuevo texto no debe ser idéntico
        expect(newText).to.contain('¡Hola desde el backend del Fuerte de Libros! Son las'); // Pero debe contener la parte del saludo
      });
    });
  });
});