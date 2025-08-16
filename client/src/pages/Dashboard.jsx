import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api(token).get("/auth/me");
        if (!res.ok) {
          if (res.status === 401) logout(); // token inválido/expirado
          return;
        }
        const data = await res.json();
        if (mounted) setMe(data);
      } catch (e) {
        if (mounted) setErr("No se pudo cargar tu perfil");
      }
    })();
    return () => { mounted = false; };
  }, [token, logout]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {err && <p className="text-sm text-red-600 mb-3">{err}</p>}

      {!me ? (
        <p className="text-sm text-slate-600">Cargando...</p>
      ) : (
        <div className="border rounded p-4 mb-6">
          <div className="font-semibold">{me.name}</div>
          <div className="text-sm text-slate-600">{me.email}</div>
        </div>
      )}

      <div className="flex gap-2">
        <a
          href="/projects"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Ir a Projects
        </a>
        <button
          onClick={logout}
          className="px-4 py-2 rounded border"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
