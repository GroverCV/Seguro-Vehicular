import React, { useState } from "react";
import { FaBell, FaCalendarAlt, FaHome, FaInfoCircle, FaPhone, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Calendario from "./menu/Calendario";
import Contacto from "./menu/Contacto";
import Informacion from "./menu/Informacion";
import Inicio from "./menu/Inicio";
import Notificaciones from "./menu/Notificaciones";
import Poliza from "./menu/Poliza";

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#333",
    color: "white",
    flexWrap: "wrap", // Permitir que los botones se envuelvan
  },
  iconButton: {
    margin: "5px",
    padding: "10px",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column", // Para alinear el icono y el texto verticalmente
    alignItems: "center", // Centrar el contenido horizontalmente
  },
  icon: {
    fontSize: "40px", // Tamaño del icono
  },
  label: {
    marginTop: "5px",
    fontSize: "16px", // Tamaño del texto debajo del icono
  },
  content: {
    padding: "20px",
    backgroundColor: "#f4f4f4",
    color: "#333",
    marginTop: "20px",
  },
};

export const Home = () => {
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState(null);

  const handleNavigation = (path, button) => {
    setSelectedButton(button);
    navigate(path);
  };

  return (
    <div>
      <div style={styles.container}>
        <button
          style={styles.iconButton}
          onClick={() => handleNavigation("/", "inicio")}
        >
          <FaHome style={styles.icon} />
          <span style={styles.label}>Inicio</span>
        </button>
        <button
          style={styles.iconButton}
          onClick={() => handleNavigation("/", "informacion")}
        >
          <FaInfoCircle style={styles.icon} />
          <span style={styles.label}>Información</span>
        </button>
        <button
          style={styles.iconButton}
          onClick={() => handleNavigation("/", "poliza")}
        >
          <FaShieldAlt style={styles.icon} />
          <span style={styles.label}>Paga tu seguro</span>
        </button>
        <button
          style={styles.iconButton}
          onClick={() => handleNavigation("/", "calendario")}
        >
          <FaCalendarAlt style={styles.icon} />
          <span style={styles.label}>Calendario</span>
        </button>
        <button
          style={styles.iconButton}
          onClick={() => handleNavigation("/", "contacto")}
        >
          <FaPhone style={styles.icon} />
          <span style={styles.label}>Contacto</span>
        </button>
        <button
          style={styles.iconButton}
          onClick={() => handleNavigation("/", "notificaciones")}
        >
          <FaBell style={styles.icon} />
          <span style={styles.label}>Notificaciones</span>
        </button>
      </div>

      <div style={styles.content}>
        {selectedButton === "inicio" && <Inicio />}
        {selectedButton === "contacto" && <Contacto />}
        {selectedButton === "informacion" && <Informacion />}
        {selectedButton === "poliza" && <Poliza />}
        {selectedButton === "calendario" && <Calendario />}
        {selectedButton === "notificaciones" && <Notificaciones />}
      </div>
    </div>
  );
};

export default Home;
