import React, { useEffect, useState } from "react";
import { confirmAction } from "./modalComponentes/ModalConfirm";
import ModalAgenda from "./modalComponentes/ModalAgenda";





const GestionarAgenda = () => {
  const [citas, setCitas] = useState([]);
  const [tipoCita, setTipoCita] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCita, setEditingCita] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);



  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;
const indexOfLastCita = currentPage * itemsPerPage;
const indexOfFirstCita = indexOfLastCita - itemsPerPage;
const currentCitas = citas.slice(indexOfFirstCita, indexOfLastCita);
const totalPages = Math.ceil(citas.length / itemsPerPage);
const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchCitas = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/citas"
      );
      if (!response.ok) {
        throw new Error("Error al obtener las citas");
      }
      const data = await response.json();
      setCitas(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/usuarios"
      );
      if (!response.ok) throw new Error("Error al obtener los usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTipoCita = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/tipo_cita"
      );
      if (!response.ok) {
        throw new Error("Error al obtener los tipos de cita");
      }
      const data = await response.json();
      setTipoCita(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsuarios();
    fetchTipoCita();
    fetchCitas();
  }, []);

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
      width: "400px",
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
      margin: "0 5px",
      padding: "5px 10px",
      cursor: "pointer",
      border: "1px solid #007bff",
      borderRadius: "4px",
      backgroundColor: "#007bff",
      color: "white",
    },
    activePageButton: {
      backgroundColor: "#0056b3",
    },
  };

  const handleEdit = (cita) => {
    setEditingCita(cita);
    setFormData(cita);
    setShowForm(true);
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
        await fetch(
          `https://backend-seguros.campozanodevlab.com/api/citas/${id}`,
          { method: "DELETE" }
        );
        setCitas(citas.filter((cita) => cita.id !== id));
  
        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó la Cita ID: ${id}`,
          ip: userIp,
        };
  
        await logAction(logData);
      } catch (error) {
        console.error("Error al eliminar la cita:", error);
      }
    });
  };
  
  const logAction = async (logData) => {
    const token = "simulated-token";
    try {
      await fetch("https://backend-seguros.campozanodevlab.com/api/bitacora", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(logData),
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
        const response = await fetch(
          editingCita
            ? `https://backend-seguros.campozanodevlab.com/api/citas/${editingCita.id}`
            : "https://backend-seguros.campozanodevlab.com/api/citas",
          {
            method: editingCita ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
  
        const updatedCita = await response.json();
        setCitas((prev) =>
          editingCita
            ? prev.map((cita) =>
                cita.id === updatedCita.id ? updatedCita : cita
              )
            : [...prev, updatedCita]
        );
  
        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: editingCita ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingCita ? "editó" : "creó"
          } la Cita ID: ${
            editingCita ? editingCita.id : updatedCita.id
          }`,
          ip: userIp,
        };
  
        await logAction(logData);
  
        setEditingCita(null);
        setShowForm(false);
        fetchCitas()
      } catch (error) {
        console.error("Error al actualizar o crear la cita:", error);
      }
    });
  };
  



  const handleCancel = () => {
    setEditingCita(null);
    setShowForm(false);
  };
  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR AGENDA</h1>
      <button
        style={styles.submitButton}
        onClick={() => {
          setShowForm(true);
          setFormData({});
        }}
      >
        Crear Cita
      </button>

      
      <button style={styles.button} onClick={toggleCalendar}>
        {showCalendar ? "Ocultar Calendario" : "Ver Calendario"}
      </button>
      {showCalendar && (
        <div>
          <h2>Calendario</h2>
          <ModalAgenda/>
        </div>
      )}
    

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Fecha Creación</th>
            <th style={styles.th}>Fecha</th>
            <th style={styles.th}>Duración</th>
            <th style={styles.th}>Motivo Cliente</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Solicitante</th>
            <th style={styles.th}>Recepcion</th>
            <th style={styles.th}>Tipo Cita</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {currentCitas.map((cita, index) => (
            <tr
              key={cita.id}
              style={index % 2 === 0 ? styles.trEven : styles.trOdd}
            >
              <td style={styles.td}>{cita.id}</td>
              <td style={styles.td}>
                {cita.fechaCreacion
                  ? new Date(cita.fechaCreacion).toLocaleDateString()
                  : "No definido"}
              </td>
              <td style={styles.td}>{new Date(cita.fecha).toLocaleString()}</td>
              <td style={styles.td}>{cita.duracion}</td>
              <td style={styles.td}>{cita.motivo}</td>
              <td style={styles.td}>{cita.estado}</td>

              <td style={styles.td}>
                {usuarios.find((usuario) => usuario.id === cita.solicitante_id)
                  ? `${
                      usuarios.find(
                        (usuario) => usuario.id === cita.solicitante_id
                      ).nombre
                    } ${
                      usuarios.find(
                        (usuario) => usuario.id === cita.solicitante_id
                      ).apellido
                    }`
                  : "No definido"}
              </td>

              <td style={styles.td}>
                {usuarios.find((usuario) => usuario.id === cita.recepcion_id)
                  ? `${
                      usuarios.find(
                        (usuario) => usuario.id === cita.recepcion_id
                      ).nombre
                    } ${
                      usuarios.find(
                        (usuario) => usuario.id === cita.recepcion_id
                      ).apellido
                    }`
                  : "No definido"}
              </td>

              <td style={styles.td}>
                {tipoCita.find((tipo) => tipo.id === cita.tipoCita_id)
                  ?.nombre || "No definido"}
              </td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handleEdit(cita)}>
                  Editar
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleDelete(cita.id)}
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
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {showForm && (
        <>
          <div style={styles.overlay} onClick={handleCancel}></div>
          <div style={styles.modal}>
            <h2>{editingCita ? "Editar Cita" : "Crear Cita"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="date"
                placeholder="Fecha de Creación"
                value={formData.fechaCreacion || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fechaCreacion: e.target.value })
                }
                style={styles.input}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Fecha"
                value={formData.fecha || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fecha: e.target.value })
                }
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Duración"
                value={formData.duracion || ""}
                onChange={(e) =>
                  setFormData({ ...formData, duracion: e.target.value })
                }
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Motivo"
                value={formData.motivo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, motivo: e.target.value })
                }
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Estado"
                value={formData.estado || ""}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                required
              />
              <select
                value={formData.solicitante_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, solicitante_id: e.target.value })
                }
                required
                style={styles.input}
              >
                <option value="">Seleccionar Solicitante</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                  </option>
                ))}
              </select>

              <select
                value={formData.recepcion_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, recepcion_id: e.target.value })
                }
                required
                style={styles.input}
              >
                <option value="">Seleccionar Recepcion</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                  </option>
                ))}
              </select>

              <select
                value={formData.tipoCita_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tipoCita_id: e.target.value })
                }
                required
                style={styles.input}
              >
                <option value="">Seleccionar Tipo de Cita</option>
                {tipoCita.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              <button type="submit" style={styles.submitButton}>
                {editingCita ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={styles.button}
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

export default GestionarAgenda;
