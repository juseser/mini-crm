import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import User from './User.js';

const Project = db.define('Project', {
  name:        { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
}, {
  tableName: 'crm_projects',
  timestamps: true
});

// relación (cada proyecto pertenece a un usuario)
Project.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Project, { foreignKey: 'userId' });

export default Project;
