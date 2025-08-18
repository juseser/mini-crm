import express from 'express';
import auth from '../middleware/auth.js';
import { listTaskByProject, createTask, updateTask, deleteTask } from '../controllers/taskControllers.js';

const router = express.Router();
router.use(auth);

//LISTAR TAREAS
router.get('/', listTaskByProject );

// CREAR
router.post('/', createTask );

// ACTUALIZAR
router.patch('/:id', updateTask );

// ELIMINAR
router.delete('/:id', deleteTask );

export default router;
