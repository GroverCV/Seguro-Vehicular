import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const GestionarPlanPago = () => {
  const [planesPago, setPlanesPago] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [polizas, setPolizas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPlanPago, setEditingPlanPago] = useState(null);
  const [formData, setFormData] = useState({
    estado: "activo",
  });

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPlanPago = currentPage * itemsPerPage;
  const indexOfFirstPlanPago = indexOfLastPlanPago - itemsPerPage;
  const currentPlanesPago = Array.isArray(planesPago)
    ? planesPago.slice(indexOfFirstPlanPago, indexOfLastPlanPago)
    : [];
  const totalPages = Math.ceil(
    Array.isArray(planesPago) ? planesPago.length / itemsPerPage : 0
  );

  const fetchPlanesPago = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/plan_pago");
      setPlanesPago(response.data.data);
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
    fetchPolizas();
    fetchPlanesPago();
    fetchUsuarios();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/plan_pago/${id}`);
      const planPago = response.data.data;

      setEditingPlanPago(planPago);
      setFormData(planPago);
      setShowForm(true);
      
    } catch (error) {
      console.error("Error al obtener los datos del plan de pago:", error);
    }
  };

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await api.delete(`/api/plan_pago/${id}`);
        setPlanesPago(planesPago.filter((plan) => plan.id !== id));
        fetchPlanesPago();
      } catch (error) {
        console.error("Error al eliminar el plan de pago:", error);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        const response = await api({
          method: editingPlanPago ? "put" : "post",
          url: editingPlanPago
            ? `/api/plan_pago/${editingPlanPago.id}`
            : "/api/plan_pago",
          data: formData,
        });

        const updatedPlanPago = response.data.data;

        setPlanesPago((prev) =>
          editingPlanPago
            ? prev.map((plan) =>
                plan.id === updatedPlanPago.id ? updatedPlanPago : plan
              )
            : [...prev, updatedPlanPago]
        );

        setFormData({
          estado: "activo",
        });
        setEditingPlanPago(null);
        setShowForm(false);
        
      } catch (error) {
        console.error("Error al actualizar o crear el plan de pago:", error);
      }
      fetchPlanesPago();
    });
  };

  const handleCancel = () => {
    setEditingPlanPago(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR PLAN DE PAGO</h1>
      <button style={styles.submitButton} onClick={() => setShowForm(true)}>
        Crear Plan de Pago
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Poliza ID</th>
            <th style={styles.th}>Monto Total</th>
            <th style={styles.th}>Fecha Inicio</th>
            <th style={styles.th}>Fecha Fin</th>
            <th style={styles.th}>Saldo</th>
            <th style={styles.th}>Tipo Plan</th>
            <th style={styles.th}>Número de Cuotas</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Usuario Registro</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPlanesPago.map((plan, index) => {
            const usuario = usuarios.find(
              (u) => u.id === plan.usuario_registro_id
            );
            return (
              <tr
                key={plan.id}
                style={index % 2 === 0 ? styles.trEven : styles.trOdd}
              >
                <td style={styles.td}>{plan.id}</td>
                <td style={styles.td}>{plan.poliza_id}</td>
                <td style={styles.td}>{plan.monto_total}</td>
                <td style={styles.td}>{plan.fecha_inicio}</td>
                <td style={styles.td}>{plan.fecha_fin}</td>
                <td style={styles.td}>{plan.saldo}</td>
                <td style={styles.td}>{plan.tipo_plan}</td>
                <td style={styles.td}>{plan.numero_cuotas}</td>
                <td style={styles.td}>{plan.estado}</td>
                <td style={styles.td}>
                  {usuario
                    ? usuario.nombre + " " + usuario.apellido
                    : "Desconocido"}
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => handleEdit(plan.id)}
                  >
                    Editar
                  </button>
                  <button
                    style={styles.button}
                    onClick={() => handleDelete(plan.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
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
            <h2>{editingPlanPago ? "Editar" : "Crear"} Plan de Pago</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Poliza ID:
                <select
                  style={styles.input}
                  value={formData.poliza_id || ""}
                  onChange={(e) => {
                    const selectedPolizaId = e.target.value;
                    const selectedPoliza = polizas.find(
                      (poliza) => poliza.id === selectedPolizaId
                    );

                    // Generar un monto total aleatorio entre 15,000 y 45,000
                    const montoRandom =
                      Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000;

                    setFormData({
                      ...formData,
                      poliza_id: selectedPolizaId,
                      monto_total: selectedPoliza ? montoRandom : "", // Asignar monto aleatorio
                    });
                  }}
                >
                  <option value="">Seleccione una Póliza</option>
                  {polizas.map((poliza) => (
                    <option key={poliza.id} value={poliza.id}>
                      {poliza.id} {/* Muestra solo el ID */}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Monto Total:
                <input
                  style={styles.input}
                  type="number"
                  value={formData.monto_total || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monto_total: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Fecha Inicio:
                <input
                  style={styles.input}
                  type="date"
                  value={formData.fecha_inicio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_inicio: e.target.value })
                  }
                />
              </label>

              <label>
                Fecha Fin:
                <input
                  style={styles.input}
                  type="date"
                  value={formData.fecha_fin || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_fin: e.target.value })
                  }
                />
              </label>

              <label>
                Saldo:
                <input
                  style={styles.input}
                  type="number"
                  value={formData.saldo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, saldo: e.target.value })
                  }
                />
              </label>

              <label>
                Tipo Plan:
                <select
                  style={styles.input}
                  value={formData.tipo_plan || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo_plan: e.target.value })
                  }
                >
                  <option value="">Seleccione un plan</option>
                  <option value="total">Pago Total</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  {/* Puedes agregar más opciones aquí */}
                </select>
              </label>

              <label>
                Número de Cuotas:
                <select
                  style={styles.input}
                  value={formData.numero_cuotas || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numero_cuotas: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccione una opción</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
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
                Usuario de Registro:
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
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre + " " + usuario.apellido}
                    </option>
                  ))}
                </select>
              </label>

              <button type="submit" style={styles.submitButton}>
                {editingPlanPago ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
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

export default GestionarPlanPago;

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
