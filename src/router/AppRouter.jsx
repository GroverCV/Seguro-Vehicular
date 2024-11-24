import { Route, Routes } from "react-router-dom";
import Navbar from "../Navbar";
import CerrarSesion from "../views/CerrarSesion";
import AdministrarBitacora from "../views/Componentes/AdministrarBitacora";
import AsignarPermisos from "../views/Componentes/AsignarPermisos";
import GestionarAgenda from "../views/Componentes/GestionarAgenda";
import GestionarImagen from "../views/Componentes/GestionarImagen";
import GestionarInformacion from "../views/Componentes/GestionarInformacion";
import GestionarMarca from "../views/Componentes/GestionarMarca";
import GestionarNotificacion from "../views/Componentes/GestionarNotificacion";
import GestionarRol from "../views/Componentes/GestionarRol";
import GestionarTipoCita from "../views/Componentes/GestionarTipoCita";
import GestionarTipoNotificacion from "../views/Componentes/GestionarTipoNotificacion";
import GestionarUsuario from "../views/Componentes/GestionarUsuario";
import Dashboard from "../views/Dashboard";
import Home from "../views/Home";
import Login from "../views/Login";
import Register from "../views/Register";
import Calendario from "../views/menu/Calendario";
import Contacto from "../views/menu/Contacto";
import Informacion from "../views/menu/Informacion";
import Inicio from "../views/menu/Inicio";
import Notificaciones from "../views/menu/Notificaciones";
import Poliza from "../views/menu/Poliza";
import { PrivateRoute } from "./PrivateRout";
import GestionarModelo from "../views/Componentes/GestionarModelo";
import GestionarDepreciacion from "../views/Componentes/GestionarDepreciacion";
import GestionarTipoVehiculo from "../views/Componentes/GestionarTipoVehiculo";
import GestionarValorComercial from "../views/Componentes/GestionarValorComercial";
import GestionarVehiculo from "../views/Componentes/GestionarVehiculo";
import GenerarReporte from "../views/Componentes/GenerarReporte";
import GestionarTipoUsuario from "../views/Componentes/GestionarTipoUsuario";
import ModalAgendaAgente from "../views/Componentes/modalComponentes/ModalAgendaAgente";
import GestionarPlanPago from "../views/Componentes/Pagos/GestionarPlanPago";
import GestionarMotivoPago from "../views/Componentes/Pagos/GestionarMotivoPago";
import AdministrarMetodoPago from "../views/Componentes/Pagos/AdministrarMetodoPago";
import GestionarPoliza from "../views/Componentes/Pagos/GestionarPoliza";
import GestionarCuota from "../views/Componentes/Pagos/GestionarCouta";
import AdministrarPago from "../views/Componentes/Pagos/AdministrarPago";
import Comprobante from "../views/Componentes/Pagos/Comprobante";
import Backup from "../views/Componentes/Backup";


export const AppRouter = () => {
  return (
    <>
      <Navbar />
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/poliza" element={<Poliza/>} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
        <PrivateRoute> <Dashboard /> </PrivateRoute>}>
          <Route path="register" element={<Register />} />
          <Route path="cerrarsesion" element={<CerrarSesion />} />
          <Route path="gestionarusuario" element={<GestionarUsuario />} />
          <Route path="gestionartipousuario" element={<GestionarTipoUsuario />} />
          <Route path="administrarbitacora" element={<AdministrarBitacora/>} />
          <Route path="gestionarrol" element={<GestionarRol />} />
          <Route path="asignarpermisos" element={<AsignarPermisos/>} />
          <Route path="gestionarmarca" element={<GestionarMarca/>} />
          <Route path="gestionartipocita" element={<GestionarTipoCita/>} />
          <Route path="gestionaragenda" element={<GestionarAgenda/>} />
          <Route path="gestionartiponotificacion" element={<GestionarTipoNotificacion/>} />
          <Route path="gestionarnotificacion" element={<GestionarNotificacion/>} />
          <Route path="gestionarimagen" element={<GestionarImagen/>} />
          <Route path="gestionarinformacion" element={<GestionarInformacion/>} />
          <Route path="gestionarmodelo" element={<GestionarModelo/>} />
          <Route path="gestionarmarca" element={<GestionarMarca/>} />
          <Route path="gestionardepreciacion" element={<GestionarDepreciacion/>} />
          <Route path="gestionartipovehiculo" element={<GestionarTipoVehiculo/>} />
          <Route path="gestionarvalorcomercial" element={<GestionarValorComercial/>} />
          <Route path="gestionarvehiculo" element={<GestionarVehiculo/>} />
          <Route path="gestionarplanpago" element={<GestionarPlanPago/>} />
          <Route path="gestionarmotivopago" element={<GestionarMotivoPago/>} />
          <Route path="administrarmetodopago" element={<AdministrarMetodoPago/>} />
          <Route path="gestionarpoliza" element={<GestionarPoliza/>} />
          <Route path="gestionarcouta" element={<GestionarCuota/>} />
          <Route path="administrarpago" element={<AdministrarPago/>} />
          <Route path="comprobante" element={<Comprobante/>} />
          <Route path="modalagendaagente" element={<ModalAgendaAgente/>} />
          <Route path="backup" element={<Backup/>} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
