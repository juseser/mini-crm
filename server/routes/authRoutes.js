import express from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import { info, login, registerUser } from '../controllers/authControllers.js';

const router = express.Router() 

router.post( '/register', [
  check('name').notEmpty().withMessage('El campo nombre es obligatorio'),
  check('email').isEmail().withMessage('El campo email debe ser un email'),
  check('password').notEmpty().withMessage('El campo password es obligatorio')
], registerUser );

router.post( '/login', [
  check('email').isEmail().withMessage('El campo email debe ser un email'),
  check('password').notEmpty().withMessage('El campo password es obligatorio')
], login );

router.get( '/me', authMiddleware, info );

export default router;