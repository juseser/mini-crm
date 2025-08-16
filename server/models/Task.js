import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import User from './User.js';
import Project from './Project.js';

const Task = db.define('Task', {
  title:    { type: DataTypes.STRING, allowNull: false },
  status:   { type: DataTypes.ENUM('todo','doing','done'), defaultValue: 'todo' },
  priority: { type: DataTypes.ENUM('baja','media','alta'), defaultValue: 'media' }
}, {
  tableName: 'crm_tasks',
  timestamps: true
});

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task,  { foreignKey: 'userId' });

Task.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(Task,   { foreignKey: 'projectId' });

export default Task;
