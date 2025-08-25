import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const mapErrorsByField = (arr = []) => {
  const out = {};
  arr.forEach(e => {
    const field = e.param || e.path;
    if (field) out[field] = e.msg;
  });
  return out;
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const resp = await login(form.email, form.password);
    if (!resp.ok) {
      setFieldErrors(mapErrorsByField(resp.errors));
      return;
    }

    // ✅ Éxito: navega dentro de la SPA y Nav se actualizará por el contexto
    navigate("/projects", { replace: true });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

      <form onSubmit={handleSubmit} noValidate className="grid gap-3">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            className={`border rounded px-3 py-2 w-full ${fieldErrors.email ? "border-red-500" : ""}`}
            value={form.email}
            onChange={onInputChange}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className={`border rounded px-3 py-2 w-full ${fieldErrors.password ? "border-red-500" : ""}`}
            value={form.password}
            onChange={onInputChange}
            aria-invalid={!!fieldErrors.password}
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
          )}
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
};

export default Login;
