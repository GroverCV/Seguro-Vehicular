import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { confirmAction } from "./modalComponentes/ModalConfirm";

const GestionarTipoVehiculo = () => {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTipo, setEditingTipo] = useState(null);
  const [creatingTipo, setCreatingTipo] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const fetchTipoVehiculo = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/tipo_vehiculo"
      );
      if (!response.ok) throw new Error("Error al obtener los tipos de vehículo");
      const data = await response.json();
      setTiposVehiculo(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipoVehiculo();
  }, []);

  const handleEdit = (tipo) => {
    setEditingTipo(tipo);
    setFormData(tipo);
  };

  const handleCreate = () => {
    setCreatingTipo(true);
    setFormData({ nombre: "" });
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
        await fetch(
          `https://backend-seguros.campozanodevlab.com/api/tipo_vehiculo/${id}`,
          {
            method: "DELETE",
          }
        );
        setTiposVehiculo(tiposVehiculo.filter((tipo) => tipo.id !== id));

        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó el Tipo ID: ${id}`,
          ip: userIp,
        };

        await logAction(logData);
      } catch (error) {
        setError("Error al eliminar el tipo de vehículo");
        console.error("Error al eliminar el tipo de vehículo:", error);
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
      console.error("Error al registrar la acción en la bitácora:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAction(async () => {
      try {
        if (creatingTipo) {
          const response = await fetch(
            "https://backend-seguros.campozanodevlab.com/api/tipo_vehiculo",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            }
          );
          const newTipo = await response.json();
          setTiposVehiculo([...tiposVehiculo, newTipo]);

          const userIp = await getUserIp();
          const logData = {
            usuario_id: userId,
            accion: "Creó",
            detalles: `El Usuario ID: ${userId} creó un nuevo Tipo: ${newTipo.nombre}`,
            ip: userIp,
          };
          await logAction(logData);
          setCreatingTipo(false);
        } else {
          const previousTipoResponse = await fetch(
            `https://backend-seguros.campozanodevlab.com/api/tipo_vehiculo/${editingTipo.id}`
          );
          const previousTipo = await previousTipoResponse.json();

          const response = await fetch(
            `https://backend-seguros.campozanodevlab.com/api/tipo_vehiculo/${editingTipo.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            }
          );
          const updatedTipo = await response.json();
          setTiposVehiculo((prev) =>
            prev.map((tipo) =>
              tipo.id === updatedTipo.id ? updatedTipo : tipo
            )
          );

          const userIp = await getUserIp();
          const attributesToCheck = ["Nombre"];
          const editedAttribute = attributesToCheck.find(
            (key) => formData[key] !== previousTipo[key]
          );

          let logDetails = "";
          if (editedAttribute) {
            logDetails = `Atributo editado: ${editedAttribute}`;
          }

          const logData = {
            usuario_id: userId,
            accion: "Editó",
            detalles: `El Usuario ID: ${userId} editó el Tipo ID: ${editingTipo.id}. ${logDetails}`,
            ip: userIp,
          };
          await logAction(logData);
          setEditingTipo(null);
        }
        fetchTipoVehiculo();
      } catch (error) {
        setError("Error al guardar el tipo de vehículo");
        console.error("Error al guardar el tipo de vehículo:", error);
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
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
          <Button
            type="primary"
            onClick={close}
            size="small"
            style={{ width: 90 }}
          >
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
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
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
      render: (text, tipo) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(tipo)}>Editar</Button>
          <Button onClick={() => handleDelete(tipo.id)} type="danger">
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
      <h1 style={styles.h1}>Gestionar Tipos de Vehículo</h1>
      {loading && <p>Cargando tipos de vehículo...</p>}
      {error && <p>{error}</p>}
      <Button type="primary" onClick={handleCreate} style={styles.button}>
        Crear Tipo de Vehículo
      </Button>
      <Table
        columns={columns}
        dataSource={tiposVehiculo}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
      {creatingTipo || editingTipo ? (
        <div style={styles.modal}>
          <h2>{creatingTipo ? "Crear Tipo de Vehículo" : "Editar Tipo de Vehículo"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.nombre || ""}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              style={styles.input}
              required
            />
            <button type="submit" style={styles.submitButton}>
              {creatingTipo ? "Crear" : "Guardar"}
            </button>
            <Button onClick={() => {
              setCreatingTipo(false);
              setEditingTipo(null);
            }}>
              Cancelar
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default GestionarTipoVehiculo;
