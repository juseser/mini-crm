import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { info, login, registerUser } from '../controllers/authControllers.js';

const router = express.Router() 

router.post( '/register', registerUser );

router.post( '/login', login );

router.get( '/me', authMiddleware, info );

export default router;