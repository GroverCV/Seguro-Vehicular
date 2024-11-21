import axios from "axios";

// Crear una instancia de Axios
const api = axios.create({
  baseURL: "http://34.68.199.122", // Cambia esta URL por la de tu backend
});

// Agregar un interceptor para incluir el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    // Obtener el token desde localStorage o cualquier otra fuente segura
    const token = localStorage.getItem("access_token");

    if (token) {
      // Agregar el token al encabezado de autorización
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Manejar errores en la configuración de la solicitud
    return Promise.reject(error);
  }
);

// Opcional: Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Token inválido o no autorizado. Redirigiendo al login...");
      // Opcional: Redirigir al usuario al inicio de sesión
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { api };
