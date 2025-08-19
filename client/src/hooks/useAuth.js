// src/hooks/useAuth.js
import { useState } from "react";
import { api } from "../lib/api";

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Login que llama a la API y guarda el token
  const login = async (email, password) => {
    try {
      const res = await api().post("/auth/login", { email, password });
      const body = await res.json().catch(()=> ({}));
      if (!res.ok) {
        // Siempre devolvemos array `errors`
        const errors = Array.isArray(body?.errors)
          ? body.errors
          : [{ msg: body?.message || "Error al iniciar sesión" }];
        return { ok: false, errors };
      }
      localStorage.setItem("token", body.token);
      setToken(body.token);
      window.location.href = "/projects";
      return { ok: true };
    } catch {
      return { ok: false, errors: [{ msg: "Error de red" }] };
    }
  };

  // Registro simple (devuelve true/false)
  const register = async (name, email, password) => {
    try {
      const res = await api().post("/auth/register", { name, email, password });
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

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return { token, isAuth: !!token, login, register, logout };
}

