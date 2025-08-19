import { validationResult } from "express-validator";
import Project from '../models/Project.js';

const listProjects = async (req, res) => {
  const rows = await Project.findAll({ where: { userId: req.user.id }, order: [['updatedAt','DESC']] });
  res.json(rows);
}

const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, description } = req.body;
    const row = await Project.create({ name, description, userId: req.user.id });
    res.status(201).json(row);
}

const updateProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const row = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    await row.update({ name: req.body.name ?? row.name, description: req.body.description ?? row.description });
    res.json(row);
}

const deleteProject = async (req, res) => {
  const count = await Project.destroy({ where: { id: req.params.id, userId: req.user.id } });
  if (!count) return res.status(404).json({ message: 'No encontrado' });
  res.json({ ok: true });
}

export{
    listProjects,
    createProject,
    updateProject,
    deleteProject
}