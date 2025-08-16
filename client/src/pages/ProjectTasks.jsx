import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

export default function ProjectTasks() {
  const { id } = useParams();
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title:"", status:"todo", priority:"media" });

  const load = async () => {
    const r = await api(token).get(`/tasks?projectId=${id}`);
    if (r.ok) setItems(await r.json());
  };
  useEffect(() => { load(); }, [id]);

  const save = async (e) => {
    e.preventDefault();
    const r = await api(token).post("/tasks", { ...form, projectId: Number(id) });
    if (r.ok) { setForm({ title:"", status:"todo", priority:"media" }); load(); }
  };

  const toggle = async (t) => {
    const next = t.status === "done" ? "todo" : "done";
    const r = await api(token).patch(`/tasks/${t.id}`, { status: next });
    if (r.ok) load();
  };

  const del = async (taskId) => {
    if (!confirm("¿Eliminar tarea?")) return;
    const r = await api(token).del(`/tasks/${taskId}`);
    if (r.ok) load();
  };

  return (
    <div>
      <a href="/projects" className="text-sm text-indigo-700 underline">← Volver</a>
      <h1 className="text-2xl font-bold mb-4">Tareas del proyecto {id}</h1>

      <form onSubmit={save} className="mb-6 grid gap-2 max-w-lg">
        <input
          className="border rounded px-3 py-2"
          placeholder="Título"
          value={form.title}
          onChange={e=>setForm(f=>({...f, title:e.target.value}))}
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            className="border rounded px-3 py-2"
            value={form.status}
            onChange={e=>setForm(f=>({...f, status:e.target.value}))}
          >
            <option value="todo">Por hacer</option>
            <option value="doing">En progreso</option>
            <option value="done">Completada</option>
          </select>
          <select
            className="border rounded px-3 py-2"
            value={form.priority}
            onChange={e=>setForm(f=>({...f, priority:e.target.value}))}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          Agregar
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-slate-600">Aún no hay tareas.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map(t => (
            <li key={t.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-slate-600">{t.status} · {t.priority}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={()=>toggle(t)}
                  className={t.status === "done"
                    ? "px-3 py-2 rounded bg-amber-500 hover:bg-amber-600 text-white"
                    : "px-3 py-2 rounded bg-green-600 hover:bg-green-700 text-white"}
                >
                  {t.status === "done" ? "Reabrir" : "Completar"}
                </button>
                <button
                  onClick={()=>del(t.id)}
                  className="px-3 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white"
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
