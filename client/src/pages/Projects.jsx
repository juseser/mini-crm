import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

export default function Projects() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:"", description:"" });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const r = await api(token).get("/projects");
    if (r.ok) setItems(await r.json());
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const body = { ...form };
    const r = editId
      ? await api(token).patch(`/projects/${editId}`, body)
      : await api(token).post("/projects", body);
    if (r.ok) { setForm({name:"", description:""}); setEditId(null); load(); }
  };

  const del = async (id) => {
    if (!confirm("¿Eliminar proyecto?")) return;
    const r = await api(token).del(`/projects/${id}`);
    if (r.ok) load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Proyectos</h1>

      <form onSubmit={save} className="mb-6 grid gap-2 max-w-lg">
        <input
          className="border rounded px-3 py-2"
          placeholder="Nombre"
          value={form.name}
          onChange={e=>setForm(f=>({...f, name:e.target.value}))}
        />
        <textarea
          className="border rounded px-3 py-2"
          placeholder="Descripción"
          rows="3"
          value={form.description}
          onChange={e=>setForm(f=>({...f, description:e.target.value}))}
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            {editId ? "Actualizar" : "Crear"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={()=>{ setEditId(null); setForm({name:"",description:""}); }}
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
                  onClick={()=>{ setEditId(p.id); setForm({ name:p.name, description:p.description||"" }); }}
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
