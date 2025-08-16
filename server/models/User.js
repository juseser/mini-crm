import { DataTypes }  from 'sequelize';
import db from '../config/db.js'

const User = db.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'crm_users', timestamps: true });

export default User;
