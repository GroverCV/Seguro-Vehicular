import axios from "axios";

const api = axios.create({
    baseURL: 'https://backend-seguros.campozanodevlab.com'
})

export { api };

