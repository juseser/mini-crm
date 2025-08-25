import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api  from "../lib/api.js";

const mapErrorsByField = (arr = []) => {
    const errors = {};
    arr.forEach((error) => { //Recorremos el array de errrores(arr) y lo convertimos a un objeto por campo
        const field = error.param || error.path;
        if (field) errors[field] = error.msg;
    }); 
    return errors;
}

const ProjectTasks = () => {
    const { id } = useParams();
    const { token } = useAuth();

    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ title:"", status:"todo", priority:"media" });

    // nuevos estados para manejar errores/ok
    const [fieldErrors, setFieldErrors] = useState({}); // { title?: string }
    const [serverList, setServerList] = useState([]); // [{ msg, param? }]
    const [okMsg, setOkMsg] = useState("");

    const load = async () => {
        setServerList([]); // limpia mensajes al recargar
        const r = await api(token).get(`/tasks?projectId=${id}`);
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          const errors = Array.isArray(body.errors)
            ? body.errors
            : [{ msg: body.message || "No se pudieron cargar las tareas" }];
          setServerList(errors);
          setItems([]);
          return;
        }
        setItems(await r.json());
    };

    useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

    const save = async (e) => {
      e.preventDefault();
      setFieldErrors({});
      setServerList([]);
      setOkMsg("");

      const r = await api(token).post("/tasks", { ...form, projectId: Number(id) });
      const body = await r.json().catch(() => ({}));

      if (!r.ok) {
        const errors = Array.isArray(body.errors)
          ? body.errors
          : [{ msg: body.message || "No se pudo crear la tarea" }];
        setFieldErrors(mapErrorsByField(errors));
        setServerList(errors);
        return;
      }

      setForm({ title:"", status:"todo", priority:"media" });
      setOkMsg("Tarea creada");
      load();
    };

    const toggle = async (t) => {
        setServerList([]); setOkMsg("");
        const next = t.status === "done" ? "todo" : "done";
        const r = await api(token).patch(`/tasks/${t.id}`, { status: next });
        if (!r.ok) {
            const body = await r.json().catch(() => ({}));
            const errors = Array.isArray(body.errors)
              ? body.errors
              : [{ msg: body.message || "No se pudo actualizar la tarea" }];
            setServerList(errors);
            return;
        }
        load();
    };

    const del = async (taskId) => {
        if (!confirm("¿Eliminar tarea?")) return;
        setServerList([]); setOkMsg("");
        const r = await api(token).del(`/tasks/${taskId}`);
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          const errors = Array.isArray(body.errors)
            ? body.errors
            : [{ msg: body.message || "No se pudo eliminar la tarea" }];
          setServerList(errors);
          return;
        }
        load();
    };

    const onInputChange = ({ target })=> {
        const { name, value } = target; //destructuring
        setForm((prev) => ({ //estado anterior
          ...prev,
          [name]: value
        }));
    }

    return (
      <div>
        <Link
          to={"/projects"}
          className="text-sm text-indigo-700 underline"
        >
          ← Volver
        </Link>
        
        <h1 className="text-2xl font-bold mb-4">Tareas del proyecto {id}</h1>

        {okMsg && <p className="text-green-600 text-sm mb-3">{okMsg}</p>}

        <form onSubmit={save} noValidate className="mb-6 grid gap-2 max-w-lg">
          <div>
            <input
              className={`border rounded px-3 py-2 w-full ${fieldErrors.title ? 'border-red-500' : ''}`}
              placeholder="Título"
              name="title"
              value={form.title}
              onChange={onInputChange}
              aria-invalid={!!fieldErrors.title}
            />
            {fieldErrors.title && <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              className="border rounded px-3 py-2"
              value={form.status}
              name="status"
              onChange={onInputChange}
            >
              <option value="todo">Por hacer</option>
              <option value="doing">En progreso</option>
              <option value="done">Completada</option>
            </select>
            <select
              className="border rounded px-3 py-2"
              value={form.priority}
              name="priority"
              onChange={onInputChange}
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

export default ProjectTasks;
