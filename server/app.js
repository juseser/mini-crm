import express from 'express';
import cors from 'cors';//habilitar CORS (Cross-Origin Resource Sharing) en la API de Express.
import db from './config/db.js';
import './models/index.js';
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();// Crea una aplicación de Express (el servidor principal
app.use(cors());// Habilita CORS (Cross-Origin Resource Sharing) para que el backend pueda recibir peticiones desde un frontend en otro dominio/puerto
app.use(express.json());// Permite a Express entender y procesar datos en formato JSON que vengan en el body de las peticiones (req.body)

app.use('/auth', authRoutes); 
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

//Conexion a la base de datos
try {
    await db.authenticate();
    await db.sync();
    console.log('Conectado a la BD')
} catch (error) {
    console.log(error)
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});