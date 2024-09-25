import React from "react";

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
  hero: {
    display: "flex",
    flexDirection: "column", // Cambiado a columna para móviles
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    color: "white",
    padding: "50px 20px",
    borderRadius: "8px",
    margin: "20px 0",
  },
  heroImg: {
    width: "100%", // Ajustar imagen al 100% en dispositivos móviles
    maxWidth: "500px", // Limitar ancho máximo
    borderRadius: "8px",
    marginTop: "20px", // Separar imagen del texto
  },
  heroText: {
    textAlign: "center", // Centrar texto
  },
  heroHeading: {
    fontSize: "36px",
    margin: 0,
  },
  heroParagraph: {
    fontSize: "18px",
    margin: "10px 0",
  },
  services: {
    display: "flex",
    flexWrap: "wrap", // Permitir que los servicios se envuelvan
    justifyContent: "space-between",
    margin: "20px 0",
  },
  service: {
    background: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "30%",
    textAlign: "center",
    marginBottom: "20px", // Añadir margen inferior
  },
  serviceImg: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%",
  },
  serviceHeading: {
    fontSize: "24px",
    margin: "10px 0",
  },
  serviceParagraph: {
    fontSize: "16px",
  },
  footer: {
    backgroundColor: "#333",
    color: "white",
    textAlign: "center",
    padding: "20px",
  },
};

const Inicio = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Seguro para Autos</h1>
      </header>

      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.heroHeading}>Protege tu Vehículo con Nuestro Seguro</h1>
          <p style={styles.heroParagraph}>
            Obtén la mejor protección para tu auto con nuestras opciones de seguro flexibles y completas. Ya sea que necesites cobertura básica o una póliza completa, tenemos lo que buscas.
          </p>
          <p style={styles.heroParagraph}>
            ¡Comienza hoy y disfruta de la tranquilidad de saber que tu auto está seguro!
          </p>
        </div>
        <img
          src="https://revistaautosmas.com/wp-content/uploads/2021/08/Seguro_Auto.jpg"
          alt="Seguro de Auto"
          style={styles.heroImg}
        />
      </div>

      <div style={styles.services}>
        <div style={styles.service}>
          <img
            src="https://blog.qualitas.com.mx/wp-content/uploads/2022/10/BLOG-MITOS-Y-REALIDADES-1-958x639.jpg"
            alt="Servicio 1"
            style={styles.serviceImg}
          />
          <h2 style={styles.serviceHeading}>Seguro a Todo Riesgo</h2>
          <p style={styles.serviceParagraph}>
            Protege tu vehículo contra todos los posibles daños, desde accidentes hasta robo y vandalismo.
          </p>
        </div>
        <div style={styles.service}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdBdtNyVqaVmfRx6FXcIJUrFmkJdL8AEEGZ1Y0rHMAifUKKxhTME_0IEAcqT3oC-rrjOM&usqp=CAU"
            alt="Servicio 2"
            style={styles.serviceImg}
          />
          <h2 style={styles.serviceHeading}>Seguro Contra Accidentes</h2>
          <p style={styles.serviceParagraph}>
            Cubre los gastos médicos y daños a terceros en caso de accidente.
          </p>
        </div>
        <div style={styles.service}>
          <img
            src="https://www.aseguratemexico.com/images/easyblog_images/62/seguros-automoviles.jpg"
            alt="Servicio 3"
            style={styles.serviceImg}
          />
          <h2 style={styles.serviceHeading}>Seguro de a terceros</h2>
          <p style={styles.serviceParagraph}>
            Protege tus finanzas contra reclamaciones por daños a terceros.
          </p>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; 2024 Seguro y Autos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Inicio;
