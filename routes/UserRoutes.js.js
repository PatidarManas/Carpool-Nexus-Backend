import express from 'express';
import { signup, login } from '../controllers/userController.js';
import { validateSignup, validateLogin, hashPassword } from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup Route
router.post('/signup', validateSignup, hashPassword, signup);

// Login Route
router.post('/login', validateLogin, login);

export default router;
