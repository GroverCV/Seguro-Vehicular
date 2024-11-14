import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { confirmAction } from "./modalComponentes/ModalConfirm";
import { api } from "../../api/axios";

const GestionarMarca = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMarca, setEditingMarca] = useState(null);
  const [creatingMarca, setCreatingMarca] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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

  useEffect(() => {
    fetchMarca();
  }, []);

  const handleEdit = (marca) => {
    setEditingMarca(marca);
    setFormData(marca);
  };

  const handleCreate = () => {
    setCreatingMarca(true);
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

  const handleDelete = async (id) => {
    confirmAction(async () => {
      try {
        await api.delete(`/api/marca/${id}`);
        setMarcas(marcas.filter((marca) => marca.id !== id));
  
        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó la Marca ID: ${id}`,
          ip: userIp,
        };
  
        await logAction(logData);
      } catch (error) {
        setError("Error al eliminar la marca");
        console.error("Error al eliminar la marca:", error);
      }
    });
  };
  
  const logAction = async (logData) => {
    const token = "simulated-token";
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
        if (creatingMarca) {
          // Si estamos creando una nueva marca
          const response = await api.post("/api/marca", formData, {
            headers: { "Content-Type": "application/json" },
          });
          const newMarca = response.data;
          setMarcas([...marcas, newMarca]);
  
          const userIp = await getUserIp();
          const logData = {
            usuario_id: userId,
            accion: "Creó",
            detalles: `El Usuario ID: ${userId} creó una nueva Marca: ${newMarca.nombre}`,
            ip: userIp,
          };
          await logAction(logData);
          setCreatingMarca(false); // Cerrar el modal de creación
        } else {
          // Si estamos editando una marca existente
          const previousMarcaResponse = await api.get(`/api/marca/${editingMarca.id}`);
          const previousMarca = previousMarcaResponse.data;
  
          const response = await api.put(`/api/marca/${editingMarca.id}`, formData, {
            headers: { "Content-Type": "application/json" },
          });
          const updatedMarca = response.data;
          setMarcas((prev) =>
            prev.map((marca) =>
              marca.id === updatedMarca.id ? updatedMarca : marca
            )
          );
  
          const userIp = await getUserIp();
          const attributesToCheck = ["Nombre"];
          const editedAttribute = attributesToCheck.find(
            (key) => formData[key] !== previousMarca[key]
          );
  
          let logDetails = "";
          if (editedAttribute) {
            logDetails = `Atributo editado: ${editedAttribute}`;
          }
  
          const logData = {
            usuario_id: userId,
            accion: "Editó",
            detalles: `El Usuario ID: ${userId} editó la Marca ID: ${editingMarca.id}. ${logDetails}`,
            ip: userIp,
          };
  
          await logAction(logData);
          setEditingMarca(null);
        }
        fetchMarca();
      } catch (error) {
        setError("Error al guardar la marca");
        console.error("Error al guardar la marca:", error);
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
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
          <Button onClick={() => close()} size="small" style={{ width: 90 }}>
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
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
      ...getColumnSearchProps("id"),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      ...getColumnSearchProps("nombre"),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, marca) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(marca)}>
            Editar
          </Button>
          <Button type="danger" onClick={() => handleDelete(marca.id)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>GESTIONAR MARCAS</h1>
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: "20px" }}
      >
        Crear Marca
      </Button>
      <Table
        columns={columns}
        dataSource={marcas}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={loading}
        locale={{
          emptyText: "No se encontraron resultados",
        }}
      />
      {(editingMarca || creatingMarca) && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <form onSubmit={handleSubmit}>
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                style={styles.input}
              />
              <div>
                <button type="submit" style={styles.submitButton}>
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMarca(null);
                    setCreatingMarca(false); // Cerrar modal de creación
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
      )}
    </div>
  );
};

export default GestionarMarca;
