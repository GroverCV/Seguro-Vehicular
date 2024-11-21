import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";

const GestionarPoliza = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [valorComercial, setValorComercial] = useState([]);

  const [usuarios, setUsuarios] = useState([]);
  const [polizas, setPolizas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPoliza, setEditingPoliza] = useState(null);
  const [formData, setFormData] = useState({
    estado: "activo",
  });

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPoliza = currentPage * itemsPerPage;
  const indexOfFirstPoliza = indexOfLastPoliza - itemsPerPage;
  const currentPolizas = Array.isArray(polizas)
    ? polizas.slice(indexOfFirstPoliza, indexOfLastPoliza)
    : [];
  const totalPages = Math.ceil(
    Array.isArray(polizas) ? polizas.length / itemsPerPage : 0
  );

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

  useEffect(() => {
    fetchPolizas();
    fetchUsuarios();
    fetchVehiculos();
    fetchValorComercial();
  }, []);

  const fetchValorComercial = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/valor_comercial");
      setValorComercial(response.data);
    } catch (error) {
      message.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/poliza/${id}`);
      const poliza = response.data.data;

      setEditingPoliza(poliza);
      setFormData(poliza);
      setShowForm(true);
    } catch (error) {
      console.error("Error al obtener los datos de la póliza:", error);
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
        await api.delete(`/api/poliza/${id}`);
        setPolizas(polizas.filter((poliza) => poliza.id !== id));

        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó la Póliza ID: ${id}`,
          ip: userIp,
        };
        fetchPolizas();
        await logAction(logData);
      } catch (error) {
        console.error("Error al eliminar la póliza:", error);
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
          method: editingPoliza ? "put" : "post",
          url: editingPoliza
            ? `/api/poliza/${editingPoliza.id}`
            : "/api/poliza",
          data: formData,
        });

        const updatedPoliza = response.data.data;

        setPolizas((prev) =>
          editingPoliza
            ? prev.map((poliza) =>
                poliza.id === updatedPoliza.id ? updatedPoliza : poliza
              )
            : [...prev, updatedPoliza]
        );

        setFormData({
          estado: "activo",
        });
        setEditingPoliza(null);
        setShowForm(false);

        const userIp = await getUserIp();

        const logData = {
          usuario_id: userId,
          accion: editingPoliza ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingPoliza ? "editó" : "creó"
          } la Póliza ID: ${
            editingPoliza ? editingPoliza.id : updatedPoliza.id
          }`,
          ip: userIp,
        };
        fetchPolizas();
        await logAction(logData);
      } catch (error) {
        console.error("Error al actualizar o crear la póliza:", error);
      }
    });
  };

  const handleCancel = () => {
    setEditingPoliza(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR PÓLIZA</h1>
      <button style={styles.submitButton} onClick={() => setShowForm(true)}>
        Crear Póliza
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Número de Póliza</th>
            <th style={styles.th}>Vehículo</th>
            <th style={styles.th}>Fecha Inicio</th>
            <th style={styles.th}>Fecha Fin</th>
            <th style={styles.th}>Monto Total</th>
            <th style={styles.th}>Prima Mensual</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Documento URL</th>
            <th style={styles.th}>Usuario Registro</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPolizas.map((poliza, index) => {
            const usuario = usuarios.find(
              (u) => u.id === poliza.usuario_registro_id
            );
            const vehiculo = vehiculos.find((v) => v.id === poliza.vehiculo_id);
            return (
              <tr
                key={poliza.id}
                style={index % 2 === 0 ? styles.trEven : styles.trOdd}
              >
                <td style={styles.td}>{poliza.id}</td>
                <td style={styles.td}>{poliza.numero_poliza}</td>
                <td style={styles.td}>
                  {vehiculo ? vehiculo.placa : "Desconocido"}
                </td>
                <td style={styles.td}>{poliza.fecha_inicio}</td>
                <td style={styles.td}>{poliza.fecha_fin}</td>
                <td style={styles.td}>{poliza.monto_total}</td>
                <td style={styles.td}>{poliza.prima_mensual}</td>
                <td style={styles.td}>{poliza.estado}</td>
                <td style={styles.td}>
                  <a
                    href={poliza.documento_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Documento
                  </a>
                </td>
                <td style={styles.td}>
                  {usuario ? usuario.nombre : "Desconocido"}
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => handleEdit(poliza.id)}
                  >
                    Editar
                  </button>
                  <button
                    style={styles.button}
                    onClick={() => handleDelete(poliza.id)}
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
            <h2>{editingPoliza ? "Editar" : "Crear"} Póliza</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Número de Póliza:
                {loading ? (
                  <p>Cargando pólizas...</p>
                ) : (
                  <input
                    style={styles.input}
                    type="text"
                    value={formData.numero_poliza || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numero_poliza: e.target.value,
                      })
                    } // Permite editar el valor
                  />
                )}
              </label>

              <label>
                Vehículo:
                <select
                  style={styles.input}
                  value={formData.vehiculo_id || ""}
                  onChange={(e) => {
                    const vehiculoId = e.target.value;
                    if (vehiculoId) {
                      const montoTotalRandom = Math.floor(
                        Math.random() * (60000 - 15000 + 1) + 15000
                      ); // Generar número aleatorio entre 15000 y 60000
                      let primaMensual = montoTotalRandom / 30; // Calcular prima mensual
                      if (primaMensual < 3480) {
                        primaMensual = 3480; // Asignar 3480 si es menor
                      }
                      setFormData({
                        ...formData,
                        vehiculo_id: vehiculoId,
                        monto_total: montoTotalRandom,
                        prima_mensual: primaMensual,
                      });
                    } else {
                      setFormData({ ...formData, vehiculo_id: "" });
                    }
                  }}
                >
                  <option value="">Selecciona un vehículo</option>{" "}
                  {/* opción por defecto */}
                  {vehiculos.map((vehiculo) => (
                    <option key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.placa} {/* O cualquier otro dato relevante */}
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
                  readOnly // Hacer el campo de solo lectura si no deseas edición manual
                />
              </label>

              <label>
                Prima Mensual:
                <input
                  style={styles.input}
                  type="number"
                  value={formData.prima_mensual || ""}
                  onChange={(e) => {
                    const primaMensual = e.target.value;
                    if (primaMensual < 3480) {
                      setFormData({ ...formData, prima_mensual: 3480 }); // Asegurar que la prima no sea menor a 3480
                    } else {
                      setFormData({ ...formData, prima_mensual: primaMensual });
                    }
                  }}
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
                Estado:
                <select
                  style={styles.input}
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>

              <label>
                Documento URL:
                <input
                  style={styles.input}
                  type="url"
                  value={formData.documento_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, documento_url: e.target.value })
                  }
                />
              </label>

              <label>
                Usuario Registro:
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
                  <option value="">Selecciona un usuario</option>{" "}
                  {/* opción por defecto */}
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre} {/* O cualquier otro dato relevante */}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <button style={styles.submitButton} type="submit">
                  {editingPoliza ? "Actualizar" : "Crear"}
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

export default GestionarPoliza;

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
