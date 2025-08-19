import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { validationResult } from 'express-validator';

// LISTAR por proyecto ?projectId=123
const listTaskByProject = async (req, res) => {
  const { projectId } = req.query;
  const where = { userId: req.user.id };
  if (projectId) where.projectId = projectId;
  const rows = await Task.findAll({ where, order: [['updatedAt','DESC']] });
  res.json(rows);
}

// CREAR
const createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, projectId, status='todo', priority='media' } = req.body;

    // opcional: validar que el proyecto sea mío
    const p = await Project.findOne({ where: { id: projectId, userId: req.user.id } });
    if (!p) return res.status(404).json({ message: 'Proyecto no encontrado' });

    const row = await Task.create({ title, status, priority, projectId, userId: req.user.id });
    res.status(201).json(row);
}

const updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const row = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    const { title, status, priority } = req.body;
    await row.update({ 
        title: title ?? row.title, 
        status: status ?? row.status, 
        priority: priority ?? row.priority 
    });
    res.json(row);
}

const deleteTask = async (req, res) => {
  const count = await Task.destroy({ where: { id: req.params.id, userId: req.user.id } });
  if (!count) return res.status(404).json({ message: 'No encontrado' });
  res.json({ ok: true });
}

export{
    listTaskByProject,
    createTask,
    updateTask,
    deleteTask
}