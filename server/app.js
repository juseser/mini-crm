import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import User from './models/User.js'; // registramos el modelo
import authRoutes from './routes/authRoutes.js'
import Project from './models/Project.js';            // importa para registrar el modelo
import projectRoutes from './routes/projectRoutes.js';
import Task from './models/Task.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes); // /auth/register, /auth/login, /auth/me
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

//Conexion a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('Conectado a la BD')
} catch (error) {
    console.log(error)
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});