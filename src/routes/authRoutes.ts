import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Signup - Create tenant and admin user
router.post('/signup', authController.signup);

// Login
router.post('/login', authController.login);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
