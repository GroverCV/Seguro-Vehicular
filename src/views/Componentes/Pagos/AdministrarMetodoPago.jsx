import React, { useEffect, useState } from "react";

import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const AdministrarMetodoPago = () => {
  const [metodosPago, setMetodosPago] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMetodoPago, setEditingMetodoPago] = useState(null);
  const [formData, setFormData] = useState({
    estado: "activo",
    configuracion_json: "{\"requiere_comprobante\":true}",
  });
  
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastMetodoPago = currentPage * itemsPerPage;
  const indexOfFirstMetodoPago = indexOfLastMetodoPago - itemsPerPage;
  const currentMetodosPago = Array.isArray(metodosPago)
    ? metodosPago.slice(indexOfFirstMetodoPago, indexOfLastMetodoPago)
    : [];
  const totalPages = Math.ceil(
    Array.isArray(metodosPago) ? metodosPago.length / itemsPerPage : 0
  );

  const fetchMetodosPago = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/metodo_pago");
      console.log(response.data.data);
      setMetodosPago(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetodosPago();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/metodo_pago/${id}`);
      const metodoPago = response.data.data;

      setEditingMetodoPago(metodoPago);
      setFormData(metodoPago);
      setShowForm(true);
      fetchMetodosPago();
    } catch (error) {
      console.error("Error al obtener los datos del metodo de pago:", error);
    }
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
        await api.delete(`/api/metodo_pago/${id}`);
        setMetodosPago(
          metodosPago.filter((metodo) => metodo.id !== id)
        );

        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó el Metodo Pago ID: ${id}`,
          ip: userIp,
        };
        fetchMetodosPago();
        await logAction(logData);
      } catch (error) {
        console.error("Error al eliminar el metodo de pago:", error);
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
          method: editingMetodoPago ? "put" : "post",
          url: editingMetodoPago
            ? `/api/metodo_pago/${editingMetodoPago.id}`
            : "/api/metodo_pago",
          data: formData,
        });

        const updatedMetodoPago = response.data.data;

        setMetodosPago((prev) =>
          editingMetodoPago
            ? prev.map((metodo) =>
                metodo.id === updatedMetodoPago.id
                  ? updatedMetodoPago
                  : metodo
              )
            : [...prev, updatedMetodoPago]
        );

        setFormData({
          estado: "activo", 
        });
        setEditingMetodoPago(null);
        setShowForm(false);

        const userIp = await getUserIp();

        const logData = {
          usuario_id: userId,
          accion: editingMetodoPago ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingMetodoPago ? "editó" : "creó"
          } el Metodo Pago ID: ${
            editingMetodoPago
              ? editingMetodoPago.id
              : updatedMetodoPago.id
          }`,
          ip: userIp,
        };
        fetchMetodosPago();
        await logAction(logData);
      } catch (error) {
        console.error("Error al actualizar o crear el metodo de pago:", error);
      }
    });
  };

  const handleCancel = () => {
    setEditingMetodoPago(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR METODO PAGO</h1>
      <button style={styles.submitButton} onClick={() => setShowForm(true)}>
        Crear Metodo Pago
      </button>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Descripción</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentMetodosPago.map((metodo_pago, index) => (
            <tr
              key={metodo_pago.id}
              style={index % 2 === 0 ? styles.trEven : styles.trOdd}
            >
              <td style={styles.td}>{metodo_pago.id}</td>
              <td style={styles.td}>{metodo_pago.nombre}</td>
              <td style={styles.td}>{metodo_pago.descripcion}</td>
              <td style={styles.td}>{metodo_pago.estado}</td>
              <td style={styles.td}>
                <button
                  style={styles.button}
                  onClick={() => handleEdit(metodo_pago.id)}
                >
                  Editar
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleDelete(metodo_pago.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.pagination}>
        {currentPage > 1 && (
          <button
            style={styles.pageButton}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </button>
        )}
        <span>
          Página {currentPage} de {totalPages}
        </span>
        {currentPage < totalPages && (
          <button
            style={styles.pageButton}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Siguiente
          </button>
        )}
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>{editingMetodoPago ? "Editar" : "Crear "} Metodo Pago</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nombre:
                <input
                  style={styles.input}
                  type="text"
                  value={formData.nombre || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
              </label>
              <label>
                Descripción:
                <input
                  style={styles.input}
                  type="text"
                  value={formData.descripcion || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                />
              </label>
              <label>
                Estado:
                <select
                  style={styles.input}
                  value={formData.estado || "Activo"}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </label>

              <label>
                Configuración JSON:
                <textarea
                  style={styles.input}
                  value={formData.configuracion_json || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      configuracion_json: e.target.value,
                    })
                  }
                />
              </label>

              <div>
                <button style={styles.submitButton} type="submit">
                  {editingMetodoPago ? "Actualizar" : "Crear"}
                </button>
                <button
                  style={styles.button}
                  type="button"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

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
      width: "700px",
      maxHeight: "80%",
      overflowY: "auto",
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
      minHeight: "40px",
      resize: "vertical",
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

export default AdministrarMetodoPago;
