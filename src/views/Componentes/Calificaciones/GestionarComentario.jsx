import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const GestionarComentario = () => {
  const [tiposCita, setTiposCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTipoCita, setEditingTipoCita] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedComments, setSelectedComments] = useState([]); // Estado para comentarios seleccionados

  const indexOfLastTipoCita = currentPage * itemsPerPage;
  const indexOfFirstTipoCita = indexOfLastTipoCita - itemsPerPage;
  const currentTiposCita = tiposCita
    .filter((tipoCita) => tipoCita.descripcion > 0) // Filtra solo las descripciones con estrellas
    .slice(indexOfFirstTipoCita, indexOfLastTipoCita);

  const totalPages = Math.ceil(tiposCita.length / itemsPerPage);

  const fetchTiposCita = async () => {
    try {
      const response = await api.get("/api/tipo_cita");
      // Filtramos los tipos de cita que no contienen "666"
      const tiposCitaFiltrados = response.data.filter(
        (tipoCita) => !tipoCita.nombre.includes("666")
      );
      setTiposCita(tiposCitaFiltrados); // Actualizamos el estado con los tipos de cita filtrados
      fetchTiposCita();
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

  const handleSelectComment = async (id) => {
    setSelectedComments((prevSelected) => {
      const isSelected = prevSelected.includes(id);
      const updatedSelected = isSelected
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id];

      // Actualizar el comentario en la base de datos
      updateCommentWith666(id, !isSelected);

      return updatedSelected;
    });
  };

  const updateCommentWith666 = async (id, add666) => {
    try {
      const updatedTipoCita = tiposCita.find((tipoCita) => tipoCita.id === id);
      if (!updatedTipoCita) return;

      if (add666) {
        // Verificamos si el comentario ya tiene "666" antes de agregarlo
        if (!updatedTipoCita.nombre.includes("666")) {
          updatedTipoCita.nombre = `${updatedTipoCita.nombre} 666`; // Agregar "666"
        }
      } else {
        // Eliminar solo "666" si existe
        updatedTipoCita.nombre = updatedTipoCita.nombre.replace(" 666", ""); // Eliminar "666"
      }

      // Actualizar en la base de datos
      await api.put(`/api/tipo_cita/${updatedTipoCita.id}`, updatedTipoCita);

      // Actualizar el estado local
      setTiposCita((prev) =>
        prev.map((tipoCita) =>
          tipoCita.id === updatedTipoCita.id ? updatedTipoCita : tipoCita
        )
      );
    } catch (error) {
      console.error("Error al actualizar el comentario:", error);
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
        fetchTiposCita();
      } catch (error) {
        console.error("Error al actualizar o crear el tipo de cita:", error);
        fetchTiposCita();
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
      <h1 style={styles.h1}>ADMINISTRAR COMENTARIOS</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Comentario</th>
            <th style={styles.th}>Calificación</th>
            <th style={styles.th}>Mejor Comentario</th> {/* Columna de selección */}
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
              <td style={styles.td}>
                {"★".repeat(tipoCita.descripcion)}{" "}
                {/* Esto repetirá las estrellas según el valor de descripcion */}
              </td>

              <td style={styles.td}>
                <input
                  type="checkbox"
                  checked={tipoCita.nombre.includes("666")}
                  onChange={() => handleSelectComment(tipoCita.id)}
                  style={styles.checkbox} // Aplica el estilo aquí
                />
              </td>

              <td style={styles.td}>
                <button
                  style={styles.button}
                  onClick={() => handleEdit(tipoCita)}
                >
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
            <h2>
              {editingTipoCita ? "Editar Comentario" : "Crear Comentario"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                style={styles.input}
                placeholder="Comentario"
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
                {[...Array(5)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <button type="submit" style={styles.submitButton}>
                {editingTipoCita ? "Actualizar" : "Crear"}
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
        </>
      )}
    </div>
  );
};

export default GestionarComentario;

const styles = {
  checkbox: {
    transform: "scale(2)", // Aumenta el tamaño del checkbox
    margin: "0 auto", // Centra el checkbox si es necesario
    cursor: "pointer", // Cambia el cursor para indicar que es interactivo
  },

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
