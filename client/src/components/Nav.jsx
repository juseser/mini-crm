import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Nav = () => {
  const { isAuth, logout } = useAuth();

  const renderLinks = () => {
    //Si no esta logueado
    if (!isAuth) {
      return (
        <div className="flex gap-2">
          <Link className="px-3 py-2 rounded hover:bg-slate-100" to="/login">Login</Link>
          <Link className="px-3 py-2 rounded hover:bg-slate-100" to="/register">Register</Link>
        </div>
      );
    }
    //Si esta logueado
    return (
      <div className="flex gap-2">
        <Link className="px-3 py-2 rounded hover:bg-slate-100" to="/">Dashboard</Link>
        <Link className="px-3 py-2 rounded hover:bg-slate-100" to="/projects">Projects</Link>
        <button className="px-3 py-2 rounded border" onClick={logout}>Logout</button>{/*Accedemos a la funcion logout del useAuth a la cual le hicimos destructuring*/}
      </div>
    );
  };

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto max-w-6xl h-14 px-6 flex items-center justify-between">
        <Link to="/" className="font-bold">Mini-CRM</Link>
        {renderLinks()}
      </nav>
    </header>
  );
};

export default Nav;
