import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";
import User from '../models/User.js';

const info = async(req,res)=>{
    const user = await User.findByPk(req.user.id, { attributes: ['id','name','email'] });
    res.json(user);
}

const login = async (req, res) => {
    // 1) errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //array de errores de validación
    }

    // 2) credenciales
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ errors: [{ msg: 'Credenciales inválidas' }] });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ errors: [{ msg: 'Credenciales inválidas' }] });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token });
};

const registerUser = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ errors: [{ msg: 'Email ya registrado' }] });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({ id: user.id, name, email });
}

export{
    info,
    login,
    registerUser
}