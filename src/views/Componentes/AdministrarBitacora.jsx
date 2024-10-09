import React, { useEffect, useState, useRef } from "react";
import { Table, Input, Button, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment"; // Importa moment para el manejo de fechas
import axios from "axios"; // Asegúrate de importar axios

const AdministrarBitacora = () => {
    const [data, setData] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
  
    const obtenerDatos = async () => {
      setLoading(true);
      try {
        const responseBitacora = await axios.get("https://backend-seguros.campozanodevlab.com/api/bitacora");
        const responseUsuarios = await axios.get("https://backend-seguros.campozanodevlab.com/api/usuarios");
        setUsuarios(responseUsuarios.data);
        
        // Combina los datos de la bitácora con los usuarios
        const dataConNombre = responseBitacora.data.map(bitacora => {
          const usuario = responseUsuarios.data.find(user => user.id === bitacora.usuario_id);
          return {
            ...bitacora,
            nombre: usuario ? usuario.nombre : 'Desconocido', // Asegúrate de que "nombre" y "apellido" sean los campos correctos
            apellido: usuario ? usuario.apellido : 'Desconocido'
          };
        });
    
        // Ordena los datos por fechaHora de forma descendente
        const dataOrdenada = dataConNombre.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
    
        setData(dataOrdenada);
      } catch (error) {
        message.error("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      obtenerDatos();
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Buscar ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Buscar
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reiniciar
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filtrar
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              Cerrar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1677ff' : undefined,
          }}
        />
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
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });

    // Configuración de columnas para la tabla
    const columns = [
      {
        title: "ID Bitácora",
        dataIndex: "id", // Cambia a "id" según la estructura de datos
        key: "id",
        ...getColumnSearchProps('id'),
      },
      {
        title: "ID Usuario",
        dataIndex: "usuario_id",
        key: "usuario_id",
        ...getColumnSearchProps('usuario_id'),
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
        ...getColumnSearchProps('nombre'),
      },
      {
        title: "Apellido",
        dataIndex: "apellido",
        key: "apellido",
        ...getColumnSearchProps('apellido'),
      },
      {
        title: "Acción",
        dataIndex: "accion",
        key: "accion",
        ...getColumnSearchProps('accion'),
      },
      {
        title: "Fecha",
        dataIndex: "fechaHora", // Asegúrate de que este campo existe en tu respuesta
        key: "fechaHora",
        render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"), // Formato de fecha
        ...getColumnSearchProps('fechaHora'),
      },
      {
        title: "Descripción",
        dataIndex: "detalles", // Asegúrate de que este campo existe en tu respuesta
        key: "detalles",
        ...getColumnSearchProps('detalles'),
      },
      {
        title: "IP",
        dataIndex: "ip",
        key: "ip",
        ...getColumnSearchProps('ip'),
      },
    ];

    return (
      <div>
        <h2>Administrar Bitácora</h2>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id" 
          pagination={{ pageSize: 5 }}
        />
      </div>
    );
};

export default AdministrarBitacora;
