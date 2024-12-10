import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalNotificacionesUsuario from "../Componentes/modalComponentes/ModalNotificacionesUsuario";

export default function Notificaciones() {
  
  
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el token y userId del localStorage
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    // Si no hay token o userId, redirigir al login
    if (!token || !userId) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <ModalNotificacionesUsuario />
    </>
  );
}
