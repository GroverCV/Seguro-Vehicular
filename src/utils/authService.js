// authService.js

import { jwtDecode } from "jwt-decode";

// Función para guardar el token en el almacenamiento local
export const guardarTokenEnLocalStorage = (token) => {
    localStorage.setItem('access_token', token);
  };
  
  // Función para obtener el token del almacenamiento local
  export const obtenerTokenDeLocalStorage = () => {
    return localStorage.getItem('access_token');
  };
  
  // Función para verificar si el token ha expirado
  export const tokenExpirado = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convertir a segundos
    return decodedToken.exp < currentTime;
  };

  export const deleteToken = () => {
    localStorage.clear();
  }

  export const getPermisosToken = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken.Permisos;
  }

  export const isAdminToken = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken.sub === "ADMIN"
  }

  export const getDecodeToken = () => {
    const token = obtenerTokenDeLocalStorage();
    return jwtDecode(token)
  }

  export const expiration = () => {
    const decodedToken = getDecodeToken();
    console.log()
    return decodedToken.exp
  }

  export const getUsernameToken = () => {
    const decodedToken = getDecodeToken();
    return decodedToken.sub;
  }

  export const getIdToken = () => {
    const decodedToken = getDecodeToken();
    return decodedToken.id;
  }