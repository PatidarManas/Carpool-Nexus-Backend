import express from 'express';
import { isLogin, login, signup } from '../Controllers/AuthController.js';
import { hashPassword } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Signup Route
router.post('/signup', hashPassword, signup);

// isLogin Route
router.post('/islogin', isLogin);

// Login Route
router.post('/login', login);

export {router as userRoutes};
