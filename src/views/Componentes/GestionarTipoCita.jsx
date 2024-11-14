import React, { useEffect, useState } from "react";
import { confirmAction } from "./modalComponentes/ModalConfirm";
import { api } from "../../api/axios";

const GestionarTipoCita = () => {
  const [tiposCita, setTiposCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTipoCita, setEditingTipoCita] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastTipoCita = currentPage * itemsPerPage;
  const indexOfFirstTipoCita = indexOfLastTipoCita - itemsPerPage;
  const currentTiposCita = tiposCita.slice(indexOfFirstTipoCita, indexOfLastTipoCita);
  const totalPages = Math.ceil(tiposCita.length / itemsPerPage);


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
      padding: "10px 15px",
      margin: "0 5px",
      cursor: "pointer",
      border: "1px solid #007bff",
      backgroundColor: "white",
      color: "#007bff",
    },
    activePageButton: {
      backgroundColor: "#007bff",
      color: "white",
    },
  };

  const handleEdit = (tipoCita) => {
    setEditingTipoCita(tipoCita);
    setFormData(tipoCita);
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
        await api.delete(`/api/tipo_cita/${id}`);
        setTiposCita(tiposCita.filter((tipo) => tipo.id !== id));
  
        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `el Usuario ID: ${userId} eliminó el Tipo Cita ID: ${id}`,
          ip: userIp,
        };
  
        await logAction(logData);
      } catch (error) {
        console.error("Error al eliminar el tipo de cita:", error);
      }
    });
  };
  
  const logAction = async (logData) => {
    const token = "simulated-token";
    try {
      await api.post("/api/bitacora", logData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
          method: editingTipoCita ? "put" : "post",
          url: editingTipoCita
            ? `/api/tipo_cita/${editingTipoCita.id}`
            : "/api/tipo_cita",
          data: formData,
        });
  
        const updatedTipoCita = response.data;
  
        setTiposCita((prev) =>
          editingTipoCita
            ? prev.map((tipo) =>
                tipo.id === updatedTipoCita.id ? updatedTipoCita : tipo
              )
            : [...prev, updatedTipoCita]
        );
  
        setFormData({});
        setEditingTipoCita(null);
        setShowForm(false);
  
        const userIp = await getUserIp();
  
        const logData = {
          usuario_id: userId,
          accion: editingTipoCita ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingTipoCita ? "editó" : "creó"
          } el Tipo Cita ID: ${
            editingTipoCita ? editingTipoCita.id : updatedTipoCita.id
          }`,
          ip: userIp,
        };
        fetchTiposCita();
        await logAction(logData);
      } catch (error) {
        console.error("Error al actualizar o crear el tipo de cita:", error);
      }
    });
  };
  
  

  const handleCancel = () => {
    setEditingTipoCita(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR TIPO CITA</h1>
      <button
        style={styles.submitButton}
        onClick={() => {
          setShowForm(true);
          setFormData({});
        }}
      >
        Crear Tipo Cita
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
          {currentTiposCita.map((tipoCita, index) => (
            <tr
              key={tipoCita.id}
              style={index % 2 === 0 ? styles.trEven : styles.trOdd}
            >
              <td style={styles.td}>{tipoCita.id}</td>
              <td style={styles.td}>{tipoCita.nombre}</td>
              <td style={styles.td}>{tipoCita.descripcion}</td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handleEdit(tipoCita)}>
                  Editar
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleDelete(tipoCita.id)}
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
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {showForm && (
        <>
          <div style={styles.overlay} onClick={handleCancel}></div>
          <div style={styles.modal}>
            <h2>{editingTipoCita ? "Editar Tipo Cita" : "Crear Tipo Cita"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                style={styles.input}
                placeholder="Nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              <input
                type="text"
                style={styles.input}
                placeholder="Descripción"
                value={formData.descripcion || ""}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              />
              <button type="submit" style={styles.submitButton}>
                {editingTipoCita ? "Actualizar" : "Crear"}
              </button>
              <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                Cancelar
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default GestionarTipoCita;