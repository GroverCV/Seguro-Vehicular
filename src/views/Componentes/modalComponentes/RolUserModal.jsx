import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { fetchRolesDto, putRolUser } from '../../utils/fetchUtil';

const { Option } = Select;

const EditarRol = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id, setId] = useState('');
  const [rol, setRol] = useState(null)
  const [datos, setDatos] = useState(null);

  const getDatos = async () => {
		await fetchRolesDto().then((datos)=> setDatos(datos));
  }

  useEffect(()=> {
    getDatos()
  }, [])

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
		if (id && rol){
			try {
				await putRolUser(id,rol);
			} catch (error) {
				console.log(error)	
			}
		}
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleRolChange = (value) => {
    setRol(value);
		console.log(value);
  };

  return (
    <div>
      <Button className="w-full font-bold" onClick={showModal}>
        Editar Rol
      </Button>
      <Modal 
        title="Editar Rol" 
        open={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Guardar
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="ID" required>
            <Input value={id} onChange={handleIdChange} />
          </Form.Item>
          <Form.Item label="Rol" required>
            <Select placeholder="Selecciona un rol" value={rol? rol.nombre:undefined} onChange={handleRolChange}>
            {datos? datos.map((rol) => (
                <Option value={rol.id} key={rol.id}>{rol.name}</Option>    
            )):
                <Option>No elements reload modal</Option>
            }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditarRol;
