// src/Contacto.jsx

import React, { useState } from "react";
import emailjs from "@emailjs/browser"; // Asegúrate de haber instalado este paquete
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from "./config"; // Importa desde config.js

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
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
    flex: 1,
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
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    resize: "vertical",
    boxSizing: "border-box",
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
    transition: "background-color 0.3s",
  },
  submitButtonHover: {
    backgroundColor: "#0056b3",
  },
  whatsappButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#25D366",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s",
  },
  whatsappIcon: {
    width: "30px",
    height: "30px",
  },
  footer: {
    backgroundColor: "#333",
    color: "white",
    textAlign: "center",
    padding: "20px",
    marginTop: "40px",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
  successMessage: {
    color: "green",
    fontSize: "16px",
    textAlign: "center",
    marginTop: "20px",
  },
};

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    pais: '',
    departamento: '',
    mensaje: ''
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isWhatsAppHovering, setIsWhatsAppHovering] = useState(false);
  const [isSending, setIsSending] = useState(false); // Estado para manejar el envío
  const [success, setSuccess] = useState(false); // Estado para manejar el éxito

  // Obtener las credenciales desde config.js
  const serviceID = EMAILJS_SERVICE_ID;
  const templateID = EMAILJS_TEMPLATE_ID;
  const userID = EMAILJS_USER_ID;

  // Verificar que las credenciales estén definidas
  if (!serviceID || !templateID || !userID) {
    console.error("Faltan credenciales de EmailJS. Verifica tu archivo config.js.");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar errores al escribir
    setErrors({ ...errors, [name]: "" });
    // Limpiar mensaje de éxito al modificar el formulario
    setSuccess(false);
    setGeneralError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido.";
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Correo electrónico inválido.";
    }
    if (!formData.message.trim())
      newErrors.message = "El mensaje es requerido.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setIsSending(true); // Inicia el estado de envío
      emailjs
        .send(serviceID, templateID, formData, userID)
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            setSuccess(true);
            setFormData({
              name: "",
              email: "",
              telefono: "",
              pais: "",
              departamento: "",
              asunto: "",
              message: ""
            }); 
            setIsSending(false); // Finaliza el estado de envío
          },
          (err) => {
            console.error("FAILED...", err);
            setGeneralError("Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.");
            setIsSending(false); // Finaliza el estado de envío
          }
        )
        .catch((error) => {
          console.error("Error en el envío:", error);
          setGeneralError("Hubo un error inesperado. Por favor, intenta nuevamente.");
          setIsSending(false);
        });
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "59175568812"; // Número de WhatsApp actualizado
    const message = encodeURIComponent(
      "Hola, me gustaría obtener más información sobre sus seguros."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };
  

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Contáctanos</h1>
      </header>

      <section style={styles.contactSection}>
        <h2 style={styles.contactHeading}>Estamos Aquí para Ayudarte</h2>
        <p style={styles.contactParagraph}>
          Si tienes alguna pregunta o necesitas más información sobre nuestros
          seguros, no dudes en contactarnos a través del siguiente formulario o
          por WhatsApp.
        </p>

        <form onSubmit={handleSubmit}>
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
              value={formData.name}
              onChange={handleChange}
              disabled={isSending}
            />
            {errors.name && <div style={styles.errorText}>{errors.name}</div>}
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
              value={formData.email}
              onChange={handleChange}
              disabled={isSending}
            />
            {errors.email && (
              <div style={styles.errorText}>{errors.email}</div>
            )}
          </div>

          <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="telefono">
            Teléfono: *
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            style={styles.input}
            placeholder="Ingresa tu Telefono de Contacto"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="pais">
            País: *
          </label>
          <input
            type="text"
            id="pais"
            name="pais"
            style={styles.input}
            placeholder="Ingresa tu Pais"
            value={formData.pais}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="departamento">
            Departamento: *
          </label>
          <input
            type="text"
            id="departamento"
            name="departamento"
            style={styles.input}
            placeholder="Ingresa tu Departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="asunto">
            Asunto: *
          </label>
          <input
            type="text"
            id="asunto"
            name="asunto"
            style={styles.input}
            placeholder="Ingresa tu Asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
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
              value={formData.message}
              onChange={handleChange}
              disabled={isSending}
            ></textarea>
            {errors.message && (
              <div style={styles.errorText}>{errors.message}</div>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(isHovering ? styles.submitButtonHover : {}),
              opacity: isSending ? 0.6 : 1, // Reducir opacidad durante el envío
              cursor: isSending ? "not-allowed" : "pointer", // Cambiar cursor durante el envío
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            disabled={isSending} // Deshabilitar botón durante el envío
          >
            {isSending ? "Enviando..." : "Enviar Mensaje"}
          </button>

          {success && (
            <div style={styles.successMessage}>
              ¡Mensaje enviado exitosamente!
            </div>
          )}

          {generalError && (
            <div style={styles.errorText}>{generalError}</div>
          )}
        </form>
      </section>

      <button
        style={{
          ...styles.whatsappButton,
          ...(isWhatsAppHovering
            ? { backgroundColor: "#128C7E" }
            : { backgroundColor: "#25D366" }),
        }}
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsWhatsAppHovering(true)}
        onMouseLeave={() => setIsWhatsAppHovering(false)}
        aria-label="Contactar por WhatsApp"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={styles.whatsappIcon}
        />
      </button>

      <footer style={styles.footer}>
        <p>&copy; 2024 Seguro y Autos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Contacto;