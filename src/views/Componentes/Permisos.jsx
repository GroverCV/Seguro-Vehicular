import React, { useState } from "react";

const Navegacion = () => {
  const [permisosNavegacion, setPermisosNavegacion] = useState({
    HOME: true, // Administrar Inicio de Sesión
    Iniciar_Sesión: true, // Administrar Inicio de Sesión
    Cierre_Sesión: true, // Administrar Cierre de Sesión
    Registrar_Usuario: false, // Registrar Usuario
    Gestionar_Usuario: false, // Gestionar Usuario
    Gestionar_Roles: false, // Gestionar Roles
    Asignar_Permisos: false, // Asignar Permisos
    Gestionar_Agenda: false, // Gestionar Agenda
    Gestionar_Notificación: false, // Gestionar Notificación
  });

  const togglePermisoNavegacion = (codigo) => {
    setPermisosNavegacion({
      ...permisosNavegacion,
      [codigo]: !permisosNavegacion[codigo],
    });
  };

  const permisosArray = Object.entries(permisosNavegacion);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {permisosArray.map(([codigo, asignado]) => (
          <button
            key={codigo}
            onClick={() => togglePermisoNavegacion(codigo)}
            style={{
              backgroundColor: asignado ? "lightgreen" : "lightcoral",
              color: "white",
              border: "none",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {codigo}
          </button>
        ))}
      </div>
      <div>
        {permisosNavegacion.HOME && <div>HOME</div>}
        {permisosNavegacion.Iniciar_Sesión && <div>Inicio de Sesión</div>}
        {permisosNavegacion.Cierre_Sesión && <div>Cierre de Sesión</div>}
        {permisosNavegacion.Registrar_Usuario && <div>Registrar Usuario</div>}
        {permisosNavegacion.Gestionar_Usuario && <div>Gestionar Usuario</div>}
        {permisosNavegacion.Gestionar_Roles && <div>Gestionar Roles</div>}
        {permisosNavegacion.Asignar_Permisos && <div>Asignar Permisos</div>}
        {permisosNavegacion.Gestionar_Agenda && <div>Gestionar Agenda</div>}
        {permisosNavegacion.Gestionar_Notificación && (
          <div>Gestionar Notificación</div>
        )}
      </div>
    </div>
  );
};

export default Navegacion;
