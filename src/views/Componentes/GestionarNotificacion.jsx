import React, { useEffect, useState } from "react";
import emailjs from "emailjs-com"; // Importa la biblioteca
import { confirmAction } from "./modalComponentes/ModalConfirm";

const GestionarNotificacion = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tiposNotificacion, setTiposNotificacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNotificacion, setEditingNotificacion] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [correoUsuarioSeleccionado, setCorreoUsuarioSeleccionado] =
    useState("");

  const fetchNotificaciones = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/notificacion"
      );
      if (!response.ok) {
        throw new Error("Error al obtener las notificaciones");
      }
      const data = await response.json();
      setNotificaciones(data);
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
    }
  };

  const fetchTiposNotificacion = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/tipo_notificacion"
      );
      if (!response.ok) {
        throw new Error("Error al obtener los tipos de notificación");
      }
      const data = await response.json();
      setTiposNotificacion(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    fetchUsuarios();
    fetchTiposNotificacion();
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
  };

  const handleEdit = (notificacion) => {
    setEditingNotificacion(notificacion);
    setFormData(notificacion);
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
          `https://backend-seguros.campozanodevlab.com/api/notificacion/${id}`,
          { method: "DELETE" }
        );
        setNotificaciones(
          notificaciones.filter((notificacion) => notificacion.id !== id)
        );

        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó la Notificación ID: ${id}`,
          ip: userIp,
        };

        await logAction(logData);
      } catch (error) {
        console.error("Error al eliminar la notificación:", error);
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
          editingNotificacion
            ? `https://backend-seguros.campozanodevlab.com/api/notificacion/${editingNotificacion.id}`
            : "https://backend-seguros.campozanodevlab.com/api/notificacion",
          {
            method: editingNotificacion ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const updatedNotificacion = await response.json();

        setNotificaciones((prev) =>
          editingNotificacion
            ? prev.map((notificacion) =>
                notificacion.id === updatedNotificacion.id
                  ? updatedNotificacion
                  : notificacion
              )
            : [...prev, updatedNotificacion]
        );

        // Enviar correo después de guardar la notificación
        const usuario = usuarios.find(
          (user) => user.id === formData.usuario_id
        );
        const tipoNotificacion = tiposNotificacion.find(
          (tipo) => tipo.id === formData.tipo_id
        );

        if (usuario && tipoNotificacion) {
          await sendEmail(usuario, tipoNotificacion, formData.mensaje);
        }

        setEditingNotificacion(null);
        setShowForm(false);

        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: editingNotificacion ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingNotificacion ? "editó" : "creó"
          } la Notificación ID: ${
            editingNotificacion
              ? editingNotificacion.id
              : updatedNotificacion.id
          }`,
          ip: userIp,
        };

        fetchNotificaciones();
        await logAction(logData);
      } catch (error) {
        console.error("Error al actualizar o crear la notificación:", error);
      }
    });
  };

  const sendEmail = async (usuario, tipoNotificacion, mensaje) => {
    const templateParams = {
      user_email: usuario.correo,
      subject: tipoNotificacion.nombre,
      message: mensaje,
    };

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID", // Reemplaza con tu Service ID de EmailJS
        "YOUR_TEMPLATE_ID", // Reemplaza con tu Template ID de EmailJS
        templateParams,
        "YOUR_PUBLIC_KEY" // Reemplaza con tu Public Key de EmailJS
      );
      console.log("Correo enviado correctamente");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  };

  const handleUsuarioChange = (e) => {
    const usuarioId = e.target.value;
    setFormData({ ...formData, usuario_id: usuarioId });
    const usuarioSeleccionado = usuarios.find(
      (usuario) => usuario.id === usuarioId
    );
    setCorreoUsuarioSeleccionado(
      usuarioSeleccionado ? usuarioSeleccionado.correo : ""
    );
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR NOTIFICACIONES</h1>
      <button
        style={styles.submitButton}
        onClick={() => {
          setShowForm(true);
          setFormData({});
          setCorreoUsuarioSeleccionado(""); // Limpiar el correo al abrir el formulario
        }}
      >
        Crear Notificación
      </button>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Mensaje</th>
            <th style={styles.th}>Fecha Creación</th>
            <th style={styles.th}>Fecha Envío</th>

            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Usuario</th>
            <th style={styles.th}>Correo</th>
            <th style={styles.th}>Tipo Notificación</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notificaciones.map((notificacion, index) => (
            <tr
              key={notificacion.id}
              style={index % 2 === 0 ? styles.trEven : styles.trOdd}
            >
              <td style={styles.td}>{notificacion.id}</td>
              <td style={styles.td}>{notificacion.mensaje}</td>

              <td style={styles.td}>
                {notificacion.fechaCreacion
                  ? new Date(notificacion.fechaCreacion).toLocaleDateString()
                  : "No definido"}
              </td>

              <td style={styles.td}>
                {notificacion.fechaEnvio
                  ? new Date(notificacion.fechaEnvio).toLocaleDateString()
                  : "No definido"}
              </td>

              <td style={styles.td}>{notificacion.estado || "Procesando"}</td>
              <td style={styles.td}>
                {usuarios.find(
                  (usuario) => usuario.id === notificacion.usuario_id
                )?.nombre +
                  " " +
                  usuarios.find(
                    (usuario) => usuario.id === notificacion.usuario_id
                  )?.apellido || "No definido"}
              </td>
              <td style={styles.td}>
                {usuarios.find(
                  (usuario) => usuario.id === notificacion.usuario_id
                )?.email || "No definido"}
              </td>
              <td style={styles.td}>
                {tiposNotificacion.find(
                  (tipo) => tipo.id === notificacion.tipo_id
                )?.nombre || "No definido"}
              </td>

              <td style={styles.td}>
                <button
                  style={styles.button}
                  onClick={() => handleEdit(notificacion)}
                >
                  Editar
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleDelete(notificacion.id)}
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
            <h2>
              {editingNotificacion
                ? "Editar Notificación"
                : "Crear Notificación"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Mensaje"
                value={formData.mensaje || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                style={styles.input}
                required
              />
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
                type="date"
                placeholder="Fecha de Envío"
                value={formData.fechaEnvio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fechaEnvio: e.target.value })
                }
                style={styles.input}
                required
              />

              <input
                type="text"
                placeholder="Estado"
                value={formData.estado || ""}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                style={styles.input}
                required
              />
              <select
                value={formData.usuario_id || ""}
                onChange={handleUsuarioChange}
                style={styles.input}
                required
              >
                <option value="">Seleccione un Usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
              <select
                value={formData.tipo_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tipo_id: e.target.value })
                }
                style={styles.input}
                required
              >
                <option value="">Seleccione un Tipo de Notificación</option>
                {tiposNotificacion.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              <button type="submit" style={styles.submitButton}>
                {editingNotificacion ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={styles.button}
              >
                Cancelar
              </button>
            </form>
            {correoUsuarioSeleccionado && (
              <p>
                Correo del usuario seleccionado: {correoUsuarioSeleccionado}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarNotificacion;
