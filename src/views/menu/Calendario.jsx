import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalAgendaUsuario from "../Componentes/modalComponentes/ModalAgendaUsuario";

export default function Calendario() {
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el token y userId del localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Si no hay token o userId, redirigir al login
    if (!token || !userId) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <ModalAgendaUsuario />
    </>
  );
}
