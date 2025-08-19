import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function mapErrorsByField(arr = []) {
  const out = {};
  arr.forEach(e => { if (e.param) out[e.param] = e.msg; });
  return out;
}

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [ok, setOk] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // { name?:string, email?:string, password?:string }
  const [serverList, setServerList] = useState([]);   // [{ msg, param? }, ...]

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOk(false);
    setFieldErrors({});
    setServerList([]);

    const r = await register(form.name, form.email, form.password);

    if (!r.ok) {
      setFieldErrors(mapErrorsByField(r.errors));
      setServerList(r.errors); // aquí vendrá también el 409 "Email ya registrado"
      return;
    }

    setOk(true);
    setForm({ name:"", email:"", password:"" });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>

      {/* Errores generales del backend (incluye 409 email ya registrado) */}
      {serverList.length > 0 && (
        <ul className="mb-3 text-sm text-red-600 list-disc list-inside">
          {serverList.map((e,i) => <li key={i}>{e.msg}</li>)}
        </ul>
      )}
      {ok && (
        <p className="text-green-600 text-sm mb-3">
          Usuario creado con éxito. Ahora puedes iniciar sesión.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="grid gap-3">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            className={`border rounded px-3 py-2 w-full ${fieldErrors.name ? 'border-red-500' : ''}`}
            value={form.name}
            onChange={e=>setForm(f=>({...f, name:e.target.value}))}
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
        </div>

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
          Registrarse
        </button>
      </form>
    </div>
  );
}
