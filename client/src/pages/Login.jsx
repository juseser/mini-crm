import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function mapErrorsByField(arr = []) {
  const out = {};
  arr.forEach(e => { if (e.param) out[e.param] = e.msg; });
  return out;
}

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email:"", password:"" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverList, setServerList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerList([]);

    const r = await login(form.email, form.password);
    if (!r.ok) {
      setFieldErrors(mapErrorsByField(r.errors));
      setServerList(r.errors);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

      {/* Lista general de errores del backend */}
      {serverList.length > 0 && (
        <ul className="mb-3 text-sm text-red-600 list-disc list-inside">
          {serverList.map((e,i)=><li key={i}>{e.msg}</li>)}
        </ul>
      )}

      <form onSubmit={handleSubmit} noValidate className="grid gap-3">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            className={`border rounded px-3 py-2 w-full ${fieldErrors.email ? 'border-red-500' : ''}`}
            value={form.email}
            onChange={e=>setForm(f=>({...f, email:e.target.value}))}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className={`border rounded px-3 py-2 w-full ${fieldErrors.password ? 'border-red-500' : ''}`}
            value={form.password}
            onChange={e=>setForm(f=>({...f, password:e.target.value}))}
            aria-invalid={!!fieldErrors.password}
          />
          {fieldErrors.password && <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>}
        </div>

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
