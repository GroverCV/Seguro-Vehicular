import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const ModalEditarUsuario = ({ visible, onCancel, onSubmit, formData, roles }) => {
  return (
    <Modal title="Editar Usuario" visible={visible} onCancel={onCancel} footer={null}>
      <Form
        onFinish={onSubmit}
        layout="vertical"
        initialValues={formData}
      >
        <Form.Item 
          name="nombre" 
          label="Nombre" 
          rules={[{ required: true, message: 'Por favor ingresa el nombre!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name="apellido" 
          label="Apellido" 
          rules={[{ required: true, message: 'Por favor ingresa el apellido!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name="email" 
          label="Email" 
          rules={[{ required: true, type: 'email', message: 'Por favor ingresa un correo válido!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="telefono" label="Teléfono">
          <Input />
        </Form.Item>

        <Form.Item name="celular" label="Celular">
          <Input />
        </Form.Item>

        <Form.Item name="direccion" label="Dirección">
          <Input />
        </Form.Item>

        <Form.Item 
          name="rol_id" 
          label="Rol"
          rules={[{ required: true, message: 'Por favor selecciona un rol!' }]}
        >
          <Select placeholder="Selecciona un rol">
            {roles.map((rol) => (
              <Option key={rol.id} value={rol.id}>
                {rol.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: '10px' }}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditarUsuario;
