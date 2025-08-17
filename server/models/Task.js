import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Task = db.define('Task', {
  title:    { type: DataTypes.STRING, allowNull: false },
  status:   { type: DataTypes.ENUM('todo','doing','done'), defaultValue: 'todo' },
  priority: { type: DataTypes.ENUM('baja','media','alta'), defaultValue: 'media' }
}, {
  tableName: 'crm_tasks',
  timestamps: true
});

export default Task;
