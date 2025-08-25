import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const mapErrorsByField = (arr = []) => {
  const errors = {};
  arr.forEach((error) => { //Recorremos el array de errrores(arr) y lo convertimos a un objeto por campo
    const field = error.param || error.path;
    if (field) errors[field] = error.msg;
  }); 
  return errors;
}

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"" });//estado para cargar los datos de los inputs
  const [ok, setOk] = useState(false);//estado para mostrar el mensaje de usuario creado con exito
  const [fieldErrors, setFieldErrors] = useState({}); //state para cargar los errores

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOk(false);//ocultamos el mensaje de usuario registrado con exito
    setFieldErrors({});//Limpia errores por campo ANTES de mandar la petición (así no quedan mensajes viejos visibles mientras esperas la respuesta)
   
    const resp = await register(form.name, form.email, form.password);//pasamos los valores al api

    if (!resp.ok) {
      setFieldErrors(mapErrorsByField(resp.errors));
      return;
    }

    setOk(true);//mostramos el mensaje de usuario registrado con exito
    setForm({ name:"", email:"", password:"" });//reseteamos el valor de los campos
  };

  //Funcion que dispara el state para cargar los datos en los inputs
  const onInputChange=({ target })=>{
    const { name, value } = target; //destructuring
    setForm((prev) => ({ //estado anterior
      ...prev,
      [name]: value
    }));
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>

      {ok && (// si ok= true entonces ...
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
            onChange={onInputChange}
            aria-invalid={!!fieldErrors.name}//si hay error en name: true !!=convierte en booleano
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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

export default Register;
