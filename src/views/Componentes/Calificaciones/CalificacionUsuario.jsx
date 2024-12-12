import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const CalificacionUsuario = () => {
  const [tiposCita, setTiposCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTipoCita, setEditingTipoCita] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  const fetchTiposCita = async () => {
    try {
      const response = await api.get("/api/tipo_cita");
      const filteredData = response.data
        .filter((tipoCita) => tipoCita.descripcion > 0)
        .sort((a, b) => b.id - a.id); // Orden descendente
      setTiposCita(filteredData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposCita();
  }, []);

  const handleEdit = (tipoCita) => {
    setEditingTipoCita(tipoCita);
    setFormData(tipoCita);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await api.delete(`/api/tipo_cita/${id}`);
        setTiposCita(tiposCita.filter((tipo) => tipo.id !== id));
      } catch (error) {
        console.error("Error al eliminar el tipo de cita:", error);
      }
    });
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
        fetchTiposCita();
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
      <h1 style={styles.h1}>
        Da tu opinion, ayudanos a dar un mejor el servicio
      </h1>
      <button
        style={styles.submitButton}
        onClick={() => {
          setShowForm(true);
          setFormData({});
        }}
      >
        Agrega un Comentario
      </button>

      <div style={styles.cardContainer}>
        {tiposCita.map((tipoCita) => (
          <div key={tipoCita.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{tipoCita.nombre}</h3>
            <p style={styles.cardDescription}>
              {"★".repeat(tipoCita.descripcion)}
            </p>
            <div style={styles.cardActions}></div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>{editingTipoCita ? "Editar Tipo Cita" : "Crear Tipo Cita"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                style={styles.input}
                placeholder="Nombre"
                value={formData.nombre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
              <select
                style={styles.input}
                value={formData.descripcion || ""}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                required
              >
                <option value="">Selecciona una calificación</option>
                <option value="1">★</option>
                <option value="2">★★</option>
                <option value="3">★★★</option>
                <option value="4">★★★★</option>
                <option value="5">★★★★★</option>
              </select>
              <div style={styles.formActions}>
                <button type="submit" style={styles.submitButton}>
                  {editingTipoCita ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={styles.cancelButton}
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

export default CalificacionUsuario;
const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  h1: {
    textAlign: "center",
    color: "#333",
  },
  submitButton: {
    display: "block",
    margin: "20px auto",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    padding: "15px",
    width: "250px",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  cardDescription: {
    margin: "10px 0",
    color: "#888",
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-around",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
  },
  input: {
    display: "block",
    width: "100%",
    margin: "10px 0",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  formActions: {
    display: "flex",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "gray",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
