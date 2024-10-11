import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Image } from "antd";
import Highlighter from "react-highlight-words";

const data = [
  {
    key: "1",
    id: "1",
    nombre: "John Brown",
    enlace: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRnJGL-ioXRvAgayNVK2Qv_eCruvpyPUKkNw&s",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRnJGL-ioXRvAgayNVK2Qv_eCruvpyPUKkNw&s",
  },
  {
    key: "2",
    id: "2",
    nombre: "Joe Black",
    enlace: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO8ZC66DK_FSE6c5SxifMoeySpQPh1XLbf7Q&s",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO8ZC66DK_FSE6c5SxifMoeySpQPh1XLbf7Q&s",
  },
  {
    key: "3",
    id: "3",
    nombre: "Jim Green",
    enlace: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbU64rgj5EGbLcSeZkNQp7y44z-vI6rxDkSA&s",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbU64rgj5EGbLcSeZkNQp7y44z-vI6rxDkSA&s",
  },
  {
    key: "4",
    id: "4",
    nombre: "Jim Red",
    enlace: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_aNZZ8230OtEwQyQ5lXtIAKi8yMy2urWCqw&s",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_aNZZ8230OtEwQyQ5lXtIAKi8yMy2urWCqw&s",
  },
];

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
          color: filtered ? "#1677ff" : undefined,
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
      width: "10%",
      ...getColumnSearchProps("id"), // Añadir búsqueda para ID
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: "30%",
      ...getColumnSearchProps("nombre"),
    },
    {
      title: "Enlace",
      dataIndex: "enlace",
      key: "enlace",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Imagen",
      dataIndex: "imagen",
      key: "imagen",
      render: (text) => <Image width={100} src={text} />,
    },
    {
      title: "Acción",
      key: "acción",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary">Editar</Button>
          <Button type="danger">Eliminar</Button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default App;
