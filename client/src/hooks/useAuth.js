import { useState } from "react";
import api from "../lib/api.js";// Importa la función api → es un helper que centraliza las llamadas al backend
// (ej: api().post("/auth/login", {...}) en lugar de usar fetch directamente)

// Este es un custom hook para manejar la autenticación
const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));//Guardamos el token que viene de node en la variable token

  // ----------- FUNCIÓN DE LOGIN -----------
  // Se encarga de llamar al endpoint de login en la API
  // Guarda el token si la autenticación fue exitosa
  const login = async (email, password) => {
    try {
      const res = await api().post("/auth/login", { email, password }); // Hace la petición POST a /auth/login enviando email y password
      const body = await res.json().catch(()=> ({}));// Intenta convertir la respuesta en JSON. Si falla (ej. respuesta vacía) devuelve {}

      if (!res.ok) {// Si la respuesta NO es ok (status 400 o 500, etc.)
        const errors = Array.isArray(body?.errors)//¿body.errors existe y además es un array?
          ? body.errors //si si, usamos el array tal cual
          : [{ msg: body?.message || "Error al iniciar sesión" }];//creamos un array manualmente (Si body.message existe usamos su valor. Si no existe → usamos "Error al iniciar sesión")
        return { ok: false, errors };//devolvemos un objeto con los errores al Login.jsx
      }

      localStorage.setItem("token", body.token);// Guarda el token en localStorage (persistencia al refrescar la página)
      setToken(body.token);// Actualiza el estado de token dentro del hook
      window.location.href = "/projects";// Redirige al usuario al listado de proyectos
      return { ok: true };// Devuelve éxito como un objeto
    } catch {
      return { ok: false, errors: [{ msg: "Error de red" }] };// Si hubo error de red o excepción
    }
  };

  // ----------- FUNCIÓN DE REGISTRO -----------
  // Similar al login, pero llamando al endpoint de registro
  const register = async (name, email, password) => {
    try {
      const res = await api().post("/auth/register", { name, email, password });//consumimos el api y pasamos los valores como un obj
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Normaliza a array de errores
        const errors = Array.isArray(body.errors)
          ? body.errors
          : [{ msg: body.message || "No se pudo registrar" }];
        return { ok: false, errors };
      }
      return { ok: true };
    } catch {
      return { ok: false, errors: [{ msg: "Error de red" }] };
    }
  };

  // ----------- FUNCIÓN DE LOGOUT -----------
  // Limpia la sesión del usuario
  const logout = () => {
    localStorage.removeItem("token"); // Elimina el token del localStorage
    setToken(null);// Borra el token del estado (isAuth = false)
    window.location.href = "/login";// Redirige al login
  };

   // ----------- VALORES DEVUELTOS POR EL HOOK -----------
  // Cuando usas este hook en un componente, tendrás acceso a:
  // token   → el token JWT actual
  // isAuth  → true/false según exista token
  // login   → función para loguear
  // register→ función para registrar
  // logout  → función para cerrar sesión
  return { token, isAuth: !!token, login, register, logout };
}

export default useAuth;// Exporta el hook para poder usarlo en otros componentes

