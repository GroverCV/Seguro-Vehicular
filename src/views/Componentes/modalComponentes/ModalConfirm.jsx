import { Modal } from 'antd';

export const confirmAction = (okFunction) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
        okFunction()
      console.log('El usuario hizo clic en Aceptar');
    },
    onCancel() {
      console.log('El usuario hizo clic en Cancelar');
    },
  });
};
