import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Project = db.define('Project', {
  name:        { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
}, {
  tableName: 'crm_projects',
  timestamps: true
});


export default Project;
