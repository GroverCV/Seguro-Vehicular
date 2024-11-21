import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const GestionarCuota = () => {
  const [cuotas, setCuotas] = useState([]);
  const [planesPago, setPlanesPago] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCuota, setEditingCuota] = useState(null);
  const [formData, setFormData] = useState({
    estado: "activo",
  });

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastCuota = currentPage * itemsPerPage;
  const indexOfFirstCuota = indexOfLastCuota - itemsPerPage;
  const currentCuotas = Array.isArray(cuotas)
    ? cuotas.slice(indexOfFirstCuota, indexOfLastCuota)
    : [];
  const totalPages = Math.ceil(
    Array.isArray(cuotas) ? cuotas.length / itemsPerPage : 0
  );

  const fetchCuotas = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/cuotas");
      setCuotas(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchCuotas();
    fetchPlanesPago();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/cuotas/${id}`);
      const cuota = response.data.data;

      setEditingCuota(cuota);
      setFormData(cuota);
      setShowForm(true);
    } catch (error) {
      console.error("Error al obtener los datos de la cuota:", error);
    }
  };

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await api.delete(`/api/cuotas/${id}`);
        setCuotas(cuotas.filter((cuota) => cuota.id !== id));
        fetchCuotas();
      } catch (error) {
        console.error("Error al eliminar la cuota:", error);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        const response = await api({
          method: editingCuota ? "put" : "post",
          url: editingCuota ? `/api/cuotas/${editingCuota.id}` : "/api/cuotas",
          data: formData,
        });

        const updatedCuota = response.data.data;

        setCuotas((prev) =>
          editingCuota
            ? prev.map((cuota) =>
                cuota.id === updatedCuota.id ? updatedCuota : cuota
              )
            : [...prev, updatedCuota]
        );

        setFormData({
          estado: "activo",
        });
        setEditingCuota(null);
        setShowForm(false);
      } catch (error) {
        console.error("Error al actualizar o crear la cuota:", error);
      }
    });
  };

  const handleCancel = () => {
    setEditingCuota(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR CUOTAS</h1>
      <button style={styles.submitButton} onClick={() => setShowForm(true)}>
        Crear Cuota
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Plan Pago ID</th>
            <th style={styles.th}>Número de Cuota</th>
            <th style={styles.th}>Monto</th>
            <th style={styles.th}>Estado Cuota</th>
            <th style={styles.th}>Fecha Vencimiento</th>
            <th style={styles.th}>Fecha Pago</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>

        <tbody>
  {currentCuotas.map((cuota, index) => {
    // Encontrar el plan de pago asociado a la cuota
    const planPago = planesPago.find((plan) => plan.id === cuota.plan_pago_id);
    return (
      <tr
        key={cuota.id}
        style={index % 2 === 0 ? styles.trEven : styles.trOdd}
      >
        <td style={styles.td}>{cuota.id}</td>
        <td style={styles.td}>{planPago ? planPago.tipo_plan : "Desconocido"}</td>
        <td style={styles.td}>{cuota.numero_cuota}</td>
        <td style={styles.td}>{cuota.monto_cuota}</td>
        <td style={styles.td}>{cuota.estado_cuota}</td>
        <td style={styles.td}>{cuota.fecha_vencimiento}</td>
        <td style={styles.td}>{cuota.fecha_pago}</td>
        <td style={styles.td}>{cuota.estado ? "Activo" : "Inactivo"}</td>
        <td style={styles.td}>
          <button
            style={styles.button}
            onClick={() => handleEdit(cuota.id)}
          >
            Editar
          </button>
          <button
            style={styles.button}
            onClick={() => handleDelete(cuota.id)}
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
            <h2>{editingCuota ? "Editar" : "Crear"} Cuota</h2>
            <form onSubmit={handleSubmit}>
              

              <label>
              Plan Pago ID:
                <select
                  style={styles.input}
                  value={formData.plan_pago_id|| ""}
                  onChange={(e) =>
                    setFormData({ ...formData, plan_pago_id: e.target.value })
                  }
                >
                  {planesPago.map((plan_pago) => (
                    <option key={plan_pago.id} value={plan_pago.id}>
                      {plan_pago.tipo_plan}
                    </option>
                  ))}
                </select>
              </label>

              <label>
  Número de Cuota:
  <select
    style={styles.input}
    value={formData.numero_cuota || ""}
    onChange={(e) =>
      setFormData({ ...formData, numero_cuota: e.target.value })
    }
  >
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
  </select>
</label>


              <label>
                Monto de Cuota:
                <input
                  style={styles.input}
                  type="number"
                  value={formData.monto_cuota || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, monto_cuota: e.target.value })
                  }
                />
              </label>

              <label>
  Estado Cuota:
  <select
    style={styles.input}
    value={formData.estado_cuota || ""}
    onChange={(e) =>
      setFormData({ ...formData, estado_cuota: e.target.value })
    }
  >
    <option value="Pagado">Pagado</option>
    <option value="Pendiente">Pendiente</option>
  </select>
</label>


              <label>
                Fecha Vencimiento:
                <input
                  style={styles.input}
                  type="date"
                  value={formData.fecha_vencimiento || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_vencimiento: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Fecha Pago:
                <input
                  style={styles.input}
                  type="date"
                  value={formData.fecha_pago || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_pago: e.target.value })
                  }
                />
              </label>

              <label>
  Estado:
  <select
    style={styles.input}
    value={formData.estado || "Activo"}  // Default value is "Activo"
    onChange={(e) =>
      setFormData({ ...formData, estado: e.target.value })
    }
  >
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
  </select>
</label>


              <button type="submit" style={styles.submitButton}>
                {editingCuota ? "Actualizar" : "Crear"}
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

export default GestionarCuota;
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
