import { Outlet } from "react-router-dom";
import Sidebar from "./Componentes/Sidebar";

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    width: "250px", // Puedes ajustar el ancho del sidebar
    backgroundColor: "#f4f4f4", // Color de fondo del sidebar
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", // Sombra para el sidebar
  },
  outlet: {
    flex: 1, // Ocupa todo el espacio restante
    padding: "0px 0px 0px 100px", // Espaciado interno del contenido
  },
};

export const Dashboard = () => {
  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <Sidebar />
      </div>
      <div style={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
