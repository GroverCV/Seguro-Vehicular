import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hook/userform";

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100vh",
    backgroundImage:
      "url('https://alianzaautomotriz.com/wp-content/uploads/2020/05/seguro-autos.jpg')", // Aquí va la URL de la imagen de fondo
    backgroundSize: "cover", // Para que la imagen cubra toda la pantalla
    backgroundPosition: "center", // Centrar la imagen de fondo
    padding: "20px",
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo semitransparente para destacar el formulario
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    width: "500px",
    textAlign: "center",
  },
  h1: {
    marginBottom: "30px",
    fontSize: "32px",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "25px",
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "18px",
  },
  label: {
    position: "absolute",
    top: "50%",
    left: "14px",
    transform: "translateY(-50%)",
    color: "#aaa",
    transition: "0.3s",
    pointerEvents: "none",
    fontSize: "16px",
  },
  labelActive: {
    top: "-10px",
    left: "14px",
    fontSize: "14px",
    color: "#007bff",
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
};

export const Login = () => {
  const navigate = useNavigate();
  const { name, password, onInputChange, onResetForm } = useForm({
    name: "",
    password: "",
  });

  const [error, setError] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/usuarios"
      );
      const users = await response.json();
  
      const user = users.find(
        (user) => user.email === name && user.contrasena === password
      );
  
      if (user) {
        const token = "simulated-token"; // Cambiar a un token real si es necesario
        localStorage.setItem("token", token);
  
        // Obtener la IP del usuario
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
  
        const userIp = await getUserIp();
  
        // Datos a enviar a la bitácora
        const logData = {
          usuario_id: user.id, // Asegúrate de tener el ID del usuario
          accion: "Inició Sesión",
          detalles: "Ingreso al Sistema",
          ip: userIp,
        };
  
        // Enviar la acción a la bitácora
        await fetch("https://backend-seguros.campozanodevlab.com/api/bitacora", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Si es necesario un token para la autenticación
          },
          body: JSON.stringify(logData),
        });

        localStorage.setItem("userId", user.id);
        localStorage.setItem("userIp", userIp);
  
        // Navegar al dashboard
        navigate("/dashboard", {
          replace: true,
          state: { logged: true, name: user.nombre },
        });
      } else {
        setError("Email o contraseña incorrectos");
      }
    } catch (error) {
      setError("Error al autenticar. Inténtalo más tarde.");
    }
  
    onResetForm();
  };
  return (
    <div style={styles.wrapper}>
      <form onSubmit={onLogin} style={styles.form}>
        <h1 style={styles.h1}>Iniciar Sesión</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={styles.inputGroup}>
          <input
            type="email"
            name="name"
            id="name"
            value={name}
            onChange={onInputChange}
            required
            autoComplete="off"
            style={styles.input}
          />
          <label
            htmlFor="name"
            style={{ ...styles.label, ...(name ? styles.labelActive : {}) }}
          >
            Email:
          </label>
        </div>
        <div style={styles.inputGroup}>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onInputChange}
            required
            autoComplete="off"
            style={styles.input}
          />
          <label
            htmlFor="password"
            style={{ ...styles.label, ...(password ? styles.labelActive : {}) }}
          >
            Contraseña:
          </label>
        </div>
        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
