import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const AdministrarPago = () => {
  const [pagos, setPagos] = useState([]);
  


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPago, setEditingPago] = useState(null);
  const [formData, setFormData] = useState({
    estado: true,
  });

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPago = currentPage * itemsPerPage;
  const indexOfFirstPago = indexOfLastPago - itemsPerPage;
  const currentPagos = Array.isArray(pagos)
    ? pagos.slice(indexOfFirstPago, indexOfLastPago)
    : [];
  const totalPages = Math.ceil(
    Array.isArray(pagos) ? pagos.length / itemsPerPage : 0
  );



  const fetchPagos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/pagos");
      setPagos(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };



  

  useEffect(() => {
    fetchPagos();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/pagos/${id}`);
      const pago = response.data.data;

      setEditingPago(pago);
      setFormData(pago);
      setShowForm(true);
    } catch (error) {
      console.error("Error al obtener los datos del pago:", error);
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
        await api.delete(`/api/pago/${id}`);
        setPagos(pagos.filter((pago) => pago.id !== id));

        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó el Pago ID: ${id}`,
          ip: userIp,
        };
        fetchPagos();
        await logAction(logData);
      } catch (error) {
        console.error("Error al eliminar el pago:", error);
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
          method: editingPago ? "put" : "post",
          url: editingPago ? `/api/pagos/${editingPago.id}` : "/api/pagos",
          data: formData,
        });

        const updatedPago = response.data.data;

        setPagos((prev) =>
          editingPago
            ? prev.map((pago) =>
                pago.id === updatedPago.id ? updatedPago : pago
              )
            : [...prev, updatedPago]
        );

        setFormData({
          estado: true,
        });
        setEditingPago(null);
        setShowForm(false);

        const userIp = await getUserIp();

        const logData = {
          usuario_id: userId,
          accion: editingPago ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingPago ? "editó" : "creó"
          } el Pago ID: ${editingPago ? editingPago.id : updatedPago.id}`,
          ip: userIp,
        };
        fetchPagos();
        await logAction(logData);
      } catch (error) {
        console.error("Error al actualizar o crear el pago:", error);
      }
    });
  };

  const handleCancel = () => {
    setEditingPago(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR PAGO</h1>
      <button style={styles.submitButton} onClick={() => setShowForm(true)}>
        Crear Pago
      </button>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>ID COUTA</th>
            <th style={styles.th}>ID METODO PAGO</th>
            <th style={styles.th}>ID MOTIVO PAGO</th>
            <th style={styles.th}>ID Usuario Registro</th>
            <th style={styles.th}>Fecha</th>
            <th style={styles.th}>Monto</th>
            <th style={styles.th}>NOTAS</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Comprobante de Pago</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPagos.map((pago, index) => (
            <tr
              key={pago.id}
              style={index % 2 === 0 ? styles.trEven : styles.trOdd}
            >
              <td style={styles.td}>{pago.id}</td>
              <td style={styles.td}>{pago.cuota_id}</td>
              <td style={styles.td}>{pago.metodo_pago_id}</td>
              <td style={styles.td}>{pago.motivo_pago_id}</td>
              <td style={styles.td}>{pago.usuario_registro_id}</td>
              <td style={styles.td}>{pago.fecha}</td>
              <td style={styles.td}>{pago.monto}</td>
              <td style={styles.td}>{pago.notas}</td>
              <td style={styles.td}>{pago.estado}</td>
              <td style={styles.td}>{pago.id}</td>
              <td style={styles.td}>
                <button
                  style={styles.button}
                  onClick={() => handleEdit(pago.id)}
                >
                  Editar
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleDelete(pago.id)}
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
            <h2>{editingPago ? "Editar" : "Crear"} Pago</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Cuota ID:
                <input
                  style={styles.input}
                  type="text"
                  value={formData.cuota_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, cuota_id: e.target.value })
                  }
                />
              </label>
              <label>
                Método de Pago ID:
                <input
                  style={styles.input}
                  type="text"
                  value={formData.metodo_pago_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, metodo_pago_id: e.target.value })
                  }
                />
              </label>
              <label>
                Motivo de Pago ID:
                <input
                  style={styles.input}
                  type="text"
                  value={formData.motivo_pago_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, motivo_pago_id: e.target.value })
                  }
                />
              </label>
              <label>
                Usuario Registro ID:
                <input
                  style={styles.input}
                  type="text"
                  value={formData.usuario_registro_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usuario_registro_id: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Fecha:
                <input
                  style={styles.input}
                  type="date"
                  value={formData.fecha || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                />
              </label>
              <label>
                Monto:
                <input
                  style={styles.input}
                  type="number"
                  value={formData.monto || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                />
              </label>
              <label>
                Notas:
                <textarea
                  style={styles.input}
                  value={formData.notas || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notas: e.target.value })
                  }
                />
              </label>
              <label>
                Estado:
                <input
                  style={styles.input}
                  type="checkbox"
                  checked={formData.estado || false}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.checked })
                  }
                />
              </label>
              <div style={styles.buttons}>
                <button style={styles.submitButton} type="submit">
                  {editingPago ? "Actualizar" : "Crear"}
                </button>
                <button
                  style={styles.cancelButton}
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

export default AdministrarPago;

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
