import React from 'react';

export default function Poliza() {
  const handleLinkClick = (url) => {
    window.location.href = url;
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Selecciona una opción:</h2>
        <form>
          <button
            type="button"
            onClick={() =>
              handleLinkClick('https://buy.stripe.com/test_7sIdSV7ve6rs4OQ8wy')
            }
            style={styles.button}
          >
            Paga tu Prima de Seguro
          </button>
          <button
            type="button"
            onClick={() =>
              handleLinkClick('https://buy.stripe.com/test_3cs2adeXG7vw2GI8wx')
            }
            style={styles.button}
          >
            Reactiva tu Poliza
          </button>
          <button
            type="button"
            onClick={() =>
              handleLinkClick('https://buy.stripe.com/test_aEUg13dTCdTU4OQfZ2')
            }
            style={styles.button}
          >
            Paga tu primera Couta
          </button>
          <button
            type="button"
            onClick={() =>
              handleLinkClick('https://buy.stripe.com/test_bIY7ux7veg22gxy28b')
            }
            style={styles.button}
          >
            Paga tu 2 Couta
          </button>
          <button
            type="button"
            onClick={() =>
              handleLinkClick('https://buy.stripe.com/test_dR62ad2aUeXY5SU6ot')
            }
            style={styles.button}
          >
            Paga tu tercera Couta
          </button>
          <button
            type="button"
            onClick={() =>
              handleLinkClick('https://buy.stripe.com/test_bIY2adg1K4jkepq28e')
            }
            style={styles.button}
          >
            Paga tu Cuarta Cuota
          </button>
        </form>
      </div>
    </div>
  );
}

// Estilos en JavaScript (CSS normal)
const styles = {
  container: {
    display: 'block', // Cambiado a 'block' para que no esté centrado
    backgroundColor: '#f7fafc', // Color de fondo
    padding: '2rem', // Un poco de padding en el contenedor
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px', // Ancho máximo para el formulario
    margin: '0 auto', // Centrando horizontalmente, pero no verticalmente
  },
  header: {
    fontSize: '1.5rem',
    fontWeight: '600',
    textAlign: 'left', // Alineación a la izquierda en lugar de centro
    color: '#2d3748',
    marginBottom: '1.5rem',
  },
  button: {
    backgroundColor: '#4299e1', // Color del botón
    color: '#fff',
    padding: '1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
