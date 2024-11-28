import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const GestionarTipoIncidente = () => {
  const [tiposIncidente, setTiposIncidente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTipoIncidente, setEditingTipoIncidente] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "activo",
  });

  const fetchTiposIncidente = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/tipo_incidente");
      setTiposIncidente(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposIncidente();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/tipo_incidente/${id}`);
      const tipoIncidente = response.data.data;

      setEditingTipoIncidente(tipoIncidente);
      setFormData(tipoIncidente);
      setShowForm(true);
    } catch (error) {
      console.error("Error al obtener los datos del tipo de incidente:", error);
    }
  };

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await api.delete(`/api/tipo_incidente/${id}`);
        setTiposIncidente(tiposIncidente.filter((tipo) => tipo.id !== id));
      } catch (error) {
        console.error("Error al eliminar el tipo de incidente:", error);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        const response = await api({
          method: editingTipoIncidente ? "put" : "post",
          url: editingTipoIncidente
            ? `/api/tipo_incidente/${editingTipoIncidente.id}`
            : "/api/tipo_incidente",
          data: formData,
        });

        const updatedTipoIncidente = response.data.data;

        setTiposIncidente((prev) =>
          editingTipoIncidente
            ? prev.map((tipo) =>
                tipo.id === updatedTipoIncidente.id ? updatedTipoIncidente : tipo
              )
            : [...prev, updatedTipoIncidente]
        );

        setFormData({
          nombre: "",
          descripcion: "",
          estado: "activo",
        });
        setEditingTipoIncidente(null);
        setShowForm(false);
      } catch (error) {
        console.error("Error al actualizar o crear el tipo de incidente:", error);
      }
    });
  };

  const handleCancel = () => {
    setEditingTipoIncidente(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR TIPO DE INCIDENTE</h1>
      <button style={styles.submitButton} onClick={() => setShowForm(true)}>
        Registrar Tipo de Incidente
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
          {tiposIncidente.map((tipo, index) => (
            <tr
              key={tipo.id}
              style={index % 2 === 0 ? styles.trEven : styles.trOdd}
            >
              <td style={styles.td}>{tipo.id}</td>
              <td style={styles.td}>{tipo.nombre}</td>
              <td style={styles.td}>{tipo.descripcion}</td>
              <td style={styles.td}>{tipo.estado}</td>
              <td style={styles.td}>
                <button
                  style={styles.button}
                  onClick={() => handleEdit(tipo.id)}
                >
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

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>{editingTipoIncidente ? "Editar" : "Registrar"} Tipo de Incidente</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  style={styles.input}
                  value={formData.nombre || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
              </label>

              <label>
                Descripción:
                <textarea
                  style={styles.input}
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
                  value={formData.estado || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>

              <button type="submit" style={styles.submitButton}>
                Guardar
              </button>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarTipoIncidente;

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
  cancelButton: {
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
