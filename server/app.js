import express from 'express';
import cors from 'cors';//habilitar CORS (Cross-Origin Resource Sharing) en la API de Express.
import db from './config/db.js';
import './models/index.js';
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();// Crea una aplicación de Express (el servidor principal

// CORS — MODO DEBUG (eco del origin que llegue)
app.use(cors({
  origin: true,                          // hace echo del Origin que llega
  credentials: false,                    // no usas cookies
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204
}));

// Responder TODOS los preflights
app.options('*', cors());

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