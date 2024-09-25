import React from 'react';

const CerrarSesion = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 className="text-xl mb-4">Cerrar Sesión</h2>
        <p>¿Está seguro que desea cerrar sesión?</p>
        <div className="flex justify-end mt-4">
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            style={{ ...styles.button, ...styles.confirmButton }}
            onClick={onConfirm}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    marginRight: '0.5rem',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#004d40',
    color: 'white',
  },
};

export default CerrarSesion;
