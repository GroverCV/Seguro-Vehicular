import { message } from "antd";
import { api } from "../api/axios";

const fetchVentaUsuario = async () => {
    try {
        // Suponiendo que '1' es un parámetro que necesitas pasar
        const response = await api.get("/venta/ventaUsuario", {
            params: {
                personId: 1 // Cambia 'someParam' por el nombre correcto del parámetro que espera tu API
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('fetchVentaUsuario: Error al obtener datos Department:', error);
        message.error('Error al obtener datos');
    }
}

const fetchReporteVenta = async (formato, id, path) => {
    try {
      const response = await api.get(`${path}`, {
        params: {
            format: formato,
            id: id
          },
          responseType: 'arraybuffer' // Asegúrate de manejar la respuesta como un array buffer
        });
        if (response.status === 200) {
          let mimeType;
          let extension;
    
          if (formato === 'pdf') {
            mimeType = 'application/pdf';
            extension = 'pdf';
          } else if (formato === 'xlsx') {
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            extension = 'xlsx';
          } else {
            throw new Error('Formato no soportado: ' + formato);
          }
    
          const blob = new Blob([response.data], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte_${id}.${extension}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return response.data;
        }
      } catch (error) {
        console.error('Error al obtener reporte:', error);
        message.error('Error al obtener reporte');
    }
  };

export {
    fetchVentaUsuario,
    fetchReporteVenta
}
