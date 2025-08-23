import { useState } from "react";
import useAuth  from "../hooks/useAuth.js";

const mapErrorsByField = (arr = []) => { //arr viene del useAuth y le indicamos que su valor por defecto es un array vacio
  const errors = {};//Creamos un objeto vacío donde vamos a ir guardando los errores mapeados
  arr.forEach((error) => { //Recorremos el array de errrores(arr) y lo convertimos a un objeto por campo
    const field = error.param || error.path;
    if (field) errors[field] = error.msg;
  }); 
  return errors;
}

//1.Funcion encargada de hacer el login
const Login = () => {
  const { login } = useAuth();//Hago destructuring a la funcion login
  const [form, setForm] = useState({ email:"", password:"" });//estado encargado de cargar los inputs de email y password con sus respectivos valores
  const [fieldErrors, setFieldErrors] = useState({});//estado encargado de cargar los errores

  //Funcion que maneja el envio del formulario, se llama desde el onSubmit del form
  const handleSubmit = async (e) => {
    e.preventDefault();//Evita que el <form> haga submit "tradicional" (recargar la página)
    setFieldErrors({}); //Limpia errores por campo ANTES de mandar la petición (así no quedan mensajes viejos visibles mientras esperas la respuesta)

    const resp = await login(form.email, form.password); //Llama al hook useAuth → POST /auth/login
    if (!resp.ok) { //Si el backend respondió con errores de validación/credenciales
      setFieldErrors(mapErrorsByField(resp.errors));//Mapea el array [{param/msg}...] a objeto {campo: msg}
    }
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
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

      <form onSubmit={ handleSubmit } noValidate className="grid gap-3">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            className={`border rounded px-3 py-2 w-full ${fieldErrors.email ? 'border-red-500' : ''}`}
            value={form.email}
            onChange={ onInputChange }
            aria-invalid={!!fieldErrors.email}//si hay error en email: true !!=convierte en booleano
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
            onChange={ onInputChange }
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

export default Login;
