import express from 'express';
import cors from 'cors';//habilitar CORS (Cross-Origin Resource Sharing) en la API de Express.
import db from './config/db.js';
import './models/index.js';
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();// Crea una aplicación de Express (el servidor principal

// --- CORS + preflight manual (Express 5 safe) ---
const allow = new Set(['http://localhost:5173', process.env.CLIENT_URL].filter(Boolean));

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Permite Postman/cURL (sin origin) y los de la whitelist
  if (!origin || allow.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    // res.setHeader('Access-Control-Allow-Credentials', 'false'); // no usas cookies

    if (req.method === 'OPTIONS') return res.sendStatus(204); // preflight OK
    return next();
  }

  // Origin NO permitido
  return res.status(403).send('Not allowed by CORS');
});

app.use(express.json());// Permite a Express entender y procesar datos en formato JSON que vengan en el body de las peticiones (req.body)

app.use('/auth', authRoutes); 
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

//Conexion a la base de datos
try {
    await db.authenticate();
    await db.sync({ force: true });
    console.log('Conectado a la BD')
} catch (error) {
    console.log(error)
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});