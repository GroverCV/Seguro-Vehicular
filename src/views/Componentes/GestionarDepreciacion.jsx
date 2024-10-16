import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { confirmAction } from "./modalComponentes/ModalConfirm";

const GestionarDepreciacion = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [depreciacion, setDepreciacion] = useState([]);
  const [valorComercial, setValorComercial] = useState([]);
  const [editingDepreciacion, setEditingDepreciacion] = useState(null); // Estado para editar depreciación
  const [creatingDepreciacion, setCreatingDepreciacion] = useState(false); // Estado para crear depreciación
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  useEffect(() => {
    fetchDepreciacion();
    fetchValorComercial();
  }, []);

  const fetchDepreciacion = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/depreciacion"
      );
      const result = await response.json();
      setDepreciacion(result);
    } catch (error) {
      message.error("Error al cargar los datos de depreciación");
    } finally {
      setLoading(false);
    }
  };

  const fetchValorComercial = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/valor_comercial"
      );
      const result = await response.json();
      setValorComercial(result);
    } catch (error) {
      message.error("Error al cargar los datos de valor comercial");
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

  const handleEdit = (depreciacion) => {
    setEditingDepreciacion(depreciacion); // Cambia el estado de edición
    setFormData(depreciacion); // Establece los datos del formulario para editar
  };

  const userId = localStorage.getItem("userId");

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await fetch(
          `https://backend-seguros.campozanodevlab.com/api/depreciacion/${id}`,
          {
            method: "DELETE",
          }
        );
        setDepreciacion(
          depreciacion.filter((depreciacion) => depreciacion.id !== id)
        );

        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó la Depreciación ID: ${id}`,
          ip: userIp,
        };

        await logAction(logData);
      } catch (error) {
        setError("Error al eliminar la Depreciación");
        console.error("Error al eliminar la Depreciación:", error);
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
        let previousDepreciacion = null;
        if (editingDepreciacion) {
          const previousDepreciacionResponse = await fetch(
            `https://backend-seguros.campozanodevlab.com/api/depreciacion/${editingDepreciacion.id}`
          );
          if (!previousDepreciacionResponse.ok) {
            throw new Error("Error al obtener la depreciación anterior");
          }
          previousDepreciacion = await previousDepreciacionResponse.json();
        }

        const method = editingDepreciacion ? "PUT" : "POST";
        const url = editingDepreciacion
          ? `https://backend-seguros.campozanodevlab.com/api/depreciacion/${editingDepreciacion.id}`
          : `https://backend-seguros.campozanodevlab.com/api/depreciacion`;

        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const updatedDepreciacion = await response.json();

        if (method === "PUT") {
          setDepreciacion((prev) =>
            prev.map((depreciacion) =>
              depreciacion.id === updatedDepreciacion.id
                ? updatedDepreciacion
                : depreciacion
            )
          );
        } else {
          setDepreciacion((prev) => [updatedDepreciacion, ...prev]);
        }

        const userIp = await getUserIp();
        const attributesToCheck = [
          "valor_inicial",
          "valor_depreciado",
          "fecha_depreciacion",
          "motivo_depreciacion",
        ];

        let logDetails = "";
        if (editingDepreciacion) {
          const editedAttribute = attributesToCheck.find(
            (key) => formData[key] !== previousDepreciacion[key]
          );
          if (editedAttribute) {
            logDetails = `Atributo editado: ${editedAttribute}`;
          }
        } else {
          logDetails = `Se creó una nueva depreciación.`;
        }

        const logData = {
          usuario_id: userId,
          accion: editingDepreciacion ? "Editó" : "Creó",
          detalles: `El Usuario ID: ${userId} ${
            editingDepreciacion ? "editó" : "creó"
          } la Depreciación ID: ${
            editingDepreciacion
              ? editingDepreciacion.id
              : updatedDepreciacion.id
          }. ${logDetails}`,
          ip: userIp,
        };

        await logAction(logData);
        fetchDepreciacion();
        setEditingDepreciacion(null);
      } catch (error) {
        setError(
          `Error al actualizar o crear la depreciación: ${error.message}`
        );
        console.error("Error al actualizar o crear la depreciación:", error);
      }
      setEditingDepreciacion(null);
      setCreatingDepreciacion(false);
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      ...getColumnSearchProps("id"),
    },

    {
      title: "Valor Comercial_ID",
      dataIndex: "valor_comercial_id",
      key: "valor_comercial_id",
      render: (valor_comercial_id) =>
        valorComercial.find(
          (valorComercial) => valorComercial.id === valor_comercial_id
        )?.id || "No definido",
      ...getColumnSearchProps("valor_comercial_id"),
    },
    {
      title: "Valor Inicial",
      dataIndex: "valor_inicial",
      ...getColumnSearchProps("valor_inicial"),
    },

    {
      title: "Valor Depreciacion",
      dataIndex: "valor_depreciado",
      ...getColumnSearchProps("valor_depreciado"),
    },

    {
      title: "Fecha Depreciacion",
      dataIndex: "fecha_depreciacion",
      ...getColumnSearchProps("fecha_depreciacion"),
    },
    {
      title: "Motivo Depreciacion",
      dataIndex: "motivo_depreciacion",
      ...getColumnSearchProps("motivo_depreciacion"),
    },

    {
      title: "Acciones",
      key: "action",
      render: (_, record) => (
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
      <h1 style={styles.h1}>GESTIONAR DEPRECIACIÓN</h1>
      <Button
        type="primary"
        onClick={() => {
          setCreatingDepreciacion(true);
          setEditingDepreciacion(null);
          setFormData({}); // Limpiar el formulario para la creación
        }}
        style={{ marginBottom: "20px" }}
      >
        Crear Depreciación
      </Button>
      <Table
        dataSource={depreciacion} // Usa aquí los datos de depreciación
        columns={columns} // Coloca las columnas aquí
        pagination={{
          current: currentPage,
          pageSize: 5,
          total: depreciacion.length, // Total de datos para la paginación
          onChange: (page) => setCurrentPage(page),
        }}
        loading={loading}
        rowKey="id" // Asegúrate de que 'id' sea la clave única en tu data
      />

      {(editingDepreciacion || creatingDepreciacion) && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>
              {editingDepreciacion
                ? "Editar Depreciación"
                : "Crear Depreciación"}
            </h2>
            <div style={styles.formContainer}>
              <form onSubmit={handleSubmit}>

                <label htmlFor="valor_comercial_id">ID Valor Comercial:</label>

                <select
                  id="valor_comercial_id"
                  value={formData.valor_comercial_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valor_comercial_id: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                >
                  <option value="">Seleccionar Valor Comercial</option>
                  {valorComercial.map((valor_comercial) => (
                    <option key={valor_comercial.id} value={valor_comercial.id}>
                      {valor_comercial.id}
                    </option>
                  ))}
                </select>

                <label htmlFor="valor_inicial">Valor Inicial:</label>
                <input
                  type="number"
                  id="valor_inicial"
                  value={formData.valor_inicial || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valor_inicial: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="valor_depreciado">Valor Depreciado:</label>
                <input
                  type="number"
                  id="valor_depreciado"
                  value={formData.valor_depreciado || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valor_depreciado: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="fecha_depreciacion">Fecha Depreciacion:</label>
                <input
                  type="date"
                  id="fecha_depreciacion"
                  value={formData.fecha_depreciacion || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_depreciacion: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                />

                <label htmlFor="motivo_depreciacion">
                  Motivo Depreciacion:
                </label>
                <input
                  type="text"
                  id="motivo_depreciacion"
                  value={formData.motivo_depreciacion || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      motivo_depreciacion: e.target.value,
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
                    setEditingDepreciacion(null);
                    setCreatingDepreciacion(false);
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

export default GestionarDepreciacion;
