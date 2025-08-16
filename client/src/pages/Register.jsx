import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setOk(false);
    const success = await register(form.name, form.email, form.password);
    if (!success) {
      setError("No se pudo registrar (quizás el correo ya existe).");
    } else {
      setOk(true);
      setForm({ name:"", email:"", password:"" });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {ok && <p className="text-green-600 text-sm mb-3">Usuario creado con éxito. Ahora puedes iniciar sesión.</p>}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          type="text"
          placeholder="Nombre"
          className="border rounded px-3 py-2"
          value={form.name}
          onChange={e=>setForm(f=>({...f, name:e.target.value}))}
        />
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
          Registrarse
        </button>
      </form>
    </div>
  );
}
