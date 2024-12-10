import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { FaStar } from "react-icons/fa"; // Para las estrellas

const CalificacionGeneral = () => {
  const [tiposCita, setTiposCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchTiposCita = async () => {
    try {
      const response = await api.get("/api/tipo_cita");
      setTiposCita(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposCita();
  }, []);

  // Calcular el promedio de las estrellas solo de las descripciones con estrellas
const calcularPromedio = () => {
    const descripcionesConEstrellas = tiposCita.filter((tipo) => tipo.descripcion > 0); // Filtrar solo las calificaciones mayores a 0
  
    if (descripcionesConEstrellas.length === 0) return 0; // Si no hay descripciones válidas, retornar 0
  
    const totalEstrellas = descripcionesConEstrellas.reduce(
      (sum, tipo) => sum + tipo.descripcion,
      0
    );
  
    return (totalEstrellas / descripcionesConEstrellas.length).toFixed(2); // Calcular el promedio
  };
  

  // Calcular las estadísticas de las calificaciones
  const obtenerEstadisticas = () => {
    const estadisticas = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    tiposCita.forEach((tipo) => {
      estadisticas[tipo.descripcion]++;
    });

    return estadisticas;
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const estadisticas = obtenerEstadisticas();
  const promedio = calcularPromedio();

  // Función para determinar el color de las estrellas basado en el promedio
  const obtenerColorEstrella = (rating) => {
    if (rating <= promedio) return "#FFD700"; // Oro si la calificación es menor o igual al promedio
    return "#D3D3D3"; // Gris si la calificación es mayor al promedio
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>CALIFICACIÓN GENERAL</h1>

      <div style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            style={{
              fontSize: "100px",
              color: obtenerColorEstrella(star),
              margin: "0 10px",
            }}
          />
        ))}
      </div>

      <div style={styles.statsContainer}>
        <h2>Promedio de Calificaciones: {promedio} ★</h2>
        <div style={styles.statsBox}>
          <h3>Estadísticas de Calificaciones:</h3>
          <ul>
            <li>1 estrella: {estadisticas[1]} comentarios</li>
            <li>2 estrellas: {estadisticas[2]} comentarios</li>
            <li>3 estrellas: {estadisticas[3]} comentarios</li>
            <li>4 estrellas: {estadisticas[4]} comentarios</li>
            <li>5 estrellas: {estadisticas[5]} comentarios</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalificacionGeneral;

const styles = {
    body: {
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      backgroundColor: "linear-gradient(45deg, #FF6F61, #FFDD44)",
      margin: 0,
      padding: "20px",
      color: "#FFFFFF",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
    },
    h1: {
      textAlign: "center",
      color: "#FFFFFF",
      fontSize: "3rem",
      background: "linear-gradient(to right, #FFDD44, #FF6F61)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    statsContainer: {
      textAlign: "center",
      marginBottom: "20px",
      padding: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
    },
    statsBox: {
      padding: "20px",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      color: "#FFDD44",
      borderRadius: "8px",
      margin: "10px auto",
      boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)",
    },
    submitButton: {
      padding: "12px 20px",
      backgroundColor: "#28A745",
      color: "#FFFFFF",
      fontSize: "1.2rem",
      border: "none",
      borderRadius: "30px",
      cursor: "pointer",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      transition: "all 0.3s ease-in-out",
    },
    input: {
      width: "90%",
      padding: "10px",
      margin: "10px auto",
      borderRadius: "15px",
      border: "2px solid #FF6F61",
      fontSize: "1rem",
      boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.2)",
      color: "#FF6F61",
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#FFFFFF",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)",
      zIndex: 1000,
      width: "80%",
      maxHeight: "90%",
      overflowY: "auto",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: 999,
    },
    cancelButton: {
      marginTop: "10px",
      padding: "12px 20px",
      backgroundColor: "#DC3545",
      color: "#FFFFFF",
      fontSize: "1rem",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      transition: "all 0.3s ease-in-out",
    },
    starsContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      gap: "10px",
    },
  };
  
