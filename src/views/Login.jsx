import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hook/userform";
import { api } from "../api/axios";
import { guardarTokenEnLocalStorage } from "../utils/authService";

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100vh",
    backgroundImage:
      "url('https://alianzaautomotriz.com/wp-content/uploads/2020/05/seguro-autos.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
  const { email, password, onInputChange, onResetForm } = useForm({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/login", {
        email,
        password,
      });

      const { access_token, user } = response.data;

      // Guardar el token usando la función de authService

      guardarTokenEnLocalStorage(access_token, user.email, user.id);

      // Mostrar el token y los datos del usuario en la consola
      console.log("Token obtenido:", access_token);
      console.log("Usuario obtenido:", user.id);

      // Navegar al dashboard
      navigate("/dashboard", {
        replace: true,
        state: { logged: true },
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
      setError("Email o contraseña incorrectos. Inténtalo de nuevo.");
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
            name="email"
            id="email"
            value={email}
            onChange={onInputChange}
            required
            autoComplete="off"
            style={styles.input}
          />
          <label
            htmlFor="email"
            style={{ ...styles.label, ...(email ? styles.labelActive : {}) }}
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
