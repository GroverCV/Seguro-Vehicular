import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const Comprobante = () => {
  const [comprobantes, setComprobantes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [motivosPago, setMotivosPago] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingComprobante, setEditingComprobante] = useState(null);
  const [formData, setFormData] = useState({
    estado: true,
  });

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastComprobante = currentPage * itemsPerPage;
  const indexOfFirstComprobante = indexOfLastComprobante - itemsPerPage;
  const currentComprobantes = Array.isArray(comprobantes)
    ? comprobantes.slice(indexOfFirstComprobante, indexOfLastComprobante)
    : [];
  const totalPages = Math.ceil(
    Array.isArray(comprobantes) ? comprobantes.length / itemsPerPage : 0
  );

  const fetchComprobantes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/comprobante_pago");
      setComprobantes(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComprobantes();
    fetchPagos();
    fetchUsuarios();
    fetchVehiculos();
    fetchMetodosPago();
    fetchMotivosPago();

  }, []);

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

  const fetchMotivosPago = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/motivo_pago");
      console.log(response.data.data);
      setMotivosPago(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
  const fetchVehiculos = async () => {
    try {
      const response = await api.get("/api/vehiculos");
      setVehiculos(response.data.reverse());
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/comprobante_pago/${id}`);
      const comprobante = response.data.data;

      setEditingComprobante(comprobante);
      setFormData(comprobante);
      setShowForm(true);
    } catch (error) {
      console.error("Error al obtener los datos del comprobante:", error);
    }
  };

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await api.delete(`/api/comprobante_pago/${id}`);
        setComprobantes(
          comprobantes.filter((comprobante) => comprobante.id !== id)
        );
        fetchComprobantes();
      } catch (error) {
        console.error("Error al eliminar el comprobante:", error);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        const response = await api({
          method: editingComprobante ? "put" : "post",
          url: editingComprobante
            ? `/api/comprobante_pago/${editingComprobante.id}`
            : "/api/comprobante_pago",
          data: formData,
        });

        const updatedComprobante = response.data.data;

        setComprobantes((prev) =>
          editingComprobante
            ? prev.map((comprobante) =>
                comprobante.id === updatedComprobante.id
                  ? updatedComprobante
                  : comprobante
              )
            : [...prev, updatedComprobante]
        );

        setFormData({
          estado: true,
        });
        setEditingComprobante(null);
        setShowForm(false);
      } catch (error) {
        console.error("Error al actualizar o crear el comprobante:", error);
      }
    });
  };

  const handleCancel = () => {
    setEditingComprobante(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR COMPROBANTES</h1>
      <button style={styles.submitButton} onClick={() => setShowForm(true)}>
        Crear Comprobante
      </button>

      <table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.th}>ID</th>
      <th style={styles.th}>Pago ID</th>
      <th style={styles.th}>Usuario</th>
      <th style={styles.th}>Número Comprobante</th>
      <th style={styles.th}>Fecha Emision</th>
      <th style={styles.th}>Monto Total</th>
      <th style={styles.th}>Detalles</th>
      <th style={styles.th}>Estado</th>
      <th style={styles.th}>Acciones</th>
    </tr>
  </thead>

  <tbody>
    {currentComprobantes.map((comprobante, index) => {
      // Find the user who owns the pago_id
      const usuario = usuarios.find(user => user.id === comprobante.pago_id);
      const usuarioNombre = usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario no encontrado';

      return (
        <tr
          key={comprobante.id}
          style={index % 2 === 0 ? styles.trEven : styles.trOdd}
        >
          <td style={styles.td}>{comprobante.id}</td>
          <td style={styles.td}>{comprobante.pago_id}</td>
          <td style={styles.td}>{usuarioNombre}</td> 
          
          <td style={styles.td}>{comprobante.numero_comprobante}</td>
          <td style={styles.td}>{comprobante.fecha_emision}</td>
          <td style={styles.td}>{comprobante.monto_total}</td>
          <td style={styles.td}>{comprobante.detalles_json}</td>
          <td style={styles.td}>
            {comprobante.estado ? "Activo" : "Inactivo"}
          </td>
          <td style={styles.td}>
            <button
              style={styles.button}
              onClick={() => handleEdit(comprobante.id)}
            >
              Editar
            </button>
            <button
              style={styles.button}
              onClick={() => handleDelete(comprobante.id)}
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
            <h2>{editingComprobante ? "Editar" : "Crear"} Comprobante</h2>
            <form onSubmit={handleSubmit}>
              <label>
                ID PAGO
                <select
                  style={styles.input}
                  value={formData.pago_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pago_id: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Seleccione un pago
                  </option>
                  {pagos.map((pago) => {
                    const usuario = usuarios.find(
                      (user) => user.id === pago.usuario_registro_id
                    );
                    const usuarioNombre = usuario
                      ? `${usuario.nombre} ${usuario.apellido}`
                      : "Usuario no encontrado"; // Adjust fields based on your user object structure

                    return (
                      <option key={pago.id} value={pago.id}>
                        {usuarioNombre} - {pago.id}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label>
                Número Comprobante:
                <input
                  style={styles.input}
                  type="text"
                  value={formData.numero_comprobante || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numero_comprobante: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Monto Total:
                <input
                  style={styles.input}
                  type="number"
                  value={formData.monto_total || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, monto_total: e.target.value })
                  }
                />
              </label>

              <label>
                Detalles (JSON):
                <textarea
                  style={styles.input}
                  value={formData.detalles_json || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, detalles_json: e.target.value })
                  }
                />
              </label>

              <label>
                Estado:
                <select
                  style={styles.input}
                  value={formData.estado || true}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                >
                  <option value={true}>Activo</option>
                  <option value={false}>Inactivo</option>
                </select>
              </label>

              <button type="submit" style={styles.submitButton}>
                {editingComprobante ? "Actualizar" : "Crear"}
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

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  h1: {
    textAlign: "center",
    marginBottom: "20px",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    borderBottom: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    borderBottom: "1px solid #ddd",
    padding: "10px",
  },
  trEven: {
    backgroundColor: "#f2f2f2",
  },
  trOdd: {
    backgroundColor: "#ffffff",
  },
  button: {
    marginRight: "10px",
    backgroundColor: "#f0ad4e",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  pagination: {
    marginTop: "20px",
    textAlign: "center",
  },
  pageButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    width: "400px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Comprobante;
