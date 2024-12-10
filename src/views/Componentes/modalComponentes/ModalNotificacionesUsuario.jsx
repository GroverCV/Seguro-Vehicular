import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";

const ModalNotificacionesUsuario = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [tiposNotificacion, setTiposNotificacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ip, setIp] = useState("");

  // Fetch notificaciones
  const fetchNotificaciones = async () => {
    try {
      const response = await api.get("/api/notificacion");
      setNotificaciones(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // Fetch tipos de notificación
  const fetchTiposNotificacion = async () => {
    try {
      const response = await api.get("/api/tipo_notificacion");
      setTiposNotificacion(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch IP address
  const fetchIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setIp(data.ip);
    } catch (error) {
      console.error("Error al obtener la IP:", error);
    }
  };

  // Registrar en Bitácora
  const registrarBitacora = async () => {
    const bitacoraEntry = {
      usuario_id: userId,
      accion: "Visitó Notificaciones",
      detalles: "Revisó notificaciones",
      ip: ip,
    };

    try {
      const response = await api.post("/api/bitacora", bitacoraEntry, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error("Error al registrar en bitácora");
      console.log("Registro en bitácora exitoso");
    } catch (error) {
      console.error("Error al registrar en bitácora:", error);
    }
  };

  useEffect(() => {
    fetchIp();
    fetchNotificaciones();
    fetchTiposNotificacion();
  }, []);

  useEffect(() => {
    if (ip) {
      registrarBitacora(); // Solo registra en bitácora después de obtener la IP
    }
  }, [ip]);

  // Obtener el userId desde localStorage
  const userId = parseInt(localStorage.getItem("user_id"), 10);

  // Filtrar las notificaciones por el userId
  const notificacionesFiltradas = notificaciones.filter(
    (notificacion) => notificacion.usuario_id === userId
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1>Notificaciones</h1>
      {notificacionesFiltradas.length > 0 ? (
        notificacionesFiltradas.map((notificacion, index) => {
          const tipoNotificacion = tiposNotificacion.find(
            (tipo) => tipo.id === notificacion.tipo_id
          );

          return (
            <div
              key={notificacion.id}
              style={{
                ...styles.card,
                ...(index % 2 === 0 ? styles.cardHover : {}),
              }}
            >
              <div style={styles.header}>
                <span style={styles.date}>
                  {new Date(notificacion.fechaEnvio).toLocaleDateString() ||
                    "No definida"}
                </span>
                <span style={styles.tipoNotificacion}>
                  {tipoNotificacion?.nombre || "No definido"}
                </span>
              </div>
              <p style={styles.descripcion}>
                {tipoNotificacion?.descripcion || "No definida"}
              </p>
            </div>
          );
        })
      ) : (
        <p>No tiene notificaciones</p>
      )}
    </div>
  );
};

export default ModalNotificacionesUsuario;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#f5f5f5",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    transition: "transform 0.3s ease",
  },
  cardHover: {
    transform: "scale(1.02)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  date: {
    fontSize: "0.9em",
    color: "#888",
  },
  tipoNotificacion: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "0.85em",
  },
  descripcion: {
    fontSize: "1em",
    lineHeight: "1.5",
    color: "#333",
  },
};
