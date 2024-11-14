import React, { useEffect, useState } from "react";
import { confirmAction } from "./modalComponentes/ModalConfirm";
import { api } from "../../api/axios";

const GestionarTipoNotificacion = () => {
  const [tiposNotificacion, setTiposNotificacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTipoNotificacion, setEditingTipoNotificacion] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastTipo = currentPage * itemsPerPage;
  const indexOfFirstTipo = indexOfLastTipo - itemsPerPage;
  const currentTipos = tiposNotificacion.slice(indexOfFirstTipo, indexOfLastTipo);
  const totalPages = Math.ceil(tiposNotificacion.length / itemsPerPage);
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   const fetchTiposNotificacion = async () => {
    try {
      const response = await api.get("/api/tipo_notificacion");
      setTiposNotificacion(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTiposNotificacion();
  }, []);

  const styles = {
    body: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      margin: 0,
      padding: "20px",
    },
    h1: {
      textAlign: "center",
      color: "#333",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    th: {
      padding: "12px 15px",
      textAlign: "left",
      borderBottom: "1px solid #ddd",
      backgroundColor: "#007bff",
      color: "white",
    },
    td: {
      padding: "12px 15px",
      textAlign: "left",
      borderBottom: "1px solid #ddd",
    },
    trEven: {
      backgroundColor: "#f9f9f9",
    },
    trOdd: {
      backgroundColor: "#ffffff",
    },
    button: {
      marginRight: "10px",
      padding: "5px 10px",
      cursor: "pointer",
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      width: "700px", // Aumentar el ancho del modal
      maxHeight: "80%", // Limitar la altura máxima
      overflowY: "auto", // Hacer scroll si es necesario
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      borderRadius: "4px",
      border: "1px solid #ccc",
      minHeight: "40px", // Altura mínima
      resize: "vertical", // Permitir redimensionar verticalmente
    },
    submitButton: {
      padding: "10px 15px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
    },
    pageButton: {
      margin: "0 5px",
      padding: "5px 10px",
      cursor: "pointer",
      border: "1px solid #007bff",
      borderRadius: "4px",
      backgroundColor: "#007bff",
      color: "white",
    },
    activePageButton: {
      backgroundColor: "#0056b3",
    },
  };

  const handleEdit = (tipoNotificacion) => {
    setEditingTipoNotificacion(tipoNotificacion);
    setFormData(tipoNotificacion);
    setShowForm(true);
  };

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

  const userId = localStorage.getItem("userId");

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await api.delete(`/api/tipo_notificacion/${id}`);
        setTiposNotificacion(tiposNotificacion.filter((tipo) => tipo.id !== id));
  
        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `el Usuario ID: ${userId} eliminó el Tipo Notificacion ID: ${id}`,
          ip: userIp,
        };
  
        await logAction(logData);
      } catch (error) {
        console.error("Error al eliminar el tipo de notificación:", error);
      }
    });
  };
  
  const logAction = async (logData) => {
    const token = "simulated-token";
    try {
      await api.post(
        "/api/bitacora",
        logData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error al registrar la acción en la bitácora.");
      console.error("Error al registrar la acción:", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        const response = await api({
          method: editingTipoNotificacion ? "PUT" : "POST",
          url: editingTipoNotificacion
            ? `/api/tipo_notificacion/${editingTipoNotificacion.id}`
            : "/api/tipo_notificacion",
          headers: {
            "Content-Type": "application/json",
          },
          data: formData,
        });
  
        const updatedTipoNotificacion = response.data;
  
        setTiposNotificacion((prev) =>
          editingTipoNotificacion
            ? prev.map((tipo) =>
                tipo.id === updatedTipoNotificacion.id
                  ? updatedTipoNotificacion
                  : tipo
              )
            : [...prev, updatedTipoNotificacion]
        );
  
        setFormData({});
        setEditingTipoNotificacion(null);
        setShowForm(false);
  
        const userIp = await getUserIp();
  
        const logData = {
          usuario_id: userId,
          accion: editingTipoNotificacion ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingTipoNotificacion ? "editó" : "creó"
          } el Tipo Notificación ID: ${
            editingTipoNotificacion
              ? editingTipoNotificacion.id
              : updatedTipoNotificacion.id
          }`,
          ip: userIp,
        };
  
        fetchTiposNotificacion();
        await logAction(logData);
      } catch (error) {
        console.error(
          "Error al actualizar o crear el tipo de notificación:",
          error
        );
      }
    });
  };

  const handleCancel = () => {
    setEditingTipoNotificacion(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR TIPO NOTIFICACION</h1>
      <button
        style={styles.submitButton}
        onClick={() => {
          setShowForm(true);
          setFormData({});
        }}
      >
        Crear Tipo Notificación
      </button>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Descripción</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentTipos.map((tipo, index) => (
            <tr
              key={tipo.id}
              style={index % 2 === 0 ? styles.trEven : styles.trOdd}
            >
              <td style={styles.td}>{tipo.id}</td>
              <td style={styles.td}>{tipo.nombre}</td>
              <td style={styles.td}>{tipo.descripcion}</td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handleEdit(tipo)}>
                  Editar
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleDelete(tipo.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            style={{
              ...styles.pageButton,
              ...(currentPage === index + 1 ? styles.activePageButton : {}),
            }}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {showForm && (
        <>
          <div style={styles.overlay} onClick={handleCancel} />
          <div style={styles.modal}>
            <h2>
              {editingTipoNotificacion ? "Editar" : "Crear"} Tipo Notificación
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                style={styles.input}
              />
              <textarea
                placeholder="Descripción"
                value={formData.descripcion || ""}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                style={styles.input}
              />
              <button style={styles.submitButton} type="submit">
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  ...styles.submitButton,
                  backgroundColor: "red",
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default GestionarTipoNotificacion;
