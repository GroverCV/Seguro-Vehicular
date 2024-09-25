import { message } from 'antd';
import { api } from '../api/axios';
import { getUsernameToken } from './authService';

const fetchAllPersons = async () => {
  try {
    const response = await api.get('/user/get-all');
    if (response.status === 200) {
      console.log("fetchUtil: fetchAllPersons correcto");
      const users = response.data.map((user) => ({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido, // Nuevo campo
        email: user.email,
        telefono: user.telefono, // Nuevo campo
        celular: user.celular, // Nuevo campo
        direccion: user.direccion || "Sin valor", // Actualización existente
        enabled: user.enabled,
      }));
      return users; // Devuelve los datos mapeados
    } else {
      throw new Error('Error fetching data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


/*export const userEnable = async (id, enabled) => {
  try {
    if (enabled) {
      await api.put(`/user/unable/${id}`);
      message.success(`Usuario ${id} bloqueado`); // Muestra un mensaje de éxito
    } else {
      await api.put(`/user/enable/${id}`);
      message.success(`Usuario ${id} desbloqueado`);
    }
  } catch (error) {
    console.error('Error al bloquear/desbloquear usuario:', error);
    message.error('Error al bloquear/desbloquear usuario');
  }
};*/

const getUser = async () => {
  const username = getUsernameToken();
  try {
    const response = await api.get(`api/usuarios/${username}`);
    if (response.status === 200) {
      const user = response.data;
      const userFiltered = {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        celular: user.celular,
        direccion: user.direccion,
        tipoUsuario_id: user.tipoUsuario_id,  // Incluyendo tipoUsuario_id
        rol_id: user.rol_id                   // Incluyendo rol_id
      };
      return userFiltered;
    }
  } catch (error) {
    console.error('getUser: Error al obtener datos usuario:', error);
    message.error('Error al obtener datos usuario');
  }
};


const saveUser = async (user) => {
  try {
    const userPost = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      contrasena: user.contrasena || undefined,
      email: user.email,
      telefono: user.telefono,
      celular: user.celular,
      direccion: user.direccion,
    };

    console.log(userPost);
    
    const response = await api.put(`/user/update/${user.id}`, userPost);
    
    if (response.status === 200) {
      message.success('Usuario guardado exitosamente');
    } else {
      throw new Error('Error al guardar datos del usuario');
    }
    console.log(response);
  } catch (error) {
    console.error('saveUser: Error al guardar datos del usuario:', error);
    message.error('Error al guardar datos del usuario');
  }
};


/*const fetchBitacora = async () => {
  try {
    const response = await api.get("/bitacora/get-all");
    if (response.status === 200) {
      const filteredData = response.data.map((bitacora) => ({
        id: bitacora.id,
        usuario: bitacora.user.usuario,
        accion: bitacora.accion,
        fechaHora: (new Date(bitacora.fecha).toLocaleString()),
        ip: bitacora.ip
      }));
      return filteredData;
    }
  } catch (error) {
    console.error('fetchBitacora: Error al obtener datos bitacora:', error);
    message.error('Error al obtener datos');
  }
};*/

const fetchRol = async () => {
  try {
    const response = await api.get("/api/roles");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('fetchRol: Error al obtener datos Rol:', error);
    message.error('Error al obtener datos');
  }
};


const fetchRoles = async () => {
  try {
    const response = await api.get("/api/roles");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('fetchRoles: Error al obtener datos Roles:', error);
    message.error('Error al obtener datos');
  }
};

/*const fetchPermisos = async () => {
  try {
    const response = await api.get("/permiso/get-all");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('fetchPermisos: Error al obtener datos Permisos:', error);
    message.error('Error al obtener datos');
  }
};*/

const fetchRolesDto = async () => {
  try {
    const response = await api.get("/rol/dtos");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('fetchRoles: Error al obtener datos Roles:', error);
    message.error('Error al obtener datos');
  }
}

const putRolUser = async (id, rol) => {
  try {
    const response = await api.put(`/api/roles/${id}`, {
      id: rol
    });
  } catch (error) {
    console.error('fetchRoles: Error al obtener datos Roles:', error);
    message.error('Error al obtener datos');
  }
}


export {
  fetchAllPersons,
  getUser,
  saveUser,
  fetchRol,
  fetchRoles,
  fetchRolesDto,
  putRolUser,
  /*fetchBitacora,
  fetchPermisos,*/
};
