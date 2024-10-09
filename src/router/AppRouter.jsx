import { Route, Routes } from "react-router-dom";
import Navbar from "../Navbar";
import GestionarUsuario from "../views/Componentes/GestionarUsuario";
import Dashboard from "../views/Dashboard";
import Home from "../views/Home";
import Login from "../views/Login";
import Register from "../views/Register";
import Inicio from "../views/menu/Inicio";
import { PrivateRoute } from "./PrivateRout";
import GestionarRol from "../views/Componentes/GestionarRol";
import AsignarPermisos from "../views/Componentes/AsignarPermisos";
import GestionarMarca from "../views/Componentes/GestionarMarca";
import GestionarAgenda from "../views/Componentes/GestionarAgenda";
import GestionarNotificacion from "../views/Componentes/GestionarNotificacion";
import CerrarSesion from "../views/CerrarSesion";
import Contacto from "../views/menu/Contacto";
import GestionarTipoCita from "../views/Componentes/GestionarTipoCita";
import GestionarTipoNotificacion from "../views/Componentes/GestionarTipoNotificacion";
import AdministrarBitacora from "../views/Componentes/AdministrarBitacora";
import Informacion from "../views/menu/Informacion";


export const AppRouter = () => {
  return (
    <>
      <Navbar />
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
        <PrivateRoute> <Dashboard /> </PrivateRoute>}>
          <Route path="register" element={<Register />} />
          <Route path="cerrarsesion" element={<CerrarSesion />} />
          <Route path="gestionarusuario" element={<GestionarUsuario />} />
          <Route path="administrarbitacora" element={<AdministrarBitacora/>} />
          <Route path="gestionarrol" element={<GestionarRol />} />
          <Route path="asignarpermisos" element={<AsignarPermisos/>} />
          <Route path="gestionarmarca" element={<GestionarMarca/>} />
          <Route path="gestionartipocita" element={<GestionarTipoCita/>} />
          <Route path="gestionaragenda" element={<GestionarAgenda/>} />
          <Route path="gestionartiponotificacion" element={<GestionarTipoNotificacion/>} />
          <Route path="gestionarnotificacion" element={<GestionarNotificacion/>} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
