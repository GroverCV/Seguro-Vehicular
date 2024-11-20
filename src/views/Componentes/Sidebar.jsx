import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Definir los estilos como constantes
const sidebarStyles = {
  container: {
    width: "500px", // Ancho del sidebar aumentado al 30%
    backgroundColor: "#333", // Color de fondo
    height: "auto", // Altura completa de la pantalla
    padding: "0rem", // Espaciado interno
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 5px rgba(0,0,0,0.5)",
  },
  header: {
    fontFamily: "Pacifico, cursive",
    fontSize: "2.0rem", // Aumentar el tamaño del texto
    color: "#FFFFFF", // Color blanco
    fontWeight: "bold",
    textAlign: "center",
  },

  listItem: {
    marginBottom: "0.5rem",
    borderRadius: "0.5rem",
    padding: "1rem 0rem", // Espaciado superior/inferior y lateral
    cursor: "pointer",
    fontSize: "1.1rem", // Tamaño del texto para los ítems de la lista
    color: "#FFFFFF", // Color blanco para los ítems
    textDecoration: "none",
    justifyContent: "flex-start", // Alinear el texto a la izquierda
    transition: "background-color 0.1s", // Transición suave para el cambio de color
    whiteSpace: "nowrap", // Evitar que el texto se divida en varias líneas
    overflow: "hidden", // Ocultar cualquier texto desbordante
    //textOverflow: "ellipsis", // Mostrar puntos suspensivos para texto largo
  },
  itemHover: {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#00796B", // color teal-800
  },
  itemActive: {
    backgroundColor: "#004d40", // color teal-900 (más oscuro para el estado activo)
    color: "#FFC107", // color amber-500 para el texto activo
  },
  sublist: {
    marginLeft: "0rem",
    marginTop: "0rem",
  },
  modal: {
    position: "fixed",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "0rem",
    borderRadius: "0rem",
  },
  button: {
    padding: "0rem 0rem",
    borderRadius: "0rem",
    marginRight: "0rem",
    fontSize: "1rem", // Tamaño del texto para los botones
    transition: "background-color 0.3s", // Transición suave para el cambio de color
  },
  cancelButton: {
    backgroundColor: "#E0E0E0", // color gray-200
  },
  confirmButton: {
    backgroundColor: "#004d40", // color teal-800
    color: "white",
  },
};

const SidebarItem = ({ label, items, section, expanded, toggleExpand }) => (
  <li
    style={{
      ...sidebarStyles.listItem,
      ...(expanded ? sidebarStyles.itemHover : {}),
    }}
  >
    <div
      className="px-3 h-full flex items-center cursor-pointer"
      onClick={() => toggleExpand(section)}
    >
      {label}
    </div>
    {expanded && (
      <ul style={sidebarStyles.sublist}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              ...sidebarStyles.listItem,
              ...(item.active
                ? sidebarStyles.itemActive
                : sidebarStyles.itemHover),
            }}
          >
            {item.onClick ? (
              <div
                className="px-3 h-full flex items-center cursor-pointer"
                onClick={item.onClick}
                style={{
                  color: item.active
                    ? sidebarStyles.itemActive.color
                    : "#FFFFFF",
                }}
              >
                {item.label}
              </div>
            ) : (
              <NavLink
                to={item.to}
                className="px-3 h-full flex items-center"
                style={({ isActive }) => ({
                  color: isActive ? sidebarStyles.itemActive.color : "#FFFFFF",
                  backgroundColor: isActive
                    ? sidebarStyles.itemActive.backgroundColor
                    : "transparent",
                  textDecoration: "none", // Quitar subrayado
                })}
                activeStyle={{
                  backgroundColor: sidebarStyles.itemActive.backgroundColor, // Color cuando está activo
                  color: sidebarStyles.itemActive.color,
                }}
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    )}
  </li>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [expanded, setExpanded] = useState({
    usuario: false,
    poliza: false,
    incidente: false,
    finanza: false,
  });

  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false);
    navigate("/", { replace: true });
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  const toggleExpand = (section) => {
    setExpanded((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleBackup = async () => {
    try {
      const response = await axios.post(
        "https://5b74-181-41-146-246.ngrok-free.app/api/backup"
      );
      console.log("Backup exitoso:", response);
      alert("¡Backup realizado exitosamente!");
    } catch (error) {
      console.error("Error al realizar el backup:", error);
      alert("Error al realizar el backup");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={sidebarStyles.container}>
        <hr />
        <div>
          <h1 style={sidebarStyles.header}>FUNCIONES</h1>
        </div>
        <hr />
        <ul className="mt-3 font-bold">
          <SidebarItem
            label="Usuarios y Agenda"
            section="usuario"
            expanded={expanded.usuario}
            toggleExpand={toggleExpand}
            items={[
              { label: "CU01. Administrar Inicio de Sesión", to: "/login" },
              {
                label: "CU02. Administrar Cierre de Sesión",
                onClick: () => setLogoutModalVisible(true),
              },
              { label: "CU03. Registrar Usuario", to: "/dashboard/register" },
              {
                label: "CU04. Gestionar Usuario",
                to: "/dashboard/gestionarusuario",
              },
              { label: "CU05. Gestionar Roles", to: "/dashboard/gestionarrol" },
              {
                label: "CU06. Asignar Permisos",
                to: "/dashboard/asignarpermisos",
              },
              {
                label: "CU00. Gestionar Tipo Usuario",
                to: "/dashboard/gestionartipousuario",
              },
              {
                label: "CU09. Gestinoar Agenda",
                to: "/dashboard/gestionaragenda",
              },

              {
                label: "CU08. Gestionar Tipo Cita",
                to: "/dashboard/gestionartipocita",
              },
              {
                label: "CU23. Administrar Bitacora",
                to: "/dashboard/administrarbitacora",
              },
            ]}
          />

          <SidebarItem
            label="Vehiculos y Propietarios"
            section="poliza"
            expanded={expanded.poliza}
            toggleExpand={toggleExpand}
            items={[
              {
                label: "CU20. Gestionar Vehiculo",
                to: "/dashboard/gestionarvehiculo",
              },
              {
                label: "CU19. Gestionar Tipo Vehiculo",
                to: "/dashboard/gestionartipovehiculo",
              },

              {
                label: "CU16. Gestionar Modelo",
                to: "/dashboard/gestionarmodelo",
              },
              {
                label: "CU15. Gestionar Marca",
                to: "/dashboard/gestionarmarca",
              },

              {
                label: "CU17. Gestionar Valor Comercial",
                to: "/dashboard/gestionarvalorcomercial",
              },
              {
                label: "CU18. Gestionar Depreciacion",
                to: "/dashboard/gestionardepreciacion",
              },
              {
                label: "CU25. Gestionar Imagen",
                to: "/dashboard/gestionarimagen",
              },
            ]}
          />
          <SidebarItem
            label="Documentos e Incidentes"
            section="incidente"
            expanded={expanded.incidente}
            toggleExpand={toggleExpand}
            items={[
              {
                label: "CU13. Gestionar Informacion",
                to: "/dashboard/gestionarinformacion",
              },
            ]}
          />
          <SidebarItem
            label="Pagos y Notificaciones"
            section="finanza"
            expanded={expanded.finanza}
            toggleExpand={toggleExpand}
            items={[
              {
                label: "CU08. Gestionar Tipo Notificacion",
                to: "/dashboard/gestionartiponotificacion",
              },
              {
                label: "CU11. Gestionar Notificacion",
                to: "/dashboard/gestionarnotificacion",
              },
              {
                label: "CU11. Gestionar Motivo Pago",
                to: "/dashboard/gestionarmotivopago",
              },
              {
                label: "CU11. Administrar Metodo Pago",
                to: "/dashboard/administrarmetodopago",
              },
              {
                label: "CU11. GestionarPoliza",
                to: "/dashboard/gestionarpoliza",
              },

              {
                label: "CU11. Gestionar Couta",
                to: "/dashboard/gestionarcouta",
              },
              
              {
                label: "CU11. Administrar Pago",
                to: "/dashboard/administrarpago",
              },

              {
                label: "CU11. Comprobante",
                to: "/dashboard/comprobante",
              },

              {
                label: "CU11. Gestionar Plan Pago",
                to: "/dashboard/gestionarplanpago",
              },
              {
                /*{
                label: "CU12. Realizar tipo de pago",
                to: "/dashboard/uploadImage",
              },*/
              },
            ]}
          />
          <li
            style={{
              ...sidebarStyles.listItem,
              ...sidebarStyles.itemHover,
            }}
          >
            <NavLink
              to="/dashboard/ModalAgendaAgente"
              className="px-3 h-full flex items-center"
              style={({ isActive }) => ({
                color: isActive ? sidebarStyles.itemActive.color : "#FFFFFF",
                backgroundColor: isActive
                  ? sidebarStyles.itemActive.backgroundColor
                  : "transparent",
                textDecoration: "none", // Quitar subrayado
              })}
            >
              MI AGENDA
            </NavLink>
          </li>
          <li
            style={{
              ...sidebarStyles.listItem,
              ...sidebarStyles.itemHover,
            }}
          >
            <NavLink
              to="/dashboard/administrarbitacora"
              className="px-3 h-full flex items-center"
              style={({ isActive }) => ({
                color: isActive ? sidebarStyles.itemActive.color : "#FFFFFF",
                backgroundColor: isActive
                  ? sidebarStyles.itemActive.backgroundColor
                  : "transparent",
                textDecoration: "none", // Quitar subrayado
              })}
            >
              ADMINISTRAR BITACORA
            </NavLink>
          </li>
          <li
            style={{
              ...sidebarStyles.listItem,
              ...sidebarStyles.itemHover,
            }}
          >
            <NavLink
              to="/dashboard/generarreporte"
              className="px-3 h-full flex items-center"
              style={({ isActive }) => ({
                color: isActive ? sidebarStyles.itemActive.color : "#FFFFFF",
                backgroundColor: isActive
                  ? sidebarStyles.itemActive.backgroundColor
                  : "transparent",
                textDecoration: "none", // Quitar subrayado
              })}
            >
              GENERAR REPORTE
            </NavLink>
          </li>

          <li
            style={{
              ...sidebarStyles.listItem,
              ...sidebarStyles.itemHover,
            }}
          >
            <NavLink
              to="#"
              className="px-3 h-full flex items-center"
              onClick={(e) => {
                e.preventDefault();
                const confirmed = window.confirm(
                  "¿Estás seguro de que deseas realizar un backup?"
                );
                if (confirmed) {
                  handleBackup(); 
                }
              }}
              style={({ isActive }) => ({
                color: isActive ? sidebarStyles.itemActive.color : "#FFFFFF",
                backgroundColor: isActive
                  ? sidebarStyles.itemActive.backgroundColor
                  : "transparent",
                textDecoration: "none", // Quitar subrayado
              })}
            >
              REALIZAR BACKUP
            </NavLink>
          </li>

        </ul>

        {logoutModalVisible && (
          <div style={sidebarStyles.modal}>
            <div
              style={{
                ...sidebarStyles.modalContent,
                width: "400px",
                padding: "20px",
                borderRadius: "10px",
                fontSize: "25px",
                backgroundColor: "#ADD8E6",
                border: "2px solid black",
                display: "flex", // Agregar flexbox
                flexDirection: "column", // Alinear en columna
                alignItems: "center", // Centrar horizontalmente
                justifyContent: "center", // Centrar verticalmente
              }}
            >
              <h2 className="text-2xl mb-4 text-center">Cerrar Sesión</h2>
              <p className="text-lg text-center">
                ¿Está seguro que desea cerrar sesión?
              </p>
              <div className="flex justify-end mt-4">
                <button
                  style={{
                    ...sidebarStyles.button,
                    ...sidebarStyles.cancelButton,
                    padding: "20px 33px",
                    borderRadius: "5px",
                    fontSize: "25px",
                    marginRight: "10px", // Espaciado entre botones
                  }}
                  onClick={handleLogoutCancel}
                >
                  Cancelar
                </button>
                <button
                  style={{
                    ...sidebarStyles.button,
                    ...sidebarStyles.confirmButton,
                    padding: "20px 40px",
                    borderRadius: "5px",
                    fontSize: "25px",
                  }}
                  onClick={handleLogoutConfirm}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
