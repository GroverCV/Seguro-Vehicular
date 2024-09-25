import React, { useState } from 'react';
import axios from 'axios';

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
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    estado: 'true',
    telefono: '',
    celular: '',
    direccion: '',
    tipoUsuario_id: 1,
    rol_id: 4,
  });
  const [mensaje, setMensaje] = useState(''); // Estado para el mensaje

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://backend-seguros.campozanodevlab.com/api/usuarios', formData);
      console.log('Usuario registrado:', response.data);
      setMensaje('Usuario registrado correctamente.'); // Mensaje de éxito
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMensaje('Error al registrar usuario: ' + (error.response?.data?.message || 'Error desconocido.')); // Mensaje de error
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.h2}>Registro de Usuario</h2>
        {mensaje && <p style={styles.errorMessage}>{mensaje}</p>} {/* Mostrar mensaje */}
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
        <input
          type="number"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="celular"
          placeholder="Celular"
          value={formData.celular}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
