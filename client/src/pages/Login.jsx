import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email:"", password:"" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const ok = await login(form.email, form.password);
    if (!ok) setError("Credenciales inválidas");
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          type="email"
          placeholder="Correo"
          className="border rounded px-3 py-2"
          value={form.email}
          onChange={e=>setForm(f=>({...f, email:e.target.value}))}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border rounded px-3 py-2"
          value={form.password}
          onChange={e=>setForm(f=>({...f, password:e.target.value}))}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
