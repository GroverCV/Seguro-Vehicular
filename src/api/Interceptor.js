import axios from "axios"

function Interceptor() {
  

    axios.interceptors.request((request)=>{
        console.log("Starting request", request)
        return request
    })
}

export default Interceptor
