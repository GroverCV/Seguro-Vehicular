import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { confirmAction } from "./modalComponentes/ModalConfirm";
import Cloudinary from "./modalComponentes/Cloudinary";
import { api } from "../../api/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";




const GestionarVehiculo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
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

  const [currentPage, setCurrentPage] = useState(1); // Página actual

  const downloadPDF = () => {
    if (!formData.propietario_id) {
      alert("Por favor, selecciona un propietario para descargar su reporte.");
      return;
    }

    const vehiculosFiltrados = vehiculos.filter(
      (vehiculo) => vehiculo.propietario_id === parseInt(formData.propietario_id)
    );

    if (vehiculosFiltrados.length === 0) {
      alert("No hay vehículos para el propietario seleccionado.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Reporte de Vehículos por Propietario", 14, 20);

    const tableColumn = ["ID", "Año", "Placa", "Kilometraje", "Marca", "Modelo"];
    const tableRows = vehiculosFiltrados.map((vehiculo) => {
      const marca =
        marcas.find((marca) => marca.id === vehiculo.marca_id)?.nombre || "N/A";
      const modelo =
        modelos.find((modelo) => modelo.id === vehiculo.modelo_id)?.nombre ||
        "N/A";

      return [
        vehiculo.id,
        vehiculo.anio,
        vehiculo.placa,
        vehiculo.kilometraje,
        marca,
        modelo,
      ];
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save(`reporte_vehiculos_propietario_${formData.propietario_id}.pdf`);
  };

  const downloadExcel = () => {
    if (!formData.propietario_id) {
      alert("Por favor, selecciona un propietario para descargar su reporte.");
      return;
    }

    const vehiculosFiltrados = vehiculos.filter(
      (vehiculo) => vehiculo.propietario_id === parseInt(formData.propietario_id)
    );

    if (vehiculosFiltrados.length === 0) {
      alert("No hay vehículos para el propietario seleccionado.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      vehiculosFiltrados.map((vehiculo) => ({
        ID: vehiculo.id,
        Año: vehiculo.anio,
        Placa: vehiculo.placa,
        Kilometraje: vehiculo.kilometraje,
        Marca:
          marcas.find((marca) => marca.id === vehiculo.marca_id)?.nombre ||
          "N/A",
        Modelo:
          modelos.find((modelo) => modelo.id === vehiculo.modelo_id)?.nombre ||
          "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Vehículos Propietario ${formData.propietario_id}`
    );
    XLSX.writeFile(
      workbook,
      `reporte_vehiculos_propietario_${formData.propietario_id}.xlsx`
    );
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

  const fetchTipoVehiculo = async () => {
    try {
      const response = await api.get("/api/tipo_vehiculo");
      setTipoVehiculos(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchModelo = async () => {
    try {
      const response = await api.get("/api/modelo_vehiculo");
      setModelos(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarca = async () => {
    try {
      const response = await api.get("/api/marca");
      setMarcas(response.data);
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
        await api.delete(`/api/vehiculos/${id}`);
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
      await api.post("/api/bitacora", logData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error al registrar la acción en la bitácora:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        let previousVehiculo = null;
        if (editingVehiculo) {
          const previousVehiculoResponse = await api.get(
            `/api/vehiculos/${editingVehiculo.id}`
          );
          previousVehiculo = previousVehiculoResponse.data;
        }

        const method = editingVehiculo ? "PUT" : "POST";
        const url = editingVehiculo
          ? `/api/vehiculos/${editingVehiculo.id}`
          : "/api/vehiculos";

        const response = await api.request({
          method: method,
          url: url,
          data: formData,
        });

        const updatedVehiculo = response.data;

        if (method === "PUT") {
          setVehiculos((prev) =>
            prev.map((vehiculo) =>
              vehiculo.id === updatedVehiculo.id ? updatedVehiculo : vehiculo
            )
          );
        } else {
          setVehiculos((prev) => [updatedVehiculo, ...prev]);
        }

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

        let logDetails = "";
        if (editingVehiculo) {
          const editedAttribute = attributesToCheck.find(
            (key) => formData[key] !== previousVehiculo[key]
          );
          if (editedAttribute) {
            logDetails = `Atributo editado: ${editedAttribute}`;
          }
        } else {
          logDetails = `Se creó un nuevo vehículo.`;
        }

        const logData = {
          usuario_id: userId,
          accion: editingVehiculo ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingVehiculo ? "editó" : "creó"
          } el Vehículo ID: ${
            editingVehiculo ? editingVehiculo.id : updatedVehiculo.id
          }. ${logDetails}`,
          ip: userIp,
        };

        fetchVehiculos();
        await logAction(logData);
        setEditingVehiculo(null);
      } catch (error) {
        setError("Error al actualizar o crear el vehículo");
        console.error("Error al actualizar o crear el vehículo:", error);
      }
      setEditingVehiculo(null);
      setCreatingVehiculo(false);
    });
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
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Año",
      dataIndex: "anio",
      key: "anio",
      ...getColumnSearchProps("anio"),
    },
    {
      title: "Placa",
      dataIndex: "placa",
      key: "placa",
      ...getColumnSearchProps("placa"),
    },
    {
      title: "Kilometraje",
      dataIndex: "kilometraje",
      key: "kilometraje",
      ...getColumnSearchProps("kilometraje"),
    },
    {
      title: "Fecha de Adquisicion",
      dataIndex: "fecha_adquisicion",
      key: "fecha_adquisicion",
      ...getColumnSearchProps("fecha_adquisicion"),
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

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", alignItems: "center" }}>
  <select
    value={formData.propietario_id || ""}
    onChange={(e) =>
      setFormData({ ...formData, propietario_id: e.target.value })
    }
    style={{
      width: "250px",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    }}
  >
    <option value="">Seleccionar Propietario</option>
    {usuarios.map((usuario) => (
      <option key={usuario.id} value={usuario.id}>
        {`${usuario.nombre} ${usuario.apellido} - CI: ${usuario.ci}`}
      </option>
    ))}
  </select>

  <Button
    onClick={downloadPDF}
    type="primary"
    disabled={!formData.propietario_id}
    style={{
      backgroundColor: "#007bff",
      borderColor: "#007bff",
      color: "#fff",
      padding: "10px 20px",
      fontSize: "14px",
      borderRadius: "5px",
    }}
  >
    Descargar PDF
  </Button>
  <Button
    onClick={downloadExcel}
    type="default"
    disabled={!formData.propietario_id}
    style={{
      backgroundColor: "#f5f5f5",
      borderColor: "#dcdcdc",
      color: "#333",
      padding: "10px 20px",
      fontSize: "14px",
      borderRadius: "5px",
    }}
  >
    Descargar Excel
  </Button>
</div>


      <div style={{ display: "flex", gap: "15px" }}>



  </div>
      <Button
        type="primary"
        onClick={() => {
          setCreatingVehiculo(true);
          setEditingVehiculo(null);
          setFormData({}); // Limpiar el formulario para la creación
        }}
        style={{ marginBottom: "20px" }}
      >
        Crear Vehículo
      </Button>
      <Table
        dataSource={vehiculos} // Usa paginatedData aquí
        columns={columns} // Coloca las columnas aquí
        pagination={{
          current: currentPage,
          pageSize: 5, // Tamaño de página directamente aquí
          total: vehiculos.length, // Total de datos para la paginación
          onChange: (page) => setCurrentPage(page),
        }}
        loading={loading}
        rowKey="id" // Asegúrate de que 'id' sea la clave única en tu data
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

                <button type="submit" style={styles.submitButton}>
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingVehiculo(null);
                    setCreatingVehiculo(false);
                    setFormData({}); // Limpiar el formulario al cancelar
                  }}
                  style={styles.submitButton}
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarVehiculo;


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
