import { Navigate } from "react-router-dom"; 
import useAuth from "../hooks/useAuth.js";  

const Protected = ({ children }) => {//children en este caso trae el componente hijo, puedo ser Dashboard para el primer caso cuando se entre a la ruta principal
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;//si estoy logueado renderiza lo que viene como children, si no redirecciona al login
}

export default Protected;
