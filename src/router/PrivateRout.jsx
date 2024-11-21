import { useLocation, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('access_token'); // Verificar el token

  // Si hay un token, permite el acceso a las rutas protegidas
  return token ? children : <Navigate to="/login" state={{ from: location }} />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
