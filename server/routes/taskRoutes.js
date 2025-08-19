import express from 'express';
import { check } from 'express-validator';
import auth from '../middleware/auth.js';
import { listTaskByProject, createTask, updateTask, deleteTask } from '../controllers/taskControllers.js';

const router = express.Router();
router.use(auth);

//LISTAR TAREAS
router.get( '/', listTaskByProject );

// CREAR
router.post( '/', [
  check('title').notEmpty().withMessage('El campo titulo es obligatorio')
], createTask );

// ACTUALIZAR
router.patch( '/:id', [
  check('title').notEmpty().withMessage('El campo titulo es obligatorio')
], updateTask );

// ELIMINAR
router.delete( '/:id', deleteTask );

export default router;
