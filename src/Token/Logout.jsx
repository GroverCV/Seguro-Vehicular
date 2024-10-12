import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  },
};

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Estado para manejar el cierre de sesión
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true); // Cambiar estado al iniciar el cierre de sesión
    const token = localStorage.getItem("token");
    const userId = 1; // Reemplaza con el ID real del usuario

    // Obtener la IP del usuario
    const getUserIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error("Error obteniendo IP:", error);
        return "IP desconocida";
      }
    };

    const userIp = await getUserIp();

    // Datos a enviar a la bitácora
    const logData = {
      usuario_id: userId,
      accion: "Cerró Sesión",
      detalles: "Salida del Sistema",
      ip: userIp,
    };

    try {
      // Enviar la acción de cierre de sesión a la bitácora
      await fetch("https://backend-seguros.campozanodevlab.com/api/bitacora", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(logData),
      });

      // Eliminar el token del localStorage
      localStorage.removeItem("token");

      // Redirigir al usuario a la página de inicio de sesión
      navigate("/login", { replace: true });

      // Recargar la página
      window.location.reload(); // O también puedes usar: window.location.href = window.location.href
    } catch (error) {
      console.error("Error al registrar en la bitácora:", error);
      setIsLoggingOut(false); // Resetear el estado en caso de error
    }
  };



  return (
    <button
      style={styles.button}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)
      }
      onClick={handleLogout}
      disabled={isLoggingOut} // Deshabilitar el botón mientras se realiza el cierre de sesión
    >
      {isLoggingOut ? "Cerrando Sesión..." : "Cerrar Sesión"}
    </button>
  );
};

export default Logout;
