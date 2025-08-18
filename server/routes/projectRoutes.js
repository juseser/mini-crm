import express from 'express';
import auth from '../middleware/auth.js';
import { listProjects, createProject, updateProject, deleteProject } from '../controllers/projectControllers.js';

const router = express.Router();
router.use(auth);// Esto aplica `auth` a todas las rutas de este router

// LISTAR mis proyectos
router.get( '/', listProjects );

// CREAR
router.post( '/', createProject );

// ACTUALIZAR
router.patch( '/:id', updateProject );

// ELIMINAR
router.delete( '/:id', deleteProject );

export default router;
