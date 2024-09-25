import { expiration, getPermisosToken, obtenerTokenDeLocalStorage, tokenExpirado } from "./authService";

export const checkPermissions = (requiredPermission) => {
    const userToken = obtenerTokenDeLocalStorage();
    const userPermissions = getPermisosToken(userToken);
    return userPermissions.includes(requiredPermission);
};

export const checkAuth = () => {
    const token = obtenerTokenDeLocalStorage();

    if (token) {
        return !tokenExpirado(token);
    }

    return false;
}

export const expirationSession = () => {
    const miliExpiration = expiration(); // Supongo que expiration es el valor en milisegundos que quieres convertir
    const currentTime = Date.now() / 1000;
    // Crear una nueva instancia de Date con el valor de milisegundos
    const fechaExpiracion = new Date(miliExpiration);

    // Obtener la fecha, hora y segundos en una cadena de texto
    const fechaHoraSegundos = `Fecha: ${fechaExpiracion.toLocaleDateString()} a Horas: ${fechaExpiracion.toLocaleTimeString()} `;

    // Devolver la cadena de texto con la fecha, hora y segundos
    return fechaHoraSegundos;
}

export const obtenerFechaActual = () => {
      const fecha = new Date();
      return fecha.toISOString();
    }