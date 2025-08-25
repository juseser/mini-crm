import { createContext, useContext, useMemo, useState } from "react";
import api from "../lib/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = async (email, password) => {
    try {
      const res = await api().post("/auth/login", { email, password });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errors = Array.isArray(body.errors)
          ? body.errors
          : [{ msg: body.message || "Error al iniciar sesión" }];
        return { ok: false, errors };
      }
      localStorage.setItem("token", body.token);
      setToken(body.token);            // <- dispara re-render en Nav
      return { ok: true };
    } catch {
      return { ok: false, errors: [{ msg: "Error de red" }] };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api().post("/auth/register", { name, email, password });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        let errors = Array.isArray(body.errors)
          ? body.errors
          : [{ msg: body.message || "No se pudo registrar" }];
        if (res.status === 409) {
          errors = errors.map(e => ({
            param: e.param || e.path || "email",
            msg: e.msg || "Email ya registrado",
          }));
        }
        return { ok: false, errors };
      }
      return { ok: true };
    } catch {
      return { ok: false, errors: [{ msg: "Error de red" }] };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const value = useMemo(
    () => ({ token, isAuth: !!token, login, register, logout }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
