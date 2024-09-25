import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  button: {
    backgroundColor: "#f44336", // Color rojo
    color: "white",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "5px", // Bordes redondeados
    transition: "background-color 0.3s, transform 0.3s", // Efecto de transición
    marginLeft: "10px", // Espacio entre el nombre y el botón
  },
  buttonHover: {
    backgroundColor: "#d32f2f", // Color más oscuro al pasar el mouse
    transform: "scale(1.05)", // Aumentar tamaño ligeramente
  }
};

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        // Redirigir al usuario a la página de inicio de sesión
        navigate('/login', { replace: true });
    };

    return (
        <button 
          style={styles.button} 
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          onClick={handleLogout}
        >
            Cerrar Sesión
        </button>
    );
};

export default Logout;
