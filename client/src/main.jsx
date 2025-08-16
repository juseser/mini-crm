import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import "./index.css";
import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectTasks from "./pages/ProjectTasks";

function Protected({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

function Nav() {
  const { isAuth, logout } = useAuth();
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto max-w-6xl h-14 px-6 flex items-center justify-between">
        <Link to="/" className="font-bold">Mini-CRM</Link>
        {!isAuth ? (
          <div className="flex gap-2">
            <Link className="px-3 py-2 rounded hover:bg-slate-100" to="/login">Login</Link>
            <Link className="px-3 py-2 rounded hover:bg-slate-100" to="/register">Register</Link>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link className="px-3 py-2 rounded hover:bg-slate-100" to="/">Dashboard</Link>
            <Link className="px-3 py-2 rounded hover:bg-slate-100" to="/projects">Projects</Link>
            <button className="px-3 py-2 rounded border" onClick={logout}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

          <Route path="/" element={<Protected><Dashboard/></Protected>} />
          <Route path="/projects" element={<Protected><Projects/></Protected>} />
          <Route path="/projects/:id/tasks" element={<Protected><ProjectTasks/></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
