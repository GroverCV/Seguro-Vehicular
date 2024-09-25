import axios from "axios";

/* https://prueba-379813.rj.r.appspot.com */

const api = axios.create({
    baseURL: 'https://backend-seguros.campozanodevlab.com'
})

/*
const getIpAddress = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        console.log(response)
        return response.data.ip;
    } catch (error) {
        console.error('Error al obtener la dirección IP:', error);
        return null;
    }
};*/

export { api };

