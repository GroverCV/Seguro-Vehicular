import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Logout from './Token/Logout'; // Asegúrate de que la ruta sea correcta

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    padding: "10px 20px",
    color: "white",
    fontSize: "16px",
    flexWrap: "wrap",
  },
  Titulo: {
    flex: "1 0 auto",
    backgroundColor: "black",
    color: "white",
    textAlign: "center",
    fontSize: "calc(1.5rem + 2vw)",
    textDecoration: "none",
    margin: "10px 0",
  },
  user: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "black",
    color: "white",
    padding: "10px",
  },
  username: {
    fontSize: "16px",
    marginRight: "10px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "black",
    padding: "10px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    marginBottom: "10px",
    padding: "10px 20px",
    border: "2px solid white",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  // Estilos responsivos
  responsiveUser: {
    display: "flex",
    flexDirection: "column", // Asegura que sea columna en pantallas pequeñas
    alignItems: "flex-start",
  },
};

export const Navbar = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    
    if (token) {
      setIsAuthenticated(true);
      setUsername(name);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <>
      <header style={styles.header}>
        <Link to="/" style={styles.Titulo}>
          Seguro Vehicular
        </Link>

        {isAuthenticated ? (
          <div style={styles.responsiveUser}>
            <div style={styles.user}>
              <span style={styles.username}>{username}</span>
              <Logout onLogout={handleLogout} />
            </div>
          </div>
        ) : (
          <nav style={styles.nav}>
            <Link to="/login" style={styles.link}>
              Iniciar Sesión
            </Link>
          </nav>
        )}
      </header>
      
      <Outlet />
    </>
  );
};

export default Navbar;
