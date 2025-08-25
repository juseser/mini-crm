import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth  from "../hooks/useAuth.js";
import api  from "../lib/api.js";

const mapErrorsByField = (arr = []) => {
    const errors = {};
    arr.forEach((error) => { //Recorremos el array de errrores(arr) y lo convertimos a un objeto por campo
        const field = error.param || error.path;
        if (field) errors[field] = error.msg;
    }); 
    return errors;
}

const Projects = () => {
    const { token } = useAuth(); // 1) Traer el token (para auth) desde tu hook
    const [items, setItems] = useState([]);// 2) Estado de la lista de proyectos
    const [form, setForm] = useState({ name:"", description:"" });// 3) Estado del formulario (inputs controlados)
    const [editId, setEditId] = useState(null); // 4) Modo edición: null = crear; id != null = editar ese proyecto, como al momento en que se carga el componente se la asigna null a editId esta en modo creacion

    const [fieldErrors, setFieldErrors] = useState({}); // 5) Errores del backend mapeados por campo
    const [okMsg, setOkMsg] = useState(""); // 6) Mensaje de OK (feedback al usuario)

    // -------- API: Cargar proyectos --------
    const load = async () => {
        const resp = await api(token).get("/projects");// GET /projects con Authorization si token existe
        if (resp.ok) setItems(await resp.json()); // Si ok, guardamos el JSON en items para luego recorrerlo y listarlo
    };

    // Load inicial (componentDidMount)
    useEffect(() => { load(); }, []); // [] => solo una vez al montar, carga los proyectos

    // -------- Crear / Actualizar --------
    const save = async (e) => {
        e.preventDefault();// Evita refresh del <form>
        setFieldErrors({});// Limpia errores viejos
        setOkMsg("");// Limpia mensaje de OK

        const body = { ...form };// Payload= Información principal que viaja en una comunicación, se clona la info de form y se asigna al body

        // Si hay editId => PATCH /projects/:id ; si no => POST /projects
        const resp = editId 
          ? await api(token).patch(`/projects/${editId}`, body)// Si hay editId → significa que estamos editando un proyecto existente, se hace un PATCH a /projects/:id enviando el body (objeto con los datos del form)
          : await api(token).post("/projects", body);// Si NO hay editId → significa que estamos creando un proyecto nuevo, se hace un POST a /projects enviando el body (objeto con los datos del form)

        const data = await resp.json().catch(() => ({}));// Cuerpo de respuesta (si hay)

        if (!resp.ok) {
          // Normaliza errores del backend (express-validator: { errors: [...] })
          const errors = Array.isArray(data.errors)
            ? data.errors
            : [{ msg: data.message || "No se pudo guardar" }];

          // 1) Poner errores por campo (bajo cada input)
          setFieldErrors(mapErrorsByField(errors));
          return;
        }

        // Si todo OK:
        setForm({ name:"", description:"" });// Limpia el form
        setEditId(null);// Salimos de modo edición
        setOkMsg(editId ? "Proyecto actualizado" : "Proyecto creado");// Feedback
        load();// Refrescamos la lista
    };

    // -------- Eliminar --------
    const del = async (id) => {
        if (!confirm("¿Eliminar proyecto?")) return;
        const resp = await api(token).del(`/projects/${id}`);
        if (resp.ok) load();//si todo funciona correctamente cargamos de nuevo la lista
    };

    // -------- onChange genérico para inputs --------
    const onInputChange = ({ target })=> {
        const { name, value } = target; //destructuring
        setForm((prev) => ({ //estado anterior
          ...prev,
          [name]: value
        }));
    }

    // ------Resetea el form cuando se edita un proyecto y se da cancelar --------
    const resetForm = () => {
        setEditId(null); // salimos del modo edición
        setForm({ name:"", description:"" }); // limpiamos los inputs
        setFieldErrors({});// limpiamos errores por campo
    };

    // ------------ Editar -------------------
    const startEdit = (project) => {
        setEditId(project.id);// entramos en modo edición cargando el id
        setForm({ name: project.name, description: project.description || "" }); // llenamos el form, Si project.description tiene un valor truthy usalo,Si es falsy entonces un string vacio
        setFieldErrors({});// limpiamos errores de campos
    };

    // -------- Render --------
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Proyectos</h1>

        {/*Mensaje de feedback cuando se crea un proyecto*/}
        {okMsg && <p className="text-green-600 text-sm mb-3">{okMsg}</p>}

        {/*Form para crear/editar un proyecto*/}
        <form onSubmit={save} noValidate className="mb-6 grid gap-2 max-w-lg">
          <div>
            <input
              className={`border rounded px-3 py-2 w-full ${fieldErrors.name ? 'border-red-500' : ''}`}
              placeholder="Nombre"
              name="name"
              value={form.name}
              onChange={onInputChange}
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
              onChange={onInputChange}
              aria-invalid={!!fieldErrors.description}
            />
            {fieldErrors.description && <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>}
          </div>

          {/*Botones que se muestran abajo del form para crear/editar proyecto*/}
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
              {editId ? "Actualizar" : "Crear"} {/*Si editId es true entonces el texto es Actualizar si no es Crear*/}
            </button>

            {/*true && algo → devuelve algo false && algo → devuelve false*/}
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/*Aqui listamos los proyectos*/}
        {
          items.length === 0 ? (
            <p className="text-sm text-slate-600">Aún no hay proyectos.</p>
          ) : (
            <ul className="grid gap-3">
              {items.map((project) => (
                <li key={project.id} className="border rounded p-3 flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{project.name}</div>
                    {project.description && <div className="text-sm text-slate-600">{project.description}</div>}{/*Esto para que es?*/}
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      to={`/projects/${project.id}/tasks`} 
                      className="px-3 py-2 rounded bg-slate-800 text-white"
                    >
                      Tareas
                    </Link>{/*Btn para listar las Tareas del proyecto*/}
                    {/*Btn editar*/}
                    <button
                      className="px-3 py-2 rounded bg-indigo-600 text-white"
                      onClick={() => startEdit(project)}//Esto pasa la función y se ejecuta solo al click
                    >
                      Editar
                    </button>
                    <button
                      className="px-3 py-2 rounded bg-rose-600 text-white"
                      onClick={()=>del(project.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        }{/*Fin list proyectos*/}
      </div>
    );
}

export default Projects;
