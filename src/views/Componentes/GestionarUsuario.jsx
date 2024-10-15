import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { confirmAction } from "./modalComponentes/ModalConfirm";

const GestionarUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [roles, setRoles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [tipoUsuarios, setTipoUsuario] = useState([]);
  const [ciudades, setCiudad] = useState([]);
  const [paises, setPais] = useState([]);
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

  const fetchTipoUsuario = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/tipo_usuario"
      );
      if (!response.ok)
        throw new Error("Error al obtener los tipos de usuario");
      const data = await response.json();
      setTipoUsuario(data); // setTipoUsuarios es un estado que almacena los tipos de usuario
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCiudad = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/ciudad"
      );
      if (!response.ok) throw new Error("Error al obtener las ciudades");
      const data = await response.json();
      setCiudad(data); // setCiudades es un estado que almacena las ciudades
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPais = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/pais"
      );
      if (!response.ok) throw new Error("Error al obtener los países");
      const data = await response.json();
      setPais(data); // setPaises es un estado que almacena los países
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/roles"
      );
      if (!response.ok) throw new Error("Error al obtener los roles");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
    fetchTipoUsuario();
    fetchCiudad();
    fetchPais();
  }, []);

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData(usuario);
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
          `https://backend-seguros.campozanodevlab.com/api/usuarios/${id}`,
          {
            method: "DELETE",
          }
        );
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));

        const userIp = await getUserIp();
        const logData = {
          usuario_id: userId,
          accion: "Eliminó",
          detalles: `El Usuario ID: ${userId} eliminó el Usuario ID: ${id}`,
          ip: userIp,
        };

        await logAction(logData);
      } catch (error) {
        setError("Error al eliminar el usuario");
        console.error("Error al eliminar el usuario:", error);
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
        // Obtener el usuario que se está editando antes de la actualización
        const previousUserResponse = await fetch(
          `https://backend-seguros.campozanodevlab.com/api/usuarios/${editingUser.id}`
        );
        const previousUser = await previousUserResponse.json();

        const response = await fetch(
          `https://backend-seguros.campozanodevlab.com/api/usuarios/${editingUser.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const updatedUser = await response.json();
        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.id === updatedUser.id ? updatedUser : usuario
          )
        );
        const userIp = await getUserIp();
        const attributesToCheck = [
          "Nombre",
          "Apellido",
          "Email",
          "Carnet Identidad",
          "Celular",
          "Dirección",
          "Tipo Usuario",
          "Rol",
          "Pais",
          "Ciudad",
        ];
        const editedAttribute = attributesToCheck.find(
          (key) => formData[key] !== previousUser[key]
        );

        let logDetails = "";
        if (editedAttribute) {
          logDetails = `Atributo editado: ${editedAttribute}`; // Detalle del atributo editado
        }

        const logData = {
          usuario_id: userId,
          accion: "Editó",
          detalles: `El Usuario ID: ${userId} editó al Usuario ID: ${editingUser.id}. ${logDetails}`,
          ip: userIp,
        };

        fetchUsuarios();
        await logAction(logData);
        setEditingUser(null);
      } catch (error) {
        setError("Error al actualizar el usuario");
        console.error("Error al actualizar el usuario:", error);
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
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reiniciar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            cerrar
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
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      ...getColumnSearchProps("nombre"),
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
      ...getColumnSearchProps("apellido"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Carnet Identidad",
      dataIndex: "ci",
      key: "ci",
      ...getColumnSearchProps("ci"),
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
      ...getColumnSearchProps("celular"),
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
      ...getColumnSearchProps("direccion"),
    },
    {
      title: "Tipo Usuario",
      dataIndex: "tipoUsuario_id",
      key: "tipoUsuario_id",
      render: (tipoUsuario_id) =>
        tipoUsuarios.find((tipoUsuario) => tipoUsuario.id === tipoUsuario_id)
          ?.nombre || "No definido",
    },
    {
      title: "Permisos Rol",
      dataIndex: "rol_id",
      key: "rol_id",
      render: (rol_id) =>
        roles.find((role) => role.id === rol_id)?.nombre || "No definido",
    },
    {
      title: "País",
      dataIndex: "pais_id",
      key: "pais_id",
      render: (pais_id) =>
        paises.find((pais) => pais.id === pais_id)?.nombre || "No definido",
    },
    {
      title: "Ciudad",
      dataIndex: "ciudad_id",
      key: "ciudad_id",
      render: (ciudad_id) =>
        ciudades.find((ciudad) => ciudad.id === ciudad_id)?.nombre ||
        "No definido",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, usuario) => (
        <>
          <Button onClick={() => handleEdit(usuario)}>Editar</Button>
          <Button
            onClick={() => handleDelete(usuario.id)}
            style={{ marginLeft: 8 }}
          >
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>GESTIONAR USUARIOS</h1>
      <Table
        columns={columns}
        dataSource={usuarios}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        onChange={(pagination, filters, sorter) => {
          console.log("Various parameters", pagination, filters, sorter);
        }}
      />

      {editingUser && (
        <>
          <div
            style={styles.overlay}
            onClick={() => setEditingUser(null)}
          ></div>
          <div style={styles.modal}>
            <h2>Editar Usuario</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                required
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                style={styles.input}
              />

              <input
                type="text"
                placeholder="Carnet Identidad"
                value={formData.ci}
                onChange={(e) =>
                  setFormData({ ...formData, ci: e.target.value })
                }
                required
                style={styles.input}
              />

              <input
                type="text"
                placeholder="Celular"
                value={formData.celular}
                onChange={(e) =>
                  setFormData({ ...formData, celular: e.target.value })
                }
                required
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                required
                style={styles.input}
              />

              <select
                value={formData.tipoUsuario_id}
                onChange={(e) =>
                  setFormData({ ...formData, tipoUsuario_id: e.target.value })
                }
                required
                style={styles.input}
              >
                <option value="">Seleccionar tipo de usuario</option>
                {tipoUsuarios.map((tipoUsuario) => (
                  <option key={tipoUsuario.id} value={tipoUsuario.id}>
                    {tipoUsuario.nombre}
                  </option>
                ))}
              </select>

              <select
                value={formData.rol_id}
                onChange={(e) =>
                  setFormData({ ...formData, rol_id: e.target.value })
                }
                required
                style={styles.input}
              >
                <option value="">Seleccionar rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.nombre}
                  </option>
                ))}
              </select>

              <select
                value={formData.pais_id}
                onChange={(e) =>
                  setFormData({ ...formData, pais_id: e.target.value })
                }
                required
                style={styles.input}
              >
                <option value="">Seleccionar país</option>
                {paises.map((pais) => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </select>

              <select
                value={formData.ciudad_id}
                onChange={(e) =>
                  setFormData({ ...formData, ciudad_id: e.target.value })
                }
                required
                style={styles.input}
              >
                <option value="">Seleccionar ciudad</option>
                {ciudades.map((ciudad) => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>

              <button type="submit" style={styles.submitButton}>
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                style={styles.submitButton}
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

export default GestionarUsuario;
