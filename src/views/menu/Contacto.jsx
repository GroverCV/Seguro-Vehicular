import React from "react";
import Permisos from "../Componentes/Permisos";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#333",
    color: "white",
    padding: "20px",
    textAlign: "center",
  },
  contactSection: {
    padding: "40px 20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  contactHeading: {
    fontSize: "32px",
    margin: "0 0 20px",
    textAlign: "center",
  },
  contactParagraph: {
    fontSize: "18px",
    margin: "10px 0 30px",
    textAlign: "center",
  },
  formGroup: {
    margin: "20px 0",
  },
  label: {
    fontSize: "16px",
    marginBottom: "10px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  submitButton: {
    display: "block",
    width: "100%",
    padding: "15px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "18px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
  footer: {
    backgroundColor: "#333",
    color: "white",
    textAlign: "center",
    padding: "20px",
    marginTop: "40px",
  },
};

const Contacto = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Contáctanos</h1>
      </header>

      <section style={styles.contactSection}>
        <h2 style={styles.contactHeading}>Estamos Aquí para Ayudarte</h2>
        <p style={styles.contactParagraph}>
          Si tienes alguna pregunta o necesitas más información sobre nuestros
          seguros, no dudes en contactarnos a través del siguiente formulario.
        </p>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="name">
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            style={styles.input}
            placeholder="Ingresa tu nombre completo"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            style={styles.input}
            placeholder="Ingresa tu correo electrónico"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="message">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            style={styles.textarea}
            placeholder="Escribe tu mensaje"
            rows="6"
          ></textarea>
        </div>

        <button type="submit" style={styles.submitButton}>
          Enviar Mensaje
        </button>
      </section>

      <footer style={styles.footer}>
        <p>&copy; 2024 Seguro y Autos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Contacto;
