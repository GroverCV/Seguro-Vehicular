import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Inicio from "./menu/Inicio";
import Contacto from "./menu/Contacto";

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
  button: {
    margin: "5px",
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "1px solid white",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    flex: "1 0 100px", // Permitir que los botones crezcan y se ajusten
    textAlign: "center", // Centrar texto
  },
  content: {
    padding: "20px",
    backgroundColor: "#f4f4f4",
    color: "#333",
    marginTop: "20px",
  },
  searchBar: {
    padding: "5px",
    margin: "0 10px",
    border: "none",
    borderRadius: "4px",
  },
  cartButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
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
          style={styles.button}
          onClick={() => handleNavigation("/", "inicio")}
        >
          Inicio
        </button>
        <button
          style={styles.button}
          onClick={() => handleNavigation("/", "cotiza")}
        >
          Cotiza tu Poliza
        </button>
        <button
          style={styles.button}
          onClick={() => handleNavigation("/", "paga")}
        >
          Paga tu seguro
        </button>
        <button
          style={styles.button}
          onClick={() => handleNavigation("/", "contacto")}
        >
          Contacto
        </button>
      </div>

      <div style={styles.content}>
        {selectedButton === "inicio" && <Inicio />}
        {selectedButton === "contacto" && <Contacto />}
      </div>

      <Inicio />
    </div>
  );
};

export default Home;
