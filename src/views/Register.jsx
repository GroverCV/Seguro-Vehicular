import React, { useEffect, useState } from "react";
import { api } from "../api/axios";

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    padding: "20px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    width: "500px",
    textAlign: "center",
  },
  h2: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "18px",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "background-color 0.3s",
  },
  errorMessage: {
    color: "red",
    marginBottom: "10px",
  },
};

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    estado: "true",
    ci: "",
    celular: "",
    direccion: "",
    tipoUsuario_id: "",
    rol_id: "",
    pais_id: "",
    ciudad_id: "",
  });

  const [mensaje, setMensaje] = useState(""); // Estado para el mensaje
  const [tiposUsuario, setTiposUsuario] = useState([]); // Lista de tipos de usuario
  const [roles, setRoles] = useState([]); // Lista de roles
  const [paises, setPaises] = useState([]); // Lista de países
  const [ciudades, setCiudades] = useState([]); // Lista de ciudades

  // Obtener tipos de usuario, roles, países y ciudades al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipoUsuarioRes, rolRes, paisRes, ciudadRes] = await Promise.all([
          api.get("/api/tipo_usuario"),
          api.get("/api/roles"),
          api.get("/api/pais"),
          api.get("/api/ciudad"),
        ]);

        setTiposUsuario(tipoUsuarioRes.data);
        setRoles(rolRes.data);
        setPaises(paisRes.data);
        setCiudades(ciudadRes.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getUserIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error obteniendo IP:", error);
      return "IP desconocida";
    }
  };

  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/usuarios", formData);
      console.log("Usuario registrado:", response.data);
      setMensaje("Usuario registrado correctamente.");

      const userIp = await getUserIp();
      const logData = {
        usuario_id: userId,
        accion: "Registró",
        detalles: `El Usuario ID: ${userId} registró al Usuario ID: ${response.data.id}`,
        ip: userIp,
      };

      await logAction(logData);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setMensaje(
        "Error al registrar usuario: " +
          (error.response?.data?.message || "Error desconocido.")
      );
    }
  };

  const logAction = async (logData) => {
    const token = "simulated-token";
    try {
      await api.post("/api/bitacora", logData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error al registrar la acción en la bitácora:", error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.h2}>Registro de Usuario</h2>
        {mensaje && <p style={styles.errorMessage}>{mensaje}</p>}{" "}
        {/* Mostrar mensaje */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={formData.contrasena}
          onChange={handleChange}
          required
          style={styles.input}
        />
        {/* Nuevo campo para CI */}
        <input
          type="number"
          name="ci"
          placeholder="Carnet de Identidad"
          value={formData.ci}
          onChange={handleChange}
          required
          style={styles.input}
        />
        {/* Nuevo campo para celular */}
        <input
          type="number"
          name="celular"
          placeholder="Celular"
          value={formData.celular}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Direccion"
          value={formData.direccion}
          onChange={handleChange}
          required
          style={styles.input}
        />
        {/* Select Tipo Usuario */}
        <select
          name="tipoUsuario_id"
          value={formData.tipoUsuario_id}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Seleccione Tipo de Usuario</option>
          {tiposUsuario.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
        {/* Select Rol */}
        <select
          name="rol_id"
          value={formData.rol_id}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Seleccione Rol</option>
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>
        {/* Select País */}
        <select
          name="pais_id"
          value={formData.pais_id}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Seleccione País</option>
          {paises.map((pais) => (
            <option key={pais.id} value={pais.id}>
              {pais.nombre}
            </option>
          ))}
        </select>
        {/* Select Ciudad */}
        <select
          name="ciudad_id"
          value={formData.ciudad_id}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Seleccione Ciudad</option>
          {ciudades.map((ciudad) => (
            <option key={ciudad.id} value={ciudad.id}>
              {ciudad.nombre}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.button}>
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
