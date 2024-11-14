import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { confirmAction } from "./modalComponentes/ModalConfirm";
import { api } from "../../api/axios";

const GestionarValorComercial = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [valorComercial, setValorComercial] = useState([]);
  const [editingValorComercial, seteditingValorComercial] = useState(null); // Estado para editar valor comercial
  const [creatingValorComercial, setCreatingValorComercial] = useState(false); // Estado para crear valor comercial
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  useEffect(() => {
    fetchValorComercial();
    fetchVehiculos();
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
  
  const fetchVehiculos = async () => {
    try {
      const response = await api.get("/api/vehiculos");
      setVehiculos(response.data);
    } catch (error) {
      message.error("Error al cargar los datos de vehiculos");
    } finally {
      setLoading(false);
    }
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
            Restablecer
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleEdit = (valorComercial) => {
    seteditingValorComercial(valorComercial); // Cambia el estado de edición
    setFormData(valorComercial); // Establece los datos del formulario para editar
  };

  const userId = localStorage.getItem("userId");

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await api.delete(`/api/valor_comercial/${id}`);
        setValorComercial(
          valorComercial.filter((valorComercial) => valorComercial.id !== id)
        );
  
        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó el Valor Comercial ID: ${id}`,
          ip: userIp,
        };
  
        await logAction(logData);
      } catch (error) {
        setError("Error al eliminar el Valor Comercial");
        console.error("Error al eliminar el Valor Comercial:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        // Si se está editando un valor comercial, obtenemos el anterior; si no, no es necesario
        let previousValorComercial = null;
        if (editingValorComercial) {
          const previousValorComercialResponse = await api.get(
            `/api/valor_comercial/${editingValorComercial.id}`
          );
          previousValorComercial = previousValorComercialResponse.data;
        }
  
        const method = editingValorComercial ? "PUT" : "POST"; // Determinar el método
        const url = editingValorComercial
          ? `/api/valor_comercial/${editingValorComercial.id}`
          : `/api/valor_comercial`; // URL para crear o editar
  
        const response = await api({
          method: method,
          url: url,
          data: formData, // Envía los datos del formulario
        });
  
        const updatedValorComercial = response.data;
  
        if (method === "PUT") {
          setValorComercial((prev) =>
            prev.map((valorComercial) =>
              valorComercial.id === updatedValorComercial.id
                ? updatedValorComercial
                : valorComercial
            )
          );
        } else {
          setValorComercial((prev) => [updatedValorComercial, ...prev]); // Agregar el nuevo valor comercial
        }
  
        const userIp = await getUserIp();
        const attributesToCheck = [
          "valor_inicial",
          "valor_actual",
          "fecha_valor",
          "tasa_depreciacion",
          "anos_depreciacion",
        ];
  
        let logDetails = "";
        if (editingValorComercial) {
          const editedAttribute = attributesToCheck.find(
            (key) => formData[key] !== previousValorComercial[key]
          );
          if (editedAttribute) {
            logDetails = `Atributo editado: ${editedAttribute}`; // Detalle del atributo editado
          }
        } else {
          logDetails = `Se creó un nuevo valor comercial.`; // Mensaje para creación
        }
  
        const logData = {
          usuario_id: userId,
          accion: editingValorComercial ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingValorComercial ? "editó" : "creó"
          } el Valor Comercial ID: ${
            editingValorComercial
              ? editingValorComercial.id
              : updatedValorComercial.id
          }. ${logDetails}`,
          ip: userIp,
        };
  
        fetchValorComercial();
        await logAction(logData);
        seteditingValorComercial(null); // Limpiar el estado de edición después de la operación
      } catch (error) {
        setError("Error al actualizar o crear el valor comercial");
        console.error("Error al actualizar o crear el valor comercial:", error);
      }
      seteditingValorComercial(null);
      setCreatingValorComercial(false); // Si usas esta variable para indicar la creación
    });
  };
  

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Vehiculo",
      dataIndex: "vehiculo_id",
      key: "vehiculo_id",
      render: (vehiculo_id) =>
        vehiculos.find((vehiculo) => vehiculo.id === vehiculo_id)?.placa ||
        "No definido",
    },

    {
      title: "Valor Inicial",
      dataIndex: "valor_inicial",
      ...getColumnSearchProps("valor_inicial"),
    },
    {
      title: "Valor Actual",
      dataIndex: "valor_actual",
      ...getColumnSearchProps("valor_actual"),
    },
    {
      title: "Fecha de Valor",
      dataIndex: "fecha_valor",
      ...getColumnSearchProps("fecha_valor"),
    },
    {
      title: "Tasa de Depreciación Porcentaje %",
      dataIndex: "tasa_depreciacion",
      ...getColumnSearchProps("tasa_depreciacion"),
    },
    {
      title: "Años de Depreciación",
      dataIndex: "anos_depreciacion",
      ...getColumnSearchProps("anos_depreciacion"),
    },
    {
      title: "Acciones",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Editar</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR VALOR COMERCIAL</h1>
      <Button
        type="primary"
        onClick={() => {
          setCreatingValorComercial(true);
          seteditingValorComercial(null);
          setFormData({}); // Limpiar el formulario para la creación
        }}
        style={{ marginBottom: "20px" }}
      >
        Crear Valor Comercial
      </Button>
      <Table
        dataSource={valorComercial} // Usa paginatedData aquí
        columns={columns} // Coloca las columnas aquí
        pagination={{
          current: currentPage,
          pageSize: 5, // Tamaño de página directamente aquí
          total: valorComercial.length, // Total de datos para la paginación
          onChange: (page) => setCurrentPage(page),
        }}
        loading={loading}
        rowKey="id" // Asegúrate de que 'id' sea la clave única en tu data
      />

      {(editingValorComercial || creatingValorComercial) && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>
              {editingValorComercial ? "Editar Vehículo" : "Crear Vehículo"}
            </h2>
            <div style={styles.formContainer}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="vehiculo_id">Placa Vehículo:</label>

                <select
                  id="vehiculo_id"
                  value={formData.vehiculo_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehiculo_id: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                >
                  <option value="">Seleccionar Vehículo</option>
                  {vehiculos.map((vehiculos) => (
                    <option key={vehiculos.id} value={vehiculos.id}>
                      {vehiculos.placa}
                    </option>
                  ))}
                </select>

                {/* Nuevos campos para los atributos adicionales */}
                <label htmlFor="valor_inicial">Valor Inicial:</label>
                <input
                  type="number"
                  id="valor_inicial"
                  name="valor_inicial"
                  value={formData.valor_inicial || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_inicial: e.target.value })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="valor_actual">Valor Actual:</label>
                <input
                  type="number"
                  id="valor_actual"
                  name="valor_actual"
                  value={formData.valor_actual || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_actual: e.target.value })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="fecha_valor">Fecha de Valor:</label>
                <input
                  type="date"
                  id="fecha_valor"
                  name="fecha_valor"
                  value={formData.fecha_valor || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_valor: e.target.value })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="tasa_depreciacion">Tasa de Depreciación:</label>
                <input
                  type="number"
                  id="tasa_depreciacion"
                  name="tasa_depreciacion"
                  value={formData.tasa_depreciacion|| ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tasa_depreciacion: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="anos_depreciacion">Años de Depreciación:</label>
                <input
                  type="number"
                  id="anos_depreciacion"
                  name="anos_depreciacion"
                  value={formData.anos_depreciacion || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      anos_depreciacion: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                />

                <button type="submit" style={styles.submitButton}>
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    seteditingValorComercial(null);
                    setCreatingValorComercial(false);
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

export default GestionarValorComercial;
