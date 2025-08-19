import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

function mapErrorsByField(arr = []) {
  const out = {};
  arr.forEach(e => { if (e.param) out[e.param] = e.msg; });
  return out;
}

export default function Projects() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:"", description:"" });
  const [editId, setEditId] = useState(null);

  // nuevos estados para errores del backend
  const [fieldErrors, setFieldErrors] = useState({}); // { name?:string, description?:string }
  const [serverList, setServerList]   = useState([]); // [{ msg, param? }, ...]
  const [okMsg, setOkMsg] = useState("");

  const load = async () => {
    const r = await api(token).get("/projects");
    if (r.ok) setItems(await r.json());
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const save = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerList([]);
    setOkMsg("");

    const body = { ...form };

    const r = editId
      ? await api(token).patch(`/projects/${editId}`, body)
      : await api(token).post("/projects", body);

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      // Normaliza errores del backend (express-validator: { errors: [...] })
      const errors = Array.isArray(data.errors)
        ? data.errors
        : [{ msg: data.message || "No se pudo guardar" }];

      setFieldErrors(mapErrorsByField(errors));
      setServerList(errors);
      return;
    }

    // OK
    setForm({ name:"", description:"" });
    setEditId(null);
    setOkMsg(editId ? "Proyecto actualizado" : "Proyecto creado");
    load();
  };

  const del = async (id) => {
    if (!confirm("¿Eliminar proyecto?")) return;
    const r = await api(token).del(`/projects/${id}`);
    if (r.ok) load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Proyectos</h1>

      {/* Mensajes globales */}
      {serverList.length > 0 && (
        <ul className="mb-3 text-sm text-red-600 list-disc list-inside">
          {serverList.map((e,i) => <li key={i}>{e.msg}</li>)}
        </ul>
      )}
      {okMsg && <p className="text-green-600 text-sm mb-3">{okMsg}</p>}

      <form onSubmit={save} noValidate className="mb-6 grid gap-2 max-w-lg">
        <div>
          <input
            className={`border rounded px-3 py-2 w-full ${fieldErrors.name ? 'border-red-500' : ''}`}
            placeholder="Nombre"
            name="name"
            value={form.name}
            onChange={e=>setForm(f=>({...f, name:e.target.value}))}
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
        </div>

        <div>
          <textarea
            className={`border rounded px-3 py-2 w-full ${fieldErrors.description ? 'border-red-500' : ''}`}
            placeholder="Descripción"
            name="description"
            rows="3"
            value={form.description}
            onChange={e=>setForm(f=>({...f, description:e.target.value}))}
            aria-invalid={!!fieldErrors.description}
          />
          {fieldErrors.description && <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>}
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            {editId ? "Actualizar" : "Crear"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={()=>{ setEditId(null); setForm({name:"",description:""}); setFieldErrors({}); setServerList([]); }}
              className="px-4 py-2 rounded border"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-slate-600">Aún no hay proyectos.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map(p => (
            <li key={p.id} className="border rounded p-3 flex items-start justify-between">
              <div>
                <div className="font-semibold">{p.name}</div>
                {p.description && <div className="text-sm text-slate-600">{p.description}</div>}
              </div>
              <div className="flex gap-2">
                <a href={`/projects/${p.id}/tasks`} className="px-3 py-2 rounded bg-slate-800 text-white">Tareas</a>
                <button
                  className="px-3 py-2 rounded bg-indigo-600 text-white"
                  onClick={()=>{ setEditId(p.id); setForm({ name:p.name, description:p.description||"" }); setFieldErrors({}); setServerList([]); }}
                >
                  Editar
                </button>
                <button
                  className="px-3 py-2 rounded bg-rose-600 text-white"
                  onClick={()=>del(p.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
