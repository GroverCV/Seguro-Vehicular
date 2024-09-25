import { Table, Button, Input } from "antd";
import React, { useState } from "react";

const GestionarMarca = () => {
  // Estado para manejar los datos de las marcas
  const [marcas, setMarcas] = useState([
    { key: "1", nombre: "Marca A", empresa: "Empresa A", pais: "Bolivia" },
    { key: "2", nombre: "Marca B", empresa: "Empresa B", pais: "Argentina" },
    { key: "3", nombre: "Marca C", empresa: "Empresa C", pais: "Brasil" },
  ]);

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      rowScope: "row",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
    },
    {
      title: "Empresa",
      dataIndex: "empresa",
    },
    {
      title: "País",
      dataIndex: "pais",
    },
  ];

  // Datos de marcas (se pueden modificar o agregar nuevas marcas)
  const [newMarca, setNewMarca] = useState({ nombre: "", empresa: "", pais: "" });

  const handleAddMarca = () => {
    setMarcas((prevMarcas) => [
      ...prevMarcas,
      {
        key: (prevMarcas.length + 1).toString(),
        nombre: newMarca.nombre,
        empresa: newMarca.empresa,
        pais: newMarca.pais,
      },
    ]);
    setNewMarca({ nombre: "", empresa: "", pais: "" });
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Gestionar Marca</h1>
      <div style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "20px" }}>
        <Table columns={columns} dataSource={marcas} bordered />
        <div style={{ marginTop: "20px" }}>
          <h2>Agregar Nueva Marca</h2>
          <Input
            placeholder="Nombre"
            value={newMarca.nombre}
            onChange={(e) => setNewMarca({ ...newMarca, nombre: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="Empresa"
            value={newMarca.empresa}
            onChange={(e) => setNewMarca({ ...newMarca, empresa: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="País"
            value={newMarca.pais}
            onChange={(e) => setNewMarca({ ...newMarca, pais: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <Button type="primary" onClick={handleAddMarca}>
            Agregar Marca
          </Button>
        </div>
      </div>
    </>
  );
};

export default GestionarMarca;
