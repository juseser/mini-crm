import express from 'express';
import { check } from 'express-validator';
import auth from '../middleware/auth.js';
import { listProjects, createProject, updateProject, deleteProject } from '../controllers/projectControllers.js';

const router = express.Router();
router.use(auth);// Esto aplica `auth` a todas las rutas de este router

// LISTAR mis proyectos
router.get( '/', listProjects );

// CREAR
router.post( '/', [
  check('name').notEmpty().withMessage('El campo nombre es obligatorio'),
  check('description').notEmpty().withMessage('El campo descripcion es obligatorio')
], createProject );

// ACTUALIZAR
router.patch( '/:id', [
  check('name').notEmpty().withMessage('El campo nombre es obligatorio'),
  check('description').notEmpty().withMessage('El campo descripcion es obligatorio')
], updateProject );

// ELIMINAR
router.delete( '/:id', deleteProject );

export default router;
