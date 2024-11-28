import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { confirmAction } from "../modalComponentes/ModalConfirm";
import Mapa from "./Mapa/Mapa";
import Cloudinary from "../modalComponentes/Cloudinary";

const AdministrarIncidente = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [polizas, setPolizas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tiposIncidente, setTiposIncidente] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIncidente, setEditingIncidente] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    poliza_id: "",
    tipo_incidente_id: "",
    fecha_incidente: "",
    descripcion: "",
    estado: "en_proceso",
    cobertura_id: 1,
    usuario_registro_id: "",
    imagen_1: "",
    imagen_2: "",
    imagen_3: "",
    imagen_4: "",
    descripcion_imagen: "",
    maps_url: "",
    fecha_reporte: "",
    estado_reporte: "",
    url_imagen: "",
    oficial_cargo: "",
    observacion: "",
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
  const handleImageUpload1 = (imageUrl) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      imagen_1: imageUrl, // Actualizar la descripción con la URL de la imagen
    }));
  };
  const handleImageUpload2 = (imageUrl) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      imagen_2: imageUrl, // Actualizar la descripción con la URL de la imagen
    }));
  };
  const handleImageUpload3 = (imageUrl) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      imagen_3: imageUrl, // Actualizar la descripción con la URL de la imagen
    }));
  };
  const handleImageUpload4 = (imageUrl) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      imagen_4: imageUrl, // Actualizar la descripción con la URL de la imagen
    }));
  };

  const handleImageUpload5 = (imageUrl) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      url_imagen: imageUrl, // Actualizar la descripción con la URL de la imagen
    }));
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

  const fetchTiposIncidente = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/tipo_incidente");
      setTiposIncidente(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentes();
    fetchUsuarios();
    fetchTiposIncidente();
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
  const getTipoIncidenteNombre = (id) => {
    const tipo = tiposIncidente.find((tipo) => tipo.id === id);
    return tipo ? tipo.nombre : "Desconocido";
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
          tipo_incidente_id: "",
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
      <h1 style={styles.h1}>ADMINISTRAR INCIDENTE</h1>
      <button style={styles.submitButton} onClick={() => setShowForm(true)}>
        Registrar Incidente
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Póliza</th>
            <th style={styles.th}>Tipo Incidente</th>
            <th style={styles.th}>Fecha Incidente</th>
            <th style={styles.th}>Descripción</th>
            <th style={styles.th}>Estado</th>
            {/*<th style={styles.th}>Cobertura</th>*/}
            <th style={styles.th}>Usuario Registro</th>
            <th style={styles.th}>Acciones</th>
            {/* <th style={styles.th}>ID</th>
            <th style={styles.th}>IMAGEN1</th>
            <th style={styles.th}>IMAGEN2</th>
            <th style={styles.th}>IMAGNE3</th>
            <th style={styles.th}>IMAGEN4</th>
            <th style={styles.th}>DESCRIPCION</th>
            <th style={styles.th}>Acciones</th>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>MAPA</th>
            <th style={styles.th}>Acciones</th>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Oficial</th>
            <th style={styles.th}>fecha_reporte</th>
            <th style={styles.th}>url_imagen</th>
            <th style={styles.th}>observacion</th>
            <th style={styles.th}>estado_reporte</th>
            <th style={styles.th}>Acciones</th>*/}
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
                <td style={styles.td}>
                  {getTipoIncidenteNombre(incidente.tipo_incidente_id)}
                </td>

                <td style={styles.td}>{incidente.fecha_incidente}</td>
                <td style={styles.td}>{incidente.descripcion}</td>
                <td style={styles.td}>{incidente.estado}</td>
                {/*<td style={styles.td}>{incidente.cobertura_id}</td>*/}
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
                {/*<td style={styles.td}>{incidente.id}</td>
                <td style={styles.td}>
                  {incidente.imagen_1 && (
                    <img
                      src={incidente.imagen_1}
                      alt="Imagen 1"
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </td>
                <td style={styles.td}>
                  {incidente.imagen_2 && (
                    <img
                      src={incidente.imagen_2}
                      alt="Imagen 2"
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </td>
                <td style={styles.td}>
                  {incidente.imagen_3 && (
                    <img
                      src={incidente.imagen_3}
                      alt="Imagen 3"
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </td>
                <td style={styles.td}>
                  {incidente.imagen_4 && (
                    <img
                      src={incidente.imagen_4}
                      alt="Imagen 4"
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </td>

                <td style={styles.td}>{incidente.descripcion_imagen}</td>

                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => handleEdit(incidente.id)}
                  >
                    Editar
                  </button>
                </td>

                <td style={styles.td}>{incidente.id}</td>
                <td style={styles.td}>{incidente.maps_url}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => handleEdit(incidente.id)}
                  >
                    Editar
                  </button>
                </td>

                <td style={styles.td}>{incidente.id}</td>
                <td style={styles.td}>{incidente.oficial_cargo}</td>
                <td style={styles.td}>{incidente.fecha_reporte}</td>
                <td style={styles.td}>
                  {incidente.imagen_4 && (
                    <img
                      src={incidente.url_imagen}
                      alt="Imagen 4"
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </td>
                <td style={styles.td}>{incidente.observacion}</td>
                <td style={styles.td}>{incidente.estado_reporte}</td>

                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => handleEdit(incidente.id)}
                  >
                    Editar
                  </button>
                </td>*/}
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
                Fecha y Hora del Incidente:
                <input
                  type="datetime-local"
                  style={styles.input}
                  value={formData.fecha_incidente || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_incidente: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Tipo Incidente:
                <select
                  style={styles.input}
                  value={formData.tipo_incidente_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_incidente_id: e.target.value, // Esto guarda el ID del tipo de incidente seleccionado
                    })
                  }
                >
                  <option value="" disabled>
                    Seleccionar Tipo de Incidente
                  </option>
                  {tiposIncidente.map((tipo_incidente) => (
                    <option key={tipo_incidente.id} value={tipo_incidente.id}>
                      {tipo_incidente.nombre}
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

              {/*<Cloudinary onImageUpload={handleImageUpload1} />
              <textarea
                placeholder="enlace"
                value={formData.imagen_1 || ""}
                readOnly // Este campo se llenará automáticamente con la URL de la imagen
              />

              <Cloudinary onImageUpload={handleImageUpload2} />
              <textarea
                placeholder="enlace"
                value={formData.imagen_2 || ""}
                readOnly // Este campo se llenará automáticamente con la URL de la imagen
              />

              <Cloudinary onImageUpload={handleImageUpload3} />
              <textarea
                placeholder="enlace"
                value={formData.imagen_3 || ""}
                readOnly // Este campo se llenará automáticamente con la URL de la imagen
              />

              <Cloudinary onImageUpload={handleImageUpload4} />
              <textarea
                placeholder="enlace"
                value={formData.imagen_4 || ""}
                readOnly // Este campo se llenará automáticamente con la URL de la imagen
              />

              <label>
                Descripción:
                <textarea
                  style={styles.input}
                  value={formData.descripcion_imagen || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descripcion_imagen: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Oficial a Cargo
                <input
                  type="text"
                  style={styles.input}
                  value={formData.oficial_cargo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      oficial_cargo: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Fecha y Hora del Incidente:
                <input
                  type="datetime-local"
                  style={styles.input}
                  value={formData.fecha_incidente || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_incidente: e.target.value,
                    })
                  }
                />
              </label>

              <Cloudinary onImageUpload={handleImageUpload5} />
              <textarea
                placeholder="enlace"
                value={formData.url_imagen || ""}
                readOnly // Este campo se llenará automáticamente con la URL de la imagen
              />

              <label>
                Observacion
                <input
                  type="text"
                  style={styles.input}
                  value={formData.observacion || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      observacion: e.target.value,
                    })
                  }
                />
              </label>*/}

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

export default AdministrarIncidente;

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
