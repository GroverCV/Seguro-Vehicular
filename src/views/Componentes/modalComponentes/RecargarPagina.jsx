import { useEffect } from "react";

const Recargar = () => {
  useEffect(() => {
    window.location.reload();
  }, []); // El array vacío asegura que se ejecute solo una vez al montarse

  return null; // No renderiza nada en la UI
};

export default Recargar;
