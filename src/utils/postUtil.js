import { Modal, message } from 'antd';
import { api, getIpAddress } from '../api/axios';
import { getIdToken } from './authService';

const saveBitacora = async (accion) => {
  try {
    const ip = await getIpAddress();
    const usuario = {
      id: getIdToken()
    }
    const bitacora = {
      fecha: (new Date().toJSON()),
      accion: accion,
      user: usuario,
      ip: ip
    }
    console.log("Llegó a bitácora.", bitacora);
    await api.post("/bitacora", bitacora);
  } catch (error) {
    console.error('saveBitacora: Error al enviar: ', error);
  }
}

const deleteRol = async (id) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.delete(`/rol/${id}`);
        if (response.status === 200) {
          message.success(`Rol ${id} eliminado`);
        } else {
          message.error('Error al eliminar rol');
        }
      } catch (error) {
        console.error('Error al eliminar rol:', error);
        message.error('Error al eliminar rol');
      }
      console.log('El usuario hizo clic en Aceptar');
    },
    onCancel() {
      console.log('El usuario hizo clic en Cancelar');
    },
  });
};

const deleteRoll = async (id) => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: 'Confirmar acción',
      content: '¿Estás seguro de realizar esta acción?',
      async onOk() {
        try {
          await api.delete(`/rol/${id}`);
          message.success(`Rol ${id} eliminado correctamente`);
          resolve();
        } catch (error) {
          console.error('Error al eliminar rol:', error);
          message.error('Error al eliminar rol');
          reject(error);
        }
      },
      onCancel() {
        reject(new Error('El usuario canceló la acción'));
      },
    });
  });
};


//Error Al Editar Rol
const updateRol = async (id, nombre) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const body = { name: nombre };
        const response = await api.put(`/rol/${id}`, body);
        if (response.status === 200) {
          message.success(`Rol ${id} actualizado`);
        }
      } catch (error) {
        console.error('Error al actualizar rol:', error);
        message.error('Error al actualizar rol');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};


const createRol = async (nombre) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.post("/rol/save", { name: nombre });
        if (response.status === 200) {
          message.success(`Rol creado correctamente`);
          Modal.destroyAll();
        }
      } catch (error) {
        console.error('Error al crear rol:', error);
        message.error('Error al crear rol');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};


/* -------------------------------------------------------------------------------- */
/* DEPARTAMENTO */
/* -------------------------------------------------------------------------------- */

const updateDepartment = async (departament) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.put("/departament/update", departament);
        if (response.status === 200) {
          message.success(`Departamento ${departament.id} modificado correctamente`);
        }
      } catch (error) {
        console.error('Error al modificar departamento:', error);
        message.error('Error al modificar departamento');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};


const deleteDepartment = async (id) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.delete(`/departament/${id}`);
        if (response.status === 200) {
          message.success(`Departamento ${id} eliminado correctamente`);
        } else {
          message.error('Error al eliminar Departamento');
        }
      } catch (error) {
        console.error('Error al eliminar departamento:', error);
        message.error('Error al eliminar departamento');
      }
      console.log('El usuario hizo clic en Aceptar');
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};


const createDepartment = async (department) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.post("/departament/save", department);
        if (response.status === 200) {
          message.success(`Departamento creado correctamente`);
          Modal.destroyAll();
        }
      } catch (error) {
        console.error('Error al crear departamento:', error);
        message.error('Error al crear Departamento');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};


/* -------------------------------------------------------------------------------- */
/* CATEGORIA */
/* -------------------------------------------------------------------------------- */

const updateCategory = async (category) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      const categoria = {
        id: category.id,
        nombre: category.nombre,
        departament: category.Departamento
      }

      try {
        const response = await api.put("/category/update", categoria);
        if (response.status === 200) {
          message.success(`Categoria ${category.id} modificada correctamente`);
        }
      } catch (error) {
        console.error('Error al modificar categoria:', error);
        message.error('Error al modificar categoria');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};


const deleteCategory = async (id) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.delete(`/category/${id}`);
        if (response.status === 200) {
          message.success(`Categoria ${id} eliminada correctamente`);
        } else {
          message.error('Error al eliminar Categoria');
        }
      } catch (error) {
        console.error('Error al eliminar categoria:', error);
        message.error('Error al eliminar categoria');
      }
      console.log('El usuario hizo clic en Aceptar');
    },
    onCancel() {
      console.log('El usuario hizo clic en Cancelar');
    },
  });
};

const createCategory = async (category) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.post("/category/save", category);
        if (response.status === 200) {
          message.success(`Categoria creado correctamente`);
          Modal.destroyAll();
        }
      } catch (error) {
        console.error('Error al crear categoria:', error);
        message.error('Error al crear Categoria');
      }
    }
  });
};

/* -------------------------------------------------------------------------------- */
/* PERMISOS */
/* -------------------------------------------------------------------------------- */

const setPermissions = async (id, rol) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.put(`/rol/${id}`, rol);
        if (response.status === 200) {
          message.success(`Permisos de rol ${id} modificados correctamente`);
        }
      } catch (error) {
        console.error('Error al modificar permisos:', error);
        message.error('Error al modificar permisos');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

/* -------------------------------------------------------------------------------- */
/* DESCUENTO */
/* -------------------------------------------------------------------------------- */

const deleteDiscount = async (id) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.delete(`/descuento/${id}`);
        if (response.status === 200) {
          message.success(`Descuento ${id} eliminado correctamente`);
        } else {
          message.error('Error al eliminar descuento');
        }
      } catch (error) {
        console.error('Error al eliminar descuento:', error);
        message.error('Error al eliminar descuento');
      }
      console.log('El usuario hizo clic en Aceptar');
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

const updateDiscount = async (descuento) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.put("/descuento", descuento);
        if (response.status === 200) {
          message.success(`Descuento ${descuento.id} modificado correctamente`);
        }
      } catch (error) {
        console.error('Error al modificar descuento:', error);
        message.error('Error al modificar descuento');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

const createDiscount = async (descuento) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.post("/descuento", descuento);
        if (response.status === 200) {
          message.success('Descuento creado correctamente');
          Modal.destroyAll(); // Cierra todos los modales abiertos
        }
        return response;
      } catch (error) {
        console.error('Error al crear descuento:', error);
        message.error('Error al crear descuento');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

/* -------------------------------------------------------------------------------- */
/* PRODUCTO */
/* -------------------------------------------------------------------------------- */

const updateProducto = async (product) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.put(`/producto/update`, product);
        if (response.status === 200) {
          message.success('Producto actualizado exitosamente');
          return response.data;
        } else {
          throw new Error('Error al actualizar el producto');
        }
      } catch (error) {
        console.error('updateProducto: Error al actualizar producto:', error);
        message.error('Error al actualizar el producto');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

const deleteProducto = async (productId) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.delete(`/producto/delete/${productId}`);
        if (response.status === 200) {
          message.success('Producto eliminado exitosamente');
        } else {
          throw new Error('Error al eliminar el producto');
        }
      } catch (error) {
        console.error('deleteProducto: Error al eliminar producto:', error);
        message.error('Error al eliminar el producto');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

// Aquí añadimos la función createProducto si es necesaria
const createProducto = async (product) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.post("/producto/save", product);
        if (response.status === 200) {
          message.success('Producto creado exitosamente');
          return response.data;
        } else {
          throw new Error('Error al crear el producto');
        }
      } catch (error) {
        console.error('createProducto: Error al crear producto:', error);
        message.error('Error al crear el producto');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

/* -------------------------------------------------------------------------------- */
/* NOTA DE INGRESO */
/* -------------------------------------------------------------------------------- */

const createIncomeNote = async (nota) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.post("/nota-ingreso", nota);
        if (response.status === 200) {
          message.success('Nota creada exitosamente');
          return response.data;
        } else {
          throw new Error('Error al crear la Nota');
        }
      } catch (error) {
        console.error('createIncomeNote: Error al crear Nota:', error);
        message.error('Error al crear el Nota');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

const deleteIncomeNote = async (id) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.delete(`/nota-ingreso/${id}`);
        if (response.status === 200) {
          message.success('Nota eliminada exitosamente');
          return response.data;
        } else {
          throw new Error('Error al eliminar la Nota');
        }
      } catch (error) {
        console.error('deleteIncomeNote: Error al eliminar Nota:', error);
        message.error('Error al eliminar el Nota');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};


/* -------------------------------------------------------------------------------- */
/* NotaEgreso */
/* -------------------------------------------------------------------------------- */
const deleteEgressNote = async (id) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.delete(`/nota-egreso/${id}`);
        if (response.status === 200) {
          message.success('Nota eliminada exitosamente');
          return response.data;
        } else {
          throw new Error('Error al eliminar la Nota');
        }
      } catch (error) {
        console.error('deleteEgressNote: Error al eliminar Nota:', error);
        message.error('Error al eliminar el Nota');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};



const createEgressNote = async (nota) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.post("/nota-egreso", nota);
        if (response.status === 200) {
          message.success('Nota creada exitosamente');
          return response.data;
        } else {
          throw new Error('Error al crear la Nota');
        }
      } catch (error) {
        console.error('createEgressNote: Error al crear Nota:', error);
        message.error('Error al crear el Nota');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

const createImagen = async (imagen) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.post("/imagen", imagen);
        if (response.status === 200) {
          message.success('Imagen creada exitosamente');
          return response.data;
        } else {
          throw new Error('Error al crear la Imagen');
        }
      } catch (error) {
        console.error('createImagen: Error al crear Imagen:', error);
        message.error('Error al crear el Imagen');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};



const deleteProveedor = async (id) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.delete(`/proveedor/${id}`);
        if (response.status === 200) {
          message.success(`Proveedor ${id} eliminado correctamente`);
        }
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        message.error('Error al eliminar proveedor');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};

const updateProveedor = async (proveedor) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.put("/proveedor", proveedor);
        if (response.status === 200) {
          message.success(`Proveedor ${proveedor.id} modificado correctamente`);
        }
      } catch (error) {
        console.error('Error al modificar proveedor:', error);
        message.error('Error al modificar proveedor');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};



const createProveedor = async (proveedor) => {
  Modal.confirm({
    title: 'Confirmar acción',
    content: '¿Estás seguro de realizar esta acción?',
    async onOk() {
      try {
        const response = await api.post("/proveedor", proveedor);
        if (response.status === 200) {
          message.success('Proveedor creado correctamente');
          Modal.destroyAll();// Cierra todos los modales abiertos
        }
        return response;
        
      } catch (error) {
        console.error('Error al crear proveedor:', error);
        message.error('Error al crear proveedor');
      }
    },
    onCancel() {
      message.info('Acción cancelada'); // Mensaje opcional de información
    }
  });
};



const createVenta = async (venta) => {
  try {
    const response = await api.post("/venta", venta);
    if (response.status === 200) {
      Modal.destroyAll(); // Cierra todos los modales abiertos
    }
    return response;
  } catch (error) {
    console.error('Error al crear venta:', error);
    message.error('Error al crear venta');
    return null; // Asegúrate de devolver algo en caso de error
  }
};

export {
  createCategory, createDepartment, createDiscount, createEgressNote, createImagen, createIncomeNote, createProducto, createProveedor, createRol, deleteCategory, deleteDepartment, deleteDiscount, deleteEgressNote, deleteIncomeNote, deleteProducto, deleteProveedor, deleteRol,
  deleteRoll, saveBitacora, setPermissions, updateCategory, updateDepartment, updateDiscount, updateProducto, updateProveedor, updateRol
  ,createVenta
};
