import express from 'express';
import cors from 'cors';//habilitar CORS (Cross-Origin Resource Sharing) en la API de Express.
import db from './config/db.js';
import './models/index.js';
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes); 
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

//Conexion a la base de datos
try {
    await db.authenticate();
    await db.sync({ alter: true });
    console.log('Conectado a la BD')
} catch (error) {
    console.log(error)
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});