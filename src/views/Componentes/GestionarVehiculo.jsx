import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { confirmAction } from "./modalComponentes/ModalConfirm";
import Cloudinary from "./modalComponentes/Cloudinary";

const GestionarVehiculo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [showForm, setShowForm] = useState(false);
  const searchInput = useRef(null);
  const [usuarios, setUsuarios] = useState([]);
  const [tipoVehiculos, setTipoVehiculos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [creatingVehiculo, setCreatingVehiculo] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageToShow, setImageToShow] = useState("");

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

  const fetchTipoVehiculo = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/tipo_vehiculo"
      );
      if (!response.ok)
        throw new Error("Error al obtener los tipos de vehículo"); // Corrected message
      const data = await response.json();
      setTipoVehiculos(data); // Corrected variable name
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchModelo = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/modelo_vehiculo"
      );
      if (!response.ok) throw new Error("Error al obtener los modelos"); // Corrected message
      const data = await response.json();
      setModelos(data); // Corrected variable name
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarca = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/marca"
      ); // Corrected URL case
      if (!response.ok) throw new Error("Error al obtener las marcas"); // Corrected message
      const data = await response.json();
      setMarcas(data); // Corrected variable name
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchVehiculos = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/vehiculos"
      ); // Corrected URL case
      if (!response.ok) throw new Error("Error al obtener los vehiculos"); // Corrected message
      const data = await response.json();
      setVehiculos(data); // Corrected variable name
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchModelo();
    fetchTipoVehiculo();
    fetchMarca();
    fetchVehiculos();
  }, []);

  const handleEdit = (vehiculo) => {
    setEditingVehiculo(vehiculo);
    setFormData(vehiculo);
  };
  const closeModal = () => {
    setShowImageModal(false);
    setImageToShow(""); // Limpiar la imagen cuando se cierre el modal
  };

  const handleImageClick = (imageUrl) => {
    setImageToShow(imageUrl); // Establecer la imagen seleccionada
    setShowImageModal(true); // Mostrar el modal
  };

  const handleCreate = () => {
    setCreatingVehiculo(true);
    setFormData({ nombre: "" }); // Limpiar el formulario para una nueva marca
  };

  const userId = localStorage.getItem("userId");

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

  const handleImageUpload = (imageUrl) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      url_imagen: imageUrl, // Actualizar la descripción con la URL de la imagen
    }));
  };

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await fetch(
          `https://backend-seguros.campozanodevlab.com/api/vehiculos/${id}`,
          {
            method: "DELETE",
          }
        );
        setVehiculos(vehiculos.filter((vehiculo) => vehiculo.id !== id));
  
        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó el Vehículo ID: ${id}`,
          ip: userIp,
        };
  
        await logAction(logData);
      } catch (error) {
        setError("Error al eliminar el vehículo");
        console.error("Error al eliminar el vehículo:", error);
      }
    });
  };
  

  const logAction = async (logData) => {
    const token = "simulated-token"; // Aquí deberías usar un token válido si es necesario
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
      console.error("Error al registrar la acción en la bitácora:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        // Obtener el vehículo que se está editando antes de la actualización
        const previousVehiculoResponse = await fetch(
          `https://backend-seguros.campozanodevlab.com/api/vehiculos/${editingVehiculo.id}`
        );
        const previousVehiculo = await previousVehiculoResponse.json();
  
        const response = await fetch(
          `https://backend-seguros.campozanodevlab.com/api/vehiculos/${editingVehiculo.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const updatedVehiculo = await response.json();
        setVehiculos((prev) =>
          prev.map((vehiculo) =>
            vehiculo.id === updatedVehiculo.id ? updatedVehiculo : vehiculo
          )
        );
  
        const userIp = await getUserIp();
        const attributesToCheck = [
          "anio",
          "placa",
          "kilometraje",
          "fecha_Adquisicion",
          "url_imagen",
          "marca_id",
          "modelo_id",
          "tipoVehiculo_id",
          "propietario_id",
        ];
        const editedAttribute = attributesToCheck.find(
          (key) => formData[key] !== previousVehiculo[key]
        );
  
        let logDetails = "";
        if (editedAttribute) {
          logDetails = `Atributo editado: ${editedAttribute}`; // Detalle del atributo editado
        }
  
        const logData = {
          usuario_id: userId,
          accion: "Editó",
          detalles: `El Usuario ID: ${userId} editó el Vehículo ID: ${editingVehiculo.id}. ${logDetails}`,
          ip: userIp,
        };
  
        fetchVehiculos(); // Asumiendo que tienes una función para refrescar la lista de vehículos
        await logAction(logData);
        setEditingVehiculo(null);
      } catch (error) {
        setError("Error al actualizar el vehículo");
        console.error("Error al actualizar el vehículo:", error);
      }
    });
  };
  

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
    formContainer: {
      maxHeight: "400px", // Altura máxima del formulario
      overflowY: "auto", // Habilitar scroll vertical si excede la altura
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Año",
      dataIndex: "anio",
      key: "anio",
      ...getColumnSearchProps("anio"),
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Placa",
      dataIndex: "placa",
      key: "placa",
      ...getColumnSearchProps("placa"),
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Kilometraje",
      dataIndex: "kilometraje",
      key: "kilometraje",
      ...getColumnSearchProps("kilometraje"),
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Fecha de Adquisicion",
      dataIndex: "fecha_adquisicion",
      key: "fecha_adquisicion",
      ...getColumnSearchProps("fecha_adquisicion"),
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Imagen",
      dataIndex: "url_imagen",
      key: "url_imagen",
      render: (text) => (
        <img
          src={text}
          alt="Vehículo"
          style={{ width: 50, height: 50, objectFit: "cover" }}
          onClick={() => handleImageClick(text)} // Abre el modal al hacer clic en la imagen
        />
      ),
    },
    {
      title: "Marca",
      dataIndex: "marca_id",
      key: "marca_id",
      render: (marca_id) =>
        marcas.find((marca) => marca.id === marca_id)?.nombre || "No definido",
    },

    {
      title: "Modelo",
      dataIndex: "modelo_id",
      key: "modelo_id",
      render: (modelo_id) =>
        modelos.find((modelo) => modelo.id === modelo_id)?.nombre ||
        "No definido",
    },
    {
      title: "Tipo Vehículo",
      dataIndex: "tipoVehiculo_id",
      key: "tipoVehiculo_id",
      render: (tipoVehiculo_id) =>
        tipoVehiculos.find(
          (tipo_vehiculo) => tipo_vehiculo.id === tipoVehiculo_id
        )?.nombre || "No definido",
    },
    {
      title: "Propietario",
      dataIndex: "propietario_id",
      key: "propietario_id",
      render: (propietario_id) => {
        const usuario = usuarios.find(
          (usuario) => usuario.id === propietario_id
        );
        return usuario
          ? `${usuario.nombre} ${usuario.apellido} - CI: ${usuario.ci}`
          : "No definido";
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, vehiculo) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(vehiculo)}>Editar</Button>
          <Button onClick={() => handleDelete(vehiculo.id)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR VEHÍCULOS</h1>
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: "20px" }}
      >
        Crear Vehículo
      </Button>
      <Table
        columns={columns}
        dataSource={vehiculos}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={loading}
        locale={{
          emptyText: "No se encontraron resultados",
        }}
      />

      {showImageModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.imageModal}>
            <img
              src={imageToShow}
              alt="Imagen Grande"
              style={{
                maxWidth: "80%",
                maxHeight: "80%",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      )}

      {(editingVehiculo || creatingVehiculo) && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>{editingVehiculo ? "Editar Vehículo" : "Crear Vehículo"}</h2>
            <div style={styles.formContainer}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="anio">Año:</label>
                <input
                  type="text"
                  id="anio"
                  name="anio"
                  value={formData.anio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, anio: e.target.value })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="placa">Placa:</label>
                <input
                  type="text"
                  id="placa"
                  name="placa"
                  value={formData.placa || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, placa: e.target.value })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="kilometraje">Kilometraje:</label>
                <input
                  type="number"
                  id="kilometraje"
                  name="kilometraje"
                  value={formData.kilometraje || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, kilometraje: e.target.value })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="fecha_adquisicion">Fecha de Adquisición:</label>
                <input
                  type="date"
                  id="fecha_adquisicion"
                  name="fecha_adquisicion"
                  value={formData.fecha_adquisicion || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_adquisicion: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                />

                <Cloudinary onImageUpload={handleImageUpload} />
                <label htmlFor="url_imagen">URL Imagen:</label>
                <input
                  type="text"
                  id="url_imagen"
                  name="url_imagen"
                  value={formData.url_imagen || ""}
                  readOnly // Hacer el campo de texto de solo lectura
                  required
                  style={styles.input}
                  onClick={() => handleImageClick(formData.url_imagen)} // Cambiar a formData.url_imagen
                />

               

                <label htmlFor="marca_id">Marca:</label>
                <select
                  id="marca_id"
                  value={formData.marca_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, marca_id: e.target.value })
                  }
                  required
                  style={styles.input}
                >
                  <option value="">Seleccionar Marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>

                <label htmlFor="modelo_id">Modelo:</label>
                <select
                  id="modelo_id"
                  value={formData.modelo_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, modelo_id: e.target.value })
                  }
                  required
                  style={styles.input}
                >
                  <option value="">Seleccionar Modelo</option>
                  {modelos.map((modelo) => (
                    <option key={modelo.id} value={modelo.id}>
                      {modelo.nombre}
                    </option>
                  ))}
                </select>

                <label htmlFor="tipoVehiculo_id">Tipo Vehículo:</label>
                <select
                  id="tipoVehiculo_id"
                  value={formData.tipoVehiculo_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoVehiculo_id: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                >
                  <option value="">Seleccionar Tipo Vehículo</option>
                  {tipoVehiculos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>

                <label htmlFor="propietario_id">Propietario:</label>
                <select
                  id="propietario_id"
                  value={formData.propietario_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, propietario_id: e.target.value })
                  }
                  required
                  style={styles.input}
                >
                  <option value="">Seleccionar Propietario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {`${usuario.nombre} ${usuario.apellido} - CI: ${usuario.ci}`}
                    </option>
                  ))}
                </select>

                <div>
                  <button type="submit" style={styles.submitButton}>
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVehiculo(null);
                      setCreatingVehiculo(false); // Cerrar modal de creación
                      setFormData({});
                    }}
                    style={styles.submitButton}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarVehiculo;
