import express from 'express';
import auth from '../middleware/auth.js';
import Project from '../models/Project.js';

const router = express.Router();
router.use(auth);

// LISTAR mis proyectos
router.get('/', async (req, res) => {
  const rows = await Project.findAll({ where: { userId: req.user.id }, order: [['updatedAt','DESC']] });
  res.json(rows);
});

// CREAR
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Nombre requerido' });
  const row = await Project.create({ name, description, userId: req.user.id });
  res.status(201).json(row);
});

// ACTUALIZAR
router.patch('/:id', async (req, res) => {
  const row = await Project.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!row) return res.status(404).json({ message: 'No encontrado' });
  await row.update({ name: req.body.name ?? row.name, description: req.body.description ?? row.description });
  res.json(row);
});

// ELIMINAR
router.delete('/:id', async (req, res) => {
  const count = await Project.destroy({ where: { id: req.params.id, userId: req.user.id } });
  if (!count) return res.status(404).json({ message: 'No encontrado' });
  res.json({ ok: true });
});

export default router;
