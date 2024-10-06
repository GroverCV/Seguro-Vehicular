import React from 'react';
import { Modal } from 'antd';

const ModalConfirmacion = ({ visible, onConfirm, onCancel, title, description }) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Confirmar"
      cancelText="Cancelar"
    >
      <p>{description}</p>
    </Modal>
  );
};

// Uso del componente
const App = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // Lógica para manejar la confirmación
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Abrir Modal de Confirmación
      </Button>
      <ModalConfirmacion
        visible={isModalVisible}
        onConfirm={handleOk}
        onCancel={handleCancel}
        title="Confirmación"
        description="¿Está seguro de que desea continuar?"
      />
    </div>
  );
};

export default App;
