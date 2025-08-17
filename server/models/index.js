// server/models/index.js
import User from './User.js';
import Project from './Project.js';
import Task from './Task.js';

// Relación: un usuario tiene muchos proyectos
User.hasMany(Project, { foreignKey: 'userId' });
Project.belongsTo(User, { foreignKey: 'userId' });

// Relación: un proyecto tiene muchas tareas
Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task,  { foreignKey: 'userId' });


export { User, Project, Task };