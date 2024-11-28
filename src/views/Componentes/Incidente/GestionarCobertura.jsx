import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const GestionarCobertura = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [polizas, setPolizas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIncidente, setEditingIncidente] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    poliza_id: "",
    fecha_incidente: "",
    descripcion: "",
    ubicacion: "",
    monto_estimado: "",
    estado: "en_proceso",
    cobertura_id: "",
    usuario_registro_id: "",
  });

  const fetchIncidentes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/incidente");
      setIncidentes(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPolizas = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/poliza");
      console.log(response.data.data);
      setPolizas(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get("/api/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentes();
    fetchUsuarios();
    fetchPolizas();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/incidente/${id}`);
      const incidente = response.data.data;

      setEditingIncidente(incidente);
      setFormData(incidente);
      setShowForm(true);
    } catch (error) {
      console.error("Error al obtener los datos del incidente:", error);
    }
  };

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await api.delete(`/api/incidente/${id}`);
        setIncidentes(incidentes.filter((incidente) => incidente.id !== id));
        fetchIncidentes();
      } catch (error) {
        console.error("Error al eliminar el incidente:", error);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        const response = await api({
          method: editingIncidente ? "put" : "post",
          url: editingIncidente
            ? `/api/incidente/${editingIncidente.id}`
            : "/api/incidente",
          data: formData,
        });

        const updatedIncidente = response.data.data;

        setIncidentes((prev) =>
          editingIncidente
            ? prev.map((incidente) =>
                incidente.id === updatedIncidente.id
                  ? updatedIncidente
                  : incidente
              )
            : [...prev, updatedIncidente]
        );

        setFormData({
          poliza_id: "",
          fecha_incidente: "",
          descripcion: "",
          ubicacion: "",
          monto_estimado: "",
          estado: "en_proceso",
          cobertura_id: "",
          usuario_registro_id: "",
        });
        setEditingIncidente(null);
        setShowForm(false);
        fetchIncidentes();
      } catch (error) {
        console.error("Error al actualizar o crear el incidente:", error);
      }
    });
  };

  const handleCancel = () => {
    setEditingIncidente(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR INCIDENTE</h1>
      <button style={styles.submitButton} onClick={() => setShowForm(true)}>
        Registrar Incidente
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Póliza</th>
            <th style={styles.th}>Fecha Incidente</th>
            <th style={styles.th}>Descripción</th>
            <th style={styles.th}>Ubicación</th>
            <th style={styles.th}>Monto Estimado</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Cobertura</th>
            <th style={styles.th}>Usuario Registro</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incidentes.map((incidente, index) => {
            const usuario = usuarios.find(
              (u) => u.id === incidente.usuario_registro_id
            );
            return (
              <tr
                key={incidente.id}
                style={index % 2 === 0 ? styles.trEven : styles.trOdd}
              >
                <td style={styles.td}>{incidente.id}</td>
                <td style={styles.td}>
                  {polizas.find((poliza) => poliza.id === incidente.poliza_id)
                    ?.numero_poliza || "Desconocido"}
                </td>
                <td style={styles.td}>{incidente.fecha_incidente}</td>
                <td style={styles.td}>{incidente.descripcion}</td>
                <td style={styles.td}>{incidente.ubicacion}</td>
                <td style={styles.td}>{incidente.monto_estimado}</td>
                <td style={styles.td}>{incidente.estado}</td>
                <td style={styles.td}>{incidente.cobertura_id}</td>
                <td style={styles.td}>
                  {usuario
                    ? usuario.nombre + " " + usuario.apellido
                    : "Desconocido"}
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => handleEdit(incidente.id)}
                  >
                    Editar
                  </button>
                  <button
                    style={styles.button}
                    onClick={() => handleDelete(incidente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>{editingIncidente ? "Editar" : "Registrar"} Incidente</h2>
            <form onSubmit={handleSubmit}>


              <label>
                Usuario Registro ID:
                <select
                  style={styles.input}
                  value={formData.usuario_registro_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usuario_registro_id: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Seleccionar ID de usuario
                  </option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.id} - {usuario.nombre} {usuario.apellido}{" "}
                      {/* Puedes mostrar más detalles si lo deseas */}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Póliza:
                <select
                  style={styles.input}
                  value={formData.poliza_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, poliza_id: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Seleccionar póliza
                  </option>
                  {polizas.map((poliza) => (
                    <option key={poliza.id} value={poliza.id}>
                      {poliza.numero_poliza}
                    </option>
                  ))}
                </select>
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
                Ubicación:
                <input
                  type="text"
                  style={styles.input}
                  value={formData.ubicacion || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ubicacion: e.target.value })
                  }
                />
              </label>
              
              <label>
                Monto Estimado:
                <input
                  type="number"
                  style={styles.input}
                  value={formData.monto_estimado || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, monto_estimado: e.target.value })
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
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </label>
              <label>
                Cobertura ID:
                <input
                  type="text"
                  style={styles.input}
                  value={formData.cobertura_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, cobertura_id: e.target.value })
                  }
                />
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

export default GestionarCobertura;

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
