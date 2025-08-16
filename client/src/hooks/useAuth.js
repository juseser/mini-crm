// src/hooks/useAuth.js
import { useState } from "react";
import { api } from "../lib/api";

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Login que llama a la API y guarda el token
  const login = async (email, password) => {
    try {
      const res = await api().post("/auth/login", { email, password });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
      // navega a Projects luego de iniciar sesión
      window.location.href = "/projects";
      return true;
    } catch {
      return false;
    }
  };

  // Registro simple (devuelve true/false)
  const register = async (name, email, password) => {
    try {
      const res = await api().post("/auth/register", { name, email, password });
      return res.ok;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return { token, isAuth: !!token, login, register, logout };
}

