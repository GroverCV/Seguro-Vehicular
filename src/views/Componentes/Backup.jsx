import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { api } from "../../api/axios";

export default function Backup() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [backupTime, setBackupTime] = useState(null); // Estado para guardar la hora del respaldo
  const [isBackupDone, setIsBackupDone] = useState(false); // Estado para verificar si el respaldo se ha hecho

  useEffect(() => {
    const showModal = () => {
      setIsModalVisible(true); // Mostrar el modal cuando el componente se monte
    };

    showModal(); // Llamar a la función para mostrar el modal al montar el componente
  }, []); // El array vacío asegura que se ejecute solo una vez cuando el componente se monta

  const handleSubmit = async () => {
    try {
      // Realizar la solicitud POST al confirmar
      const response = await api.post(
        '/api/backup', 
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Respaldo creado:", response.data);
      
      // Establecer la hora del respaldo
      const currentTime = new Date().toLocaleString();
      setBackupTime(currentTime); // Guardar la hora actual

      setIsBackupDone(true); // Cambiar el estado a verdadero para mostrar el mensaje de respaldo
      setIsModalVisible(false); // Cerrar el modal después de la acción
    } catch (error) {
      console.error("Error al crear el respaldo:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Cerrar el modal si el usuario cancela
  };

  return (
    <div>
      {/* Modal de confirmación */}
      <Modal
        title="Confirmación"
        visible={isModalVisible}
        onOk={handleSubmit} // Ejecutar el POST cuando se confirma
        onCancel={handleCancel} // Cerrar el modal si se cancela
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro de que deseas realizar un respaldo?</p>
      </Modal>
      
      {/* Mostrar el mensaje de respaldo y la hora solo después de confirmar */}
      {isBackupDone && (
        <div>
          <h2>Respaldo Realizado</h2>
          <p>Hora del respaldo: {backupTime}</p>
        </div>
      )}
    </div>
  );
}
