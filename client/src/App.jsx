import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Nav from "./components/Nav.jsx";
import Protected from "./components/Protected.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectTasks from "./pages/ProjectTasks.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
